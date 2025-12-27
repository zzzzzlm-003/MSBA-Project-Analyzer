"""
使用AI助手分析项目文本
读取提取的PDF文本，逐个分析并提取关键信息
"""

import json
from pathlib import Path
from typing import List, Dict
import pandas as pd
from project_analyzer_local import ExcelExporter, OUTPUT_DIR

TEXTS_DIR = Path("data/project_texts")


def analyze_project_text(text: str, filename: str) -> Dict:
    """
    分析单个项目的文本内容
    这个函数会被AI助手调用来分析每个项目
    """
    # 这个函数实际上会被AI助手直接使用
    # 返回结构化的项目信息
    pass


def load_extracted_texts() -> List[Dict]:
    """加载所有已提取的文本文件"""
    index_file = TEXTS_DIR / "index.json"
    
    if not index_file.exists():
        print("错误: 未找到文本索引文件")
        print("请先运行: python project_analyzer_local.py --extract")
        return []
    
    with open(index_file, 'r', encoding='utf-8') as f:
        files = json.load(f)
    
    # 读取每个文本文件的实际内容
    texts = []
    for file_info in files:
        text_file = TEXTS_DIR / file_info['text_file']
        if text_file.exists():
            with open(text_file, 'r', encoding='utf-8') as f:
                content = f.read()
                texts.append({
                    "filename": file_info['pdf_file'],
                    "text": content,
                    "text_length": len(content)
                })
    
    return texts


def main():
    """主函数 - 展示如何让AI助手分析"""
    print("=" * 60)
    print("项目文本分析准备")
    print("=" * 60)
    
    texts = load_extracted_texts()
    
    if not texts:
        print("\n未找到文本文件")
        return
    
    print(f"\n找到 {len(texts)} 个项目的文本")
    print("\n接下来，AI助手将逐个分析这些文本...")
    print("\n提示：")
    print("1. 将每个文本文件的内容提供给AI助手")
    print("2. 或使用以下格式让AI助手批量分析：")
    print("\n   请分析以下项目文档，提取关键信息：")
    print("   - 所处行业")
    print("   - 应用场景")
    print("   - 公司用心程度（1-10分，说明理由）")
    print("   - 预期成果")
    print("   - 项目名称、公司名称、技能要求等")
    print("\n   文档内容：[粘贴文本]")
    
    # 显示第一个文本作为示例
    if texts:
        print("\n" + "="*60)
        print("示例：第一个项目的文本内容")
        print("="*60)
        print(f"\n文件名: {texts[0]['filename']}")
        print(f"文本长度: {texts[0]['text_length']} 字符")
        print(f"\n文本内容预览（前1000字符）:\n")
        print(texts[0]['text'][:1000])
        print("\n...")
        
        # 保存所有文本到一个文件，方便AI读取
        all_texts_file = TEXTS_DIR / "all_texts_for_ai.txt"
        with open(all_texts_file, 'w', encoding='utf-8') as f:
            for i, text_info in enumerate(texts, 1):
                f.write(f"\n{'='*80}\n")
                f.write(f"项目 {i}: {text_info['filename']}\n")
                f.write(f"{'='*80}\n\n")
                f.write(text_info['text'])
                f.write("\n\n")
        
        print(f"\n✓ 所有文本已合并保存到: {all_texts_file}")
        print("   你可以将这个文件的内容提供给AI助手进行批量分析")


if __name__ == "__main__":
    main()

