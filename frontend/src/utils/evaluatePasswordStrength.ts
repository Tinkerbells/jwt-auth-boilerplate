export type EvaluatePasswordStrengthType = {
  value: number
  color: string
}
export function evaluatePasswordStrength(password: string): EvaluatePasswordStrengthType {
  let score = 0;
  if (!password) return { value: 0, color: "bg-red-800" };
  // Check password length
  if (password.length > 8) score += 1;
  // Contains lowercase
  if (/[a-z]/.test(password)) score += 1;
  // Contains uppercase
  if (/[A-Z]/.test(password)) score += 1;
  // Contains numbers
  if (/\d/.test(password)) score += 1;
  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password))
    score += 1;
  switch (score) {
    case 0:
    case 1:
    case 2:
      return { value: 33, color: "bg-red-700" };
    case 3:
      return { value: 50, color: "bg-orange-400" };
    case 4:
      return { value: 66, color: "bg-green-300" };
    case 5:
      return { value: 100, color: "bg-green-500" };
  }
  return { value: 0, color: "bg-red-800" };
}
