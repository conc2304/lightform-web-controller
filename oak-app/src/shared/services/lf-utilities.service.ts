// ==== Library Imports =======================================================
// ==== App Imports ===========================================================


// Numbers ------------------------------------
export function randomToString() {
  return Math.floor(
    Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)
  ).toString();
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomIntInRange(min: number, max: number): number {
  return Math.floor(this.randomInRange(min, max));
}

