// "Bottom sheet" que confirma se o usuário quer apagar a vaga.
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Botao } from '../componentes';
import { IconeLixeira } from '../icones';
import { fonte } from '../tema';

export default function ConfirmarApagar({ tema, visivel, onCancelar, onConfirmar }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onCancelar} statusBarTranslucent>
      <View style={[styles.fundo, { backgroundColor: tema.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancelar} accessibilityLabel="Fechar" />
        <View style={[styles.folha, { backgroundColor: tema.surface, paddingBottom: insets.bottom + 20 }]} accessibilityViewIsModal>
          <View style={[styles.alca, { backgroundColor: tema.border }]} />
          <View style={[styles.circulo, { backgroundColor: tema.dangerSoft }]}>
            <IconeLixeira tamanho={28} cor={tema.danger} linhas />
          </View>
          <Text style={[styles.titulo, fonte(700), { color: tema.text }]}>Já pegou o carro?</Text>
          <Text style={[styles.texto, fonte(400), { color: tema.text2 }]}>A vaga salva e a foto serão apagadas.</Text>
          <View style={styles.botoes}>
            <View style={{ flex: 1 }}>
              <Botao texto="Cancelar" variante="cinza" tema={tema} onPress={onCancelar} />
            </View>
            <View style={{ flex: 1 }}>
              <Botao texto="Sim, apagar" variante="perigo" tema={tema} onPress={onConfirmar} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, justifyContent: 'flex-end' },
  folha: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  alca: { width: 40, height: 5, borderRadius: 3 },
  circulo: { marginTop: 24, width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  titulo: { marginTop: 18, fontSize: 22, lineHeight: 28, textAlign: 'center' },
  texto: { marginTop: 8, maxWidth: 300, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  botoes: { marginTop: 28, flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
});
