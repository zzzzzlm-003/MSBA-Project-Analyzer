"""
处理本地PDF文件 - 从指定目录复制PDF并分析
"""

import shutil
from pathlib import Path
from project_analyzer_local import PDFExtractor, ExcelExporter, OUTPUT_DIR, TEXTS_DIR
import json
import pandas as pd

# 源目录和目标目录
SOURCE_DIR = Path(r"E:\备份资料\IEOR 4524 Spring 2026-20251227T052940Z-3-001\IEOR 4524 Spring 2026")
TARGET_DIR = Path("data/projects")
TARGET_DIR.mkdir(parents=True, exist_ok=True)


def copy_pdfs_to_project_dir():
    """将PDF文件复制到项目目录"""
    if not SOURCE_DIR.exists():
        print(f"错误: 源目录不存在: {SOURCE_DIR}")
        return []
    
    pdf_files = list(SOURCE_DIR.glob("*.pdf"))
    
    if not pdf_files:
        print(f"错误: 在 {SOURCE_DIR} 中未找到PDF文件")
        return []
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    print("开始复制文件...\n")
    
    copied_files = []
    for i, pdf_file in enumerate(pdf_files, 1):
        target_path = TARGET_DIR / pdf_file.name
        try:
            shutil.copy2(pdf_file, target_path)
            copied_files.append(target_path)
            print(f"[{i}/{len(pdf_files)}] ✓ {pdf_file.name}")
        except Exception as e:
            print(f"[{i}/{len(pdf_files)}] ✗ {pdf_file.name} - {str(e)}")
    
    print(f"\n✓ 成功复制 {len(copied_files)} 个PDF文件到 {TARGET_DIR}")
    return copied_files


def extract_and_prepare_for_ai():
    """提取PDF文本，准备让AI分析"""
    print("\n" + "="*60)
    print("提取PDF文本内容")
    print("="*60)
    
    # 提取所有PDF文本
    extracted = PDFExtractor.extract_all_pdfs_to_texts()
    
    if not extracted:
        print("未提取到任何文本")
        return
    
    # 创建合并的文本文件，方便AI读取
    all_texts_file = TEXTS_DIR / "all_projects_text.txt"
    index_data = []
    
    with open(all_texts_file, 'w', encoding='utf-8') as f:
        for i, file_info in enumerate(extracted, 1):
            text_file = TEXTS_DIR / file_info['text_file']
            if text_file.exists():
                with open(text_file, 'r', encoding='utf-8') as tf:
                    text_content = tf.read()
                
                # 写入合并文件
                f.write(f"\n{'='*80}\n")
                f.write(f"项目 {i}: {file_info['pdf_file']}\n")
                f.write(f"{'='*80}\n\n")
                f.write(text_content)
                f.write("\n\n")
                
                index_data.append({
                    "序号": i,
                    "PDF文件": file_info['pdf_file'],
                    "文本文件": file_info['text_file'],
                    "文本长度": file_info['text_length'],
                    "文本预览": text_content[:200] + "..." if len(text_content) > 200 else text_content
                })
    
    # 保存索引
    index_file = TEXTS_DIR / "projects_index.json"
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ 所有文本已合并保存到: {all_texts_file}")
    print(f"✓ 项目索引已保存到: {index_file}")
    print(f"\n共 {len(index_data)} 个项目准备分析")
    
    return all_texts_file, index_data


def main():
    """主函数"""
    print("=" * 60)
    print("处理本地PDF文件")
    print("=" * 60)
    
    # 步骤1: 复制PDF文件
    copied_files = copy_pdfs_to_project_dir()
    
    if not copied_files:
        return
    
    # 步骤2: 提取文本
    result = extract_and_prepare_for_ai()
    
    if result:
        all_texts_file, index_data = result
        print("\n" + "="*60)
        print("准备完成！")
        print("="*60)
        print("\n下一步：")
        print("1. 文本文件已准备好，可以开始AI分析")
        print("2. 所有项目文本在: data/project_texts/all_projects_text.txt")
        print("3. 项目索引在: data/project_texts/projects_index.json")
        print("\n现在可以让我（AI助手）开始分析这些项目了！")


if __name__ == "__main__":
    main()

