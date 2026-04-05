import { useState } from 'react'
import styles from './Section.module.css'
import s from './AICompare.module.css'

const SERVICES = [
  // 영상
  { name: 'Vrew',          cat: '영상', desc: '영상 편집 + AI 동영상 생성. 쇼츠·유튜브 등 다양한 포맷 지원.',         url: 'https://vrew.voyagerx.com/ko/', 편의: 7,   유용: 7,   기능: 7   },
  { name: 'typecast',      cat: '영상', desc: 'AI 성우 & 가상인간으로 콘텐츠 제작. 한국어 지원, 말투/호흡 세부 조정 가능.', url: 'https://typecast.ai/kr',         편의: 6.3, 유용: 6.3, 기능: 5   },
  { name: 'D-ID',          cat: '영상', desc: '글만 입력하면 사람이 말하는 디지털 아바타 영상 자동 생성.',               url: 'https://www.d-id.com/',          편의: 6,   유용: 7,   기능: 4   },
  { name: 'Sora AI',       cat: '영상', desc: '스토리라인으로 영상 생성. 고도의 프롬프트 엔지니어링 필요.',               url: 'https://openai.com/sora/',       편의: 4,   유용: 6,   기능: 6   },
  { name: 'OnAir Studio',  cat: '영상', desc: '음성·영상 동시 제작. 보이스·음량·속도·호흡 간격까지 세부 조정 가능.',      url: 'https://onairstudio.ai/',        편의: 5.5, 유용: 5,   기능: 5.5 },
  { name: 'Runway AI',     cat: '영상', desc: '텍스트 한 줄로 영화 같은 영상 생성. 복잡한 지식 불필요.',                 url: 'https://runwayml.com/',          편의: null,유용: null,기능: null, note: '유료' },
  { name: 'HeyGen',        cat: '영상', desc: 'AI 아바타로 텍스트 기반 영상 제작. 사진 기반 제작 효율은 낮은 편.',        url: 'https://app.heygen.com/home',    편의: 3,   유용: 5,   기능: 4   },
  { name: 'Invideo AI',    cat: '영상', desc: '텍스트 기반 숏폼 영상 자동 생성 AI.',                                    url: 'https://invideo.io/',             편의: 6,   유용: 3,   기능: 4   },
  { name: 'Viggle AI',     cat: '영상', desc: '밈으로 유행하는 춤 영상을 원하는 객체로 변경.',                            url: 'https://viggle.ai/home',          편의: 5,   유용: 5,   기능: 4   },
  { name: 'LTX Studio',    cat: '영상', desc: '스토리텔링으로 영상 자동 생성. 무료 사용자 일부 제한.',                    url: 'https://app.ltx.studio/',        편의: 3,   유용: 5,   기능: 5   },
  { name: 'Kling AI',      cat: '영상', desc: '서로 다른 사진 객체를 조합해 영상 제작. 속도와 퀄리티 아쉬움.',             url: 'https://klingai.com/',            편의: 2,   유용: 1,   기능: 2   },
  { name: 'QuinvioAI',     cat: '영상', desc: '키워드 입력 → 대본 작성 → 발표 영상 자동 생성. 영상 제작은 유료.',         url: 'https://www.quinv.io/ai',        편의: 5,   유용: 4.67,기능: 4.67},
  { name: 'RephraseAI',    cat: '영상', desc: '텍스트 → 아나운서 발표 영상 변환. 발표 연습에 유용.',                      url: 'https://www.rephrase.ai/',       편의: 5,   유용: 4,   기능: 4.5 },
  // 이미지
  { name: 'Adobe Firefly', cat: '이미지', desc: '텍스트로 이미지 생성 및 다양한 스타일 편집. 수정·재생성 편리하고 퀄리티 높음.', url: 'https://www.adobe.com/kr/sensei/generative-ai/firefly.html', 편의: 7, 유용: 7, 기능: 7 },
  { name: 'Remove.bg',     cat: '이미지', desc: 'AI로 이미지 배경 자동 제거. 정교한 피사체 인식으로 포토샵 작업 속도 향상.',   url: 'https://www.remove.bg/',         편의: 7,   유용: 5.7, 기능: 6   },
  { name: 'AI Image Enlarger', cat: '이미지', desc: '화질 저하 없이 이미지 확대·업스케일링. 배경 제거도 정교하게 가능.',      url: 'https://imglarger.com/',         편의: 6,   유용: 6,   기능: 5   },
  { name: 'Midjourney',    cat: '이미지', desc: '이미지 생성 AI의 대표주자. 한글 이미지 생성은 아직 어려움.',               url: 'https://www.midjourney.com/home',편의: 5,   유용: 6,   기능: 6   },
  { name: 'Topview AI',    cat: '이미지', desc: '나의 제품을 들고 있는 인플루언서 아바타 생성. 상품 홍보에 특화.',             url: 'https://www.topview.ai/',        편의: 5,   유용: 6,   기능: 6   },
  { name: 'Krea AI',       cat: '이미지', desc: '사진 복원·확장·제품 적용 및 동영상 생성. 고급 기능은 유료.',                url: 'https://www.krea.ai/',            편의: 5,   유용: 5,   기능: 6   },
  { name: 'Karlo',         cat: '이미지', desc: '단어 나열 프롬프트로 쉽게 이미지 생성. 원하는 이미지와 비교적 유사하게 생성.', url: 'https://kakaobrain.com/techplayground', 편의: 6, 유용: 5, 기능: 4.6 },
  { name: 'clipdrop',      cat: '이미지', desc: '사진 관련 다양한 기능(배경 제거, 업스케일 등) 한 곳에서 제공.',              url: 'https://clipdrop.co',            편의: 6,   유용: 4.3, 기능: 5   },
  { name: 'Playground AI', cat: '이미지', desc: '프롬프트로 로고·일러스트 디자인 가능. 이미지 기반 디자인은 아직 아쉬움.',      url: 'https://playground.com/design',  편의: 6,   유용: 4,   기능: 2   },
  { name: 'Whisk AI',      cat: '이미지', desc: '객체를 조합해 원하는 이미지 생성하는 구글의 새로운 AI. 조합 정확도 아쉬움.',   url: 'https://labs.google/fx/tools/whisk', 편의: 5, 유용: 2, 기능: 3 },
  { name: 'StockimgAI',    cat: '이미지', desc: '스톡 이미지·배경·로고 등 시각 자산 생성. 로고 제작에 특히 유용.',            url: 'https://stockimg.ai/',           편의: 5.3, 유용: 5,   기능: 4.7 },
  { name: 'Pika AI',       cat: '이미지', desc: '객체를 젤리·스티커·케이크 스타일로 변환. 처리 속도와 품질 아쉬움.',           url: 'https://pika.art/',              편의: 2,   유용: 1,   기능: 3   },
]

