import TopicLayout from './TopicLayout'

const data = {
  icon: '💡',
  title: 'DP / 그리디',
  desc: '동적 프로그래밍과 그리디 전략의 핵심 패턴 정리',
  problems: [
    {
      title: '계단 오르기',
      platform: 'BOJ 2579',
      link: 'https://www.acmicpc.net/problem/2579',
      difficulty: 'easy',
      explanation:
        '계단을 오를 때 연속으로 3칸을 밟을 수 없다는 제약 조건 하에 최대 점수를 구하는 문제.',
      approach:
        'dp[i] = i번째 계단까지 밟을 수 있는 최대 점수. 상태: ① i-2번 밟고 i번 밟기, ② i-3번 밟고 i-1, i번 연속 밟기.',
      code: `import sys
input = sys.stdin.readline

n = int(input())
stairs = [0] + [int(input()) for _ in range(n)]
dp = [0] * (n + 1)

if n >= 1: dp[1] = stairs[1]
if n >= 2: dp[2] = stairs[1] + stairs[2]

for i in range(3, n + 1):
    # case 1: i-2 → i (i-1 건너뜀)
    # case 2: i-3 → i-1 → i (연속 2칸)
    dp[i] = max(
        dp[i - 2] + stairs[i],
        dp[i - 3] + stairs[i - 1] + stairs[i]
    )

print(dp[n])`,
    },
    {
      title: '최장 공통 부분수열 (LCS)',
      platform: 'BOJ 9251',
      link: 'https://www.acmicpc.net/problem/9251',
      difficulty: 'medium',
      explanation:
        '두 문자열의 Longest Common Subsequence 길이를 구하는 DP 고전 문제.',
      approach:
        'dp[i][j] = A[0..i-1], B[0..j-1]의 LCS 길이. A[i-1]==B[j-1]이면 dp[i-1][j-1]+1, 아니면 max(dp[i-1][j], dp[i][j-1]).',
      code: `a = input()
b = input()
n, m = len(a), len(b)
dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

print(dp[n][m])

# ── 실제 LCS 문자열 복원 ──────────────────────────
def reconstruct_lcs(a, b, dp):
    i, j = len(a), len(b)
    result = []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            result.append(a[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))`,
    },
    {
      title: '0/1 배낭 문제 (Knapsack)',
      platform: '알고리즘 구현',
      link: null,
      difficulty: 'medium',
      explanation:
        '무게 제한 내에서 물건을 선택할 때 가치의 합을 최대화하는 DP 문제. 각 물건은 하나씩만 사용 가능.',
      approach:
        'dp[i][w] = i번째 물건까지 고려했을 때 무게 w 이하에서의 최대 가치. 공간 최적화 시 1D 배열을 역순으로 갱신.',
      code: `def knapsack(weights: list, values: list, capacity: int) -> int:
    n = len(weights)
    # 공간 최적화: 1D DP (역순 갱신)
    dp = [0] * (capacity + 1)

    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]

# 선택한 물건 추적 (2D 배열 필요)
def knapsack_trace(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])

    # 역추적
    selected, w = [], capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= weights[i - 1]

    return dp[n][capacity], selected

weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
print(knapsack(weights, values, 8))  # 10`,
    },
    {
      title: '회의실 배정',
      platform: 'BOJ 1931',
      link: 'https://www.acmicpc.net/problem/1931',
      difficulty: 'medium',
      explanation:
        '겹치지 않는 회의를 최대한 많이 배정하는 그리디 문제. 활동 선택 문제(Activity Selection)의 고전.',
      approach:
        '종료 시간 기준으로 정렬 후 이전 회의가 끝난 뒤에 시작하는 회의를 greedy하게 선택. 종료 시간이 같으면 시작 시간이 빠른 것 우선.',
      code: `import sys
input = sys.stdin.readline

n = int(input())
meetings = [tuple(map(int, input().split())) for _ in range(n)]

# 종료 시간 오름차순, 동일하면 시작 시간 오름차순
meetings.sort(key=lambda x: (x[1], x[0]))

count = 0
last_end = 0

for start, end in meetings:
    if start >= last_end:
        count += 1
        last_end = end

print(count)`,
    },
    {
      title: '동전 0',
      platform: 'BOJ 11047',
      link: 'https://www.acmicpc.net/problem/11047',
      difficulty: 'easy',
      explanation: '금액 K를 만들기 위해 필요한 최소 동전 개수를 구하는 그리디 문제.',
      approach:
        '큰 동전부터 최대한 사용하는 그리디가 성립하는 이유: 동전 단위가 서로 배수 관계이기 때문 (일반적인 경우 DP 필요).',
      code: `import sys
input = sys.stdin.readline

n, k = map(int, input().split())
coins = [int(input()) for _ in range(n)]

count = 0
for coin in reversed(coins):   # 큰 단위부터
    if coin <= k:
        count += k // coin
        k     %= coin
    if k == 0:
        break

print(count)`,
    },
  ],
}

export default function DPGreedy() {
  return <TopicLayout data={data} />
}
