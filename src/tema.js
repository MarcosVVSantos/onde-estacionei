// Cores, sombras e fontes do app (seguem o guia de estilo do design).
import { Platform } from 'react-native';

export const AZUL = '#1F6FEB';
export const AZUL_ESCURO = '#1A5FCC';
export const VERDE = '#15803D';
export const VERMELHO = '#C93A3A';

export const claro = {
  escuro: false,
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  field: '#F8FAFC',
  text: '#0F172A',
  text2: '#475569',
  text3: '#5B6577',
  border: '#DCE3EC',
  primarySoft: '#E8F0FE',
  primaryText: AZUL,
  outline: AZUL,
  danger: VERMELHO,
  dangerSoft: '#FDECEC',
  dashBorder: '#A9C4F5',
  dashBg: '#F5F8FF',
  neutralSoft: '#EEF1F5',
  dial: '#F7F9FC',
  tick: '#CBD5E1',
  tickForte: '#64748B',
  successBg: '#E3F4E9',
  successTitle: '#14532D',
  successText: '#166534',
  overlay: 'rgba(15,23,42,0.5)',
};

export const escuro = {
  escuro: true,
  bg: '#0B1220',
  surface: '#151E2E',
  field: '#0F1828',
  text: '#F1F5F9',
  text2: '#A9B4C6',
  text3: '#94A0B4',
  border: '#2A3649',
  primarySoft: '#17294A',
  primaryText: '#7AACF8',
  outline: '#4C8DF6',
  danger: '#F49A9A',
  dangerSoft: '#3A1D22',
  dashBorder: '#2F4D7E',
  dashBg: '#111C30',
  neutralSoft: '#1E293B',
  dial: '#0F1828',
  tick: '#2E3C56',
  tickForte: '#7A889E',
  successBg: '#0F2A1B',
  successTitle: '#BBF7D0',
  successText: '#86EFAC',
  overlay: 'rgba(0,0,0,0.6)',
};

// Com fonte personalizada, o React Native não troca o "peso" sozinho:
// cada peso é um arquivo de fonte diferente. Esta função escolhe o certo.
const PESOS = {
  400: 'Inter_400Regular',
  500: 'Inter_500Medium',
  600: 'Inter_600SemiBold',
  700: 'Inter_700Bold',
  800: 'Inter_800ExtraBold',
};
export const fonte = (peso = 400) => ({ fontFamily: PESOS[peso] });

// Sombra suave dos cards (iOS usa shadow*, Android usa elevation).
export const sombra = (escuroAtivo) =>
  escuroAtivo
    ? {}
    : Platform.select({
        ios: {
          shadowColor: '#0F172A',
          shadowOpacity: 0.07,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 2 },
        default: {},
      });

export const sombraBotao = (cor) =>
  Platform.select({
    ios: { shadowColor: cor, shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
    android: { elevation: 4 },
    default: {},
  });
