import { useState } from 'react'
import styles from './Section.module.css'
import s from './DevReads.module.css'

// ─── 탭 1: 생기부 소스 ───────────────────────────────────────────────────────
const SAENGGI = [
  {
    category: '🤖 AI / 머신러닝',
    items: [
      { title: 'AI 윤리와 편향 문제 탐구', desc: '챗GPT, Gemini 등 LLM이 특정 집단에 편향된 응답을 생성하는 원인을 분석하고, 학습 데이터 구성과 RLHF 방식의 한계를 탐구한 보고서 작성.' },
      { title: '생성형 AI 원리 분석 (Transformer)', desc: 'Attention Is All You Need 논문을 번역·요약하고, Self-Attention 메커니즘의 수학적 원리를 고등 수학 수준으로 설명하는 발표 준비.' },
      { title: '머신러닝으로 예측 모델 구현', desc: 'Python + sklearn을 활용해 공공데이터(기상, 교통 등)를 분석하고 회귀/분류 모델을 직접 구현. 정확도 개선 과정과 오버피팅 해결 경험 기술.' },
    ],
  },
  {
    category: '🔐 정보보안',
    items: [
      { title: 'SQL Injection 취약점 실습 보고서', desc: 'DVWA 환경에서 SQL Injection, XSS, CSRF 취약점을 직접 실습하고 공격 원리와 방어 방법(Prepared Statement, CSP 헤더 등)을 보고서로 작성.' },
      { title: '암호학 원리 탐구 (RSA, AES)', desc: '공개키 암호화 방식인 RSA의 수학적 원리(소인수분해, 오일러 정리)와 대칭키 AES의 블록 암호화 방식을 수학 교과와 연계하여 탐구.' },
      { title: '개인정보보호법과 기술의 관계', desc: 'GDPR, PIPA(개인정보보호법)의 주요 조항과 기술적 보호 조치(암호화, 익명화)의 구현 방법을 법적·기술적 관점에서 융합 탐구.' },
    ],
  },
  {
    category: '💻 프로그래밍 / 개발',
    items: [
      { title: '오픈소스 프로젝트 기여 경험', desc: 'GitHub에서 관심 있는 오픈소스 프로젝트의 Issue를 분석하고 버그 수정 또는 문서 개선을 통해 Pull Request를 제출한 경험 작성.' },
      { title: '알고리즘 문제 해결 능력 향상 과정', desc: '백준/프로그래머스에서 200문제 이상 풀이하며 DP, 그래프, 탐색 등 핵심 패턴을 분류·정리. 시간복잡도 분석 능력 향상 과정 서술.' },
      { title: '풀스택 웹 애플리케이션 개발', desc: 'React(프론트엔드) + FastAPI(백엔드) + PostgreSQL(DB)을 활용한 CRUD 애플리케이션 개발 경험. 배포(Docker, Nginx)까지 전 과정 서술.' },
    ],
  },
  {
    category: '🌐 네트워크 / 시스템',
    items: [
      { title: 'HTTP/HTTPS 프로토콜 심층 분석', desc: 'Wireshark로 HTTP 패킷을 직접 캡처하여 요청/응답 구조를 분석. TLS 핸드셰이크 과정과 인증서 체계를 실습 기반으로 설명하는 보고서 작성.' },
      { title: '운영체제 스케줄링 알고리즘 탐구', desc: 'FCFS, SJF, Round Robin, Priority Scheduling 등 CPU 스케줄링 알고리즘을 Python으로 시뮬레이션하고 성능(평균 대기시간)을 비교 분석.' },
      { title: '리눅스 서버 구축 및 운영 경험', desc: 'Ubuntu 서버를 직접 설치하고 SSH, 방화벽(ufw), Nginx 웹서버, Let\'s Encrypt SSL 인증서 적용까지 전 과정을 포트폴리오 형태로 기록.' },
    ],
  },
]

