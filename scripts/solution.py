"""
数据重组问题 - Python 简洁解决方案
"""

def getMinimumValue(data, maxOperations):
    """
    主函数：在 maxOperations 次操作后，返回数组最小元素可能的最小值
    每次操作：选择两个元素 i, j (i < j)，计算 |data[i] - data[j]|，添加到数组末尾
    
    关键思路：我们需要找到在恰好 maxOperations 次操作后，数组中可能达到的最小值。
    使用 BFS 方法，每一步都考虑所有可能的操作，并追踪最小值。
    """
    # 使用集合存储所有可能得到的值（包括原始值和新产生的差值）
    current_set = set(data)
    # 追踪每一步后可能达到的最小值
    min_value = min(data)
    
    # 如果已经是0，直接返回
    if min_value == 0:
        return 0
    
    # 执行恰好 maxOperations 次操作
    for op in range(maxOperations):
        new_values = set()
        # 将集合转为排序列表，便于计算差值
        values = sorted(list(current_set))
        
        # 尝试所有可能的差值组合
        for i in range(len(values)):
            for j in range(i + 1, len(values)):
                diff = abs(values[i] - values[j])
                if diff >= 0:  # 包括0
                    new_values.add(diff)
                    # 更新最小值
                    if diff < min_value:
                        min_value = diff
        
        # 如果没有新值产生，无法继续优化
        if len(new_values) == 0:
            break
        
        # 合并新值到当前集合，用于下一轮操作
        current_set.update(new_values)
        
        # 如果找到了0，可以提前返回
        if min_value == 0:
            return 0
    
    # 返回在恰好 maxOperations 次操作后可能达到的最小值
    return min_value


# 测试用例
if __name__ == "__main__":
    # Sample Case 0
    data0 = [4, 2, 5, 9, 3]
    max_ops0 = 1
    result0 = getMinimumValue(data0, max_ops0)
    print(f"Sample 0: {result0} (期望: 1) {'✓' if result0 == 1 else '✗'}")
    
    # Sample Case 1
    data1 = [5, 18, 3, 12, 11]
    max_ops1 = 2
    result1 = getMinimumValue(data1, max_ops1)
    print(f"Sample 1: {result1} (期望: 1) {'✓' if result1 == 1 else '✗'}")
    
    # Test Case 1
    data2 = [42, 47, 50, 54, 62, 79]
    max_ops2 = 2
    result2 = getMinimumValue(data2, max_ops2)
    print(f"Test 1: {result2} (期望: 3) {'✓' if result2 == 3 else '✗'}")
    
    # Test Case 2
    data3 = [4, 2, 5, 9, 3, 57, 68]
    max_ops3 = 5
    result3 = getMinimumValue(data3, max_ops3)
    print(f"Test 2: {result3} (期望: 0) {'✓' if result3 == 0 else '✗'}")
