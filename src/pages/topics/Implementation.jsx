import TopicLayout from './TopicLayout'

const data = {
  icon: '🧩',
  title: '구현 / 시뮬레이션',
  desc: '삼성 코테 유형, 완전탐색, 백트래킹 풀이 정리',
  problems: [
    {
      title: '로봇 청소기',
      platform: 'BOJ 14503',
      link: 'https://www.acmicpc.net/problem/14503',
      difficulty: 'medium',
      explanation:
        '삼성 SW 역량테스트 기출. 로봇 청소기의 이동 규칙을 그대로 시뮬레이션하는 구현 문제.',
      approach:
        '방향 벡터(북동남서)와 회전 규칙을 정확히 구현하는 것이 핵심. 4방향 모두 막혔을 때 후진 처리에 주의.',
      code: `import sys
input = sys.stdin.readline

n, m = map(int, input().split())
r, c, d = map(int, input().split())
board = [list(map(int, input().split())) for _ in range(n)]

# 북(0) 동(1) 남(2) 서(3)
dr = [-1, 0, 1,  0]
dc = [ 0, 1, 0, -1]
CLEAN = 2

board[r][c] = CLEAN
count = 1

while True:
    moved = False
    for _ in range(4):
        d = (d + 3) % 4          # 왼쪽 90° 회전
        nr, nc = r + dr[d], c + dc[d]
        if board[nr][nc] == 0:   # 미청소 구역
            board[nr][nc] = CLEAN
            r, c = nr, nc
            count += 1
            moved = True
            break

    if not moved:
        # 4방향 모두 청소 or 벽 → 후진
        bd = (d + 2) % 4
        nr, nc = r + dr[bd], c + dc[bd]
        if board[nr][nc] == 1:   # 뒤가 벽이면 종료
            break
        r, c = nr, nc            # 방향 유지하며 후진

print(count)`,
    },
    {
      title: '부분수열의 합',
      platform: 'BOJ 1182',
      link: 'https://www.acmicpc.net/problem/1182',
      difficulty: 'easy',
      explanation:
        'N개의 정수로 이루어진 수열에서 합이 S인 공집합이 아닌 부분수열의 개수를 구하는 문제.',
      approach:
        '각 원소를 포함/미포함으로 나누어 2^N개 경우를 탐색하는 백트래킹. 빈 집합 제외 처리 필요.',
      code: `import sys
input = sys.stdin.readline

n, s = map(int, input().split())
nums = list(map(int, input().split()))
count = 0

def backtrack(idx: int, total: int):
    global count
    if idx == n:
        if total == s:
            count += 1
        return
    backtrack(idx + 1, total + nums[idx])  # 포함
    backtrack(idx + 1, total)              # 미포함

backtrack(0, 0)

# 공집합 S==0인 경우 제거
if s == 0:
    count -= 1

print(count)`,
    },
    {
      title: 'N-Queen',
      platform: 'BOJ 9663',
      link: 'https://www.acmicpc.net/problem/9663',
      difficulty: 'hard',
      explanation:
        'N×N 체스판에 N개의 퀸을 서로 공격하지 않도록 배치하는 경우의 수를 구하는 백트래킹 대표 문제.',
      approach:
        '행을 순서대로 배치하므로 열/대각선 충돌만 확인하면 된다. 비트마스킹으로 추가 최적화 가능.',
      code: `n = int(input())
cols   = set()   # 사용 중인 열
diag1  = set()   # 우하향 대각선 (row - col)
diag2  = set()   # 우상향 대각선 (row + col)
count  = 0

def backtrack(row: int):
    global count
    if row == n:
        count += 1
        return
    for col in range(n):
        if col in cols or (row - col) in diag1 or (row + col) in diag2:
            continue
        cols.add(col);         diag1.add(row - col); diag2.add(row + col)
        backtrack(row + 1)
        cols.remove(col);      diag1.remove(row - col); diag2.remove(row + col)

backtrack(0)
print(count)`,
    },
    {
      title: '드래곤 커브',
      platform: 'BOJ 15685',
      link: 'https://www.acmicpc.net/problem/15685',
      difficulty: 'hard',
      explanation:
        '삼성 SW 역량테스트 기출. 드래곤 커브를 N세대까지 확장한 뒤 정사각형 개수를 세는 시뮬레이션.',
      approach:
        '세대가 늘어날 때 기존 방향 목록을 역순으로 뒤집어 +1 방향을 추가하는 규칙을 파악하는 것이 핵심.',
      code: `import sys
input = sys.stdin.readline

# 방향: 우(0) 상(1) 좌(2) 하(3)
dx = [1, 0, -1,  0]
dy = [0, -1,  0,  1]

grid = [[False] * 101 for _ in range(101)]

def draw(x, y, d, g):
    dirs = [d]
    for _ in range(g):
        dirs += [(dirs[-1-i] + 1) % 4 for i in range(len(dirs))]

    grid[y][x] = True
    for direction in dirs:
        x += dx[direction]
        y += dy[direction]
        grid[y][x] = True

n = int(input())
for _ in range(n):
    x, y, d, g = map(int, input().split())
    draw(x, y, d, g)

count = 0
for r in range(100):
    for c in range(100):
        if grid[r][c] and grid[r+1][c] and grid[r][c+1] and grid[r+1][c+1]:
            count += 1

print(count)`,
    },
  ],
}

export default function Implementation() {
  return <TopicLayout data={data} />
}
