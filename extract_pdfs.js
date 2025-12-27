/**
 * 提取PDF文本内容 - Node.js版本
 * 使用项目中已有的pdf-parse库
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const SOURCE_DIR = 'E:\\备份资料\\IEOR 4524 Spring 2026-20251227T052940Z-3-001\\IEOR 4524 Spring 2026';
const TEXTS_DIR = path.join(__dirname, 'data', 'project_texts');
const PROJECTS_DIR = path.join(__dirname, 'data', 'projects');

// 确保目录存在
if (!fs.existsSync(TEXTS_DIR)) {
  fs.mkdirSync(TEXTS_DIR, { recursive: true });
}

async function extractPDFText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    const text = result.text;
    await parser.destroy();
    return text;
  } catch (error) {
    console.error(`✗ PDF解析错误: ${path.basename(pdfPath)} - ${error.message}`);
    return '';
  }
}

async function processAllPDFs() {
  console.log('='.repeat(60));
  console.log('提取PDF文本内容');
  console.log('='.repeat(60));
  
  // 获取PDF文件列表
  let pdfFiles = [];
  
  // 先检查项目目录
  if (fs.existsSync(PROJECTS_DIR)) {
    const files = fs.readdirSync(PROJECTS_DIR);
    pdfFiles = files
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => path.join(PROJECTS_DIR, f))
      .sort();
  }
  
  // 如果项目目录没有，检查源目录
  if (pdfFiles.length === 0 && fs.existsSync(SOURCE_DIR)) {
    const files = fs.readdirSync(SOURCE_DIR);
    pdfFiles = files
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => path.join(SOURCE_DIR, f))
      .sort();
  }
  
  if (pdfFiles.length === 0) {
    console.log('\n未找到PDF文件！');
    console.log('请确保PDF文件在以下位置之一：');
    console.log(`1. ${PROJECTS_DIR}`);
    console.log(`2. ${SOURCE_DIR}`);
    return;
  }
  
  console.log(`\n找到 ${pdfFiles.length} 个PDF文件\n`);
  
  const allTexts = [];
  const indexData = [];
  
  // 处理每个PDF
  for (let i = 0; i < pdfFiles.length; i++) {
    const pdfPath = pdfFiles[i];
    const pdfName = path.basename(pdfPath);
    
    console.log(`[${i + 1}/${pdfFiles.length}] 处理: ${pdfName}`);
    
    const text = await extractPDFText(pdfPath);
    
    if (!text) {
      console.log('  ✗ 无法提取文本');
      continue;
    }
    
    // 保存单个文本文件
    const textFileName = path.basename(pdfPath, '.pdf') + '.txt';
    const textFilePath = path.join(TEXTS_DIR, textFileName);
    fs.writeFileSync(textFilePath, text, 'utf-8');
    
    allTexts.push({
      序号: i + 1,
      PDF文件: pdfName,
      文本文件: textFileName,
      文本内容: text,
      文本长度: text.length
    });
    
    indexData.push({
      序号: i + 1,
      PDF文件: pdfName,
      文本文件: textFileName,
      文本长度: text.length,
      文本预览: text.substring(0, 300) + (text.length > 300 ? '...' : '')
    });
    
    console.log(`  ✓ 文本已保存 (${text.length} 字符)`);
  }
  
  // 保存合并的文本文件
  const allTextsFile = path.join(TEXTS_DIR, 'all_projects_text.txt');
  let mergedContent = '';
  
  for (const item of allTexts) {
    mergedContent += '\n' + '='.repeat(80) + '\n';
    mergedContent += `项目 ${item.序号}: ${item.PDF文件}\n`;
    mergedContent += '='.repeat(80) + '\n\n';
    mergedContent += item.文本内容;
    mergedContent += '\n\n';
  }
  
  fs.writeFileSync(allTextsFile, mergedContent, 'utf-8');
  
  // 保存索引JSON
  const indexFile = path.join(TEXTS_DIR, 'projects_index.json');
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), 'utf-8');
  
  console.log(`\n✓ 完成！`);
  console.log(`✓ 共提取 ${allTexts.length} 个项目的文本`);
  console.log(`✓ 合并文本文件: ${allTextsFile}`);
  console.log(`✓ 索引文件: ${indexFile}`);
  console.log(`\n现在可以让我（AI助手）开始分析这些项目了！`);
}

// 运行
processAllPDFs().catch(console.error);

