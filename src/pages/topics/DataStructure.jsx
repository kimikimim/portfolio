import TopicLayout from './TopicLayout'

const data = {
  icon: '📊',
  title: '자료구조',
  desc: '스택, 큐, 트리, 그래프, 힙을 활용한 문제 풀이 정리',
  problems: [
    {
      title: '올바른 괄호',
      platform: 'BOJ 9012',
      link: 'https://www.acmicpc.net/problem/9012',
      difficulty: 'easy',
      explanation:
        '괄호 문자열이 주어졌을 때 올바른 괄호 쌍인지 판별하는 문제. 스택의 LIFO 특성을 활용한다.',
      approach:
        "'(' 를 만나면 스택에 push, ')' 를 만나면 pop. 스택이 비어있을 때 pop하면 즉시 False, 모든 순회 후 스택이 비어있으면 True.",
      code: `import sys
input = sys.stdin.readline

def is_valid(s: str) -> bool:
    stack = []
    for ch in s:
        if ch == '(':
            stack.append(ch)
        else:
            if not stack:
                return False
            stack.pop()
    return len(stack) == 0

T = int(input())
for _ in range(T):
    s = input().strip()
    print('YES' if is_valid(s) else 'NO')`,
    },
    {
      title: '요세푸스 문제',
      platform: 'BOJ 1158',
      link: 'https://www.acmicpc.net/problem/1158',
      difficulty: 'easy',
      explanation:
        'N명이 원형으로 앉아 K번째 사람을 순서대로 제거하는 요세푸스 순열을 구하는 문제.',
      approach:
        'deque의 rotate(-k+1)로 앞에서 k-1명을 뒤로 보내고 popleft()로 k번째 원소를 추출하면 O(N·K)에 해결 가능.',
      code: `from collections import deque

n, k = map(int, input().split())
q = deque(range(1, n + 1))
result = []

while q:
    q.rotate(-(k - 1))      # k-1명을 뒤로 이동
    result.append(q.popleft())

print('<' + ', '.join(map(str, result)) + '>')`,
    },
    {
      title: '트리 순회',
      platform: 'BOJ 1991',
      link: 'https://www.acmicpc.net/problem/1991',
      difficulty: 'medium',
      explanation:
        '이진 트리를 전위(preorder), 중위(inorder), 후위(postorder) 순으로 순회하여 출력하는 문제.',
      approach:
        '재귀 DFS로 각 순회를 구현. 전위: 루트→좌→우, 중위: 좌→루트→우, 후위: 좌→우→루트.',
      code: `import sys
input = sys.stdin.readline

def preorder(node):
    if node == '.': return
    print(node, end='')
    preorder(tree[node][0])
    preorder(tree[node][1])

def inorder(node):
    if node == '.': return
    inorder(tree[node][0])
    print(node, end='')
    inorder(tree[node][1])

def postorder(node):
    if node == '.': return
    postorder(tree[node][0])
    postorder(tree[node][1])
    print(node, end='')

n = int(input())
tree = {}
for _ in range(n):
    node, left, right = input().split()
    tree[node] = (left, right)

preorder('A');  print()
inorder('A');   print()
postorder('A'); print()`,
    },
    {
      title: '절댓값 힙',
      platform: 'BOJ 11286',
      link: 'https://www.acmicpc.net/problem/11286',
      difficulty: 'easy',
      explanation:
        '절댓값이 가장 작은 값을 꺼내는 우선순위 큐 구현 문제. 절댓값이 같으면 음수를 먼저 반환.',
      approach:
        'Python의 heapq는 최소 힙이므로 (|x|, x)를 튜플로 push하면 절댓값 기준 정렬 후 원래 값 기준 정렬이 자동으로 적용된다.',
      code: `import heapq
import sys
input = sys.stdin.readline

heap = []
n = int(input())

for _ in range(n):
    x = int(input())
    if x != 0:
        heapq.heappush(heap, (abs(x), x))
    else:
        if heap:
            print(heapq.heappop(heap)[1])
        else:
            print(0)`,
    },
    {
      title: '집합의 표현 (유니온 파인드)',
      platform: 'BOJ 1717',
      link: 'https://www.acmicpc.net/problem/1717',
      difficulty: 'medium',
      explanation:
        '유니온-파인드(서로소 집합) 자료구조를 구현하여 합집합 연산과 같은 집합 여부 판별을 수행.',
      approach:
        '경로 압축(Path Compression)과 랭크 기반 합집합을 사용하면 연산 당 거의 O(1)에 가까운 시간복잡도를 달성할 수 있다.',
      code: `import sys
input = sys.stdin.readline
sys.setrecursionlimit(10 ** 6)

def find(x: int) -> int:
    if parent[x] != x:
        parent[x] = find(parent[x])   # 경로 압축
    return parent[x]

def union(a: int, b: int):
    a, b = find(a), find(b)
    if a != b:
        parent[b] = a

n, m = map(int, input().split())
parent = list(range(n + 1))

for _ in range(m):
    op, a, b = map(int, input().split())
    if op == 0:
        union(a, b)
    else:
        print('YES' if find(a) == find(b) else 'NO')`,
    },
  ],
}

export default function DataStructure() {
  return <TopicLayout data={data} />
}
