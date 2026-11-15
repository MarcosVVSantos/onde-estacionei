# Onde Estacionei? 🚗

Aplicativo em React Native (Expo) que usa os sensores do celular para lembrar onde você estacionou e te guiar de volta até o veículo.

## O problema
Shopping, estádio, estacionamento de hospital, rua desconhecida: é comum esquecer onde o carro (ou a moto) ficou. O app resolve isso com 3 toques.

## Sensores utilizados

| Sensor | Biblioteca | Para que serve no app |
|---|---|---|
| **GPS** (localização) | `expo-location` | Salva a latitude/longitude da vaga e acompanha sua posição enquanto você volta até o carro |
| **Magnetômetro** (bússola) | `expo-location` (`watchHeadingAsync`) | Descobre para onde o celular está apontando, para a seta indicar a direção do carro |
| **Câmera** | `expo-image-picker` | Fotografa a vaga (andar, coluna, placa da rua) |

## Funcionalidades
1. **Salvar vaga**: pega a posição atual pelo GPS e converte em endereço (rua e bairro).
2. **Foto e anotação**: fotografe a vaga e escreva algo como "Piso G2, coluna B14".
3. **Tempo estacionado**: mostra há quanto tempo o veículo está parado (útil para Zona Azul ou estacionamento pago por hora).
4. **Encontrar meu carro**: uma seta aponta para o carro e mostra a distância em tempo real. Abaixo de 15 m, o app avisa que você chegou.
5. **Rota no Google Maps**: abre a rota a pé até a vaga.
6. **Já peguei o carro**: apaga a vaga e a foto.

Os dados ficam salvos no próprio celular (AsyncStorage), então a vaga continua lá mesmo se você fechar o app.

## Como funciona a seta
- O GPS dá a sua posição e a posição do carro, e com elas calculamos a **direção do carro** em graus (0° = Norte).
- A bússola informa para onde o **topo do celular** aponta.
- Ângulo da seta = direção do carro − direção do celular.

A distância é calculada pela **fórmula de Haversine** (distância entre dois pontos na superfície da Terra). O código está em `src/geo.js`.

## Telas
1. **Antes de começar**: explica por que o app pede localização e câmera (só na 1ª vez).
2. **Início**: botão "Salvar onde estacionei".
3. **Vaga salva**: mapa com o pin, endereço, horário, tempo estacionado, precisão, foto e anotação.
4. **Encontrar meu carro**: bússola com a seta e a distância em tempo real.
5. **Você chegou!**: aparece a menos de 15 m, mostrando a foto e a anotação.
6. **Confirmar apagar**: painel que sobe de baixo antes de apagar a vaga.

O app segue o modo claro/escuro do celular automaticamente.

## Estrutura
```
App.js                    → estado do app, sensores e qual tela mostrar
src/telas/                → uma tela por arquivo
src/componentes.js        → botão e card reutilizáveis
src/icones.js             → ícones em SVG
src/tema.js               → cores (claro/escuro), fontes e sombras
src/geo.js                → cálculos de distância, direção e formatação
src/armazenamento.js      → salvar/carregar a vaga e a foto no celular
app.json                  → nome do app e textos de permissão
```

Bibliotecas visuais: `react-native-maps` (mapa), `react-native-svg` (ícones, ilustração e bússola) e `@expo-google-fonts/inter` (fonte Inter).

## Como rodar
```bash
npm install
npx expo start
```
Escaneie o QR Code com o app **Expo Go** no celular. Os sensores só funcionam no aparelho físico: o emulador e o navegador não têm bússola, e o GPS deles é simulado.

> Dica para testar a seta: salve a vaga, ande uns 30–50 m e toque em "Encontrar meu carro".
