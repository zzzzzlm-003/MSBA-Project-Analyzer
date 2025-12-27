/**
 * 数据重组问题
 * 通过执行 maxOperations 次操作，最小化数组中的最小元素
 * 每次操作：选择两个元素 i, j (i < j)，计算 |data[i] - data[j]|，添加到数组末尾
 */

// 计算最大公约数 (GCD)
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// 计算数组所有元素的最大公约数
function gcdArray(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
    if (result === 1) break; // 如果 GCD 已经是 1，可以提前退出
  }
  return result;
}

/**
 * 核心思路：
 * 1. 通过重复计算差值，我们可以得到所有元素的 GCD
 * 2. 如果 GCD 是 1，那么我们可以通过操作得到 1
 * 3. 如果 GCD > 1，那么最小可能值就是 GCD
 * 4. 但我们需要检查是否能在 maxOperations 次操作内得到目标值
 */
function getMinimumValue(data, maxOperations) {
  const n = data.length;
  
  // 计算所有元素的 GCD
  const g = gcdArray(data);
  
  // 如果 GCD 是 1，理论上我们可以得到 1
  // 但需要检查是否能在 maxOperations 次操作内实现
  if (g === 1) {
    // 检查是否能在有限次操作内得到 1
    // 这是一个复杂的优化问题
    // 简化：如果 maxOperations 足够大，我们可以得到 1
    
    // 使用 BFS 或动态规划来找到最少需要多少次操作才能得到 1
    // 这里使用一个简化的方法：检查是否可能得到 1
    
    // 如果数组中已经有 1，直接返回 1
    if (data.includes(1)) {
      return 1;
    }
    
    // 尝试通过操作得到 1
    // 这是一个 NP 难问题，我们需要一个启发式方法
    return findMinPossibleValue(data, maxOperations, 1);
  } else {
    // 如果 GCD > 1，最小可能值至少是 GCD
    // 但我们需要检查是否能在 maxOperations 次操作内得到 GCD
    return findMinPossibleValue(data, maxOperations, g);
  }
}

// 使用 BFS 找到在 maxOperations 次操作内能得到的最小值
function findMinPossibleValue(data, maxOperations, targetGCD) {
  // 如果目标 GCD 已经在数组中，直接返回
  if (data.includes(targetGCD)) {
    return targetGCD;
  }
  
  // 使用集合来存储所有可能得到的值
  let currentSet = new Set(data);
  let minValue = Math.min(...data);
  
  // 如果 minValue 已经是 targetGCD，直接返回
  if (minValue === targetGCD) {
    return targetGCD;
  }
  
  // 执行最多 maxOperations 次操作
  for (let op = 0; op < maxOperations; op++) {
    const newValues = new Set();
    
    // 尝试所有可能的差值
    const values = Array.from(currentSet);
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        const diff = Math.abs(values[i] - values[j]);
        if (diff > 0) {
          newValues.add(diff);
          if (diff < minValue) {
            minValue = diff;
          }
          // 如果找到了目标值，可以提前返回
          if (minValue === targetGCD) {
            return targetGCD;
          }
        }
      }
    }
    
    // 合并新的值到当前集合
    for (const val of newValues) {
      currentSet.add(val);
    }
    
    // 如果最小值不再变化，说明无法进一步优化
    if (newValues.size === 0) {
      break;
    }
  }
  
  return minValue;
}

// 更优化的方法：使用 GCD 理论
function getMinimumValueOptimized(data, maxOperations) {
  const n = data.length;
  
  // 计算所有元素的 GCD
  const g = gcdArray(data);
  
  // 如果 GCD 是 1，理论上我们可以得到 1
  // 关键问题：是否能在 maxOperations 次操作内得到 1？
  
  // 使用更智能的方法
  if (g === 1) {
    // 检查是否能在 maxOperations 次操作内得到 1
    return canReachOne(data, maxOperations) ? 1 : findMinWithOperations(data, maxOperations);
  } else {
    // 如果 GCD > 1，最小可能值是 GCD
    // 但需要检查是否能在 maxOperations 次操作内得到 GCD
    return canReachValue(data, maxOperations, g) ? g : findMinWithOperations(data, maxOperations);
  }
}

