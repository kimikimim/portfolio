import SecurityLayout from './SecurityLayout'

const data = {
  icon: '🔐',
  title: '암호학',
  desc: 'RSA 공격 기법, AES 취약점, 타원 곡선, 해시 익스플로잇',
  stats: [
    { value: '5', label: '공격 기법' },
    { value: 'RSA', label: '주요 타겟' },
    { value: 'CTF', label: '적용 분야' },
  ],
  topics: [
    {
      title: "Håstad's Broadcast Attack (RSA e=3)",
      difficulty: 'hard',
      tool: 'gmpy2 / pycryptodome',
      explanation:
        '동일한 평문 m을 서로 다른 3개의 RSA 공개키(N₁,N₂,N₃)로 e=3 암호화한 경우, 중국인 나머지 정리(CRT)로 m³을 복원하고 세제곱근을 취해 m을 얻는다.',
      theory:
        'c₁ ≡ m³ (mod N₁)<br>c₂ ≡ m³ (mod N₂)<br>c₃ ≡ m³ (mod N₃)<br>─────────────────────<br>CRT → x ≡ m³ (mod N₁N₂N₃)<br>m = ∛x',
      steps: [
        'e=3으로 동일 메시지를 3개 공개키로 암호화한 (c, N) 쌍 수집',
        'CRT로 combined = m³ mod (N₁·N₂·N₃) 계산',
        'gmpy2.iroot()로 정확한 세제곱근 추출',
      ],
      code: `from gmpy2 import iroot, mpz

def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y

def crt(remainders, moduli):
    """중국인 나머지 정리"""
    M = 1
    for m in moduli:
        M *= m

    result = 0
    for r, m in zip(remainders, moduli):
        Mi = M // m
        _, inv, _ = extended_gcd(Mi, m)
        result += r * Mi * inv

    return result % M

def hastad_broadcast_attack(c_list, n_list, e=3):
    """
    c_list: [c1, c2, c3] — 같은 평문을 각 키로 암호화한 암호문
    n_list: [N1, N2, N3] — 각 공개키 모듈러스
    """
    c_list = [mpz(c) for c in c_list]
    n_list = [mpz(n) for n in n_list]

    combined = crt(c_list, n_list)
    m, is_exact = iroot(combined, e)

    if not is_exact:
        raise ValueError("정확한 세제곱근 없음 — 입력값 확인 필요")

    return m.to_bytes((m.bit_length() + 7) // 8, 'big')

# ── 사용 예시 ─────────────────────────────────
# c1, n1 = 0x..., 0x...
# c2, n2 = 0x..., 0x...
# c3, n3 = 0x..., 0x...
# plaintext = hastad_broadcast_attack([c1,c2,c3], [n1,n2,n3])
# print(plaintext)`,
    },
    {
      title: "Wiener's Attack — RSA 작은 d 복구",
      difficulty: 'hard',
      tool: 'gmpy2',
      explanation:
        "d < N^0.25 일 때 e/N의 연분수(Continued Fraction) 전개에서 나오는 수렴값(convergent) k/d를 통해 개인키 d를 복구할 수 있다. RSA 구현 시 성능을 위해 d를 작게 선택한 경우 취약하다.",
      theory:
        '|e/N − k/d| < 1/(2d²)  (Legendre 정리)<br>→ k/d 는 e/N 의 연분수 수렴값<br>→ φ(N) = (ed−1)/k 로 역산<br>→ p+q = N−φ(N)+1, 이차방정식으로 p,q 복원',
      steps: [
        'e, N에서 e/N의 연분수 전개 계산',
        '각 수렴값 k/d 에 대해 φ(N) = (ed-1)/k 검증',
        '판별식 disc = (N-φ+1)² - 4N 의 완전제곱 여부 확인',
        '성공 시 d 반환 — 즉시 메시지 복호화 가능',
      ],
      code: `from gmpy2 import isqrt, mpz

def continued_fraction_coeffs(num, den):
    """e/N 연분수 계수 생성"""
    while den:
        q = num // den
        yield q
        num, den = den, num - q * den

def convergents(cf_iter):
    """연분수 수렴값 (numerator/denominator) 생성"""
    n0, d0 = mpz(1), mpz(0)
    n1, d1 = mpz(0), mpz(1)
    for q in cf_iter:
        q = mpz(q)
        n0, d0, n1, d1 = n1, d1, q * n1 + n0, q * d1 + d0
        yield n1, d1

def wiener_attack(e, N):
    """
    반환값: d (복구 성공) | None (실패)
    """
    e, N = mpz(e), mpz(N)

    for k, d in convergents(continued_fraction_coeffs(e, N)):
        if k == 0 or (e * d - 1) % k != 0:
            continue

        phi = (e * d - 1) // k          # φ(N) 후보
        b   = N - phi + 1               # p + q
        disc = b * b - 4 * N

        if disc < 0:
            continue

        sq = isqrt(disc)
        if sq * sq == disc and (b + sq) % 2 == 0:
            p = (b + sq) // 2
            q = (b - sq) // 2
            if p * q == N:
                return int(d)           # 개인키 d 복구 성공!

    return None

# ── 사용 예시 ─────────────────────────────────
# e = 0x...
# N = 0x...
# d = wiener_attack(e, N)
# if d:
#     m = pow(c, d, N)
#     print(m.to_bytes((m.bit_length()+7)//8,'big'))`,
    },
    {
      title: 'AES-CBC Padding Oracle Attack',
      difficulty: 'expert',
      cve: 'CVE-2014-3566 (POODLE)',
      tool: 'pycryptodome',
      explanation:
        '서버가 복호화 후 PKCS#7 패딩 유효성만 노출할 때, 바이트 단위 brute-force로 전체 평문을 복원할 수 있다. 블록 단위로 동작하며 각 바이트당 최대 256회 쿼리로 복호화 가능.',
      theory:
        'CBC 복호화: P[i] = D_k(C[i]) ⊕ C[i-1]<br>변조 블록 C\'[i-1][j] = x ⊕ pad_byte<br>oracle이 valid → D_k(C[i])[j] = pad_byte<br>→ P[i][j] = x ⊕ C[i-1][j]',
      steps: [
        '각 블록의 마지막 바이트부터 역순으로 공략',
        'C[i-1]의 j번째 바이트를 x=0~255로 변조해 oracle 호출',
        '패딩 유효 → intermediate[j] = x ⊕ pad_byte 확정',
        '실제 평문 = intermediate[j] ⊕ original_C[i-1][j]',
      ],
      code: `from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

BLOCK = 16

def padding_oracle_attack(ciphertext: bytes, oracle) -> bytes:
    """
    oracle(ciphertext) -> bool (패딩 유효 여부)
    ciphertext: IV + 암호문 블록들 (첫 블록이 IV)
    """
    blocks = [ciphertext[i:i+BLOCK] for i in range(0, len(ciphertext), BLOCK)]
    plaintext = b''

    for blk_idx in range(1, len(blocks)):
        prev  = bytearray(blocks[blk_idx - 1])
        curr  = bytes(blocks[blk_idx])
        inter = bytearray(BLOCK)     # D_k(curr) — intermediate 값

        for pos in range(BLOCK - 1, -1, -1):
            pad_val = BLOCK - pos    # 목표 패딩 바이트 (1~16)

            for guess in range(256):
                modified = bytearray(BLOCK)
                modified[pos] = guess

                # pos+1 ~ 15: 이미 알고 있는 intermediate로 올바른 패딩 강제
                for j in range(pos + 1, BLOCK):
                    modified[j] = inter[j] ^ pad_val

                if oracle(bytes(modified) + curr):
                    # guess XOR pad_val = D_k(curr)[pos]
                    inter[pos] = guess ^ pad_val
                    break

        # 실제 평문 = intermediate XOR 원래 prev 블록
        plaintext += bytes(i ^ p for i, p in zip(inter, prev))

    # PKCS#7 패딩 제거
    return unpad(plaintext, BLOCK)`,
    },
    {
      title: 'Hash Length Extension Attack',
      difficulty: 'hard',
      cve: 'CWE-1021',
      tool: 'hashpumpy / 직접 구현',
      explanation:
        'MAC = H(key || message) 방식에서 내부 해시 상태(state)를 재구성하여 key 없이 임의 데이터를 append한 유효한 MAC을 생성할 수 있다. SHA-1, SHA-256, MD5가 모두 취약하다.',
      theory:
        'SHA-256 내부 상태 = 8개 32-bit 워드<br>H(key||msg) 의 digest = 최종 상태<br>→ 이 상태를 초기값으로 사용<br>→ H_state(padding||append) 계산 가능<br>→ key 없이 H(key||msg||padding||append) 생성',
      steps: [
        '서버 MAC = SHA256(secret || data) 획득',
        'hashpumpy로 secret 길이 brute-force + append 데이터 지정',
        '새 MAC과 새 payload (data || SHA256_padding || append) 반환',
        '서버에 새 payload + MAC 전송 → 검증 통과',
      ],
      code: `import struct
import hashlib

def sha256_padding(msg_len: int) -> bytes:
    """
    SHA-256 내부 padding 생성
    msg_len: key 포함한 원본 메시지 길이 (바이트)
    """
    bit_len = msg_len * 8
    padding = b'\\x80'
    # 55 ≡ (56-1) mod 64
    padding += b'\\x00' * ((55 - msg_len) % 64)
    padding += struct.pack('>Q', bit_len)
    return padding

def sha256_from_state(state_hex: str, data: bytes, msg_len: int) -> str:
    """
    기존 digest를 내부 상태로 재구성하여 연장 계산
    state_hex: 서버에서 받은 SHA-256 digest (hex)
    data:      추가할 데이터
    msg_len:   원본 (key || message || padding) 의 총 길이
    """
    import ctypes

    # digest → 8개 32-bit 워드로 파싱
    digest_bytes = bytes.fromhex(state_hex)
    state = list(struct.unpack('>8I', digest_bytes))

    sha = hashlib.sha256()
    # 내부 상태 강제 주입 (CPython 구현 의존 — 실전은 hashpumpy 사용)
    # sha._sha256.digest_size 등 내부 접근은 버전마다 다름
    # 아래는 hashpumpy 사용 예시
    return None

# ── 실전: hashpumpy 사용 ───────────────────────
# pip install hashpumpy
#
# import hashpumpy
#
# for secret_len in range(1, 32):
#     new_sig, new_msg = hashpumpy.hashpump(
#         hexdigest   = original_mac,   # 서버 MAC
#         original_data = b'user=guest',
#         data_to_add   = b'&admin=1',
#         key_length    = secret_len
#     )
#     if verify(new_msg, new_sig):
#         print(f"[+] secret len={secret_len}")
#         print(f"[+] payload: {new_msg.hex()}")
#         break`,
    },
    {
      title: 'RSA Common Modulus Attack',
      difficulty: 'hard',
      tool: 'gmpy2',
      explanation:
        '동일한 N에 서로 다른 e₁, e₂로 같은 메시지 m을 암호화할 때, gcd(e₁,e₂)=1이면 확장 유클리드 알고리즘으로 m을 복원할 수 있다.',
      theory:
        's₁·e₁ + s₂·e₂ = 1  (베주 항등식)<br>m = c₁^s₁ · c₂^s₂ (mod N)<br>단, s₁ < 0 이면 c₁의 모듈러 역수 사용',
      code: `from gmpy2 import mpz, gcd, invert

def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y

def common_modulus_attack(N, e1, e2, c1, c2):
    """
    같은 N, 다른 e로 암호화된 c1, c2에서 평문 복구
    전제: gcd(e1, e2) == 1
    """
    N, e1, e2, c1, c2 = (mpz(x) for x in [N, e1, e2, c1, c2])

    g, s1, s2 = extended_gcd(int(e1), int(e2))
    assert g == 1, f"gcd(e1,e2) = {g} ≠ 1 — 공격 불가"

    if s1 < 0:
        s1 = -s1
        c1 = invert(c1, N)           # 모듈러 역수
    if s2 < 0:
        s2 = -s2
        c2 = invert(c2, N)

    m = (pow(c1, s1, N) * pow(c2, s2, N)) % N
    return m.to_bytes((m.bit_length() + 7) // 8, 'big')

# ── 사용 예시 ─────────────────────────────────
# m = common_modulus_attack(N, e1=17, e2=65537, c1=c1, c2=c2)
# print(m)`,
    },
  ],
}

export default function Cryptography() {
  return <SecurityLayout data={data} />
}
