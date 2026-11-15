// Peças reutilizadas em várias telas: botão e card.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AZUL, VERDE, VERMELHO, fonte, sombra, sombraBotao } from './tema';

// variante: 'primaria' | 'verde' | 'contorno' | 'texto' | 'perigoTexto' | 'cinza' | 'perigo'
export function Botao({ texto, icone: Icone, onPress, variante = 'primaria', tema, altura = 56, desabilitado }) {
  const v = {
    primaria: { bg: AZUL, cor: '#FFFFFF', sombra: AZUL },
    verde: { bg: VERDE, cor: '#FFFFFF', sombra: VERDE },
    perigo: { bg: VERMELHO, cor: '#FFFFFF', sombra: VERMELHO },
    contorno: { bg: 'transparent', cor: tema.primaryText, borda: tema.outline },
    cinza: { bg: tema.neutralSoft, cor: tema.text },
    texto: { bg: 'transparent', cor: tema.text2 },
    perigoTexto: { bg: 'transparent', cor: tema.danger },
  }[variante];

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.botao,
        { height: altura, backgroundColor: v.bg },
        v.borda && { borderWidth: 1.5, borderColor: v.borda },
        v.sombra && !desabilitado && sombraBotao(v.sombra),
        pressed && { opacity: 0.75, transform: [{ scale: 0.99 }] },
      ]}
    >
      {Icone && <Icone tamanho={19} cor={v.cor} />}
      <Text style={[styles.botaoTexto, fonte(600), { color: v.cor }]}>{texto}</Text>
    </Pressable>
  );
}

export function Card({ tema, style, children }) {
  return <View style={[styles.card, { backgroundColor: tema.surface }, sombra(tema.escuro), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  botaoTexto: { fontSize: 16.5 },
  card: { borderRadius: 20, padding: 16 },
});
