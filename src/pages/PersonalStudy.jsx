import { useNavigate } from 'react-router-dom'
import styles from './Section.module.css'
import s from './PersonalStudy.module.css'

const TOPICS = [
  {
    icon: '🔐',
    title: '암호학',
    desc: 'RSA 공격, AES 취약점, ECC, 해시 함수 익스플로잇',
    slug: 'cryptography',
    tags: ['RSA', 'AES-CBC', 'Padding Oracle', 'Wiener', 'ECC'],
    level: 'Advanced',
  },
  {
    icon: '🔬',
    title: '리버싱',
    desc: 'ELF 구조 분석, 안티디버깅 우회, 패커, VM 난독화',
    slug: 'reversing',
    tags: ['ELF/PE', 'Anti-Debug', 'Unpacking', 'IDAPython', 'GDB'],
    level: 'Advanced',
  },
  {
    icon: '💥',
    title: '포너블',
    desc: 'ret2libc, ROP, 포맷스트링, 힙 익스플로잇, FSOP',
    slug: 'pwnable',
    tags: ['ROP', 'Heap', 'Format String', 'SROP', 'FSOP'],
    level: 'Expert',
  },
  {
    icon: '🌐',
    title: '네트워크',
    desc: 'Scapy 패킷 크래프팅, ARP 스푸핑, TLS 분석, DNS 리바인딩',
    slug: 'network',
    tags: ['Scapy', 'ARP Spoof', 'MITM', 'TLS', 'DNS Rebinding'],
    level: 'Advanced',
  },
]

const LEVEL_COLOR = {
  Advanced: 'blue',
  Expert:   'red',
}

export default function PersonalStudy() {
  const navigate = useNavigate()

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          <span className={styles.tag}>#</span> 개인공부
        </h2>
        <p className={styles.desc}>보안 / 시스템 / 네트워크 심화 학습 기록</p>

        <div className={s.grid}>
          {TOPICS.map(({ icon, title, desc, slug, tags, level }) => (
            <div
              key={slug}
              className={s.card}
              onClick={() => navigate(`/personal-study/${slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/personal-study/${slug}`)}
            >
              <div className={s.cardTop}>
                <span className={s.icon}>{icon}</span>
                <span className={`${s.level} ${s[LEVEL_COLOR[level]]}`}>{level}</span>
              </div>

              <h3 className={s.cardTitle}>{title}</h3>
              <p className={s.cardDesc}>{desc}</p>

              <div className={s.tags}>
                {tags.map(tag => (
                  <span key={tag} className={s.tag}>{tag}</span>
                ))}
              </div>

              <span className={s.viewMore}>내용 보기 →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
