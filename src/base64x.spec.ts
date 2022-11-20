import { describe, expect, test } from '@jest/globals';
import { Base64x } from './base64x';

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

});