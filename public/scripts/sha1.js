'use strict';

/*
 * Adapted from https://github.com/emn178/js-sha1
 * - Converted to a class
 * - Changed all arrays to typed arrays (seems to have ~30% pref improvement)
 * - Changed the hex method a bit.
 * - Removed some other small things I wasn't using.
 * 
 * License: MIT
 */
(() => {

    const HEX_CHARS = '0123456789abcdef';
    const EXTRA = [-2147483648, 8388608, 32768, 128];
    const SHIFT = [24, 16, 8, 0];

    class SHA1 {

        constructor() {
            this.blocks = new Int32Array(80);
            this.h = Int32Array.from([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
            this.block = this.start = this.bytes = this.hBytes = 0;
            this.finalized = this.hashed = false;
            this.first = true;
        }

        update(message) {
            if (this.finalized) return;
            if (message instanceof ArrayBuffer) message = new Uint8Array(message);

            var index = 0, i, length = message.length || 0, blocks = this.blocks;

            while (index < length) {
                if (this.hashed) {
                    this.hashed = false;
                    blocks[0] = this.block;
                    blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                }

                for (i = this.start; index < length && i < 64; ++index) {
                    blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                }

                this.lastByteIndex = i;
                this.bytes += i - this.start;
                if (i >= 64) {
                    this.block = blocks[16];
                    this.start = i - 64;
                    this.hash();
                    this.hashed = true;
                } else {
                    this.start = i;
                }
            }
            if (this.bytes > 4294967295) {
                this.hBytes += this.bytes / 4294967296 << 0;
                this.bytes = this.bytes % 4294967296;
            }
            return this;
        }

        finalize() {
            if (this.finalized) {
                return;
            }
            this.finalized = true;
            var blocks = this.blocks, i = this.lastByteIndex;
            blocks[16] = this.block;
            blocks[i >> 2] |= EXTRA[i & 3];
            this.block = blocks[16];
            if (i >= 56) {
                if (!this.hashed) {
                    this.hash();
                }
                blocks[0] = this.block;
                blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                    blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                    blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
            blocks[15] = this.bytes << 3;
            this.hash();
        }

        hash() {
            var a = this.h[0], b = this.h[1], c = this.h[2], d = this.h[3], e = this.h[4];
            var f, j, t, blocks = this.blocks;

            for (j = 16; j < 80; ++j) {
                t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
                blocks[j] = (t << 1) | (t >>> 31);
            }

            for (j = 0; j < 20; j += 5) {
                f = (b & c) | ((~b) & d);
                t = (a << 5) | (a >>> 27);
                e = t + f + e + 1518500249 + blocks[j] << 0;
                b = (b << 30) | (b >>> 2);

                f = (a & b) | ((~a) & c);
                t = (e << 5) | (e >>> 27);
                d = t + f + d + 1518500249 + blocks[j + 1] << 0;
                a = (a << 30) | (a >>> 2);

                f = (e & a) | ((~e) & b);
                t = (d << 5) | (d >>> 27);
                c = t + f + c + 1518500249 + blocks[j + 2] << 0;
                e = (e << 30) | (e >>> 2);

                f = (d & e) | ((~d) & a);
                t = (c << 5) | (c >>> 27);
                b = t + f + b + 1518500249 + blocks[j + 3] << 0;
                d = (d << 30) | (d >>> 2);

                f = (c & d) | ((~c) & e);
                t = (b << 5) | (b >>> 27);
                a = t + f + a + 1518500249 + blocks[j + 4] << 0;
                c = (c << 30) | (c >>> 2);
            }

            for (; j < 40; j += 5) {
                f = b ^ c ^ d;
                t = (a << 5) | (a >>> 27);
                e = t + f + e + 1859775393 + blocks[j] << 0;
                b = (b << 30) | (b >>> 2);

                f = a ^ b ^ c;
                t = (e << 5) | (e >>> 27);
                d = t + f + d + 1859775393 + blocks[j + 1] << 0;
                a = (a << 30) | (a >>> 2);

                f = e ^ a ^ b;
                t = (d << 5) | (d >>> 27);
                c = t + f + c + 1859775393 + blocks[j + 2] << 0;
                e = (e << 30) | (e >>> 2);

                f = d ^ e ^ a;
                t = (c << 5) | (c >>> 27);
                b = t + f + b + 1859775393 + blocks[j + 3] << 0;
                d = (d << 30) | (d >>> 2);

                f = c ^ d ^ e;
                t = (b << 5) | (b >>> 27);
                a = t + f + a + 1859775393 + blocks[j + 4] << 0;
                c = (c << 30) | (c >>> 2);
            }

            for (; j < 60; j += 5) {
                f = (b & c) | (b & d) | (c & d);
                t = (a << 5) | (a >>> 27);
                e = t + f + e - 1894007588 + blocks[j] << 0;
                b = (b << 30) | (b >>> 2);

                f = (a & b) | (a & c) | (b & c);
                t = (e << 5) | (e >>> 27);
                d = t + f + d - 1894007588 + blocks[j + 1] << 0;
                a = (a << 30) | (a >>> 2);

                f = (e & a) | (e & b) | (a & b);
                t = (d << 5) | (d >>> 27);
                c = t + f + c - 1894007588 + blocks[j + 2] << 0;
                e = (e << 30) | (e >>> 2);

                f = (d & e) | (d & a) | (e & a);
                t = (c << 5) | (c >>> 27);
                b = t + f + b - 1894007588 + blocks[j + 3] << 0;
                d = (d << 30) | (d >>> 2);

                f = (c & d) | (c & e) | (d & e);
                t = (b << 5) | (b >>> 27);
                a = t + f + a - 1894007588 + blocks[j + 4] << 0;
                c = (c << 30) | (c >>> 2);
            }

            for (; j < 80; j += 5) {
                f = b ^ c ^ d;
                t = (a << 5) | (a >>> 27);
                e = t + f + e - 899497514 + blocks[j] << 0;
                b = (b << 30) | (b >>> 2);

                f = a ^ b ^ c;
                t = (e << 5) | (e >>> 27);
                d = t + f + d - 899497514 + blocks[j + 1] << 0;
                a = (a << 30) | (a >>> 2);

                f = e ^ a ^ b;
                t = (d << 5) | (d >>> 27);
                c = t + f + c - 899497514 + blocks[j + 2] << 0;
                e = (e << 30) | (e >>> 2);

                f = d ^ e ^ a;
                t = (c << 5) | (c >>> 27);
                b = t + f + b - 899497514 + blocks[j + 3] << 0;
                d = (d << 30) | (d >>> 2);

                f = c ^ d ^ e;
                t = (b << 5) | (b >>> 27);
                a = t + f + a - 899497514 + blocks[j + 4] << 0;
                c = (c << 30) | (c >>> 2);
            }

            this.h[0] = this.h[0] + a << 0;
            this.h[1] = this.h[1] + b << 0;
            this.h[2] = this.h[2] + c << 0;
            this.h[3] = this.h[3] + d << 0;
            this.h[4] = this.h[4] + e << 0;
        }

        digest() {
            this.finalize();

            var dataView = new DataView(new ArrayBuffer(20));
            this.h.forEach((v, i) => dataView.setUint32(i * 4, v));
            return dataView.buffer;
        }

        hex() {
            return [...new Uint8Array(this.digest())].map(v => HEX_CHARS[v >> 4] + HEX_CHARS[v & 15]).join('');
        }

        toString() {
            return this.hex();
        }

    }

    window.SHA1 = SHA1;

})();

