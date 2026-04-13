import TopicLayout from './TopicLayout'

const data = {
  icon: '🔗',
  title: '그래프 심화',
  desc: '다익스트라, 위상정렬, MST(크루스칼/프림), 플로이드 워셜 정리',
  problems: [
    {
      title: '최단경로 (다익스트라)',
      platform: 'BOJ 1753',
      link: 'https://www.acmicpc.net/problem/1753',
      difficulty: 'hard',
      explanation:
        '방향 그래프에서 시작점 K로부터 모든 정점까지의 최단 거리를 구하는 문제.',
      approach:
        '우선순위 큐(min-heap)를 사용하는 다익스트라. 방문한 노드는 재처리하지 않는 lazy deletion 방식으로 O((V+E) log V).',
      code: `import heapq
import sys
input = sys.stdin.readline
INF = float('inf')

def dijkstra(start: int, graph: list) -> list:
    dist = [INF] * (V + 1)
    dist[start] = 0
    pq = [(0, start)]   # (거리, 노드)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:      # 이미 더 짧은 경로 존재 → skip
            continue
        for v, w in graph[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return dist

V, E = map(int, input().split())
K = int(input())
graph = [[] for _ in range(V + 1)]

for _ in range(E):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))

dist = dijkstra(K, graph)
for i in range(1, V + 1):
    print(dist[i] if dist[i] != INF else 'INF')`,
    },
    {
      title: '줄 세우기 (위상정렬)',
      platform: 'BOJ 2252',
      link: 'https://www.acmicpc.net/problem/2252',
      difficulty: 'medium',
      explanation:
        '일부 학생의 키 순서 관계가 주어졌을 때 전체를 키 순서대로 나열하는 위상 정렬 문제.',
      approach:
        'Kahn 알고리즘: 진입 차수(in-degree)가 0인 노드를 큐에 넣고, 처리 후 연결된 노드의 진입 차수를 감소시킨다.',
      code: `from collections import deque
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
graph    = [[] for _ in range(n + 1)]
indegree = [0]  * (n + 1)

for _ in range(m):
    a, b = map(int, input().split())
    graph[a].append(b)
    indegree[b] += 1

# 진입 차수가 0인 노드로 시작
q = deque(i for i in range(1, n + 1) if indegree[i] == 0)
result = []

while q:
    node = q.popleft()
    result.append(node)
    for nxt in graph[node]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            q.append(nxt)

# 사이클 감지: result 길이 != n
print(*result)`,
    },
    {
      title: '최소 스패닝 트리 (크루스칼)',
      platform: 'BOJ 1197',
      link: 'https://www.acmicpc.net/problem/1197',
      difficulty: 'hard',
      explanation:
        '그래프의 모든 정점을 연결하는 간선 집합 중 가중치 합이 최소인 신장 트리(MST)를 구하는 문제.',
      approach:
        '크루스칼: 간선을 가중치 오름차순으로 정렬 후 사이클이 생기지 않는 간선만 선택. 유니온 파인드로 사이클 감지.',
      code: `import sys
input = sys.stdin.readline

def find(x: int) -> int:
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a: int, b: int) -> bool:
    a, b = find(a), find(b)
    if a == b:
        return False          # 사이클 발생
    if rank[a] < rank[b]:
        a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]:
        rank[a] += 1
    return True

V, E = map(int, input().split())
edges = []
for _ in range(E):
    a, b, c = map(int, input().split())
    edges.append((c, a, b))

edges.sort()
parent = list(range(V + 1))
rank   = [0] * (V + 1)
total  = 0

for cost, a, b in edges:
    if union(a, b):
        total += cost

print(total)`,
    },
    {
      title: '버스 노선 (플로이드 워셜)',
      platform: 'BOJ 11404',
      link: 'https://www.acmicpc.net/problem/11404',
      difficulty: 'medium',
      explanation:
        '모든 도시 쌍 간의 최단 거리를 구하는 문제. 경유 도시를 기준으로 거리를 갱신하는 플로이드 워셜.',
      approach:
        '3중 루프: 경유 노드 k → 출발 i → 도착 j. dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]). 시간복잡도 O(V³).',
      code: `import sys
input = sys.stdin.readline
INF = float('inf')

n = int(input())
m = int(input())

dist = [[INF] * (n + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    dist[i][i] = 0

for _ in range(m):
    a, b, c = map(int, input().split())
    dist[a][b] = min(dist[a][b], c)   # 중복 간선 처리

# 플로이드 워셜
for k in range(1, n + 1):          # 경유 도시
    for i in range(1, n + 1):      # 출발
        for j in range(1, n + 1):  # 도착
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]

for i in range(1, n + 1):
    row = [dist[i][j] if dist[i][j] != INF else 0 for j in range(1, n + 1)]
    print(*row)`,
    },
  ],
}

export default function GraphAdvanced() {
  return <TopicLayout data={data} />
}
