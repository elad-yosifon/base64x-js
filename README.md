# Base64x: Base64 encoder/decoder with customizable lookup tables

### Basic Usage:

```js
import { Base64x } from 'base64x-js';

const base64x = new Base64x('abcdefghijklmnopqrstuvwxyz+/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const encoded = base64x.encode("arbitrary string");

console.log(encoded);                 // "yxj6+xrMyxjTihnO0A9IzK=="
console.log(base64x.decode(encoded)); // "arbitrary string"
```
