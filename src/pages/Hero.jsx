import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.greeting}>안녕하세요,</p>
        <h1 className={styles.title}>
          저는 <span className={styles.hl}>개발자</span>입니다.
        </h1>
        <p className={styles.sub}>보안 · 백엔드 · AI · 풀스택</p>
        <div className={styles.cta}>
          <a href="#projects" className={styles.btnPrimary}>프로젝트 보기</a>
          <a href="https://github.com/kimikimim" target="_blank" rel="noreferrer" className={styles.btnOutline}>GitHub</a>
        </div>
      </div>

      <div className={styles.terminal}>
        <div className={styles.termHeader}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
          <span className={styles.termTitle}>~ portfolio</span>
        </div>
        <div className={styles.termBody}>
          <p><span className={styles.prompt}>$</span> whoami</p>
          <p className={styles.out}>kimikimim | Developer &amp; Security Researcher</p>
          <p><span className={styles.prompt}>$</span> cat skills.txt</p>
          <p className={styles.out}>Python · FastAPI · React · Docker</p>
          <p className={styles.out}>Security · AI/ML · PostgreSQL</p>
          <p><span className={styles.prompt}>$</span> <span className={styles.cursor}>_</span></p>
        </div>
      </div>
    </section>
  )
}
