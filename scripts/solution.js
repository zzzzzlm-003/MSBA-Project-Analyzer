/**
 * 数据重组问题 - 完整解决方案
 * 按照题目要求的输入格式解析并求解
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
    if (result === 1) break;
  }
  return result;
}

// 检查是否能在 maxOperations 次操作内得到值 target
function canReachValue(data, maxOperations, target) {
  if (data.includes(target)) {
    return true;
  }
  
  let currentSet = new Set(data);
  
  for (let op = 0; op < maxOperations; op++) {
    const newValues = new Set();
    const values = Array.from(currentSet).sort((a, b) => a - b);
    
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

// 在 maxOperations 次操作内找到可能的最小值
function findMinWithOperations(data, maxOperations) {
  let currentSet = new Set(data);
  let minValue = Math.min(...data);
  
  if (minValue === 1) {
    return 1;
  }
  
  for (let op = 0; op < maxOperations; op++) {
    const newValues = new Set();
    const values = Array.from(currentSet).sort((a, b) => a - b);
    
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        const diff = Math.abs(values[i] - values[j]);
        if (diff > 0) {
          newValues.add(diff);
          if (diff < minValue) {
            minValue = diff;
          }
          if (minValue === 1) {
            return 1;
          }
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
  
  return minValue;
}

/**
 * 主函数：getMinimumValue
 * @param {number[]} data - 整数数组
 * @param {number} maxOperations - 最大操作次数
 * @returns {number} 最小元素可能的最小值
 */
function getMinimumValue(data, maxOperations) {
  const g = gcdArray(data);
  
  if (g === 1) {
    return canReachValue(data, maxOperations, 1) ? 1 : findMinWithOperations(data, maxOperations);
  } else {
    return canReachValue(data, maxOperations, g) ? g : findMinWithOperations(data, maxOperations);
  }
}

// 解析标准输入格式
// 格式：第一行是 n，接下来 n 行是数组元素，最后一行是 maxOperations
function parseInput(inputLines) {
  const lines = inputLines.trim().split('\n').map(line => line.trim()).filter(line => line);
  const n = parseInt(lines[0]);
  const data = [];
  for (let i = 1; i <= n; i++) {
    data.push(parseInt(lines[i]));
  }
  const maxOperations = parseInt(lines[n + 1]);
  return { n, data, maxOperations };
}

// 测试用例
console.log('=== Sample Case 0 ===');
const input0 = `5
4
2
5
9
3
1`;
const { data: data0, maxOperations: maxOps0 } = parseInput(input0);
const result0 = getMinimumValue(data0, maxOps0);
console.log('输入:');
console.log('  n =', data0.length);
console.log('  data =', data0);
console.log('  maxOperations =', maxOps0);
console.log('输出:', result0);
console.log('期望: 1');
console.log('结果:', result0 === 1 ? '✓ 通过' : '✗ 失败');
console.log('');

console.log('=== Sample Case 1 ===');
const input1 = `5
5
18
3
12
11
2`;
const { data: data1, maxOperations: maxOps1 } = parseInput(input1);
const result1 = getMinimumValue(data1, maxOps1);
console.log('输入:');
console.log('  n =', data1.length);
console.log('  data =', data1);
console.log('  maxOperations =', maxOps1);
console.log('输出:', result1);
console.log('期望: 1');
console.log('结果:', result1 === 1 ? '✓ 通过' : '✗ 失败');
console.log('');

// 如果从命令行读取输入（用于实际提交）
// 注意：由于使用 ES module，需要直接运行或通过 import 使用
// 可以通过管道输入：echo "5\n4\n2\n5\n9\n3\n1" | node solution.js

export { getMinimumValue, parseInput };
