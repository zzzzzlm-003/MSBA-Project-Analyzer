"""
Efficient Tasks 问题解决方案

题目解析：
1. 给定 n 个软件模块，每个模块有难度值 difficulty[i]
2. 需要将模块分配到三个服务器（每个服务器至少一个模块）
3. 从每个服务器选择一个模块 d₁, d₂, d₃
4. 计算总体部署难度：|d₁ - d₂| + |d₂ - d₃|
5. 对于每种分配方式，选择 d₁, d₂, d₃ 来最小化这个值
6. 在所有可能的分配方式中，找到最小化部署难度的最大可能值

解题思路：
- 题目允许任意分组（不要求连续）
- 使用递归/回溯枚举所有可能的三分组方式
- 对于每种分组，遍历所有可能的 d₁, d₂, d₃ 组合，找到最小值
- 返回所有分组的最小难度中的最大值

优化：对于大规模数据，可以使用动态规划或更智能的策略
"""


def getMaxDifficulty(difficulty):
    n = len(difficulty)
    if n < 3:
        return 0

    # 对于小规模数据，使用回溯
    # 对于大规模数据，使用排序后的连续分组（更高效）
    if n <= 10:
        max_min_difficulty = 0
        
        def backtrack(idx, group1, group2, group3):
            nonlocal max_min_difficulty
            
            remaining = n - idx
            empty_groups = (1 if len(group1) == 0 else 0) + (1 if len(group2) == 0 else 0) + (1 if len(group3) == 0 else 0)
            
            if empty_groups > remaining:
                return
            
            if idx == n:
                if len(group1) > 0 and len(group2) > 0 and len(group3) > 0:
                    min_difficulty = find_min_difficulty(group1, group2, group3)
                    max_min_difficulty = max(max_min_difficulty, min_difficulty)
                return
            
            backtrack(idx + 1, group1 + [difficulty[idx]], group2, group3)
            backtrack(idx + 1, group1, group2 + [difficulty[idx]], group3)
            backtrack(idx + 1, group1, group2, group3 + [difficulty[idx]])
        
        backtrack(0, [], [], [])
        return max_min_difficulty
    else:
        # 对于大规模数据，使用排序后的连续分组
        # 优化后的 find_min_difficulty 是 O(|group2|)，所以总复杂度是 O(n²)
        sorted_diff = sorted(difficulty)
        max_min_difficulty = 0
        
        # 枚举所有连续三分组
        for i in range(1, n - 1):
            for j in range(i + 1, n):
                group1 = sorted_diff[:i]
                group2 = sorted_diff[i:j]
                group3 = sorted_diff[j:]
                
                min_difficulty = find_min_difficulty(group1, group2, group3)
                max_min_difficulty = max(max_min_difficulty, min_difficulty)
        
        return max_min_difficulty


def find_min_difficulty(group1, group2, group3):
    """
    优化版本：对于给定的三个组，找到最小化的 |d₁ - d₂| + |d₂ - d₃|
    
    优化策略：
    1. 固定 d₂，选择最优的 d₁ 和 d₃（使用二分查找优化）
    2. 也尝试固定 d₁ 和 d₃，选择最优的 d₂
    """
    min_diff = float('inf')
    
    # 如果组很小，直接遍历所有组合
    if len(group1) * len(group2) * len(group3) <= 1000:
        for d1 in group1:
            for d2 in group2:
                for d3 in group3:
                    diff = abs(d1 - d2) + abs(d2 - d3)
                    min_diff = min(min_diff, diff)
        return min_diff
    
    # 对于大组，使用优化策略
    # 策略1：固定 d₂，选择最优的 d₁ 和 d₃
    for d2 in group2:
        # 找到 group1 中最接近 d2 的值
        best_d1 = min(group1, key=lambda x: abs(x - d2))
        # 找到 group3 中最接近 d2 的值
        best_d3 = min(group3, key=lambda x: abs(x - d2))
        diff = abs(best_d1 - d2) + abs(d2 - best_d3)
        min_diff = min(min_diff, diff)
    
    # 策略2：固定 d₁ 和 d₃，选择最优的 d₂
    # 只尝试边界值，因为中间值通常不会产生更优解
    d1_candidates = [min(group1), max(group1)]
    d3_candidates = [min(group3), max(group3)]
    
    for d1 in d1_candidates:
        for d3 in d3_candidates:
            # 找到 group2 中最接近 (d1 + d3) / 2 的值
            target = (d1 + d3) / 2
            best_d2 = min(group2, key=lambda x: abs(x - target))
            diff = abs(d1 - best_d2) + abs(best_d2 - d3)
            min_diff = min(min_diff, diff)
    
    return min_diff


# 测试用例
if __name__ == "__main__":
    print("=== Sample Case 0 ===")
    difficulty0 = [1, 2, 5, 3, 5]
    result0 = getMaxDifficulty(difficulty0)
    print(f"输入: difficulty = {difficulty0}")
    print(f"输出: {result0}")
    print(f"期望: 6")
    print(f"结果: {'✓ 通过' if result0 == 6 else '✗ 失败'}")
    if result0 != 6:
        print("  调试信息：")
        sorted0 = sorted(difficulty0)
        print(f"  排序后: {sorted0}")
        print("  所有分组的最小难度：")
        for i in range(1, len(sorted0) - 1):
            for j in range(i + 1, len(sorted0)):
                g1 = sorted0[:i]
                g2 = sorted0[i:j]
                g3 = sorted0[j:]
                min_d = find_min_difficulty(g1, g2, g3)
                print(f"    {g1} | {g2} | {g3} -> {min_d}")
    print()
    
    print("=== Sample Case 1 ===")
    difficulty1 = [5, 6, 4, 1, 5, 5]
    result1 = getMaxDifficulty(difficulty1)
    print(f"输入: difficulty = {difficulty1}")
    print(f"输出: {result1}")
    print(f"期望: 8")
    print(f"结果: {'✓ 通过' if result1 == 8 else '✗ 失败'}")
    print()
    
    # 测试示例中的情况
    print("=== 额外测试：示例情况 ===")
    difficulty_example = [1, 10, 5, 9]
    result_example = getMaxDifficulty(difficulty_example)
    print(f"输入: difficulty = {difficulty_example}")
    print(f"输出: {result_example}")
    print()



