// Tela que explica por que o app pede cada acesso (aparece só na 1ª vez).
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Botao, Card } from '../componentes';
import { IconeBussola, IconeCadeado, IconeCamera, IconeEscudo, IconePin } from '../icones';
import { fonte } from '../tema';

export default function Permissoes({ tema, onPermitir, onPular }) {
  const insets = useSafeAreaInsets();

  const itens = [
    {
      Icone: IconePin,
      titulo: 'Localização',
      selo: 'Obrigatória',
      destaque: true,
      texto: 'Salva o ponto exato da vaga e calcula a distância e a direção até o veículo. Usada só com o app aberto.',
    },
    {
      Icone: IconeCamera,
      titulo: 'Câmera',
      selo: 'Opcional',
      destaque: true,
      texto: 'Para fotografar o andar, a coluna ou a placa da rua e não depender só da memória.',
    },
    {
      Icone: IconeBussola,
      titulo: 'Bússola',
      selo: 'Automática',
      destaque: false,
      texto: 'Usa o sensor do celular para a seta apontar para o veículo. Não precisa de permissão.',
    },
  ];

  return (
    <View style={[styles.tela, { backgroundColor: tema.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
      <ScrollView contentContainerStyle={{ gap: 24, paddingHorizontal: 20 }}>
        <View style={{ gap: 10, paddingHorizontal: 4 }}>
          <View style={[styles.iconeGrande, { backgroundColor: tema.primarySoft }]}>
            <IconeEscudo tamanho={28} cor={tema.primaryText} />
          </View>
          <Text style={[styles.titulo, fonte(800), { color: tema.text }]}>Antes de começar</Text>
          <Text style={[styles.texto, fonte(400), { color: tema.text2 }]}>
            Para achar seu veículo depois, o app precisa de dois acessos. Veja por que pedimos cada um.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {itens.map(({ Icone, titulo, selo, destaque, texto }) => (
            <Card key={titulo} tema={tema} style={styles.item}>
              <View style={[styles.iconeMedio, { backgroundColor: destaque ? tema.primarySoft : tema.neutralSoft }]}>
                <Icone tamanho={22} cor={destaque ? tema.primaryText : tema.text2} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.linhaTitulo}>
                  <Text style={[styles.itemTitulo, fonte(600), { color: tema.text }]}>{titulo}</Text>
                  <Text
                    style={[
                      styles.selo,
                      fonte(600),
                      selo === 'Obrigatória'
                        ? { color: tema.primaryText, backgroundColor: tema.primarySoft }
                        : { color: tema.text2, backgroundColor: tema.neutralSoft },
                    ]}
                  >
                    {selo}
                  </Text>
                </View>
                <Text style={[styles.itemTexto, fonte(400), { color: tema.text2 }]}>{texto}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.aviso}>
          <IconeCadeado tamanho={18} cor={tema.text3} />
          <Text style={[styles.avisoTexto, fonte(400), { color: tema.text3 }]}>
            A vaga e as fotos ficam guardadas no seu celular. Você pode mudar os acessos depois nos Ajustes.
          </Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, gap: 6 }}>
        <Botao texto="Permitir acesso" tema={tema} onPress={onPermitir} />
        <Botao texto="Agora não" variante="texto" altura={48} tema={tema} onPress={onPular} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  iconeGrande: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 28, lineHeight: 34, letterSpacing: -0.4, marginTop: 10 },
  texto: { fontSize: 16, lineHeight: 24 },
  item: { flexDirection: 'row', gap: 14, padding: 18 },
  iconeMedio: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  linhaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  itemTitulo: { fontSize: 17, lineHeight: 22 },
  selo: { fontSize: 12, lineHeight: 16, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  itemTexto: { fontSize: 14, lineHeight: 20 },
  aviso: { flexDirection: 'row', gap: 10, paddingHorizontal: 6 },
  avisoTexto: { flex: 1, fontSize: 13, lineHeight: 19 },
});
