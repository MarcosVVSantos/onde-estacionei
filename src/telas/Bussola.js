// Modo "Encontrar meu carro": bússola com seta apontando para o veículo.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Path, Polygon, Text as SvgText } from 'react-native-svg';

import { Botao } from '../componentes';
import { IconeCelular, IconeFechar, IconeParar } from '../icones';
import { direcaoEmGraus, distanciaEmMetros, partesDistancia } from '../geo';
import { AZUL, AZUL_ESCURO, VERMELHO, fonte, sombra } from '../tema';

const C = 150; // centro do mostrador (o SVG tem 300x300)

function qualidadeGps(precisao) {
  if (precisao <= 10) return { texto: 'GPS bom', cor: '#16A34A' };
  if (precisao <= 30) return { texto: 'GPS razoável', cor: '#D97706' };
  return { texto: 'GPS fraco', cor: '#DC2626' };
}

function Mostrador({ tema, direcaoCelular, direcaoCarro, ativo }) {
  // O mostrador inteiro gira ao contrário da direção do celular (como uma bússola de verdade).
  // A seta fica desenhada na direção real do carro, então na tela ela aponta
  // para (direção do carro − direção do celular).
  const giroMostrador = -(direcaoCelular ?? 0);
  const corTick = ativo ? tema.tick : tema.border;
  const corTickForte = ativo ? tema.tickForte : tema.tick;
  const corLetra = ativo ? tema.text2 : tema.tick;

  const rad = ((direcaoCarro ?? 0) * Math.PI) / 180;
  const carroX = C + 134 * Math.sin(rad);
  const carroY = C - 134 * Math.cos(rad);

  return (
    <Svg width={300} height={300} viewBox="0 0 300 300">
      <Circle cx={C} cy={C} r={114} fill={tema.dial} />
      <G transform={`rotate(${giroMostrador} ${C} ${C})`}>
        {/* Marcações finas (a cada 5°) e grossas (a cada 30°) */}
        <Circle cx={C} cy={C} r={134} fill="none" stroke={corTick} strokeWidth={10} strokeDasharray="1.5 10.194" strokeDashoffset={0.75} transform={`rotate(-90 ${C} ${C})`} />
        <Circle cx={C} cy={C} r={134} fill="none" stroke={corTickForte} strokeWidth={16} strokeDasharray="2.5 67.66" strokeDashoffset={1.25} transform={`rotate(-90 ${C} ${C})`} />
        <SvgText x={C} y={60} textAnchor="middle" fontSize={20} fontWeight="800" fill={ativo ? VERMELHO : tema.tick}>N</SvgText>
        <SvgText x={256} y={156} textAnchor="middle" fontSize={16} fontWeight="700" fill={corLetra}>L</SvgText>
        <SvgText x={C} y={258} textAnchor="middle" fontSize={16} fontWeight="700" fill={corLetra}>S</SvgText>
        <SvgText x={44} y={156} textAnchor="middle" fontSize={16} fontWeight="700" fill={corLetra}>O</SvgText>

        {ativo && (
          <>
            <Line x1={C} y1={C} x2={carroX} y2={carroY} stroke={AZUL} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="4 6" />
            <G transform={`rotate(${direcaoCarro} ${C} ${C})`}>
              <Polygon points="150,64 194,188 150,164 106,188" fill={AZUL} stroke={AZUL} strokeWidth={6} strokeLinejoin="round" />
              <Polygon points="150,64 150,164 106,188" fill={AZUL_ESCURO} stroke={AZUL_ESCURO} strokeWidth={6} strokeLinejoin="round" />
            </G>
            <Circle cx={C} cy={C} r={7} fill="#FFFFFF" />
            <Circle cx={carroX} cy={carroY} r={17} fill={AZUL} stroke="#FFFFFF" strokeWidth={3} />
            <G
              transform={`translate(${carroX - 8.5} ${carroY - 8.5}) scale(0.71)`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <Circle cx="7" cy="17" r="2" />
              <Path d="M9 17h6" />
              <Circle cx="17" cy="17" r="2" />
            </G>
          </>
        )}
      </G>

      {!ativo && (
        <>
          <Circle cx={C} cy={C} r={28} fill="none" stroke={tema.primarySoft} strokeWidth={6} />
          <Path d="M150 122 A28 28 0 0 1 178 150" fill="none" stroke={AZUL} strokeWidth={6} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

export default function Bussola({ tema, vaga, posicaoAtual, direcaoCelular, onParar }) {
  const insets = useSafeAreaInsets();
  const temSinal = !!posicaoAtual;

  const distancia = temSinal ? distanciaEmMetros(posicaoAtual, vaga) : null;
  const direcaoCarro = temSinal ? direcaoEmGraus(posicaoAtual, vaga) : null;
  const d = temSinal ? partesDistancia(distancia) : null;
  const minutosAPe = temSinal ? Math.max(1, Math.ceil(distancia / 80)) : null; // ~80 m por minuto
  const rua = typeof vaga.endereco === 'string' ? vaga.endereco.split('\n')[0] : vaga.endereco?.rua;
  const gps = temSinal ? qualidadeGps(posicaoAtual.accuracy ?? 99) : null;

  return (
    <View style={[styles.tela, { backgroundColor: tema.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.topo}>
        <Pressable
          onPress={onParar}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          style={[styles.botaoRedondo, { backgroundColor: tema.surface }, sombra(tema.escuro)]}
        >
          <IconeFechar tamanho={20} cor={tema.text} />
        </Pressable>
        <Text style={[styles.tituloTopo, fonte(600), { color: tema.text }]}>Encontrar meu carro</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.blocoDistancia}>
        <Text style={[styles.rotulo, fonte(500), { color: tema.text3 }]}>Distância até o carro</Text>
        {temSinal ? (
          <>
            <Text style={[styles.distancia, fonte(800), { color: tema.text }]}>
              {d.valor}
              <Text style={[styles.unidade, fonte(700), { color: tema.text2 }]}> {d.unidade}</Text>
            </Text>
            <Text style={[styles.subtexto, fonte(400), { color: tema.text2 }]} numberOfLines={1}>
              ≈ {minutosAPe} min a pé{rua ? ` · ${rua}` : ''}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.distancia, fonte(800), { color: tema.tick }]}>
              – –<Text style={[styles.unidade, fonte(700)]}> m</Text>
            </Text>
            <Text style={[styles.subtexto, fonte(400), { color: tema.text3 }]}>Calculando…</Text>
          </>
        )}
      </View>

      <View style={[styles.circulo, { backgroundColor: tema.surface }, sombra(tema.escuro)]}>
        <Mostrador tema={tema} direcaoCelular={direcaoCelular} direcaoCarro={direcaoCarro} ativo={temSinal} />
      </View>

      {temSinal ? (
        <>
          <View style={[styles.pilula, { backgroundColor: tema.primarySoft }]}>
            <IconeCelular tamanho={18} cor={tema.primaryText} />
            <Text style={[styles.pilulaTexto, fonte(600), { color: tema.primaryText }]}>
              {direcaoCelular == null ? 'Bússola indisponível: Norte para cima' : 'Segure o celular deitado e siga a seta'}
            </Text>
          </View>
          <View style={styles.status}>
            <View style={[styles.ponto, { backgroundColor: gps.cor }]} />
            <Text style={[styles.statusTexto, fonte(400), { color: tema.text2 }]}>
              {gps.texto} · precisão{' '}
              <Text style={[fonte(700), { color: tema.text }]}>± {Math.round(posicaoAtual.accuracy ?? 0)} m</Text>
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.aguardando}>
            <Text style={[styles.aguardandoTitulo, fonte(700), { color: tema.text }]}>Procurando sinal de GPS...</Text>
            <Text style={[styles.aguardandoTexto, fonte(400), { color: tema.text2 }]}>
              Em garagens subterrâneas o sinal é mais fraco. Se demorar, vá para perto de uma saída ou rampa.
            </Text>
          </View>
          <View style={styles.status}>
            <View style={[styles.ponto, { backgroundColor: '#94A3B8' }]} />
            <Text style={[styles.statusTexto, fonte(400), { color: tema.text3 }]}>Precisão: aguardando sinal</Text>
          </View>
        </>
      )}

      <View style={styles.rodape}>
        <Botao texto="Parar de buscar" icone={IconeParar} variante="contorno" tema={tema} onPress={onParar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  topo: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  botaoRedondo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  tituloTopo: { fontSize: 17, lineHeight: 22 },
  blocoDistancia: { marginTop: 24, alignItems: 'center', gap: 2 },
  rotulo: { fontSize: 13, lineHeight: 18 },
  distancia: { fontSize: 72, lineHeight: 80, letterSpacing: -2 },
  unidade: { fontSize: 32, letterSpacing: 0 },
  subtexto: { fontSize: 14, lineHeight: 20, maxWidth: 320 },
  circulo: { marginTop: 20, width: 300, height: 300, borderRadius: 150 },
  pilula: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  pilulaTexto: { fontSize: 14 },
  status: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  ponto: { width: 8, height: 8, borderRadius: 4 },
  statusTexto: { fontSize: 13, lineHeight: 18 },
  aguardando: { marginTop: 24, alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  aguardandoTitulo: { fontSize: 20, lineHeight: 26, textAlign: 'center' },
  aguardandoTexto: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  rodape: { marginTop: 'auto', alignSelf: 'stretch' },
});
