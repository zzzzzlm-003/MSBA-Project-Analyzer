# 数据重组问题 - Python 解决方案

## 文件说明

- `solution.py` - Python 完整解决方案

## 使用方法

### 1. 运行测试用例

```bash
python solution.py
```

### 2. 从标准输入读取（用于在线提交）

```bash
python solution.py --stdin < input.txt
```

或者直接输入：

```bash
python solution.py --stdin
5
4
2
5
9
3
1
```

### 3. 在代码中调用

```python
from solution import getMinimumValue

data = [4, 2, 5, 9, 3]
max_operations = 1
result = getMinimumValue(data, max_operations)
print(result)  # 输出: 1
```

## 测试用例

### Sample Case 0
- 输入: `n=5, data=[4,2,5,9,3], maxOperations=1`
- 输出: `1` ✓

### Sample Case 1
- 输入: `n=5, data=[5,18,3,12,11], maxOperations=2`
- 输出: `1` ✓

## 算法说明

1. **GCD 理论**: 通过重复计算差值，最终可以得到所有元素的 GCD（最大公约数）
2. **可达性检查**: 检查是否能在 `maxOperations` 次操作内得到目标值（通常是 1 或 GCD）
3. **BFS 搜索**: 使用集合存储所有可能得到的值，逐步扩展直到找到最小值

## 核心函数

- `getMinimumValue(data, maxOperations)`: 主函数，返回最小元素可能的最小值
- `parse_input(input_lines)`: 解析标准输入格式
- `can_reach_value(data, max_operations, target)`: 检查是否能在指定操作次数内得到目标值
- `find_min_with_operations(data, max_operations)`: 在操作限制内找到可能的最小值
