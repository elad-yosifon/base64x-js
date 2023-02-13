import { describe, expect, test } from "@jest/globals";
import { Base64x } from "./base64x";

describe('Base64x', () => {

  test('lookupTableString param is a string with exactly 64 chars', () => {
    const err = 'lookupTableString should be exactly 64 characters long.';

    // @ts-ignore
    expect(() => new Base64x(undefined)).toThrow(err); // undefined
    expect(() => new Base64x('')).toThrow(err); // 0
    expect(() => new Base64x('A')).toThrow(err); // 1
    expect(() => new Base64x('AB')).toThrow(err); // 2
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+')).toThrow(err); //63
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+//')).toThrow(err); //65
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-')).not.toThrow(err); //64
  });

  test('lookupTableString param is a string with unique, valid, url-safe (RFC4648) base64 chars', () => {
    const err = 'lookupTableString characters must match charset uniquely.';
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_*')).toThrow(err);
    expect(() => new Base64x('abcdefghijklMNOPQRSTUVWXYZabcdefghijklMNOPQRSTUVWXYZ0123456789+/')).toThrow(err);
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@')).toThrow(err);
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-')).not.toThrow(err);
    expect(() => new Base64x('_-abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')).not.toThrow(err);
  });

  test('base64 padding is preserved', () => {
    const rawString = 'ab';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

  test('ASCII string encoding/decoding intact', () => {
    const rawString = 'elad';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

  test('UTF-8 string intact', () => {
    const rawString = 'אלעד';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

  test('seed ctor must be an integer greater than 0 and less than Number.MAX_SAFE_INTEGER', () => {
    const err = 'seed value must be an integer greater than 0 and less than Number.MAX_SAFE_INTEGER.';
    expect(() => Base64x.fromSeed(Number.MIN_VALUE)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.MAX_VALUE)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.NEGATIVE_INFINITY)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.POSITIVE_INFINITY)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.EPSILON)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.NaN)).toThrow(err);
    expect(() => Base64x.fromSeed(Number.MAX_SAFE_INTEGER + Number.EPSILON)).toThrow(err);
    expect(() => Base64x.fromSeed(0.1)).toThrow(err);
    expect(() => Base64x.fromSeed(-0.1)).toThrow(err);
    expect(() => Base64x.fromSeed(0)).toThrow(err);
    expect(() => Base64x.fromSeed(-0)).toThrow(err);
    expect(() => Base64x.fromSeed(1 + Math.random())).toThrow(err);

    // valid values
    expect(() => Base64x.fromSeed(Number.MAX_SAFE_INTEGER - 1)).not.toThrow();
    expect(() => Base64x.fromSeed(1)).not.toThrow();
  });

  test('consistent encode/decode given seed ctor', () => {
    const rawString = 'אלעד';
    const seed = parseInt((Math.random() * 100000000).toFixed(0));
    const s1 = Base64x.fromSeed(seed);
    const s2 = Base64x.fromSeed(seed);
    expect(s2.decode(s1.encode(rawString))).toStrictEqual(rawString);
  });

});