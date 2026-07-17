/**
 * 分析所有项目 - 读取文本文件，准备让AI分析
 * 由于AI助手可以直接读取文件，这个脚本主要是组织数据
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEXTS_DIR = path.join(__dirname, 'data', 'project_texts');
const INDEX_FILE = path.join(TEXTS_DIR, 'projects_index.json');

// 读取索引
const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));

console.log('='.repeat(60));
console.log('项目分析准备');
console.log('='.repeat(60));
console.log(`\n共 ${indexData.length} 个项目待分析\n`);

// 显示前5个项目的预览
console.log('前5个项目预览：\n');
for (let i = 0; i < Math.min(5, indexData.length); i++) {
  const item = indexData[i];
  console.log(`${item.序号}. ${item.PDF文件}`);
  console.log(`   文本长度: ${item.文本长度} 字符`);
  console.log(`   预览: ${item.文本预览.substring(0, 100)}...`);
  console.log();
}

console.log('='.repeat(60));
console.log('准备完成！');
console.log('='.repeat(60));
console.log('\n现在AI助手将逐个分析这些项目...');
console.log('所有项目文本文件在: data/project_texts/');
console.log('索引文件: data/project_texts/projects_index.json');

