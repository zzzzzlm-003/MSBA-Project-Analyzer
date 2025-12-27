/**
 * 从JSON分析结果生成Excel文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESULTS_FILE = path.join(__dirname, 'data', 'output', 'analysis_results.json');
const OUTPUT_DIR = path.join(__dirname, 'data', 'output');

// 读取分析结果
const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));

console.log(`读取到 ${results.length} 个项目的分析结果`);

// 创建工作簿
const wb = XLSX.utils.book_new();

// 创建工作表数据
const wsData = [
  ['项目编号', '项目名称', '公司名称', '所处行业', '应用场景', '公司用心程度', '预期成果', '技能要求', '项目描述摘要', '源文件']
];

// 添加数据行
results.forEach(project => {
  wsData.push([
    project['项目编号'] || '',
    project['项目名称'] || '',
    project['公司名称'] || '',
    project['所处行业'] || '',
    project['应用场景'] || '',
    project['公司用心程度'] || '',
    project['预期成果'] || '',
    project['技能要求'] || '',
    project['项目描述摘要'] || '',
    project['源文件'] || ''
  ]);
});

// 创建工作表
const ws = XLSX.utils.aoa_to_sheet(wsData);

// 设置列宽
const colWidths = [
  { wch: 10 },  // 项目编号
  { wch: 30 },  // 项目名称
  { wch: 25 },  // 公司名称
  { wch: 15 },  // 所处行业
  { wch: 50 },  // 应用场景
  { wch: 30 },  // 公司用心程度
  { wch: 50 },  // 预期成果
  { wch: 40 },  // 技能要求
  { wch: 50 },  // 项目描述摘要
  { wch: 20 }   // 源文件
];
ws['!cols'] = colWidths;

// 添加工作表到工作簿
XLSX.utils.book_append_sheet(wb, ws, '项目分析');

// 生成文件名
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputFile = path.join(OUTPUT_DIR, `项目分析_${timestamp}.xlsx`);

// 写入文件
XLSX.writeFile(wb, outputFile);

console.log(`✓ Excel文件已生成: ${outputFile}`);
console.log(`✓ 共包含 ${results.length} 个项目`);

