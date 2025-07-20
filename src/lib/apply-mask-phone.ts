export function applyMask(input: string) {
  const onlyNumbers = input.replace(/\D/g, "").slice(0, 11); // Limita a 11 dígitos

  let masked = onlyNumbers;

  if (onlyNumbers.length <= 2) {
    masked = onlyNumbers;
  } else if (onlyNumbers.length <= 7) {
    masked = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
  } else {
    masked = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
      2,
      7
    )}-${onlyNumbers.slice(7)}`;
  }

  return masked;
}
