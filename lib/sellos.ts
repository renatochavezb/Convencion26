export interface SelloState {
  sellos: number[];
  sellosQr?: number[];
}

export function normalizeSellos(sellos: unknown): number[] {
  if (!Array.isArray(sellos)) return [];
  return [...new Set(sellos.filter((id): id is number => typeof id === 'number' && id >= 1 && id <= 7))];
}

export function normalizeSellosQr(sellosQr: unknown): number[] {
  if (!Array.isArray(sellosQr)) return [];
  return [...new Set(sellosQr.filter((id): id is number => typeof id === 'number' && id >= 1 && id <= 7))];
}

/** Merge client payload with DB — QR-verified stamps can never be removed. */
export function mergeSelloState(
  existing: SelloState | null | undefined,
  incoming: SelloState
): { sellos: number[]; sellosQr: number[] } {
  const existingQr = normalizeSellosQr(existing?.sellosQr);
  const incomingQr = normalizeSellosQr(incoming.sellosQr);
  const incomingSellos = normalizeSellos(incoming.sellos);

  const sellosQr = [...new Set([...existingQr, ...incomingQr])];
  const sellos = [...new Set([...incomingSellos, ...sellosQr])];

  return { sellos, sellosQr };
}

export function claimSelloQr(
  state: SelloState,
  selloId: number
): { sellos: number[]; sellosQr: number[]; isNew: boolean } {
  const sellos = normalizeSellos(state.sellos);
  const sellosQr = normalizeSellosQr(state.sellosQr);
  const isNew = !sellos.includes(selloId);

  return {
    sellos: [...new Set([...sellos, selloId])],
    sellosQr: [...new Set([...sellosQr, selloId])],
    isNew,
  };
}

export function toggleSelloManual(
  state: SelloState,
  selloId: number
): { sellos: number[]; sellosQr: number[]; action: 'added' | 'removed' | 'locked' } {
  const sellos = normalizeSellos(state.sellos);
  const sellosQr = normalizeSellosQr(state.sellosQr);

  if (sellos.includes(selloId)) {
    if (sellosQr.includes(selloId)) {
      return { sellos, sellosQr, action: 'locked' };
    }
    return {
      sellos: sellos.filter(id => id !== selloId),
      sellosQr,
      action: 'removed',
    };
  }

  return {
    sellos: [...sellos, selloId],
    sellosQr,
    action: 'added',
  };
}

export function isSelloQrLocked(state: SelloState, selloId: number): boolean {
  return normalizeSellosQr(state.sellosQr).includes(selloId);
}
