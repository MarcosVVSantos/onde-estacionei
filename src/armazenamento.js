// Guarda a vaga no celular para não perder quando o app for fechado.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const CHAVE = '@onde-estacionei/vaga';
const CHAVE_PERMISSOES = '@onde-estacionei/viu-permissoes';

// Guarda se o usuário já passou pela tela "Antes de começar".
export async function jaViuPermissoes() {
  return (await AsyncStorage.getItem(CHAVE_PERMISSOES)) === 'sim';
}

export async function marcarPermissoesVistas() {
  await AsyncStorage.setItem(CHAVE_PERMISSOES, 'sim');
}

export async function carregarVaga() {
  const json = await AsyncStorage.getItem(CHAVE);
  return json ? JSON.parse(json) : null;
}

export async function salvarVaga(vaga) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(vaga));
}

export async function apagarVaga(vaga) {
  await apagarFoto(vaga?.fotoUri);
  await AsyncStorage.removeItem(CHAVE);
}

// A câmera salva a foto numa pasta temporária (cache), que o sistema pode
// limpar. Por isso copiamos a foto para a pasta permanente do app.
export function guardarFoto(uriTemporaria) {
  if (Platform.OS === 'web') return uriTemporaria;

  const pasta = new Directory(Paths.document, 'fotos');
  if (!pasta.exists) pasta.create();

  const destino = new File(pasta, `vaga-${Date.now()}.jpg`);
  new File(uriTemporaria).copy(destino);
  return destino.uri;
}

export async function apagarFoto(uri) {
  if (!uri || Platform.OS === 'web') return;
  try {
    const arquivo = new File(uri);
    if (arquivo.exists) arquivo.delete();
  } catch {
    // Se a foto já não existir, não tem problema.
  }
}
