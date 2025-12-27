"""
Notion集成 - 将项目分析结果导入Notion数据库
"""

import os
import json
from pathlib import Path
from typing import List, Dict
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

# Notion配置
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")


class NotionExporter:
    """将项目数据导出到Notion"""
    
    def __init__(self, api_key: str = None, database_id: str = None):
        self.api_key = api_key or NOTION_API_KEY
        self.database_id = database_id or NOTION_DATABASE_ID
        
        if not self.api_key:
            raise ValueError("需要设置NOTION_API_KEY")
        if not self.database_id:
            raise ValueError("需要设置NOTION_DATABASE_ID")
        
        self.client = Client(auth=self.api_key)
    
    def create_database_page(self, project: Dict) -> Dict:
        """在Notion数据库中创建项目页面"""
        
        # 映射字段到Notion属性
        properties = {
            "项目名称": {
                "title": [
                    {
                        "text": {
                            "content": project.get("项目名称", "未命名项目")
                        }
                    }
                ]
            },
            "所处行业": {
                "select": {
                    "name": project.get("所处行业", "未知")
                }
            },
            "公司名称": {
                "rich_text": [
                    {
                        "text": {
                            "content": project.get("公司名称", "")
                        }
                    }
                ]
            },
            "公司用心程度": {
                "rich_text": [
                    {
                        "text": {
                            "content": str(project.get("公司用心程度", "0"))
                        }
                    }
                ]
            }
        }
        
        # 添加应用场景（作为文本块）
        children = []
        if project.get("应用场景"):
            children.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "应用场景"
                            }
                        }
                    ]
                }
            })
            children.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": project.get("应用场景", "")
                            }
                        }
                    ]
                }
            })
        
        # 添加预期成果
        if project.get("预期成果"):
            children.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "预期成果"
                            }
                        }
                    ]
                }
            })
            children.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": project.get("预期成果", "")
                            }
                        }
                    ]
                }
            })
        
        try:
            response = self.client.pages.create(
                parent={
                    "database_id": self.database_id
                },
                properties=properties,
                children=children if children else None
            )
            return response
        except Exception as e:
            print(f"✗ Notion创建失败: {project.get('项目名称', '未知')} - {str(e)}")
            return None
    
    def export_projects(self, projects: List[Dict]) -> int:
        """批量导出项目到Notion"""
        success_count = 0
        
        for i, project in enumerate(projects, 1):
            print(f"\n[{i}/{len(projects)}] 导出到Notion: {project.get('项目名称', '未知')}")
            
            result = self.create_database_page(project)
            if result:
                success_count += 1
                print(f"✓ 导出成功")
            else:
                print(f"✗ 导出失败")
        
        print(f"\n✓ 共成功导出 {success_count}/{len(projects)} 个项目到Notion")
        return success_count


def create_notion_database(notion_api_key: str, parent_page_id: str) -> str:
    """创建Notion数据库（需要手动在Notion中创建，然后获取数据库ID）"""
    print("""
    要在Notion中创建数据库：
    
    1. 在Notion中创建一个新页面
    2. 输入 "/database" 创建数据库
    3. 添加以下列：
       - 项目名称 (Title)
       - 所处行业 (Select)
       - 公司名称 (Text)
       - 公司用心程度 (Text)
       - 应用场景 (Text)
       - 预期成果 (Text)
       - 技能要求 (Text)
       - 项目描述摘要 (Text)
       - 源文件 (Text)
    
    4. 获取数据库ID：
       - 点击数据库右上角的 "..." 菜单
       - 选择 "Copy link"
       - 链接格式：https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       - 数据库ID是链接中的最后32位字符（去掉连字符）
    
    5. 将数据库ID添加到 .env 文件：
       NOTION_DATABASE_ID=your_database_id_here
    """)


def main():
    """主函数"""
    # 从JSON文件读取项目数据
    output_dir = Path("data/output")
    json_files = list(output_dir.glob("项目分析_*.json"))
    
    if not json_files:
        print("未找到项目分析JSON文件，请先运行 project_analyzer.py")
        return
    
    # 使用最新的JSON文件
    latest_json = max(json_files, key=lambda p: p.stat().st_mtime)
    print(f"使用文件: {latest_json.name}")
    
    with open(latest_json, 'r', encoding='utf-8') as f:
        projects = json.load(f)
    
    if not projects:
        print("JSON文件中没有项目数据")
        return
    
    # 检查Notion配置
    if not NOTION_API_KEY or not NOTION_DATABASE_ID:
        print("\n需要配置Notion:")
        print("1. 在 https://www.notion.so/my-integrations 创建集成")
        print("2. 获取API密钥，添加到 .env: NOTION_API_KEY=your_key")
        print("3. 在Notion中创建数据库，获取数据库ID")
        print("4. 添加到 .env: NOTION_DATABASE_ID=your_database_id")
        print("\n运行 create_notion_database() 查看详细说明")
        return
    
    # 导出到Notion
    exporter = NotionExporter()
    exporter.export_projects(projects)


if __name__ == "__main__":
    main()

