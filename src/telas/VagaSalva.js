// Tela principal quando há uma vaga salva: mapa, endereço, foto, anotação e ações.
import { useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Circle as CirculoMapa, Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Botao, Card } from '../componentes';
import {
  IconeAmpulheta,
  IconeCamera,
  IconeCarro,
  IconeLapis,
  IconeLinkExterno,
  IconeLixeira,
  IconeMira,
  IconeNavegar,
  IconePin,
  IconeRefazer,
  IconeRelogio,
} from '../icones';
import { formatarHora, partesTempo } from '../geo';
import { AZUL, fonte, sombra } from '../tema';

const ZOOM = { latitudeDelta: 0.0025, longitudeDelta: 0.0025 };

function PinCarro() {
  return (
    <View style={{ width: 48, height: 60, alignItems: 'center' }}>
      <Svg width={48} height={60} viewBox="0 0 48 60">
        <Path
          d="M24 2C11.8 2 2 11.6 2 23.6c0 16.3 22 34.4 22 34.4s22-18.1 22-34.4C46 11.6 36.2 2 24 2z"
          fill={AZUL}
          stroke="#FFFFFF"
          strokeWidth={3}
        />
        <Circle cx="24" cy="23" r="13" fill="#FFFFFF" />
      </Svg>
      <View style={{ position: 'absolute', top: 14 }}>
        <IconeCarro tamanho={18} cor={AZUL} espessura={2.4} />
      </View>
    </View>
  );
}

