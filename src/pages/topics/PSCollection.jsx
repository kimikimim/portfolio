import { Link } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'
import styles from './PSCollection.module.css'
import s from '../Section.module.css'

const PROBLEMS = [
  {
    title: '연구소',
    platform: 'BOJ 14502',
    link: 'https://www.acmicpc.net/problem/14502',
    difficulty: 'medium',
    tags: ['BFS', '완전탐색'],
    explanation:
      '3개의 벽을 세워 바이러스 확산을 최소화하고 안전 영역을 최대화하는 문제. 완전탐색 + BFS 조합.',
    code: `from itertools import combinations
from collections import deque
import copy

n, m = map(int, input().split())
board = [list(map(int, input().split())) for _ in range(n)]

empty = [(r, c) for r in range(n) for c in range(m) if board[r][c] == 0]
virus = [(r, c) for r in range(n) for c in range(m) if board[r][c] == 2]
dr, dc = [-1, 1, 0, 0], [0, 0, -1, 1]

def bfs(grid):
    q = deque(virus)
    tmp = copy.deepcopy(grid)
    while q:
        r, c = q.popleft()
        for d in range(4):
            nr, nc = r + dr[d], c + dc[d]
            if 0 <= nr < n and 0 <= nc < m and tmp[nr][nc] == 0:
                tmp[nr][nc] = 2
                q.append((nr, nc))
    return sum(row.count(0) for row in tmp)

ans = 0
for walls in combinations(empty, 3):
    tmp = copy.deepcopy(board)
    for r, c in walls:
        tmp[r][c] = 1
    ans = max(ans, bfs(tmp))

print(ans)`,
  },
  {
    title: '벽 부수고 이동하기',
    platform: 'BOJ 2206',
    link: 'https://www.acmicpc.net/problem/2206',
    difficulty: 'medium',
    tags: ['BFS', '3D DP'],
    explanation:
      '벽을 최대 1번 부수고 (1,1) → (N,M) 최단 거리를 구하는 BFS 변형 문제.',
    code: `from collections import deque

n, m = map(int, input().split())
board = [input().strip() for _ in range(n)]
dr, dc = [-1, 1, 0, 0], [0, 0, -1, 1]

# dist[r][c][broken]: broken=0 아직 벽 안 부숨, 1 부숨
dist = [[[-1, -1] for _ in range(m)] for _ in range(n)]
dist[0][0][0] = 1
q = deque([(0, 0, 0)])

while q:
    r, c, broken = q.popleft()
    if r == n - 1 and c == m - 1:
        print(dist[r][c][broken])
        exit()
    for d in range(4):
        nr, nc = r + dr[d], c + dc[d]
        if not (0 <= nr < n and 0 <= nc < m):
            continue
        if board[nr][nc] == '0' and dist[nr][nc][broken] == -1:
            dist[nr][nc][broken] = dist[r][c][broken] + 1
            q.append((nr, nc, broken))
        elif board[nr][nc] == '1' and broken == 0 and dist[nr][nc][1] == -1:
            dist[nr][nc][1] = dist[r][c][broken] + 1
            q.append((nr, nc, 1))

print(-1)`,
  },
  {
    title: '오픈채팅방',
    platform: 'Programmers 2019 카카오',
    link: 'https://school.programmers.co.kr/learn/courses/30/lessons/42888',
    difficulty: 'medium',
    tags: ['해시맵', '문자열'],
    explanation:
      '2019 카카오 블라인드 채용 문제. 입장/퇴장/닉네임변경 로그를 처리하여 최종 메시지 목록을 출력.',
    code: `def solution(record):
    uid_to_name = {}

    # 1pass: 최신 닉네임 저장
    for r in record:
        parts = r.split()
        action = parts[0]
        uid    = parts[1]
        if action in ('Enter', 'Change'):
            uid_to_name[uid] = parts[2]

    # 2pass: 메시지 생성
    result = []
    for r in record:
        parts = r.split()
        action, uid = parts[0], parts[1]
        name = uid_to_name[uid]
        if action == 'Enter':
            result.append(f'{name}님이 들어왔습니다.')
        elif action == 'Leave':
            result.append(f'{name}님이 나갔습니다.')

    return result`,
  },
  {
    title: '가장 먼 노드',
    platform: 'Programmers Level 3',
    link: 'https://school.programmers.co.kr/learn/courses/30/lessons/49189',
    difficulty: 'hard',
    tags: ['BFS', '그래프'],
    explanation: '1번 노드에서 가장 멀리 있는 노드의 개수를 구하는 BFS 문제.',
    code: `from collections import deque, defaultdict

def solution(n, edge):
    graph = defaultdict(list)
    for u, v in edge:
        graph[u].append(v)
        graph[v].append(u)

    dist = [-1] * (n + 1)
    dist[1] = 0
    q = deque([1])

    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if dist[nxt] == -1:
                dist[nxt] = dist[node] + 1
                q.append(nxt)

    max_dist = max(dist[1:])
    return dist[1:].count(max_dist)`,
  },
  {
    title: '아이템 줍기',
    platform: 'Programmers Level 3',
    link: 'https://school.programmers.co.kr/learn/courses/30/lessons/87694',
    difficulty: 'hard',
    tags: ['BFS', '좌표 변환'],
    explanation:
      '직사각형 테두리를 따라 이동할 때 두 점 사이의 최단 거리를 구하는 BFS. 경계만 이동 가능하다는 점이 핵심.',
    code: `from collections import deque

def solution(rectangle, characterX, characterY, itemX, itemY):
    # 좌표 2배 확대 (경계 구분을 위해)
    grid = [[0] * 102 for _ in range(102)]

    for x1, y1, x2, y2 in rectangle:
        x1, y1, x2, y2 = x1*2, y1*2, x2*2, y2*2
        for x in range(x1, x2 + 1):
            for y in range(y1, y2 + 1):
                if x == x1 or x == x2 or y == y1 or y == y2:
                    grid[x][y] = max(grid[x][y], 1)  # 경계: 1
                else:
                    grid[x][y] = -1                   # 내부: -1 (진입 불가)

    sx, sy = characterX * 2, characterY * 2
    ex, ey = itemX * 2, itemY * 2
    dist = [[-1] * 102 for _ in range(102)]
    dist[sx][sy] = 0
    q = deque([(sx, sy)])
    dr, dc = [-1, 1, 0, 0], [0, 0, -1, 1]

    while q:
        x, y = q.popleft()
        if x == ex and y == ey:
            return dist[x][y] // 2
        for d in range(4):
            nx, ny = x + dr[d], y + dc[d]
            if 0 <= nx < 102 and 0 <= ny < 102 and grid[nx][ny] == 1 and dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1
                q.append((nx, ny))

    return -1`,
  },
]

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function PSCollection() {
  const counts = { easy: 0, medium: 0, hard: 0 }
  PROBLEMS.forEach(p => counts[p.difficulty]++)

  return (
    <section className={s.page}>
      <div className={s.inner}>
        <Link to="/coding-test" className={styles.back}>← 코딩테스트</Link>

        <div className={styles.topHeader}>
          <span className={styles.topIcon}>🏆</span>
          <div>
            <h2 className={styles.topTitle}>PS 풀이 모음</h2>
            <p className={styles.topDesc}>백준 · 프로그래머스 풀이 아카이브 (진행중)</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{PROBLEMS.length}</span>
            <span className={styles.statLabel}>풀이</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.easy}`}>{counts.easy}</span>
            <span className={styles.statLabel}>Easy</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.medium}`}>{counts.medium}</span>
            <span className={styles.statLabel}>Medium</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.hard}`}>{counts.hard}</span>
            <span className={styles.statLabel}>Hard</span>
          </div>
        </div>

        <div className={styles.problems}>
          {PROBLEMS.map((p, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.index}>#{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.problemTitle}>{p.title}</h3>
                  <span className={`${styles.badge} ${styles[p.difficulty]}`}>
                    {DIFFICULTY_LABEL[p.difficulty]}
                  </span>
                  {p.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                    {p.platform} ↗
                  </a>
                )}
              </div>
              <p className={styles.explanation}>{p.explanation}</p>
              <CodeBlock code={p.code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
