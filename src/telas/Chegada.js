// Tela de chegada: aparece quando o usuário está a menos de 15 m do carro.
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Botao, Card } from '../componentes';
import { IconeCheck, IconeLapis, IconePin } from '../icones';
import { VERDE, fonte } from '../tema';

export default function Chegada({ tema, vaga, distancia, onAchei, onVoltar }) {
  const insets = useSafeAreaInsets();
  const temAjuda = vaga.fotoUri || vaga.anotacao;

  return (
    <View style={[styles.tela, { backgroundColor: tema.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={[styles.cabecalho, { backgroundColor: tema.successBg, paddingTop: insets.top + 40 }]}>
          <View style={styles.circuloCheck}>
            <IconeCheck tamanho={44} cor="#FFFFFF" espessura={2.6} />
          </View>
          <Text style={[styles.titulo, fonte(800), { color: tema.successTitle }]}>Você chegou!</Text>
          <Text style={[styles.texto, fonte(400), { color: tema.successText }]}>
            Seu carro está a menos de 15 m. Olhe ao redor.
          </Text>
          <View style={[styles.chip, { backgroundColor: tema.surface }]}>
            <IconePin tamanho={15} cor={VERDE} espessura={2.2} />
            <Text style={[styles.chipTexto, fonte(700), { color: VERDE }]}>{Math.round(distancia)} m</Text>
          </View>
        </View>

        {temAjuda && (
          <Card tema={tema} style={styles.card}>
            <Text style={[styles.cardTitulo, fonte(600), { color: tema.text2 }]}>Para te ajudar a achar</Text>
            {vaga.fotoUri && <Image source={{ uri: vaga.fotoUri }} style={styles.foto} resizeMode="cover" />}
            {!!vaga.anotacao && (
              <View style={styles.anotacao}>
                <View style={[styles.iconeQuadrado, { backgroundColor: tema.primarySoft }]}>
                  <IconeLapis tamanho={18} cor={tema.primaryText} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.rotulo, fonte(500), { color: tema.text3 }]}>Sua anotação</Text>
                  <Text style={[styles.anotacaoTexto, fonte(600), { color: tema.text }]}>{vaga.anotacao}</Text>
                </View>
              </View>
            )}
          </Card>
        )}
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        <Botao texto="Achei meu carro" icone={IconeCheck} variante="verde" tema={tema} onPress={onAchei} />
        <Botao texto="Voltar para a bússola" variante="texto" altura={48} tema={tema} onPress={onVoltar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  cabecalho: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  circuloCheck: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: 'rgba(21,128,61,0.18)',
  },
  titulo: { marginTop: 24, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  texto: { marginTop: 8, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  chip: { marginTop: 14, height: 32, paddingHorizontal: 14, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipTexto: { fontSize: 14 },
  card: { marginTop: 20, marginHorizontal: 16, gap: 14 },
  cardTitulo: { fontSize: 15, lineHeight: 20 },
  foto: { height: 168, borderRadius: 14, backgroundColor: '#2B3240' },
  anotacao: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconeQuadrado: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rotulo: { fontSize: 12, lineHeight: 16 },
  anotacaoTexto: { fontSize: 17, lineHeight: 24 },
  rodape: { paddingHorizontal: 16, gap: 8 },
});