const CATS = ['전체', '이미지', '영상']

function ScoreBar({ label, value, max = 7 }) {
  const pct = value != null ? (value / max) * 100 : 0
  const color = pct >= 85 ? '#7ee787' : pct >= 65 ? '#58a6ff' : pct >= 45 ? '#e3b341' : '#ff7b72'
  return (
    <div className={s.barRow}>
      <span className={s.barLabel}>{label}</span>
      <div className={s.barTrack}>
        <div className={s.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={s.barVal}>{value != null ? value.toFixed(1) : '-'}</span>
    </div>
  )
}

export default function AICompare() {
  const [filter, setFilter] = useState('전체')
  const [sort, setSort] = useState('total')
  const [expanded, setExpanded] = useState(null)

  const scored = SERVICES.map(s => ({
    ...s,
    total: (s.편의 != null && s.유용 != null && s.기능 != null)
      ? +(s.편의 + s.유용 + s.기능).toFixed(2)
      : null,
  }))

  const filtered = scored
    .filter(s => filter === '전체' || s.cat === filter)
    .filter(s => s.total != null)
    .sort((a, b) => sort === 'total' ? b.total - a.total : a.name.localeCompare(b.name))

  return (
    <section id="ai-compare" className={styles.pageAlt}>
      <div className={styles.inner}>
        <h2 className={styles.title}><span className={styles.tag}>#</span> AI 서비스 비교</h2>
        <p className={styles.desc}>
          경기대학교 수업 실습 기반 AI 이미지·영상 서비스 평가 (편의성·유용성·기능성, 각 7점 만점)
        </p>

        <div className={s.controls}>
          <div className={s.filterGroup}>
            {CATS.map(c => (
              <button
                key={c}
                className={`${s.filterBtn} ${filter === c ? s.active : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className={s.sortGroup}>
            <button className={`${s.sortBtn} ${sort === 'total' ? s.active : ''}`} onClick={() => setSort('total')}>점수순</button>
            <button className={`${s.sortBtn} ${sort === 'name'  ? s.active : ''}`} onClick={() => setSort('name')}>이름순</button>
          </div>
        </div>

        <div className={s.grid}>
          {filtered.map((svc) => {
            const isOpen = expanded === svc.name
            const rank = filtered.indexOf(svc) + 1
            return (
              <div
                key={svc.name}
                className={`${s.card} ${s[svc.cat === '영상' ? 'video' : 'image']}`}
                onClick={() => setExpanded(isOpen ? null : svc.name)}
              >
                <div className={s.cardTop}>
                  <span className={`${s.catBadge} ${s[svc.cat === '영상' ? 'video' : 'image']}`}>
                    {svc.cat === '영상' ? '🎬' : '🖼️'} {svc.cat}
                  </span>
                  <span className={s.rank}>#{rank}</span>
                </div>

                <div className={s.nameRow}>
                  <span className={s.name}>{svc.name}</span>
                  <span className={s.total}>{svc.total} <small>/ 21</small></span>
                </div>

                <p className={s.desc2}>{svc.desc}</p>

                <div className={s.bars}>
                  <ScoreBar label="편의" value={svc.편의} />
                  <ScoreBar label="유용" value={svc.유용} />
                  <ScoreBar label="기능" value={svc.기능} />
                </div>

                {isOpen && (
                  <a
                    href={svc.url}
                    target="_blank"
                    rel="noreferrer"
                    className={s.visitBtn}
                    onClick={e => e.stopPropagation()}
                  >
                    사이트 방문 →
                  </a>
                )}
              </div>
            )
          })}
        </div>

        <p className={s.footnote}>* 경기대학교 수업 실습 평가 자료 기반 (2025.06.24) · 카드 클릭 시 사이트 링크 표시</p>
      </div>
    </section>
  )
}