// ─── 탭 2: 추천 자료 ─────────────────────────────────────────────────────────
const RESOURCES = [
  {
    category: '📺 유튜브 채널',
    items: [
      { title: '노마드 코더', tag: '입문', url: 'https://www.youtube.com/@nomadcoders', desc: '풀스택 개발 강의, 트렌드 기술 정리. 한국어 최고의 개발 채널 중 하나.' },
      { title: '드림코딩', tag: '입문', url: 'https://www.youtube.com/@dream-coding', desc: 'JS 기초부터 브라우저 동작 원리까지. 설명이 명쾌하고 시각화가 뛰어남.' },
      { title: 'Fireship', tag: '영어', url: 'https://www.youtube.com/@Fireship', desc: '100초 시리즈로 기술 개념 압축 설명. 최신 트렌드 빠르게 파악하기 좋음.' },
      { title: 'Normaltic', tag: '보안', url: 'https://www.youtube.com/@Normaltic', desc: '한국어 해킹/보안 강의. CTF, 웹 취약점 실습 콘텐츠 풍부.' },
    ],
  },
  {
    category: '🌐 학습 플랫폼',
    items: [
      { title: 'roadmap.sh', tag: '필수', url: 'https://roadmap.sh', desc: '개발자 직군별 학습 로드맵. 백엔드/프론트엔드/DevOps/보안 등 체계적 경로 제시.' },
      { title: 'CS50 (Harvard)', tag: 'CS기초', url: 'https://cs50.harvard.edu/x/', desc: '전 세계 최고의 CS 입문 강의. C언어, 알고리즘, 웹, 보안까지 무료.' },
      { title: 'OverTheWire (Wargame)', tag: '보안', url: 'https://overthewire.org', desc: '리눅스 명령어부터 시작하는 보안 워게임. Bandit → Natas → Leviathan 순서로 진행.' },
      { title: 'Hack The Box', tag: '보안', url: 'https://www.hackthebox.com', desc: '실제 환경과 유사한 모의해킹 실습 플랫폼. 포트폴리오용 CTF 실력 검증에 최적.' },
    ],
  },
  {
    category: '📖 무료 책 / 문서',
    items: [
      { title: 'The Missing Semester (MIT)', tag: '무료', url: 'https://missing.csail.mit.edu/', desc: '학교에서 안 가르쳐 주는 개발자 필수 도구들 (Shell, Git, Vim, 정규식 등). MIT 강의 무료 공개.' },
      { title: 'OWASP Top 10', tag: '보안', url: 'https://owasp.org/www-project-top-ten/', desc: '웹 보안 10대 취약점 공식 문서. 보안 입문자 필독. 번역본도 있음.' },
      { title: 'Pro Git Book', tag: '무료', url: 'https://git-scm.com/book/ko/v2', desc: 'Git 공식 교재. 한국어 번역 완비. 브랜치 전략부터 내부 구조까지 완벽 정리.' },
      { title: 'Python Docs (한국어)', tag: '무료', url: 'https://docs.python.org/ko/3/', desc: '파이썬 공식 문서 한국어판. 레퍼런스보다 Tutorial 섹션부터 읽는 것을 추천.' },
    ],
  },
  {
    category: '🛠️ 개발 도구 / 환경',
    items: [
      { title: 'VSCode + Extensions', tag: '도구', url: 'https://code.visualstudio.com/', desc: 'Prettier, ESLint, GitLens, Thunder Client 등 필수 익스텐션으로 생산성 극대화.' },
      { title: 'Postman', tag: '도구', url: 'https://www.postman.com/', desc: 'API 테스트의 표준 도구. REST API 개발 시 필수. Collection으로 팀과 공유 가능.' },
      { title: 'Docker Desktop', tag: '인프라', url: 'https://www.docker.com/', desc: '컨테이너 기반 개발 환경 표준. "내 컴퓨터에서는 되는데" 문제를 영구 해결.' },
      { title: 'GitHub Student Pack', tag: '무료', url: 'https://education.github.com/pack', desc: '학생 인증 시 JetBrains IDE, Namecheap 도메인, DigitalOcean 크레딧 등 $200+ 가치의 도구 무료.' },
    ],
  },
]

