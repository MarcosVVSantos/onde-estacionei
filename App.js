// App "Onde Estacionei?"
// Sensores usados: GPS (expo-location), bússola/magnetômetro (expo-location) e câmera (expo-image-picker).
// Este arquivo guarda o "estado" do app e liga/desliga os sensores.
// O visual de cada tela fica em src/telas/.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import { distanciaEmMetros, formatarEndereco } from './src/geo';
import {
  apagarFoto,
  apagarVaga,
  carregarVaga,
  guardarFoto,
  jaViuPermissoes,
  marcarPermissoesVistas,
  salvarVaga,
} from './src/armazenamento';
import { AZUL, claro, escuro } from './src/tema';

import Permissoes from './src/telas/Permissoes';
import Inicio from './src/telas/Inicio';
import VagaSalva from './src/telas/VagaSalva';
import Bussola from './src/telas/Bussola';
import Chegada from './src/telas/Chegada';
import ConfirmarApagar from './src/telas/ConfirmarApagar';

const DISTANCIA_CHEGADA = 15; // metros

export default function App() {
  return (
    <SafeAreaProvider>
      <Conteudo />
    </SafeAreaProvider>
  );
}

function Conteudo() {
  // Segue o modo claro/escuro configurado no celular.
  const tema = useColorScheme() === 'dark' ? escuro : claro;
  const [fontesProntas] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [carregando, setCarregando] = useState(true);
  const [viuPermissoes, setViuPermissoes] = useState(false);
  const [vaga, setVaga] = useState(null);
  const [anotacao, setAnotacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [posicaoAtual, setPosicaoAtual] = useState(null);
  const [direcaoCelular, setDirecaoCelular] = useState(null);
  const [chegadaDispensada, setChegadaDispensada] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [agora, setAgora] = useState(Date.now());

  // 1) Ao abrir o app, recupera a vaga salva e se já viu a tela de permissões.
  useEffect(() => {
    Promise.all([carregarVaga(), jaViuPermissoes()])
      .then(([salva, viu]) => {
        setVaga(salva);
        setAnotacao(salva?.anotacao ?? '');
        setViuPermissoes(viu);
      })
      .finally(() => setCarregando(false));
  }, []);

  // 2) Atualiza o "Estacionado há" a cada 30 segundos.
  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // 3) Modo "Encontrar meu carro": liga o GPS e a bússola em tempo real.
  useEffect(() => {
    if (!buscando) return;

    let assinaturaGps = null;
    let assinaturaBussola = null;
    let cancelado = false;

    (async () => {
      if (!(await pedirPermissaoLocalizacao()) || cancelado) {
        setBuscando(false);
        return;
      }

      // GPS: nova posição a cada 2 metros andados (ou a cada 2 segundos).
      assinaturaGps = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 2, timeInterval: 2000 },
        (pos) => setPosicaoAtual(pos.coords),
      );

      // Bússola (magnetômetro): para onde o topo do celular aponta, em graus.
      if (Platform.OS !== 'web') {
        assinaturaBussola = await Location.watchHeadingAsync((h) => {
          setDirecaoCelular(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
        });
      }

      if (cancelado) {
        assinaturaGps?.remove();
        assinaturaBussola?.remove();
      }
    })();

    // Ao sair do modo busca, desliga os sensores para economizar bateria.
    return () => {
      cancelado = true;
      assinaturaGps?.remove();
      assinaturaBussola?.remove();
    };
  }, [buscando]);

  const distancia = vaga && posicaoAtual ? distanciaEmMetros(posicaoAtual, vaga) : null;

  // Se a pessoa voltou para a bússola e depois se afastou, a tela de chegada pode aparecer de novo.
  useEffect(() => {
    if (chegadaDispensada && distancia != null && distancia > DISTANCIA_CHEGADA * 2) {
      setChegadaDispensada(false);
    }
  }, [distancia, chegadaDispensada]);

  async function pedirPermissaoLocalizacao() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Sem acesso à localização o app não consegue salvar nem encontrar a vaga. Libere nos Ajustes do celular.',
      );
      return false;
    }
    return true;
  }

  async function concluirPermissoes(pedir) {
    if (pedir) {
      await Location.requestForegroundPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    }
    await marcarPermissoesVistas();
    setViuPermissoes(true);
  }

  async function marcarVaga() {
    setSalvando(true);
    try {
      if (!(await pedirPermissaoLocalizacao())) return;

      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      let endereco = null;
      try {
        const [resultado] = await Location.reverseGeocodeAsync(coords);
        endereco = formatarEndereco(resultado);
      } catch {
        // Sem internet: seguimos só com a coordenada.
      }

      const novaVaga = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        precisao: coords.accuracy,
        endereco,
        salvaEm: Date.now(),
        fotoUri: null,
        fotoEm: null,
        anotacao: '',
      };
      await salvarVaga(novaVaga);
      setVaga(novaVaga);
      setAnotacao('');
      setAgora(Date.now());
    } catch (erro) {
      Alert.alert('Não foi possível pegar a localização', String(erro?.message ?? erro));
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarVaga(campos) {
    const atualizada = { ...vaga, ...campos };
    setVaga(atualizada);
    await salvarVaga(atualizada);
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Libere a câmera nos Ajustes para fotografar a vaga.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (resultado.canceled) return;

    try {
      const novaUri = guardarFoto(resultado.assets[0].uri);
      await apagarFoto(vaga.fotoUri); // remove a foto antiga, se tinha
      await atualizarVaga({ fotoUri: novaUri, fotoEm: Date.now() });
    } catch (erro) {
      Alert.alert('Erro ao salvar a foto', String(erro?.message ?? erro));
    }
  }

  function iniciarBusca() {
    setPosicaoAtual(null);
    setChegadaDispensada(false);
    setBuscando(true);
  }

  function pararBusca() {
    setBuscando(false);
    setPosicaoAtual(null);
    setDirecaoCelular(null);
  }

  function abrirRotaNoMapa() {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${vaga.latitude},${vaga.longitude}`,
    );
  }

  async function apagar() {
    setConfirmando(false);
    pararBusca();
    await apagarVaga(vaga);
    setVaga(null);
    setAnotacao('');
  }

  // ---------- Qual tela mostrar ----------
  let tela;
  if (carregando || !fontesProntas) {
    tela = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tema.bg }}>
        <ActivityIndicator size="large" color={AZUL} />
      </View>
    );
  } else if (!viuPermissoes) {
    tela = <Permissoes tema={tema} onPermitir={() => concluirPermissoes(true)} onPular={() => concluirPermissoes(false)} />;
  } else if (!vaga) {
    tela = <Inicio tema={tema} salvando={salvando} onSalvar={marcarVaga} />;
  } else if (buscando && distancia != null && distancia < DISTANCIA_CHEGADA && !chegadaDispensada) {
    tela = (
      <Chegada
        tema={tema}
        vaga={vaga}
        distancia={distancia}
        onAchei={() => setConfirmando(true)}
        onVoltar={() => setChegadaDispensada(true)}
      />
    );
  } else if (buscando) {
    tela = (
      <Bussola tema={tema} vaga={vaga} posicaoAtual={posicaoAtual} direcaoCelular={direcaoCelular} onParar={pararBusca} />
    );
  } else {
    tela = (
      <VagaSalva
        tema={tema}
        vaga={vaga}
        agora={agora}
        anotacao={anotacao}
        onMudarAnotacao={setAnotacao}
        onSalvarAnotacao={() => atualizarVaga({ anotacao: anotacao.trim() })}
        onTirarFoto={tirarFoto}
        onEncontrar={iniciarBusca}
        onAbrirMapa={abrirRotaNoMapa}
        onApagar={() => setConfirmando(true)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tema.bg }}>
      <StatusBar style={tema.escuro ? 'light' : 'dark'} />
      {tela}
      {vaga && (
        <ConfirmarApagar tema={tema} visivel={confirmando} onCancelar={() => setConfirmando(false)} onConfirmar={apagar} />
      )}
    </View>
  );
}
