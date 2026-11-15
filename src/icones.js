// Ícones de linha (estilo Lucide) desenhados com react-native-svg.
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

function Base({ tamanho = 20, cor = '#0F172A', espessura = 2, children }) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={espessura}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export const IconePin = (p) => (
  <Base {...p}>
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx="12" cy="10" r="3" />
  </Base>
);

export const IconeRelogio = (p) => (
  <Base {...p}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Base>
);

export const IconeAmpulheta = (p) => (
  <Base {...p}>
    <Path d="M5 22h14" />
    <Path d="M5 2h14" />
    <Path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <Path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </Base>
);

export const IconeMira = (p) => (
  <Base {...p}>
    <Line x1="2" x2="5" y1="12" y2="12" />
    <Line x1="19" x2="22" y1="12" y2="12" />
    <Line x1="12" x2="12" y1="2" y2="5" />
    <Line x1="12" x2="12" y1="19" y2="22" />
    <Circle cx="12" cy="12" r="7" />
    <Circle cx="12" cy="12" r="3" />
  </Base>
);

export const IconeCamera = (p) => (
  <Base {...p}>
    <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <Circle cx="12" cy="13" r="3" />
  </Base>
);

export const IconeRefazer = (p) => (
  <Base {...p}>
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Base>
);

export const IconeLapis = (p) => (
  <Base {...p}>
    <Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
  </Base>
);

export const IconeNavegar = (p) => (
  <Base {...p}>
    <Polygon points="3 11 22 2 13 21 11 13 3 11" />
  </Base>
);

export const IconeLinkExterno = (p) => (
  <Base {...p}>
    <Path d="M15 3h6v6" />
    <Path d="M10 14 21 3" />
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Base>
);

export const IconeLixeira = ({ linhas = false, ...p }) => (
  <Base {...p}>
    <Path d="M3 6h18" />
    <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    {linhas && <Line x1="10" x2="10" y1="11" y2="17" />}
    {linhas && <Line x1="14" x2="14" y1="11" y2="17" />}
  </Base>
);

export const IconeFechar = (p) => (
  <Base {...p}>
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Base>
);

export const IconeCelular = (p) => (
  <Base {...p}>
    <Rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <Path d="M12 18h.01" />
  </Base>
);

export const IconeParar = (p) => (
  <Base {...p}>
    <Rect width="14" height="14" x="5" y="5" rx="2" />
  </Base>
);

export const IconeCheck = (p) => (
  <Base {...p}>
    <Path d="M20 6 9 17l-5-5" />
  </Base>
);

export const IconeEscudo = (p) => (
  <Base {...p}>
    <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <Path d="m9 12 2 2 4-4" />
  </Base>
);

export const IconeBussola = (p) => (
  <Base {...p}>
    <Circle cx="12" cy="12" r="10" />
    <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Base>
);

export const IconeCadeado = (p) => (
  <Base {...p}>
    <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Base>
);

export const IconeCarro = (p) => (
  <Base {...p}>
    <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <Circle cx="7" cy="17" r="2" />
    <Path d="M9 17h6" />
    <Circle cx="17" cy="17" r="2" />
  </Base>
);
