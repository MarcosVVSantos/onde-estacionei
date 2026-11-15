// Funções de cálculo geográfico (não dependem de nenhum sensor).

const RAIO_TERRA_METROS = 6371000;

const paraRadianos = (graus) => (graus * Math.PI) / 180;
const paraGraus = (rad) => (rad * 180) / Math.PI;

// Distância em metros entre dois pontos (fórmula de Haversine).
export function distanciaEmMetros(origem, destino) {
  const dLat = paraRadianos(destino.latitude - origem.latitude);
  const dLon = paraRadianos(destino.longitude - origem.longitude);
  const lat1 = paraRadianos(origem.latitude);
  const lat2 = paraRadianos(destino.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * RAIO_TERRA_METROS * Math.asin(Math.sqrt(a));
}

// Direção (em graus, 0 = Norte, 90 = Leste) de "origem" até "destino".
export function direcaoEmGraus(origem, destino) {
  const lat1 = paraRadianos(origem.latitude);
  const lat2 = paraRadianos(destino.latitude);
  const dLon = paraRadianos(destino.longitude - origem.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (paraGraus(Math.atan2(y, x)) + 360) % 360;
}

export function formatarDistancia(metros) {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`;
}

export function formatarTempoDecorrido(desdeMs, agoraMs) {
  const totalMin = Math.max(0, Math.floor((agoraMs - desdeMs) / 60000));
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;
  if (horas === 0) return `${minutos} min`;
  return `${horas} h ${String(minutos).padStart(2, '0')} min`;
}

// Transforma o resultado do reverseGeocode em duas linhas:
// { rua: "Rua Augusta, 1508", regiao: "Consolação · São Paulo – SP" }
export function formatarEndereco(endereco) {
  if (!endereco) return null;
  const rua = [endereco.street, endereco.streetNumber].filter(Boolean).join(', ') || endereco.name;
  const cidade = [endereco.city || endereco.subregion, endereco.region].filter(Boolean).join(' – ');
  const regiao = [endereco.district, cidade].filter(Boolean).join(' · ');
  if (!rua && !regiao) return null;
  return { rua: rua || regiao, regiao: rua ? regiao : '' };
}

export function formatarHora(ms) {
  return new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Separa número e unidade para o número poder ficar grande e a unidade pequena.
export function partesDistancia(metros) {
  if (metros < 1000) return { valor: String(Math.round(metros)), unidade: 'm' };
  return { valor: (metros / 1000).toFixed(1).replace('.', ','), unidade: 'km' };
}

export function partesTempo(desdeMs, agoraMs) {
  const totalMin = Math.max(0, Math.floor((agoraMs - desdeMs) / 60000));
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;
  if (horas === 0) return { valor: String(minutos), unidade: 'min' };
  return { valor: `${horas} h ${String(minutos).padStart(2, '0')}`, unidade: 'min' };
}
