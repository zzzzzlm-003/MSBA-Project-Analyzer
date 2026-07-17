/**
 * 批量分析所有项目
 * 读取文本文件，生成分析结果，导出Excel
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEXTS_DIR = path.join(__dirname, 'data', 'project_texts');
const INDEX_FILE = path.join(TEXTS_DIR, 'projects_index.json');
const OUTPUT_DIR = path.join(__dirname, 'data', 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 读取索引
const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));

console.log('='.repeat(60));
console.log('项目分析系统');
console.log('='.repeat(60));
console.log(`\n共 ${indexData.length} 个项目待分析\n`);

// 生成分析请求文件
const analysisRequest = {
  totalProjects: indexData.length,
  projects: indexData.map(item => ({
    序号: item.序号,
    PDF文件: item.PDF文件,
    文本文件: item.文本文件,
    文本长度: item.文本长度,
    文本预览: item.文本预览
  })),
  instructions: `
请分析以下 ${indexData.length} 个项目，为每个项目提取以下关键信息：

1. 项目编号/ID（从文件名提取，如P001, P002等）
2. 项目名称（Project title）
3. 公司名称（Company name）
4. 所处行业（如：金融、医疗、教育、科技、房地产、物流等）
5. 应用场景（项目的具体应用场景和用途，详细描述）
6. 公司用心程度（1-10分，根据文档的详细程度、完整性、专业性评分，并说明理由）
7. 预期成果（Deliverables，项目预期交付的成果或产出）
8. 技能要求（Required skills）
9. 项目描述摘要（100字以内的简要描述）

分析要求：
- 仔细阅读每个项目的完整文本内容
- 根据文档质量评估公司用心程度（详细、完整、专业的文档得分更高）
- 准确识别行业和应用场景
- 提取所有关键信息

所有项目文本文件位于：data/project_texts/
索引文件：data/project_texts/projects_index.json
合并文本文件：data/project_texts/all_projects_text.txt
`
};

// 保存分析请求
const requestFile = path.join(OUTPUT_DIR, 'analysis_request.json');
fs.writeFileSync(requestFile, JSON.stringify(analysisRequest, null, 2), 'utf-8');

console.log('✓ 分析请求已生成');
console.log(`✓ 请求文件: ${requestFile}`);
console.log('\n' + '='.repeat(60));
console.log('下一步：');
console.log('='.repeat(60));
console.log('\n1. 所有项目文本已提取完成');
console.log('2. 请让AI助手读取以下文件进行分析：');
console.log(`   - ${path.join(TEXTS_DIR, 'all_projects_text.txt')}`);
console.log(`   - ${INDEX_FILE}`);
console.log('\n3. AI助手将逐个分析每个项目并提取关键信息');
console.log('4. 分析完成后，将结果导出为Excel文件');
console.log('\n提示：由于有74个项目，建议分批分析（每次10-20个）');