function Estatistica({ tema, Icone, rotulo, valor, unidade }) {
  return (
    <Card tema={tema} style={styles.estatistica}>
      <View style={styles.estatisticaRotulo}>
        <Icone tamanho={14} cor={tema.text3} />
        <Text style={[styles.rotulo, fonte(500), { color: tema.text3 }]} numberOfLines={1}>
          {rotulo}
        </Text>
      </View>
      <Text style={[styles.estatisticaValor, fonte(700), { color: tema.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {valor}
        {unidade ? <Text style={[styles.estatisticaUnidade, fonte(600), { color: tema.text2 }]}> {unidade}</Text> : null}
      </Text>
    </Card>
  );
}

export default function VagaSalva({
  tema,
  vaga,
  agora,
  anotacao,
  onMudarAnotacao,
  onSalvarAnotacao,
  onTirarFoto,
  onEncontrar,
  onAbrirMapa,
  onApagar,
}) {
  const insets = useSafeAreaInsets();
  const mapaRef = useRef(null);
  const coordenada = { latitude: vaga.latitude, longitude: vaga.longitude };

  // Compatibilidade com vagas salvas pela versão anterior (endereço era texto).
  const endereco =
    typeof vaga.endereco === 'string'
      ? { rua: vaga.endereco.split('\n')[0], regiao: vaga.endereco.split('\n')[1] ?? '' }
      : vaga.endereco ?? {
          rua: `${vaga.latitude.toFixed(5)}, ${vaga.longitude.toFixed(5)}`,
          regiao: 'Endereço indisponível',
        };

  const tempo = partesTempo(vaga.salvaEm, agora);

  function centralizar() {
    mapaRef.current?.animateToRegion({ ...coordenada, ...ZOOM }, 400);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: tema.bg }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mapa real com o local do veículo */}
        <View style={styles.mapaArea}>
          <MapView
            ref={mapaRef}
            style={StyleSheet.absoluteFill}
            initialRegion={{ ...coordenada, ...ZOOM }}
            userInterfaceStyle={tema.escuro ? 'dark' : 'light'}
            showsUserLocation
            showsCompass={false}
            toolbarEnabled={false}
          >
            <CirculoMapa
              center={coordenada}
              radius={Math.max(vaga.precisao ?? 10, 10)}
              fillColor="rgba(31,111,235,0.12)"
              strokeColor="rgba(31,111,235,0.35)"
              strokeWidth={1.5}
            />
            <Marker coordinate={coordenada} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
              <PinCarro />
            </Marker>
          </MapView>

          <View style={[styles.mapaTopo, { top: insets.top + 12 }]}>
            <View style={[styles.chip, { backgroundColor: tema.surface }, sombra(false)]}>
              <View style={styles.pontoVerde} />
              <Text style={[styles.chipTexto, fonte(600), { color: tema.text }]}>Vaga salva</Text>
            </View>
            <Pressable
              onPress={centralizar}
              accessibilityRole="button"
              accessibilityLabel="Centralizar no veículo"
              style={[styles.botaoRedondo, { backgroundColor: tema.surface }, sombra(false)]}
            >
              <IconeMira tamanho={20} cor={tema.text} />
            </Pressable>
          </View>
        </View>

        {/* "Folha" que sobe por cima do mapa */}
        <View style={[styles.folha, { backgroundColor: tema.bg, paddingBottom: insets.bottom + 20 }]}>
          <Card tema={tema} style={styles.endereco}>
            <View style={[styles.iconeQuadrado, { backgroundColor: tema.primarySoft }]}>
              <IconePin tamanho={22} cor={tema.primaryText} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.rotulo, fonte(500), { color: tema.text3 }]}>Endereço aproximado</Text>
              <Text style={[styles.rua, fonte(600), { color: tema.text }]}>{endereco.rua}</Text>
              {!!endereco.regiao && (
                <Text style={[styles.regiao, fonte(400), { color: tema.text2 }]}>{endereco.regiao}</Text>
              )}
            </View>
          </Card>

          <View style={styles.grade}>
            <Estatistica tema={tema} Icone={IconeRelogio} rotulo="Salvo às" valor={formatarHora(vaga.salvaEm)} />
            <Estatistica tema={tema} Icone={IconeAmpulheta} rotulo="Estacionado há" valor={tempo.valor} unidade={tempo.unidade} />
            <Estatistica tema={tema} Icone={IconeMira} rotulo="Precisão" valor={`± ${Math.round(vaga.precisao ?? 0)} m`} />
          </View>

          {/* Foto da vaga */}
          <Card tema={tema} style={{ gap: 12 }}>
            <View style={styles.cabecalhoCard}>
              <Text style={[styles.tituloCard, fonte(600), { color: tema.text }]}>Foto da vaga</Text>
              {vaga.fotoUri && (
                <Pressable onPress={onTirarFoto} style={styles.linkAcao} accessibilityRole="button">
                  <IconeRefazer tamanho={16} cor={tema.primaryText} />
                  <Text style={[styles.linkTexto, fonte(600), { color: tema.primaryText }]}>Tirar outra</Text>
                </Pressable>
              )}
            </View>

            {vaga.fotoUri ? (
              <View style={styles.fotoArea}>
                <Image source={{ uri: vaga.fotoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                {vaga.fotoEm && (
                  <View style={styles.seloFoto}>
                    <IconeCamera tamanho={13} cor="#FFFFFF" espessura={2.2} />
                    <Text style={[styles.seloFotoTexto, fonte(600)]}>Foto às {formatarHora(vaga.fotoEm)}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Pressable
                onPress={onTirarFoto}
                accessibilityRole="button"
                style={[styles.fotoVazia, { borderColor: tema.dashBorder, backgroundColor: tema.dashBg }]}
              >
                <View style={[styles.circuloCamera, { backgroundColor: tema.primarySoft }]}>
                  <IconeCamera tamanho={24} cor={tema.primaryText} />
                </View>
                <Text style={[styles.fotoVaziaTitulo, fonte(600), { color: tema.primaryText }]}>Fotografar a vaga</Text>
                <Text style={[styles.fotoVaziaTexto, fonte(400), { color: tema.text2 }]}>Andar, coluna ou placa da rua</Text>
              </Pressable>
            )}
          </Card>

          {/* Anotação */}
          <Card tema={tema} style={{ gap: 10 }}>
            <View style={styles.cabecalhoCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <IconeLapis tamanho={18} cor={tema.text} />
                <Text style={[styles.tituloCard, fonte(600), { color: tema.text }]}>Anotação</Text>
              </View>
              <Text style={[styles.rotulo, fonte(500), { color: tema.text3 }]}>Opcional</Text>
            </View>
            <TextInput
              style={[styles.campo, fonte(400), { borderColor: tema.border, backgroundColor: tema.field, color: tema.text }]}
              placeholder="Ex.: Piso G2, coluna B14, perto do elevador"
              placeholderTextColor={tema.text3}
              value={anotacao}
              onChangeText={onMudarAnotacao}
              onBlur={onSalvarAnotacao}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Anotação"
            />
          </Card>

          <View style={styles.acoes}>
            <Botao texto="Encontrar meu carro" icone={IconeNavegar} tema={tema} onPress={onEncontrar} />
            <Botao texto="Abrir rota no Google Maps" icone={IconeLinkExterno} variante="contorno" tema={tema} onPress={onAbrirMapa} />
            <Botao texto="Já peguei o carro" icone={IconeLixeira} variante="perigoTexto" altura={48} tema={tema} onPress={onApagar} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mapaArea: { height: 300 },
  mapaTopo: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 36, paddingHorizontal: 14, borderRadius: 999 },
  pontoVerde: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A34A' },
  chipTexto: { fontSize: 14 },
  botaoRedondo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  folha: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  endereco: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconeQuadrado: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rotulo: { fontSize: 12, lineHeight: 16 },
  rua: { fontSize: 17, lineHeight: 22 },
  regiao: { fontSize: 14, lineHeight: 20 },
  grade: { flexDirection: 'row', gap: 8 },
  estatistica: { flex: 1, borderRadius: 16, padding: 12, gap: 6 },
  estatisticaRotulo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  estatisticaValor: { fontSize: 22, lineHeight: 26, letterSpacing: -0.3 },
  estatisticaUnidade: { fontSize: 13 },
  cabecalhoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 28 },
  tituloCard: { fontSize: 17, lineHeight: 22 },
  linkAcao: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 6 },
  linkTexto: { fontSize: 14 },
  fotoArea: { height: 200, borderRadius: 14, overflow: 'hidden', backgroundColor: '#2B3240' },
  seloFoto: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seloFotoTexto: { color: '#FFFFFF', fontSize: 12 },
  fotoVazia: {
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  circuloCamera: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  fotoVaziaTitulo: { fontSize: 16, lineHeight: 20 },
  fotoVaziaTexto: { fontSize: 13, lineHeight: 18 },
  campo: {
    minHeight: 84,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  acoes: { marginTop: 'auto', paddingTop: 8, gap: 10 },
});
