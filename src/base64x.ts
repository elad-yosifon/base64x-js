type StringTransformer = (input: string) => string;

const base64Encode: StringTransformer = ((data: string) => Buffer.from(data, 'utf8').toString('base64'));
const base64Decode: StringTransformer = ((data: string) => Buffer.from(data, 'base64').toString('utf8'));

// @see: https://datatracker.ietf.org/doc/html/rfc4648#section-5
const RFC4648_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const CHARSET_CHARS = RFC4648_CHARSET.split('');

type LookupTable = { [c: string]: string };
type ReverseLookupTable = { [c: string]: string };

function shuffleBytes (input: string, lookupTable: LookupTable): string {
  return input.split('').map(c => lookupTable[c] ?? '=').join('');
}

function reverseShuffleBytes (input: string, lookupTable: ReverseLookupTable): string {
  return input.split('').map(c => lookupTable[c] ?? '=').join('');
}

const deterministicShuffleBySeed = <T> (seed: number, arr: T[]) => {
  const length = arr.length;
  const mod = length - 1;
  for (let i = 0; i < length; i++) {
    seed ^= (seed << 1);
    seed &= 0xffffff;
    const j = seed % mod;
    const x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

export class Base64x {

  private readonly lookupTable: LookupTable;
  private readonly reverseLookupTable: ReverseLookupTable;

  constructor (lookupTableString: string) {

    if (!lookupTableString || lookupTableString.length !== 64) {
      throw new Error('lookupTableString should be exactly 64 characters long.');
    }

    const chars = lookupTableString.split('');
    const uniqueChars = new Set(chars);
    if (!CHARSET_CHARS.every(c => uniqueChars.has(c))) {
      throw new Error(`lookupTableString characters must match charset uniquely.`);
    }

    this.lookupTable = {};
    this.reverseLookupTable = {};

    for (let i = 0; i < 64; i++) {
      const c = chars[i];
      const rc = CHARSET_CHARS[i];
      this.lookupTable[rc] = c;
      this.reverseLookupTable[c] = rc;
    }
  }

  encode (input: string): string {
    return shuffleBytes(base64Encode(input), this.lookupTable);
  }

  decode (input: string): string {
    return base64Decode(reverseShuffleBytes(input, this.reverseLookupTable));
  }

  static fromSeed (seed: number) : Base64x {
    if (seed < 1 || seed >= Number.MAX_SAFE_INTEGER || !Number.isSafeInteger(seed)) {
      throw new Error('seed value must be an integer greater than 0 and less than Number.MAX_SAFE_INTEGER.');
    }
    return new Base64x(deterministicShuffleBySeed(seed, RFC4648_CHARSET.split("")).join(""));
  }
}