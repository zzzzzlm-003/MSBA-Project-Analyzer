# MSBA 项目分析工具

一个帮助MSBA学生分析和评估课程项目的工具。通过上传简历或填写个人背景信息，系统会自动生成适合你的项目分析和bidding建议。

## 功能特点

- 📄 **PDF文本提取**: 自动从PDF项目文档中提取文本
- ⚙️ **个性化配置**: 根据你的背景和偏好生成定制化分析
- ⭐ **适配度评分**: 基于你的背景给出1-5星适配度
- 💰 **Bidding建议**: 为每个项目推荐合适的bidding分数
- 📊 **Excel导出**: 导出分析结果到Excel，方便筛选和比较

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置个人信息

复制示例配置文件并填写你的信息：

```bash
# Windows
copy user_profile.example.json user_profile.json

# Mac/Linux
cp user_profile.example.json user_profile.json
```

然后编辑 `user_profile.json`，填写：
- 你的教育背景（本科、研究生专业）
- 工作经历
- 技术技能水平
- 感兴趣的行业
- Bidding策略（总分数、最少项目数等）

### 3. 准备项目PDF

将项目PDF文件放到 `data/projects/` 目录（如果目录不存在，需要创建）

### 4. 提取PDF文本

```bash
node extract_pdfs.js
```

这会从所有PDF中提取文本，保存到 `data/project_texts/` 目录。

### 5. 生成个性化分析

```bash
node analyze_with_profile.js
```

系统会根据你的 `user_profile.json` 配置，分析所有项目并生成：
- JSON格式的分析结果
- Excel格式的分析报告

## 文件说明

### 核心文件

- `extract_pdfs.js` - PDF文本提取工具
- `analyze_with_profile.js` - 基于用户配置的分析工具
- `generate_excel_from_json.js` - Excel生成工具
- `user_profile.json` - **你的个人配置文件**（需要自己创建）

### 配置文件

- `user_profile.example.json` - 配置文件模板
- `project_analyzer_config.example.json` - 项目分析器配置模板

### 输出文件

- `data/output/analysis_results_*.json` - JSON格式分析结果
- `data/output/项目分析_*.xlsx` - Excel格式分析报告

## 自定义分析标准

编辑 `user_profile.json` 可以自定义：

1. **教育背景**: 你的专业和学历
2. **工作经历**: 相关工作经验
3. **技术技能**: 编程语言、ML水平等
4. **行业偏好**: 感兴趣的行业和要避免的行业
5. **Bidding策略**: 总分数、最少项目数、每个项目最高分等

## 隐私保护

以下文件**不会**被上传到GitHub（已在.gitignore中排除）：

- ✅ 所有PDF文件
- ✅ Excel分析结果
- ✅ 提取的项目文本
- ✅ 你的个人配置文件 `user_profile.json`
- ✅ 分析结果JSON文件

## 常见问题

### Q: 如何让分析更准确？

A: 在 `user_profile.json` 中尽可能详细地填写你的背景信息，特别是：
- 工作经历的具体内容
- 技术技能的真实水平
- 对各个行业的兴趣程度

### Q: 可以分析其他类型的项目吗？

A: 可以！只要PDF格式相同，可以分析任何项目文档。只需要：
1. 将PDF放到 `data/projects/` 目录
2. 运行 `extract_pdfs.js`
3. 运行 `analyze_with_profile.js`

### Q: 如何分享给同学？

A: 每个同学需要：
1. 克隆或下载这个仓库
2. 创建自己的 `user_profile.json` 文件
3. 运行分析工具

**注意**: 不要分享你的 `user_profile.json` 和分析结果，这些是个人隐私。

## 贡献

欢迎提交Issue和Pull Request来改进这个工具！

## 许可证

MIT License

