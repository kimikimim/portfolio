import { useState } from 'react'
import styles from './Section.module.css'
import s from './Interview.module.css'

const QA = [
  {
    category: '운영체제 (OS)',
    items: [
      { q: '프로세스와 스레드의 차이는?', a: '프로세스는 독립된 메모리 공간을 가지는 실행 단위이고, 스레드는 프로세스 내에서 메모리를 공유하는 실행 단위입니다. 스레드는 생성/전환 비용이 적지만 동기화 문제가 발생할 수 있습니다.' },
      { q: '데드락(Deadlock)이란?', a: '두 개 이상의 프로세스가 서로 상대방의 자원을 기다리며 무한정 대기하는 상태. 발생 조건: 상호배제, 점유대기, 비선점, 순환대기 4가지가 모두 충족될 때 발생합니다.' },
      { q: '페이지 교체 알고리즘 종류는?', a: 'OPT(최적), FIFO, LRU(Least Recently Used), LFU(Least Frequently Used), Clock 알고리즘 등이 있으며, 실제로는 LRU 근사 알고리즘이 많이 사용됩니다.' },
    ],
  },
  {
    category: '네트워크',
    items: [
      { q: 'TCP와 UDP의 차이는?', a: 'TCP는 연결 지향적으로 신뢰성 있는 데이터 전송(순서 보장, 오류 제어)을 제공합니다. UDP는 비연결형으로 빠르지만 신뢰성을 보장하지 않습니다. 스트리밍, DNS 등에 UDP 사용.' },
      { q: 'HTTP와 HTTPS의 차이는?', a: 'HTTPS는 HTTP에 TLS/SSL 암호화 레이어를 추가한 것입니다. 데이터 암호화, 서버 인증, 데이터 무결성을 보장합니다. 포트는 HTTP 80, HTTPS 443.' },
      { q: '3-way handshake를 설명하라.', a: 'SYN → SYN-ACK → ACK 3단계로 TCP 연결을 수립합니다. 클라이언트가 SYN 전송 → 서버가 SYN-ACK 응답 → 클라이언트가 ACK 전송으로 연결 완료.' },
    ],
  },
  {
    category: '데이터베이스',
    items: [
      { q: '인덱스란 무엇이며 왜 쓰는가?', a: '데이터 조회 속도를 높이기 위한 자료구조(주로 B-Tree). 검색은 O(log n)으로 빨라지지만, 삽입/삭제/갱신 시 인덱스 갱신 오버헤드가 발생합니다.' },
      { q: '트랜잭션 ACID 속성이란?', a: 'Atomicity(원자성): 전부 성공 or 전부 실패. Consistency(일관성): 규칙 유지. Isolation(격리성): 동시 실행 트랜잭션 간 간섭 없음. Durability(지속성): 커밋 후 영구 저장.' },
      { q: '정규화란 무엇인가?', a: '데이터 중복을 최소화하고 이상(Anomaly)을 방지하기 위해 테이블을 분해하는 과정. 1NF~BCNF 단계가 있으며, 과도한 정규화는 JOIN 증가로 성능 저하를 유발할 수 있습니다.' },
    ],
  },
  {
    category: '보안',
    items: [
      { q: 'SQL Injection이란?', a: '악의적인 SQL 구문을 입력값에 삽입해 DB를 조작하는 공격. 방어: Prepared Statement(파라미터 바인딩), 입력값 검증, 최소 권한 원칙 적용.' },
      { q: 'XSS와 CSRF의 차이는?', a: 'XSS: 공격자가 스크립트를 피해 사이트에 삽입해 사용자 브라우저에서 실행. CSRF: 피해자가 의도치 않게 공격자가 원하는 요청을 전송하게 만드는 공격. 방어: XSS→CSP/이스케이프, CSRF→토큰/SameSite 쿠키.' },
      { q: 'JWT 인증 방식을 설명하라.', a: 'Header.Payload.Signature 3부분으로 구성. 서버는 서명을 검증해 토큰 유효성 확인. Stateless라 서버 부담이 적지만, 토큰 탈취 시 만료 전까지 무효화 불가(블랙리스트 관리 필요).' },
    ],
  },
  {
    category: 'Python / 백엔드',
    items: [
      { q: 'GIL(Global Interpreter Lock)이란?', a: 'CPython에서 하나의 스레드만 파이썬 바이트코드를 실행하도록 제한하는 뮤텍스. CPU-bound 작업에서 멀티스레드 성능이 제한됨. IO-bound 작업이나 multiprocessing으로 우회 가능.' },
      { q: 'REST API의 특징은?', a: 'Stateless, Client-Server 분리, 캐시 가능, 계층화, Uniform Interface. HTTP 메서드(GET/POST/PUT/DELETE)로 리소스를 조작. URI는 명사 기반으로 설계.' },
    ],
  },
]

export default function Interview() {
  const [openIdx, setOpenIdx] = useState(null)
  const [openQIdx, setOpenQIdx] = useState({})

  const toggleCat = (i) => setOpenIdx(o => o === i ? null : i)
  const toggleQ = (ci, qi) => {
    setOpenQIdx(prev => ({
      ...prev,
      [`${ci}-${qi}`]: !prev[`${ci}-${qi}`],
    }))
  }

  return (
    <section id="interview" className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.title}><span className={styles.tag}>#</span> 코딩 면접</h2>
        <p className={styles.desc}>기술 면접 대비 핵심 질문 & 답변 정리</p>

        <div className={s.accordion}>
          {QA.map(({ category, items }, ci) => (
            <div key={category} className={s.item}>
              <button className={`${s.header} ${openIdx === ci ? s.open : ''}`} onClick={() => toggleCat(ci)}>
                <span>{category}</span>
                <span className={s.icon}>{openIdx === ci ? '−' : '+'}</span>
              </button>

              {openIdx === ci && (
                <div className={s.body}>
                  {items.map(({ q, a }, qi) => (
                    <div key={qi} className={s.qaItem}>
                      <button className={s.question} onClick={() => toggleQ(ci, qi)}>
                        <span>Q. {q}</span>
                        <span>{openQIdx[`${ci}-${qi}`] ? '▲' : '▼'}</span>
                      </button>
                      {openQIdx[`${ci}-${qi}`] && (
                        <div className={s.answer}>A. {a}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
