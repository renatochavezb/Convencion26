function normalizeLetters(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '');
}

function normalizeCityKey(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

/** Abreviaturas conocidas de ciudades / delegaciones EVM */
const CITY_CODES: Record<string, string> = {
  chihuahua: 'CHIH',
  'ciudad juarez': 'JUAR',
  juarez: 'JUAR',
  monterrey: 'MTY',
  guadalajara: 'GDL',
  'ciudad de mexico': 'CDMX',
  cdmx: 'CDMX',
  'mexico df': 'CDMX',
  tijuana: 'TIJ',
  hermosillo: 'HMO',
  saltillo: 'SLW',
  torreon: 'TRC',
  leon: 'LEON',
  queretaro: 'QRO',
  puebla: 'PUE',
  merida: 'MID',
  cancun: 'CUN',
  culiacan: 'CLN',
  mazatlan: 'MZT',
  aguascalientes: 'AGS',
  morelia: 'MLM',
  veracruz: 'VER',
  oaxaca: 'OAX',
  tampico: 'TAM',
  durango: 'DGO',
  zacatecas: 'ZCL',
  'la paz': 'LAP',
  'los mochis': 'LMM',
  nogales: 'NOG',
  delicias: 'DEL',
  parral: 'PARR',
};

export function abbreviateCity(city: string): string {
  const key = normalizeCityKey(city);
  if (!key) return '';

  if (CITY_CODES[key]) return CITY_CODES[key];

  for (const [known, code] of Object.entries(CITY_CODES)) {
    if (key.includes(known) || known.includes(key)) return code;
  }

  const letters = normalizeLetters(city).toUpperCase();
  return letters.slice(0, 4) || 'CIUD';
}

/**
 * Referencia SPEI estable: mismo apellido + misma ciudad = misma referencia.
 * Formato: CMV-APELLIDO4-CIUDAD (alfanumérico, apto para concepto bancario).
 */
export function buildPaymentReference(name: string, city: string): string {
  const trimmedName = name.trim();
  const trimmedCity = city.trim();

  if (!trimmedName || !trimmedCity) {
    return '';
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean);
  const lastName =
    normalizeLetters(parts[parts.length - 1] || parts[0] || 'USR')
      .slice(0, 4)
      .toUpperCase() || 'USR';

  const cityCode = abbreviateCity(trimmedCity);

  return `CMV-${lastName}-${cityCode}`;
}
