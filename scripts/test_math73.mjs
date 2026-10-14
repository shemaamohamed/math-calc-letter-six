export function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function bigIntSqrt(n) {
  if (n < 0n) throw new Error('neg');
  if (n === 0n) return 0n;
  let x0 = n;
  let x1 = (x0 + n / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }
  return x0;
}

export function sqrtFraction(num, den, precision = 60) {
  const p = BigInt(precision);
  const scale = 10n ** (p * 2n);
  const scaledNum = (num * scale) / den;
  const sqrtInt = bigIntSqrt(scaledNum);
  const str = sqrtInt.toString().padStart(precision + 1, '0');
  const intPart = str.slice(0, str.length - precision);
  const fracPart = str.slice(str.length - precision);
  const first10 = fracPart.substring(0, 10);
  const digits = first10.split('').map(d => parseInt(d, 10));
  const sum = digits.reduce((a, b) => a + b, 0);
  return { intPart, first10, digits, sum, full: `${intPart}.${fracPart}` };
}

const r1 = sqrtFraction(6205n, 98n);
console.log('Phase 1 (6205/98):', r1);

const r2 = sqrtFraction(4675n, 98n);
console.log('Phase 2 (4675/98):', r2);
