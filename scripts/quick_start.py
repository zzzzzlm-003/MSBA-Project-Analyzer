"""
快速启动脚本 - 简化使用流程
"""

import json
from pathlib import Path
from project_analyzer import ProjectAnalyzer, load_config

def quick_analyze_from_config():
    """从配置文件快速分析"""
    analyzer = ProjectAnalyzer()
    config = load_config()
    
    # 读取链接
    if "google_drive_links" not in config:
        print("错误: 配置文件中没有google_drive_links")
        print("请编辑 project_analyzer_config.json 添加链接")
        return
    
    links = [link for link in config["google_drive_links"] 
            if link and not link.startswith("在此处") and not link.startswith("例如")]
    
    if not links:
        print("错误: 配置文件中没有有效的链接")
        return
    
    print(f"找到 {len(links)} 个链接，开始处理...")
    
    # 下载PDF
    pdf_files = analyzer.download_pdfs_from_links(links)
    
    if not pdf_files:
        print("未成功下载任何PDF文件")
        return
    
    # 分析项目
    projects = analyzer.analyze_projects(pdf_files)
    
    if projects:
        # 导出结果
        analyzer.export_results(projects, "excel")
        analyzer.export_results(projects, "json")
        print(f"\n✓ 完成！共分析 {len(projects)} 个项目")
        print(f"✓ 结果保存在 data/output/ 目录")
    else:
        print("未找到可分析的项目")


if __name__ == "__main__":
    quick_analyze_from_config()

