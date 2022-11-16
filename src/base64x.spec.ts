import { describe, expect, test } from '@jest/globals';
import { Base64x } from './base64x';

describe('Base64x', () => {

  test('lookupTableString param is a string with exactly 64 chars', () => {
    // @ts-ignore
    expect(() => new Base64x(undefined)).toThrow(); // undefined
    expect(() => new Base64x('')).toThrow(); // 0
    expect(() => new Base64x('A')).toThrow(); // 1
    expect(() => new Base64x('AB')).toThrow(); // 2
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+')).toThrow(); //63
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+//')).toThrow(); //65
  });

  test('lookupTableString param is a string with only valid base64 chars', () => {
    expect(() => new Base64x('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_=')).toThrow();
  });

  test('lookupTableString param is a string with unique chars', () => {
    expect(() => new Base64x('abcdefghijklMNOPQRSTUVWXYZabcdefghijklMNOPQRSTUVWXYZ0123456789+/')).toThrow();
  });

  test('base64 padding is preserved', () => {
    const rawString = 'ab';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz+/ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

  test('ASCII string encoding/decoding intact', () => {
    const rawString = 'elad';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz+/ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

  test('UTF-8 string intact', () => {
    const rawString = 'אלעד';
    const base64x = new Base64x('0123456789abcdefghijklmnopqrstuvwxyz+/ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(base64x.decode(base64x.encode(rawString))).toStrictEqual(rawString);
  });

});