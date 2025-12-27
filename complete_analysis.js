/**
 * 完整分析所有项目，添加适配星级、bidding建议和公司推测
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEXTS_DIR = path.join(__dirname, 'data', 'project_texts');
const INDEX_FILE = path.join(TEXTS_DIR, 'projects_index.json');
const OUTPUT_FILE = path.join(__dirname, 'data', 'output', 'analysis_results.json');

// 用户背景
const userProfile = {
  education: "本科金融 + MSBA",
  skills: ["Python", "SQL", "R", "Tableau", "Excel", "金融研究经验"],
  interests: "金融方向",
  mlLevel: "基础（学过但不多）",
  dataRequirement: "不能太高"
};

// 读取索引
const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));

console.log('开始分析所有项目...');
console.log(`共 ${indexData.length} 个项目\n`);

// 读取现有分析结果（如果有）
let existingResults = [];
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    existingResults = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`已找到 ${existingResults.length} 个现有分析结果\n`);
  } catch (e) {
    console.log('现有结果文件格式错误，将重新分析\n');
  }
}

// 分析函数 - 这个函数会被AI助手调用来分析每个项目
function analyzeProject(projectText, projectNumber, filename) {
  // 这个函数返回分析结果
  // 实际分析将由AI助手完成
  return {
    projectNumber,
    filename,
    text: projectText.substring(0, 500) // 预览
  };
}

console.log('准备分析数据...');
console.log('提示：由于有74个项目，AI助手将逐个分析每个项目');
console.log('分析内容包括：适配星级、建议bidding分数、推测公司名称\n');

// 保存准备分析的项目列表
const projectsToAnalyze = indexData.map(item => ({
  序号: item.序号,
  PDF文件: item.PDF文件,
  文本文件: item.文本文件,
  文本预览: item.文本预览
}));

const analysisRequest = {
  userProfile,
  totalProjects: projectsToAnalyze.length,
  projects: projectsToAnalyze,
  instructions: `
请分析每个项目，为每个项目添加以下字段：

1. 适配星级（1-5星）：
   - 5星：完美匹配（金融相关 + 技能匹配 + 公司用心）
   - 4星：很好匹配（金融相关或技能很好匹配）
   - 3星：一般匹配（部分匹配）
   - 2星：不太匹配（技能要求过高或行业不相关）
   - 1星：不匹配（完全不相关或要求过高）

2. 建议bidding分数（0-600）：
   - 考虑因素：适配星级、公司用心程度、项目吸引力
   - 5星项目：建议400-600分
   - 4星项目：建议200-400分
   - 3星项目：建议100-200分
   - 2星项目：建议50-100分（如果必须bid 20个）
   - 1星项目：建议20-50分（最低要求）

3. 推测公司名称：
   - 根据项目描述、行业、公司背景等信息推测
   - 如果无法推测，保持"未明确"

用户背景：
- 本科金融，硕士MSBA
- 有equity research经验
- 对金融方向感兴趣
- ML基础，不能处理data要求太高的项目
- 技能：Python, SQL, R, Tableau, Excel
`
};

fs.writeFileSync(
  path.join(__dirname, 'data', 'output', 'analysis_request_complete.json'),
  JSON.stringify(analysisRequest, null, 2),
  'utf-8'
);

console.log('分析请求已保存');
console.log('现在AI助手将开始逐个分析项目...\n');

