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

export function firmwareAGreaterThanB(v1: string, v2: string) {

  const v1Parts = v1.split(".");
  const v2Parts = v2.split(".");

  for (let i = 0; i < v1Parts.length; ++i) {
    if (v2Parts.length == i) {
      return 1;
    }

    if (v1Parts[i] == v2Parts[i]) {
      continue;
    }
    else if (v1Parts[i] > v2Parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }

  if (v1Parts.length != v2Parts.length) {
    return -1;
  }

  return 0;
}


