import TopicLayout from './TopicLayout'

const data = {
  icon: '🔍',
  title: '탐색 / 정렬',
  desc: 'BFS, DFS, 이진탐색, 병합정렬, 퀵정렬 핵심 알고리즘 정리',
  problems: [
    {
      title: '미로 탐색 (BFS)',
      platform: 'BOJ 2178',
      link: 'https://www.acmicpc.net/problem/2178',
      difficulty: 'easy',
      explanation:
        'N×M 격자 미로에서 (1,1)에서 (N,M)까지 이동할 때 지나야 하는 최소 칸 수를 구하는 문제.',
      approach:
        'BFS는 가중치가 동일한 그래프에서 최단 거리를 보장한다. 시작점에서 거리를 1씩 늘려가며 레이어 단위로 탐색.',
      code: `from collections import deque

def bfs(maze, n, m):
    dx, dy = [-1, 1, 0, 0], [0, 0, -1, 1]
    dist = [[-1] * m for _ in range(n)]
    dist[0][0] = 1
    q = deque([(0, 0)])

    while q:
        x, y = q.popleft()
        for d in range(4):
            nx, ny = x + dx[d], y + dy[d]
            if 0 <= nx < n and 0 <= ny < m and maze[nx][ny] == 1 and dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1
                q.append((nx, ny))

    return dist[n - 1][m - 1]

n, m = map(int, input().split())
maze = [list(map(int, input().strip())) for _ in range(n)]
print(bfs(maze, n, m))`,
    },
    {
      title: '연결 요소의 개수 (DFS)',
      platform: 'BOJ 11724',
      link: 'https://www.acmicpc.net/problem/11724',
      difficulty: 'easy',
      explanation:
        '방향 없는 그래프가 주어졌을 때 연결 요소(Connected Component)의 개수를 구하는 문제.',
      approach:
        '방문하지 않은 노드마다 DFS/BFS를 한 번씩 수행하면 연결 요소의 수를 카운트할 수 있다. 재귀 깊이 제한에 주의.',
      code: `import sys
from collections import defaultdict
sys.setrecursionlimit(10 ** 6)
input = sys.stdin.readline

def dfs(node: int):
    visited[node] = True
    for nxt in graph[node]:
        if not visited[nxt]:
            dfs(nxt)

n, m = map(int, input().split())
graph = defaultdict(list)

for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

visited = [False] * (n + 1)
count = 0

for i in range(1, n + 1):
    if not visited[i]:
        dfs(i)
        count += 1

print(count)`,
    },
    {
      title: '수 찾기 (이진탐색)',
      platform: 'BOJ 1920',
      link: 'https://www.acmicpc.net/problem/1920',
      difficulty: 'easy',
      explanation: 'N개의 정수 집합에서 M개의 수가 포함되는지 각각 판별하는 문제.',
      approach:
        '집합을 정렬 후 이진탐색으로 O(log N)에 존재 여부를 확인. Python의 bisect 모듈로도 구현 가능.',
      code: `import sys
input = sys.stdin.readline

def binary_search(arr: list, target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return 0

n = int(input())
a = sorted(map(int, input().split()))
m = int(input())

result = [binary_search(a, x) for x in map(int, input().split())]
print('\\n'.join(map(str, result)))`,
    },
    {
      title: '병합 정렬 (Merge Sort)',
      platform: '알고리즘 구현',
      link: null,
      difficulty: 'medium',
      explanation:
        '분할 정복 기반의 정렬 알고리즘. 평균/최악 모두 O(N log N)을 보장하며 안정 정렬이다.',
      approach:
        '배열을 반으로 나눠 각각 정렬 후 병합(merge). 병합 과정이 핵심 — 두 포인터로 작은 값부터 선택.',
      code: `def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# 실전: 역전쌍(inversion count) 응용
def count_inversions(arr: list) -> tuple[list, int]:
    if len(arr) <= 1:
        return arr, 0

    mid = len(arr) // 2
    left,  lc = count_inversions(arr[:mid])
    right, rc = count_inversions(arr[mid:])

    merged, cnt = [], lc + rc
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j])
            cnt += len(left) - i   # 핵심: 남은 left 원소 모두 역전쌍
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged, cnt`,
    },
    {
      title: '퀵 정렬 (Quick Sort)',
      platform: '알고리즘 구현',
      link: null,
      difficulty: 'medium',
      explanation:
        '피벗을 기준으로 분할하는 정렬 알고리즘. 평균 O(N log N), 최악 O(N²)이지만 실전에서 가장 빠른 정렬.',
      approach:
        '파티션 단계에서 피벗보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 이동. 랜덤 피벗 선택으로 최악 케이스를 회피.',
      code: `import random

def quick_sort(arr: list, lo: int, hi: int):
    if lo >= hi:
        return

    pivot_idx = partition(arr, lo, hi)
    quick_sort(arr, lo, pivot_idx - 1)
    quick_sort(arr, pivot_idx + 1, hi)

def partition(arr: list, lo: int, hi: int) -> int:
    # 랜덤 피벗으로 최악 케이스 방지
    rand = random.randint(lo, hi)
    arr[rand], arr[hi] = arr[hi], arr[rand]

    pivot = arr[hi]
    i = lo - 1

    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1

arr = [3, 6, 8, 10, 1, 2, 1]
quick_sort(arr, 0, len(arr) - 1)
print(arr)  # [1, 1, 2, 3, 6, 8, 10]`,
    },
  ],
}

export default function SearchSort() {
  return <TopicLayout data={data} />
}
