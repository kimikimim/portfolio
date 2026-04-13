import SecurityLayout from './SecurityLayout'

const data = {
  icon: '🔬',
  title: '리버싱',
  desc: 'ELF/PE 구조, 안티디버깅 우회, 패커, IDAPython 자동화',
  stats: [
    { value: '5', label: '기법' },
    { value: 'ELF/PE', label: '포맷' },
    { value: 'GDB/IDA', label: '도구' },
  ],
  topics: [
    {
      title: 'ELF 구조 분석 — PLT/GOT & 동적 링킹',
      difficulty: 'medium',
      tool: 'readelf / objdump / pwntools',
      explanation:
        'ELF 바이너리에서 PLT(Procedure Linkage Table)와 GOT(Global Offset Table)는 동적 링킹의 핵심이다. 외부 함수 첫 호출 시 lazy binding으로 libc 주소가 GOT에 채워지며, 이를 leak하면 libc base를 계산할 수 있다.',
      theory:
        'call puts@plt<br>  → PLT[puts]: jmp [GOT[puts]]  (첫 호출: resolver)<br>  → ld.so가 libc.puts 주소를 GOT에 기록<br>이후 호출: GOT[puts] → libc.puts 직접 점프',
      code: `#!/usr/bin/env python3
"""ELF PLT/GOT 자동 분석 스크립트"""
import subprocess
import re
from pwn import ELF

def analyze_elf(path: str):
    elf = ELF(path, checksec=False)

    print("\\n[*] Security Mitigations")
    print(f"    RELRO  : {elf.relro}")
    print(f"    Stack  : {'Canary' if elf.canary else 'No Canary'}")
    print(f"    NX     : {'Enabled' if elf.nx else 'Disabled'}")
    print(f"    PIE    : {'Enabled' if elf.pie else 'Disabled'}")

    print("\\n[*] PLT Entries (호출 가능한 외부 함수)")
    for name, addr in elf.plt.items():
        print(f"    {name:<20} PLT={hex(addr)}  GOT={hex(elf.got.get(name, 0))}")

    print("\\n[*] Useful Symbols")
    for sym in ['main', 'win', 'shell', 'backdoor', 'flag']:
        if sym in elf.symbols:
            print(f"    [!] {sym} @ {hex(elf.symbols[sym])}")

    # objdump로 PLT 스텁 역어셈블
    out = subprocess.check_output(
        ['objdump', '-d', '-j', '.plt', path],
        stderr=subprocess.DEVNULL
    ).decode()
    print("\\n[*] .plt Section Disassembly")
    print(out[:800])

if __name__ == '__main__':
    import sys
    analyze_elf(sys.argv[1])

# ── readelf 원라이너 ───────────────────────────
# readelf -W -S ./binary           # 섹션 목록
# readelf -d ./binary | grep NEED  # 의존 라이브러리
# objdump -d ./binary | grep -A5 '<puts@plt>'`,
    },
    {
      title: '안티디버깅 우회 — ptrace / RDTSC / /proc',
      difficulty: 'hard',
      tool: 'GDB + Python / LD_PRELOAD',
      explanation:
        '바이너리가 디버거 탐지 시 종료하는 패턴들: ptrace(PTRACE_TRACEME) 이중 호출, RDTSC 타이밍, /proc/self/status의 TracerPid 확인. 각각 후킹 또는 패치로 우회한다.',
      steps: [
        'strace로 의심스러운 syscall 탐지 (ptrace, prctl, clock_gettime)',
        'LD_PRELOAD 라이브러리로 ptrace 반환값 조작',
        'GDB catch syscall ptrace 로 브레이크포인트 설정 후 rax 조작',
        'Binary Ninja / IDA로 정적 패치 (anti-debug 루틴 NOP)',
      ],
      code: `/* ── LD_PRELOAD 후킹: ptrace 무력화 ────────── */
// antidebug_bypass.c
#include <sys/ptrace.h>
#include <sys/types.h>

long ptrace(enum __ptrace_request req, ...) {
    // PTRACE_TRACEME 호출 시 항상 0 반환 (성공으로 속임)
    return 0;
}

// gcc -shared -fPIC -o bypass.so antidebug_bypass.c
// LD_PRELOAD=./bypass.so ./target

/* ── GDB Python 스크립트: RDTSC 타이밍 우회 ── */
# gdb_bypass.py — GDB에서 실행
import gdb

class PatchRDTSC(gdb.Breakpoint):
    """RDTSC 명령어를 만날 때마다 edx:eax를 0으로 설정"""
    def __init__(self, addr):
        super().__init__(f'*{hex(addr)}', gdb.BP_BREAKPOINT)
        self.call_count = 0

    def stop(self):
        self.call_count += 1
        gdb.execute('set $eax = 0')
        gdb.execute('set $edx = 0')
        return False  # 멈추지 않고 계속 실행

# rdtsc_addr = int(gdb.execute('x/i $pc', to_string=True).split(':')[0][2:], 16)
# PatchRDTSC(rdtsc_addr)

/* ── /proc/self/status TracerPid 패치 ─────── */
// glibc open() 후킹으로 가짜 /proc/self/status 반환
#define _GNU_SOURCE
#include <fcntl.h>
#include <dlfcn.h>
#include <string.h>

typedef int (*orig_open_t)(const char*, int, ...);

int open(const char *path, int flags, ...) {
    orig_open_t orig = dlsym(RTLD_NEXT, "open");
    if (strstr(path, "/proc/self/status")) {
        // 가짜 파일(TracerPid: 0) 반환
        return orig("/tmp/fake_status", flags);
    }
    return orig(path, flags);
}`,
    },
    {
      title: 'UPX 언패킹 & 커스텀 패커 분석',
      difficulty: 'hard',
      tool: 'upx / GDB / x64dbg',
      explanation:
        'UPX는 오픈소스 패커로 간단히 upx -d로 풀리지만, 헤더를 조작한 변종은 직접 OEP(Original Entry Point)를 찾아 메모리 덤프해야 한다. 커스텀 패커는 PUSHA → 복호화 루프 → POPA → JMP OEP 패턴을 분석한다.',
      steps: [
        '`upx -d ./packed` — 표준 UPX는 자동 해제',
        '헤더 손상 시 `strings ./packed | grep UPX` → magic byte 복구',
        'GDB에서 `starti`, `break *main`, `run` 후 자가 복호화 루프 추적',
        'OEP 도달 후 `dump memory ./unpacked.bin $base $base+$size`',
        'pwntools ELF로 재분석',
      ],
      code: `#!/usr/bin/env python3
"""
패커 탐지 및 자동 언패킹 보조 스크립트
(실제 실행은 GDB 내 연동)
"""
import pefile
import struct

def detect_packer(path: str) -> str:
    """PE 파일 패커 탐지"""
    pe = pefile.PE(path)

    # 엔트리포인트가 마지막 섹션에 있으면 패킹 의심
    ep = pe.OPTIONAL_HEADER.AddressOfEntryPoint
    for section in pe.sections:
        va  = section.VirtualAddress
        vsz = section.Misc_VirtualSize
        if va <= ep < va + vsz:
            name = section.Name.strip(b'\\x00').decode()
            if name not in ['.text', 'CODE']:
                return f"Suspicious EP in section '{name}' — packed?"

    # 섹션 엔트로피 계산 (>7.0 이면 압축/암호화)
    for section in pe.sections:
        entropy = section.get_entropy()
        name    = section.Name.strip(b'\\x00').decode()
        print(f"  {name:<12} entropy={entropy:.2f}  {'[HIGH]' if entropy > 7.0 else ''}")

    # UPX 시그니처 탐지
    with open(path, 'rb') as f:
        data = f.read()
    if b'UPX0' in data or b'UPX1' in data:
        return "UPX packer detected"

    return "No common packer detected"

def find_oep_pattern(data: bytes) -> list:
    """
    PUSHA(0x60) + ... + POPA(0x61) + JMP 패턴으로 OEP 후보 탐색
    단순 휴리스틱 — 실제 분석은 동적 추적 필요
    """
    candidates = []
    for i in range(len(data) - 10):
        if data[i] == 0x61:             # POPA
            jmp_byte = data[i+1]
            if jmp_byte in (0xe9, 0xff):  # JMP rel32 | JMP r/m
                candidates.append(hex(i))
    return candidates

if __name__ == '__main__':
    import sys
    path = sys.argv[1]
    print(f"\\n[*] Analyzing: {path}")
    print(detect_packer(path))

# ── GDB OEP dump 원라이너 ─────────────────────
# (gdb) break *0x<OEP주소>
# (gdb) run
# (gdb) dump memory unpacked.bin 0x<base> 0x<base+size>`,
    },
    {
      title: 'IDAPython — 자동화 분석 스크립트',
      difficulty: 'hard',
      tool: 'IDA Pro / IDAPython',
      explanation:
        'IDAPython으로 반복적인 리버싱 작업을 자동화한다. 난독화된 문자열 복호화, 크로스레퍼런스 분석, 함수 이름 자동 복구 등에 활용.',
      code: `# IDA Pro 내부에서 실행 (IDAPython)
import idc
import idaapi
import idautils

# ── 1. XOR 난독화 문자열 자동 복호화 ─────────
def decrypt_xor_strings(key: int = 0x42):
    """
    mov byte ptr [rbp+var_xx], 0xNN 패턴을 탐지하고
    XOR key로 복호화하여 주석 자동 추가
    """
    for func_ea in idautils.Functions():
        for head in idautils.Heads(func_ea, idc.get_func_attr(func_ea, idc.FUNCATTR_END)):
            mnem = idc.print_insn_mnem(head)
            if mnem == 'mov':
                op_val = idc.get_operand_value(head, 1)
                if 0x20 <= (op_val ^ key) <= 0x7e:
                    decrypted = chr(op_val ^ key)
                    idc.set_cmt(head, f'decrypted: {decrypted!r}', 0)

# ── 2. 크로스레퍼런스로 dangerous 함수 탐색 ──
DANGEROUS = ['system', 'execve', 'popen', 'gets', 'strcpy', 'sprintf']

def find_dangerous_calls():
    for name in DANGEROUS:
        ea = idc.get_name_ea_simple(name)
        if ea == idc.BADADDR:
            continue
        print(f"\\n[!] {name} @ {hex(ea)}")
        for xref in idautils.XrefsTo(ea, idautils.XREF_FAR):
            caller = idaapi.get_func(xref.frm)
            fname  = idc.get_func_name(xref.frm) if caller else '(unknown)'
            print(f"    called from {fname} @ {hex(xref.frm)}")

# ── 3. 모든 문자열 수집 및 파일 저장 ──────────
def dump_strings(output='/tmp/ida_strings.txt'):
    with open(output, 'w') as f:
        for s in idautils.Strings():
            f.write(f"{hex(s.ea)}\\t{str(s)}\\n")
    print(f"[+] {output} 저장 완료")

# ── 4. 함수 이름 자동 복구 (패턴 매칭) ────────
KNOWN_SIGS = {
    b'\\x55\\x48\\x89\\xe5\\x48\\x83\\xec\\x10': 'func_setup_frame',
}

def rename_by_signature():
    for ea in idautils.Functions():
        code = idc.get_bytes(ea, 8)
        if code in KNOWN_SIGS:
            idc.set_name(ea, KNOWN_SIGS[code], idc.SN_CHECK)
            print(f"[+] renamed {hex(ea)} → {KNOWN_SIGS[code]}")

# 실행
decrypt_xor_strings(key=0x42)
find_dangerous_calls()
dump_strings()`,
    },
    {
      title: 'VM Obfuscation 분석 — 핸들러 복구',
      difficulty: 'expert',
      tool: 'IDA Pro / angr / Triton',
      explanation:
        '바이너리가 자체 VM(가상 머신) 인터프리터를 구현하여 실제 로직을 숨기는 기법. dispatch loop → opcode → handler 구조를 분석하여 원래 알고리즘을 복원한다.',
      steps: [
        'IDA에서 main dispatch loop 탐색 (switch-case 또는 jump table)',
        '각 핸들러(handler) 함수의 기능 분석 → opcode → 의미 매핑',
        'VM bytecode를 추출하여 역어셈블러 직접 작성',
        'angr/Triton으로 symbolic execution → 조건 분기 해결',
      ],
      code: `#!/usr/bin/env python3
"""
VM 바이트코드 역어셈블러 — CTF 분석용 템플릿
핸들러 분석 후 opcode 매핑 완성 필요
"""
import struct

# ── opcode 테이블 (분석 후 채움) ──────────────
OPCODES = {
    0x01: ('PUSH', 'imm8'),
    0x02: ('POP',  'reg'),
    0x03: ('ADD',  'reg', 'reg'),
    0x04: ('XOR',  'reg', 'reg'),
    0x05: ('JMP',  'offset'),
    0x06: ('JZ',   'reg', 'offset'),
    0x07: ('CALL', 'addr'),
    0x08: ('RET',  None),
    0x09: ('MOV',  'reg', 'reg'),
    0x0a: ('CMP',  'reg', 'imm8'),
    0xff: ('HALT', None),
}

REGS = {0: 'r0', 1: 'r1', 2: 'r2', 3: 'r3', 4: 'sp', 5: 'ip'}

def disasm(bytecode: bytes):
    """VM 바이트코드 역어셈블"""
    ip = 0
    output = []
    while ip < len(bytecode):
        op = bytecode[ip]
        if op not in OPCODES:
            output.append(f"{ip:04x}: UNKNOWN({hex(op)})")
            ip += 1
            continue

        instr = OPCODES[op]
        mnem  = instr[0]
        args  = []
        ip   += 1

        for operand in instr[1:]:
            if operand is None:
                break
            elif operand == 'imm8':
                args.append(f"0x{bytecode[ip]:02x}")
                ip += 1
            elif operand == 'reg':
                args.append(REGS.get(bytecode[ip], f'r{bytecode[ip]}'))
                ip += 1
            elif operand == 'offset':
                offset = struct.unpack_from('<h', bytecode, ip)[0]
                args.append(f"0x{ip+2+offset:04x}")
                ip += 2
            elif operand == 'addr':
                addr = struct.unpack_from('<I', bytecode, ip)[0]
                args.append(f"0x{addr:08x}")
                ip += 4

        output.append(f"  {ip-len(args)-1:04x}:  {mnem:<6} {', '.join(args)}")

    return '\\n'.join(output)

# ── 사용 예시 ─────────────────────────────────
# bytecode = open('./vm_bytecode.bin', 'rb').read()
# print(disasm(bytecode))`,
    },
  ],
}

export default function Reversing() {
  return <SecurityLayout data={data} />
}