// ─── 탭 3: 리눅스 써야하는 이유 ──────────────────────────────────────────────
const LINUX_ARTICLE = [
  {
    heading: '들어가며 — 왜 지금도 이 얘기를 해야 하는가',
    body: `2026년이다. 스마트폰은 모두의 손 안에 있고, 클라우드는 당연한 인프라가 됐으며, AI가 코드를 쓰는 시대다. 그런데도 "리눅스를 배워야 한다"는 말은 여전히 개발자 커뮤니티의 단골 조언으로 남아 있다. 왜일까?

답은 간단하다. 리눅스가 아직도 세상을 돌리고 있기 때문이다.

인터넷 서버의 96.3%, 세계 500대 슈퍼컴퓨터의 100%, 안드로이드 스마트폰 전체, 당신이 쓰는 AWS·GCP·Azure의 기저 인프라, 도커 컨테이너의 기반, ISS(국제우주정거장)의 운영 시스템, 심지어 테슬라 자동차의 인포테인먼트 시스템까지. 리눅스는 어디에나 있다. 보이지 않을 뿐이다.

개발자가 리눅스를 모른다는 것은, 자동차 정비사가 엔진 내부를 모른 채 외장만 닦는 것과 같다. 일은 할 수 있다. 하지만 진짜 문제가 생겼을 때, 진짜 실력 차이가 드러난다.`
  },
  {
    heading: '1. 개발 환경의 표준이 리눅스이다',
    body: `개발자로 살다 보면 반드시 마주치는 순간이 있다. 로컬 Windows 환경에서는 잘 돌아가던 코드가 리눅스 서버에 올라가는 순간 오류를 뿜는 상황. 줄바꿈 문자 차이(CRLF vs LF), 파일 경로 구분자 차이(\ vs /), 권한 체계의 차이, 패키지 버전 차이... 이 모든 문제의 근원은 단 하나다. 개발 환경과 배포 환경이 다르기 때문이다.

Docker가 이 문제를 상당 부분 해결했지만, Docker 자체가 리눅스 컨테이너 기술 위에 서 있다. Mac에서 Docker Desktop이 무겁고 느린 이유도 내부적으로 리눅스 VM을 돌리기 때문이다. 진짜 리눅스 위에서는 Docker가 날아다닌다.

현재 백엔드 개발의 표준 스택을 보자. Python/FastAPI, Node.js/Express, Go, Rust 기반 서버는 거의 예외 없이 리눅스 위에 배포된다. GitHub Actions, GitLab CI, Jenkins 파이프라인의 runner는 우분투다. AWS Lambda, GCP Cloud Run, Azure Functions의 실행 환경도 리눅스다.

WSL(Windows Subsystem for Linux)이 나온 이유를 생각해보라. Microsoft 스스로가 인정한 것이다. 진지하게 개발하려면 리눅스 환경이 필요하다고. WSL은 훌륭한 타협안이지만, 그것조차 결국 리눅스 커널을 Windows 안에 집어넣은 것이다.`
  },
  {
    heading: '2. 서버를 모르는 개발자는 절반짜리 개발자다',
    body: `"나는 프론트엔드 개발자라서 서버 몰라도 돼."

이 말이 2015년에는 어느 정도 통했다. 지금은 통하지 않는다. Vercel, Netlify 같은 플랫폼이 배포를 자동화해줬지만, 그 아래서 무슨 일이 벌어지는지 모르면 디버깅 능력의 한계가 극명하게 드러난다. 네트워크 요청이 왜 느린지, CORS 에러가 왜 나는지, 빌드가 왜 실패하는지를 진짜로 이해하려면 서버 지식이 필요하다.

백엔드 개발자는 말할 것도 없다. SSH 접속, systemd로 서비스 관리, nginx 설정, 방화벽(iptables/ufw), crontab으로 작업 스케줄링, 로그 분석(tail, grep, awk), 프로세스 모니터링(top, htop, ps), 디스크/메모리 점검... 이 모든 것이 리눅스 CLI 기반이다.

한 번이라도 프로덕션 서버에서 장애를 처리해본 사람은 안다. 새벽 3시에 서버가 다운됐을 때, GUI는 없고 SSH 접속만 가능한 상황에서 문제를 찾아야 할 때, 리눅스 명령어들이 얼마나 강력한 무기인지를. 그 순간 journalctl -u nginx -n 100으로 로그를 뽑고, netstat -tulpn으로 포트 상태를 확인하고, df -h로 디스크 꽉 찬 것을 발견하는 사람과, "서버 재부팅 해야 하나요?"라고 묻는 사람의 차이는 하늘과 땅이다.`
  },
  {
    heading: '3. 보안을 하려면 리눅스는 선택이 아니라 필수다',
    body: `사이버보안 분야에서 리눅스는 사실상 언어 수준의 필수 도구다. Kali Linux, Parrot OS, BlackArch — 모든 주요 해킹/펜테스팅 배포판이 리눅스 기반이다. 이유가 있다.

우선 도구의 생태계가 압도적이다. nmap, Metasploit, Burp Suite, Wireshark, Aircrack-ng, John the Ripper, Hashcat, sqlmap, gobuster, ffuf... 수천 개의 보안 도구들이 리눅스에서 태어나고, 리눅스에서 가장 잘 동작한다. 일부는 Windows 포팅도 있지만, 원본의 성능과 안정성에 비할 수 없다.

CTF(Capture The Flag) 대회를 생각해보자. 한국의 CODEGATE, 해외의 DEFCON CTF, picoCTF... 대부분의 문제가 리눅스 환경에서 제공된다. 파일 분석, 리버싱, 서버 해킹, 포렌식 — 어느 분야든 리눅스 숙련도가 기본 전제다.

더 근본적으로, 보안은 시스템의 작동 원리를 깊이 이해하는 학문이다. 파일 권한 체계(chmod, chown, sticky bit, SUID), 프로세스 격리(namespace, cgroup), 네트워크 스택의 작동 방식, 커널과 시스템콜의 관계... 이것을 가장 투명하게 볼 수 있는 환경이 리눅스다. 리눅스는 오픈소스이기 때문에 커널 소스코드를 직접 읽을 수 있다. Windows는 그 안을 볼 수 없다.

당신이 보안을 공부한다면, 리눅스를 모르는 것은 수영을 배우겠다면서 물에 들어가지 않겠다는 것과 같다.`
  },
  {
    heading: '4. 진짜 자유 — 내 컴퓨터를 내가 제어한다는 것',
    body: `Windows를 쓰면 Microsoft가 정한 규칙을 따라야 한다. 강제 업데이트, 광고, 사용자 데이터 수집, 기능 제거, 라이선스 비용. Mac은 Apple이 허용한 범위 안에서만 움직인다. 앱스토어 제한, 시스템 파일 접근 제한, 특정 하드웨어에서만 동작.

리눅스는 다르다. 커널부터 데스크탑 환경, 파일 시스템, 패키지 관리자까지 원하는 대로 조합하고, 수정하고, 배포할 수 있다. 이것은 단순한 취향의 문제가 아니다. 자신의 도구를 완전히 통제할 수 있다는 것은, 개발자에게 정신적으로도 실질적으로도 엄청난 차이를 만든다.

/etc/hosts를 수정하고, systemd 서비스를 직접 작성하고, 커널 파라미터를 조정하고, 부팅 과정을 원하는 방식으로 구성하는 것이 가능하다. "이 동작을 바꾸고 싶다"는 생각이 들었을 때, 리눅스에서는 실제로 바꿀 수 있다. 다른 OS에서는 그냥 참아야 할 때가 많다.

패키지 관리 시스템 하나만 봐도 차이가 느껴진다. apt install python3-dev, pip install, npm install이 한 줄의 명령어로 끝나는 세계. 의존성을 자동으로 해결하고, 업데이트를 일괄 적용하고, 설치한 패키지를 깨끗하게 제거하는 것이 당연한 세계.`
  },
  {
    heading: '5. 쉘과 CLI — 생산성의 차원이 달라진다',
    body: `마우스로 폴더를 열고, 파일을 찾고, 복사하고, 붙여넣는 것. 익숙하고 편하다. 하지만 개발자에게는 한계가 명확하다.

find . -name "*.log" -mtime +7 -delete 한 줄이 "7일 이상 된 모든 로그 파일을 하위 디렉토리까지 전부 찾아서 삭제하라"는 명령이다. GUI로 이것을 하려면 얼마나 걸릴까?

grep -r "TODO" --include="*.py" ./src 한 줄이 src 디렉토리 안의 모든 Python 파일에서 TODO 주석을 찾아준다. 에디터의 전역 검색보다 빠를 때도 많다.

cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20 한 줄이 웹 서버 로그에서 IP별 요청 수를 집계해 상위 20개를 보여준다. 엑셀로 이것을 하면 1시간 작업이다.

파이프(|)로 명령어들을 연결하고, 셸 스크립트로 자동화하고, crontab으로 스케줄링하는 것을 익히면, 반복적인 작업에서 소비하는 시간이 극적으로 줄어든다. Bash 스크립트 100줄이 수작업 몇 시간을 대체하는 경험을 한 번이라도 해보면, CLI를 포기할 수 없게 된다.

tmux를 알게 되면 터미널을 분할하고 세션을 유지하는 것이 당연해진다. vim이나 neovim을 익히면 마우스 없이도 빠르게 코드를 편집할 수 있다. z나 fzf 같은 도구를 활용하면 디렉토리 이동과 파일 검색이 순식간이 된다. 이것들은 모두 리눅스/유닉스 생태계에서 탄생하고 발전한 도구들이다.`
  },
  {
    heading: '6. 취업 시장이 리눅스를 요구한다',
    body: `채용 공고를 살펴보자. 백엔드 개발자, DevOps 엔지니어, 클라우드 엔지니어, 보안 엔지니어, SRE(Site Reliability Engineer)... 이 포지션들의 우대 조건이나 자격 요건에는 거의 빠짐없이 "Linux 환경 개발 경험"이 등장한다.

AWS 자격증(SAA, SAP, DevOps Professional)의 실기 시험에서도 리눅스 CLI 숙련도는 기본 전제다. CKAD, CKA(Kubernetes 자격증)는 리눅스 없이는 아예 시작도 안 된다. 모든 시험이 리눅스 환경에서 진행된다.

신입 개발자들 중에서도 리눅스를 다룰 줄 아는 사람은 즉시 생산적으로 투입될 수 있다. 프로젝트 서버에 SSH 접속하고, 배포 스크립트를 수정하고, 로그를 분석하는 것이 첫 주부터 가능하기 때문이다. 면접에서도 마찬가지다. "리눅스 사용 경험이 있으신가요?"라는 질문에 "네, 개인 서버 운영해봤습니다"와 "아뇨, Windows만 써봤어요"의 인상 차이는 크다.

Google, Microsoft, Meta, Apple의 서버 인프라는 모두 리눅스다. 아이러니하게도 Windows를 만드는 Microsoft조차 Azure 클라우드에서 Linux VM이 Windows VM보다 더 많이 실행되고 있다. 글로벌 IT 기업에서 일하고 싶다면, 리눅스는 선택이 아니다.`
  },
  {
    heading: '7. 배우는 것이 생각보다 어렵지 않다',
    body: `"리눅스는 어렵다"는 인식이 있다. 틀린 말은 아니다. 깊이 들어가면 끝이 없다. 커널 개발, 임베디드 시스템, 드라이버 작성... 전문가의 영역은 확실히 깊다.

하지만 개발자로서 필요한 리눅스 기초는 생각보다 빠르게 익힐 수 있다.

1단계: OverTheWire의 Bandit 게임. 브라우저에서 접속해서 SSH 접속, 파일 탐색, 권한, 리다이렉션 등 핵심 개념을 게임으로 배운다. 레벨 0에서 시작해서 한 주 안에 기초를 잡을 수 있다.

2단계: MIT의 Missing Semester 강의 시청. Shell, Vim, Git, 정규식, 디버깅 도구를 체계적으로 다룬다. 무료이고, 한 강의에 1시간이 안 된다.

3단계: VirtualBox나 UTM에 Ubuntu 가상머신을 설치하거나, WSL2를 활성화해서 실제 사용 환경을 만든다. AWS Free Tier로 EC2 인스턴스 하나 만들어서 SSH로 접속하고 웹서버 하나 올려보는 것이 최고의 실습이다.

두려움 때문에 미루지 마라. 리눅스를 쓰다가 시스템이 망가져도 가상머신이면 스냅샷으로 복원하면 된다. 실제 서버에서 rm -rf를 잘못 쳐도 그것도 배움이다(가급적 경험하지 않는 것이 낫지만). 실수가 두려워서 시작 안 하는 것이, 가장 큰 실수다.`
  },
  {
    heading: '8. 리눅스는 사고방식을 바꾼다',
    body: `리눅스를 깊이 쓰다 보면, 컴퓨터를 보는 시각이 근본적으로 달라진다.

"이게 왜 되지?"라는 질문 대신 "이게 어떻게 되는 거지?"라는 질문을 하게 된다. 프로그램이 실행될 때 메모리에 어떻게 올라가는지, 시스템콜이 어떻게 커널에 요청을 전달하는지, 네트워크 패킷이 어떤 경로로 이동하는지를 실제로 볼 수 있는 환경이 리눅스다.

strace python script.py를 실행하면 파이썬 스크립트가 실행되면서 어떤 시스템콜을 호출하는지가 화면에 쏟아진다. tcpdump -i eth0 port 80으로 HTTP 패킷을 실시간으로 볼 수 있다. /proc/meminfo를 읽으면 현재 메모리 상태가 숫자로 드러난다.

이렇게 내부를 들여다보는 습관이 생기면, 개발할 때도 달라진다. "왜 이 코드가 느릴까?"를 추상적으로 고민하는 대신, 프로파일링 도구를 켜고 병목을 찾는다. "왜 연결이 안 되지?"를 막막해하는 대신, traceroute로 어디서 끊기는지 확인한다.

리눅스 철학인 "하나의 프로그램이 하나의 일을 잘 하라, 그리고 그것들을 조합하라"는 것은 소프트웨어 설계의 원칙이기도 하다. 마이크로서비스, 유닉스 파이프, 함수형 프로그래밍의 compose — 모두 같은 사상에서 비롯된다.`
  },
  {
    heading: '결론 — 지금 당장 터미널을 열어라',
    body: `리눅스를 배워야 하는 이유를 길게 썼지만, 사실 가장 강력한 이유는 이것이다.

리눅스를 쓰면, 더 좋은 개발자가 된다.

더 빠르고, 더 깊이 이해하고, 더 많은 문제를 스스로 해결할 수 있게 된다. 그것이 전부다.

2025년, 지금 당장 할 수 있는 것:
① WSL2 설치 (Windows) 또는 터미널 앱 실행 (Mac - 이미 Unix 기반)
② OverTheWire Bandit Level 0 접속
③ ssh bandit0@bandit.labs.overthewire.org -p 2220 입력
④ 패스워드: bandit0

이 네 줄이 시작이다. 한 번 들어가면, 나오기 싫어질 것이다.

"리눅스는 해커들이나 쓰는 거 아냐?" — 맞다. 그리고 당신도 해커가 될 수 있다.
나쁜 의미가 아니라, 시스템을 깊이 이해하고 창의적으로 문제를 해결하는 사람이라는 본래의 의미에서.

The computer is yours. Use it.`
  },
]