// 检查是否能在 maxOperations 次操作内得到值 target
function canReachValue(data, maxOperations, target) {
  if (data.includes(target)) {
    return true;
  }
  
  let currentSet = new Set(data);
  
  for (let op = 0; op < maxOperations; op++) {
    const newValues = new Set();
    const values = Array.from(currentSet);
    
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        const diff = Math.abs(values[i] - values[j]);
        if (diff === target) {
          return true;
        }
        if (diff > 0) {
          newValues.add(diff);
        }
      }
    }
    
    if (newValues.size === 0) {
      break;
    }
    
    for (const val of newValues) {
      currentSet.add(val);
    }
  }
  
  return false;
}

// 检查是否能在 maxOperations 次操作内得到 1
function canReachOne(data, maxOperations) {
  return canReachValue(data, maxOperations, 1);
}

// 在 maxOperations 次操作内找到可能的最小值
function findMinWithOperations(data, maxOperations) {
  let currentSet = new Set(data);
  let minValue = Math.min(...data);
  
  // 如果已经是最小值 1，直接返回
  if (minValue === 1) {
    return 1;
  }
  
  for (let op = 0; op < maxOperations; op++) {
    const newValues = new Set();
    const values = Array.from(currentSet).sort((a, b) => a - b);
    
    // 尝试所有可能的差值
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        const diff = Math.abs(values[i] - values[j]);
        if (diff > 0) {
          newValues.add(diff);
          if (diff < minValue) {
            minValue = diff;
          }
          // 如果找到了 1，可以提前返回
          if (minValue === 1) {
            return 1;
          }
        }
      }
    }
    
    // 如果没有新值产生，无法继续优化
    if (newValues.size === 0) {
      break;
    }
    
    // 合并新值到当前集合
    for (const val of newValues) {
      currentSet.add(val);
    }
  }
  
  return minValue;
}

// 测试用例
console.log('=== 测试用例 0 (Sample Case 0) ===');
const data0 = [4, 2, 5, 9, 3];
const maxOps0 = 1;
const result0 = getMinimumValueOptimized(data0, maxOps0);
console.log('输入:');
console.log('  n =', data0.length);
console.log('  data =', data0);
console.log('  maxOperations =', maxOps0);
console.log('输出:', result0);
console.log('期望: 1');
console.log('结果:', result0 === 1 ? '✓ 通过' : '✗ 失败');
console.log('');

console.log('=== 测试用例 1 (Sample Case 1) ===');
const data1 = [5, 18, 3, 12, 11];
const maxOps1 = 2;
const result1 = getMinimumValueOptimized(data1, maxOps1);
console.log('输入:');
console.log('  n =', data1.length);
console.log('  data =', data1);
console.log('  maxOperations =', maxOps1);
console.log('输出:', result1);
console.log('期望: 1');
console.log('结果:', result1 === 1 ? '✓ 通过' : '✗ 失败');
console.log('');

// 用户提到的测试用例（输入格式：5 4 2 5 9 3 1）
console.log('=== 用户测试用例 ===');
console.log('输入格式: 5 4 2 5 9 3 1');
const dataUser = [5, 4, 2, 5, 9, 3, 1];
const maxOpsUser = 1;
const resultUser = getMinimumValueOptimized(dataUser, maxOpsUser);
console.log('解析:');
console.log('  n =', dataUser.length);
console.log('  data =', dataUser);
console.log('  maxOperations =', maxOpsUser);
console.log('输出:', resultUser);
console.log('期望: 1');
console.log('结果:', resultUser === 1 ? '✓ 通过' : '✗ 失败');
console.log('');

// 验证操作过程（用于调试）
console.log('=== 验证操作过程 ===');
console.log('测试用例 0 的详细过程:');
let testData0 = [...data0];
console.log('初始数组:', testData0);
for (let i = 0; i < testData0.length; i++) {
  for (let j = i + 1; j < testData0.length; j++) {
    const diff = Math.abs(testData0[i] - testData0[j]);
    if (diff === 1) {
      console.log(`操作: 选择 data[${i}]=${testData0[i]} 和 data[${j}]=${testData0[j]}, 差值 = ${diff}`);
      console.log('结果数组:', [...testData0, diff]);
      console.log('最小值:', Math.min(...testData0, diff));
      break;
    }
  }
}
