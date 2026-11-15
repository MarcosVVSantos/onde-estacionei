// Tela inicial: ainda não existe vaga salva.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { IconePin } from '../icones';
import { AZUL, AZUL_ESCURO, fonte, sombra, sombraBotao } from '../tema';

function IlustracaoCarro() {
  return (
    <Svg width={210} height={180} viewBox="0 0 220 190">
      <Ellipse cx="110" cy="176" rx="82" ry="9" fill="#B9CFF6" />
      <Path d="M66 116 L86 84 Q90 78 98 78 H138 Q146 78 150 84 L168 116 Z" fill={AZUL} />
      <Rect x="34" y="112" width="152" height="50" rx="16" fill={AZUL} />
      <Path d="M80 114 L94 90 Q96 87 100 87 H114 V114 Z" fill="#CFE0FC" />
      <Path d="M122 87 H136 Q140 87 142 90 L156 114 H122 Z" fill="#CFE0FC" />
      <Rect x="174" y="124" width="12" height="8" rx="4" fill="#FDE68A" />
      <Rect x="34" y="124" width="9" height="8" rx="4" fill="#F8B4B4" />
      <Rect x="104" y="128" width="16" height="4" rx="2" fill={AZUL_ESCURO} />
      <Circle cx="72" cy="162" r="18" fill="#0F172A" />
      <Circle cx="72" cy="162" r="7" fill="#CBD5E1" />
      <Circle cx="150" cy="162" r="18" fill="#0F172A" />
      <Circle cx="150" cy="162" r="7" fill="#CBD5E1" />
      <Path
        d="M118 4 C100 4 86 18 86 36 C86 58 118 82 118 82 S150 58 150 36 C150 18 136 4 118 4 Z"
        fill="#15803D"
        stroke="#FFFFFF"
        strokeWidth={4}
      />
      <Circle cx="118" cy="36" r="11" fill="#FFFFFF" />
    </Svg>
  );
}

export default function Inicio({ tema, salvando, onSalvar }) {
  const insets = useSafeAreaInsets();
  const passos = ['Salve a vaga', 'Tire uma foto', 'Siga a seta'];

  return (
    <View style={[styles.tela, { backgroundColor: tema.bg, paddingTop: insets.top + 32, paddingBottom: insets.bottom + 16 }]}>
      <Text style={[styles.titulo, fonte(800), { color: tema.text }]}>Onde Estacionei?</Text>
      <Text style={[styles.subtitulo, fonte(400), { color: tema.text2 }]}>
        Salve a vaga em um toque e volte direto para o seu veículo.
      </Text>

      <View style={[styles.circuloExterno, { backgroundColor: tema.escuro ? '#13213A' : '#E8F0FE' }]}>
        {salvando && (
          <>
            <View style={[styles.anel, { top: -14, left: -14, right: -14, bottom: -14, borderColor: 'rgba(31,111,235,0.18)' }]} />
            <View style={[styles.anel, { top: -32, left: -32, right: -32, bottom: -32, borderColor: 'rgba(31,111,235,0.08)' }]} />
          </>
        )}
        <View style={[styles.circuloInterno, { backgroundColor: tema.escuro ? '#1A2C4D' : '#D7E5FD' }]}>
          <IlustracaoCarro />
        </View>
      </View>

      <View style={styles.passos}>
        {passos.map((p, i) => (
          <View key={p} style={styles.passo}>
            <View style={[styles.numero, { backgroundColor: tema.surface }, sombra(tema.escuro)]}>
              <Text style={[styles.numeroTexto, fonte(700), { color: tema.primaryText }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.passoTexto, fonte(400), { color: tema.text2 }]}>{p}</Text>
          </View>
        ))}
      </View>

      <View style={styles.rodape}>
        <Pressable
          onPress={onSalvar}
          disabled={salvando}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botao,
            { backgroundColor: salvando ? AZUL_ESCURO : AZUL },
            sombraBotao(AZUL),
            pressed && { opacity: 0.8 },
          ]}
        >
          {salvando ? <ActivityIndicator color="#FFFFFF" /> : <IconePin tamanho={22} cor="#FFFFFF" />}
          <Text style={[styles.botaoTexto, fonte(600)]}>
            {salvando ? 'Pegando localização...' : 'Salvar onde estacionei'}
          </Text>
        </Pressable>
        <Text style={[styles.dica, fonte(400), { color: tema.text3 }]}>
          {salvando ? 'Em garagens fechadas pode demorar um pouco mais' : 'Usa o GPS do celular · leva poucos segundos'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  titulo: { fontSize: 30, lineHeight: 36, letterSpacing: -0.5, textAlign: 'center' },
  subtitulo: { marginTop: 10, maxWidth: 300, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  circuloExterno: {
    marginTop: 40,
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anel: { position: 'absolute', borderRadius: 999, borderWidth: 2 },
  circuloInterno: { width: 216, height: 216, borderRadius: 108, alignItems: 'center', justifyContent: 'center' },
  passos: { marginTop: 40, flexDirection: 'row', alignSelf: 'stretch', gap: 8 },
  passo: { flex: 1, alignItems: 'center', gap: 8 },
  numero: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  numeroTexto: { fontSize: 13 },
  passoTexto: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  rodape: { marginTop: 'auto', alignSelf: 'stretch', alignItems: 'center', gap: 12 },
  botao: {
    alignSelf: 'stretch',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botaoTexto: { color: '#FFFFFF', fontSize: 17 },
  dica: { fontSize: 13, lineHeight: 18 },
});
