"""
测试 Efficient Tasks 解决方案
"""
from efficient_tasks import getMaxDifficulty, find_min_difficulty

def test_case_0():
    """测试 Sample Case 0"""
    print("=== 测试 Sample Case 0 ===")
    difficulty = [1, 2, 5, 3, 5]
    result = getMaxDifficulty(difficulty)
    expected = 6
    print(f"输入: {difficulty}")
    print(f"输出: {result}")
    print(f"期望: {expected}")
    print(f"结果: {'✓ 通过' if result == expected else '✗ 失败'}")
    
    # 验证题目给出的分组
    print("\n验证题目给出的分组: [1] | [5, 5] | [2, 3]")
    group1 = [1]
    group2 = [5, 5]
    group3 = [2, 3]
    min_d = find_min_difficulty(group1, group2, group3)
    print(f"最小难度: {min_d}")
    print(f"详细计算:")
    for d1 in group1:
        for d2 in group2:
            for d3 in group3:
                diff = abs(d1 - d2) + abs(d2 - d3)
                print(f"  d₁={d1}, d₂={d2}, d₃={d3}: |{d1}-{d2}|+|{d2}-{d3}| = {abs(d1-d2)}+{abs(d2-d3)} = {diff}")
    print()
    return result == expected

def test_case_1():
    """测试 Sample Case 1"""
    print("=== 测试 Sample Case 1 ===")
    difficulty = [5, 6, 4, 1, 5, 5]
    result = getMaxDifficulty(difficulty)
    expected = 8
    print(f"输入: {difficulty}")
    print(f"输出: {result}")
    print(f"期望: {expected}")
    print(f"结果: {'✓ 通过' if result == expected else '✗ 失败'}")
    print()
    return result == expected

if __name__ == "__main__":
    success1 = test_case_0()
    success2 = test_case_1()
    
    if success1 and success2:
        print("✓ 所有测试通过！")
    else:
        print("✗ 部分测试失败")
