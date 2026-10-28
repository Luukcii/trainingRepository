// 0% = red, 50% = yellow, 100% = green. One rule so the slider, badges and bar all match.
export function approvalColor(percent: number) {
  return `hsl(${Math.round(percent * 1.2)} 70% 42%)`;
}
