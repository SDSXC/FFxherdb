class SHA256 {
    constructor() {
        // SHA256初始哈希值
        this.h = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        // SHA256常量K
        this.K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
    }

    // 右旋转
    rightRotate(n, x) {
        return (x >>> n) | (x << (32 - n));
    }

    // 消息填充
    padMessage(message) {
        const msg = new TextEncoder().encode(message);
        const bitLength = msg.length * 8;
        const padded = new Uint8Array((((msg.length + 8) >> 6) + 1) * 64);
        
        padded.set(msg);
        padded[msg.length] = 0x80;
        
        // 添加长度（以大端序64位表示）
        const lenBytes = new Uint8Array(8);
        new DataView(lenBytes.buffer).setBigUint64(0, BigInt(bitLength), false);
        padded.set(lenBytes, padded.length - 8);
        
        return padded;
    }

    // 计算SHA256
    hash(message) {
        const padded = this.padMessage(message);
        const h = [...this.h];
        
        for (let i = 0; i < padded.length; i += 64) {
            const chunk = padded.slice(i, i + 64);
            const w = new Array(64);
            
            // 将64字节块转换为16个32位字
            for (let j = 0; j < 16; j++) {
                w[j] = new DataView(chunk.buffer, j * 4, 4).getUint32(0, false);
            }
            
            // 扩展消息
            for (let j = 16; j < 64; j++) {
                const s0 = this.rightRotate(7, w[j-15]) ^ 
                          this.rightRotate(18, w[j-15]) ^ 
                          (w[j-15] >>> 3);
                const s1 = this.rightRotate(17, w[j-2]) ^ 
                          this.rightRotate(19, w[j-2]) ^ 
                          (w[j-2] >>> 10);
                w[j] = (w[j-16] + s0 + w[j-7] + s1) & 0xFFFFFFFF;
            }
            
            let [a, b, c, d, e, f, g, hTemp] = h;
            
            // 主循环
            for (let j = 0; j < 64; j++) {
                const S1 = this.rightRotate(6, e) ^ 
                          this.rightRotate(11, e) ^ 
                          this.rightRotate(25, e);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (hTemp + S1 + ch + this.K[j] + w[j]) & 0xFFFFFFFF;
                const S0 = this.rightRotate(2, a) ^ 
                          this.rightRotate(13, a) ^ 
                          this.rightRotate(22, a);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) & 0xFFFFFFFF;
                
                hTemp = g;
                g = f;
                f = e;
                e = (d + temp1) & 0xFFFFFFFF;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) & 0xFFFFFFFF;
            }
            
            // 更新哈希值
            h[0] = (h[0] + a) & 0xFFFFFFFF;
            h[1] = (h[1] + b) & 0xFFFFFFFF;
            h[2] = (h[2] + c) & 0xFFFFFFFF;
            h[3] = (h[3] + d) & 0xFFFFFFFF;
            h[4] = (h[4] + e) & 0xFFFFFFFF;
            h[5] = (h[5] + f) & 0xFFFFFFFF;
            h[6] = (h[6] + g) & 0xFFFFFFFF;
            h[7] = (h[7] + hTemp) & 0xFFFFFFFF;
        }
        
        // 转换为十六进制字符串
        return h.map(v => v.toString(16).padStart(8, '0')).join('');
    }
}

export default SHA256;