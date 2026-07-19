export function isIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function isValidPrice(price: number): boolean {
  return price >= 0 && Number.isFinite(price);
}

export function isValidInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