const TABS = ['생기부 소스', '추천 자료', '리눅스 써야하는 이유']

const TAG_COLOR = {
  '입문':   { bg: 'rgba(126,231,135,0.15)', color: '#7ee787' },
  '영어':   { bg: 'rgba(88,166,255,0.15)',  color: '#58a6ff' },
  '보안':   { bg: 'rgba(255,123,114,0.15)', color: '#ff7b72' },
  '필수':   { bg: 'rgba(192,122,255,0.15)', color: '#c07aff' },
  'CS기초': { bg: 'rgba(88,166,255,0.15)',  color: '#58a6ff' },
  '무료':   { bg: 'rgba(126,231,135,0.15)', color: '#7ee787' },
  '도구':   { bg: 'rgba(227,179,65,0.15)',  color: '#e3b341' },
  '인프라': { bg: 'rgba(88,166,255,0.15)',  color: '#58a6ff' },
}

export default function DevReads() {
  const [tab, setTab] = useState(0)

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.title}><span className={styles.tag}>#</span> 고딩 필독</h2>
        <p className={styles.desc}>개발자로 성장하기 위한 자료 큐레이션</p>

        <div className={s.tabs}>
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`${s.tab} ${tab === i ? s.activeTab : ''}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 탭 0: 생기부 소스 */}
        {tab === 0 && (
          <div className={s.saenggiWrap}>
            <p className={s.tabDesc}>IT·개발 분야 생활기록부 작성에 활용할 수 있는 탐구 주제 모음</p>
            {SAENGGI.map(({ category, items }) => (
              <div key={category} className={s.saenggiSection}>
                <h3 className={s.saenggiCat}>{category}</h3>
                <div className={s.saenggiGrid}>
                  {items.map(({ title, desc }) => (
                    <div key={title} className={s.saenggiCard}>
                      <div className={s.saenggiTitle}>{title}</div>
                      <p className={s.saenggiDesc}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 탭 1: 추천 자료 */}
        {tab === 1 && (
          <div className={s.resourceWrap}>
            <p className={s.tabDesc}>직접 써보고 추천하는 학습 자료, 플랫폼, 도구 모음</p>
            {RESOURCES.map(({ category, items }) => (
              <div key={category} className={s.resourceSection}>
                <h3 className={s.resourceCat}>{category}</h3>
                <div className={s.resourceGrid}>
                  {items.map(({ title, tag, url, desc }) => {
                    const tc = TAG_COLOR[tag] || { bg: 'rgba(139,148,158,0.15)', color: '#8b949e' }
                    return (
                      <a key={title} href={url} target="_blank" rel="noreferrer" className={s.resourceCard}>
                        <div className={s.resourceTop}>
                          <span className={s.resourceTitle}>{title}</span>
                          <span className={s.resourceTag} style={{ background: tc.bg, color: tc.color }}>{tag}</span>
                        </div>
                        <p className={s.resourceDesc}>{desc}</p>
                        <span className={s.resourceUrl}>{url.replace('https://', '')}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 탭 2: 리눅스 써야하는 이유 */}
        {tab === 2 && (
          <div className={s.linuxWrap}>
            <div className={s.linuxHero}>
              <span className={s.linuxIcon}>🐧</span>
              <div>
                <h3 className={s.linuxTitle}>리눅스, 왜 써야 하는가</h3>
                <p className={s.linuxSubtitle}>개발자를 위한 리눅스 입문 선언문 · 약 4,000자</p>
              </div>
            </div>
            <div className={s.linuxArticle}>
              {LINUX_ARTICLE.map(({ heading, body }) => (
                <div key={heading} className={s.linuxSection}>
                  <h4 className={s.linuxHeading}>{heading}</h4>
                  <div className={s.linuxBody}>
                    {body.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
