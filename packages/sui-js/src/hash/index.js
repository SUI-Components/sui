// extracted from https://github.com/jbt/tiny-hashes/blob/master/md5/md5.js
const m = [
  -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983, 1770035416,
  -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632, 643717713,
  -373897302, -701558691, 38016083, -660478335, -405537848, 568446438, -1019803690, -187363961, 1163531501, -1444681467,
  -51403784, 1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632,
  -1094730640, 681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651, -198630844,
  1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799, 1873313359, -30611744,
  -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551
] // eslint-disable-line
const md5 = function (c) {
  let e
  let g
  let f
  let a
  const h = []
  c = unescape(encodeURI(c))
  for (var b = c.length, k = [(e = 1732584193), (g = -271733879), ~e, ~g], d = 0; d <= b; )
    h[d >> 2] |= (c.charCodeAt(d) || 128) << (8 * (d++ % 4))
  h[(c = 16 * ((b + 8) >> 6) + 14)] = 8 * b
  for (d = 0; d < c; d += 16) {
    b = k
    for (a = 0; a < 64; )
      b = [
        (f = b[3]),
        (e = b[1] | 0) +
          (((f =
            b[0] +
            [(e & (g = b[2])) | (~e & f), (f & e) | (~f & g), e ^ g ^ f, g ^ (e | ~f)][(b = a >> 4)] +
            (m[a] + (h[([a, 5 * a + 1, 3 * a + 5, 7 * a][b] % 16) + d] | 0))) <<
            (b = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * b + (a++ % 4)])) |
            (f >>> (32 - b))),
        e,
        g
      ]
    for (a = 4; a; ) k[--a] = k[a] + b[a]
  }
  for (c = ''; a < 32; ) c += ((k[a >> 3] >> (4 * (1 ^ (a++ & 7)))) & 15).toString(16)
  return c
} // eslint-disable-line

// extracted from https://geraintluff.github.io/sha256/
const sha256 = async ascii => {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount))
  }

  const mathPow = Math.pow
  const maxWord = mathPow(2, 32)
  const lengthProperty = 'length'
  let i, j // Used as a counter across the whole file
  let result = ''

  const words = []
  const asciiBitLength = ascii[lengthProperty] * 8

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  let hash = (sha256.h = sha256.h || [])
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  const k = (sha256.k = sha256.k || [])
  let primeCounter = k[lengthProperty]
  /* /
    var hash = [], k = [];
    var primeCounter = 0;
    // */

  const isComposite = {}
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0
    }
  }

  ascii += '\x80' // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00' // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i)
    if (j >> 8) return // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8)
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0
  words[words[lengthProperty]] = asciiBitLength

  // process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16)) // The message is expanded into 64 words as part of the iteration
    const oldHash = hash
    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8)

    for (i = 0; i < 64; i++) {
      // Expand the message into 64 words
      // Used below if
      const w15 = w[i - 15]
      const w2 = w[i - 2]

      // Iterate
      const a = hash[0]
      const e = hash[4]
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0)
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])) // maj

      hash = [(temp1 + temp2) | 0].concat(hash) // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255
      result += (b < 16 ? 0 : '') + b.toString(16)
    }
  }
  return result
}

export const createHash = md5
export const createAsyncSha256 = sha256
