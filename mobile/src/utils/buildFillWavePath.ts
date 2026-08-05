/** Path SVG di un riempimento a onda: cresta sinusoidale (due bezier ease) alla quota waveY,
 *  con il picco in crestX (spostabile sull'asse x), piena sotto fino a height. Deve restare
 *  un worklet: viene richiamata da useAnimatedProps sul thread UI ad ogni frame. */
export function buildFillWavePath(
  width: number,
  height: number,
  waveY: number,
  amplitude: number,
  crestX: number
): string {
  'worklet';
  const leftControl = crestX / 2;
  const rightControl = crestX + (width - crestX) / 2;
  const crestY = waveY - amplitude;
  return [
    `M 0 ${waveY}`,
    `C ${leftControl} ${waveY} ${leftControl} ${crestY} ${crestX} ${crestY}`,
    `C ${rightControl} ${crestY} ${rightControl} ${waveY} ${width} ${waveY}`,
    `L ${width} ${height}`,
    `L 0 ${height}`,
    'Z',
  ].join(' ');
}
