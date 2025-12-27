# 上传到GitHub前的检查清单

在将代码上传到GitHub之前，请仔细检查以下项目，确保没有隐私信息被泄露。

## ✅ 必须检查的文件

### 1. PDF文件
- [ ] `data/Luomeng Zhou_Data_Resume.pdf` - **必须删除或移到.gitignore**
- [ ] `data/projects/*.pdf` - 所有项目PDF文件
- [ ] 任何其他PDF文件

### 2. Excel分析结果
- [ ] `data/output/*.xlsx` - 所有Excel分析结果文件
- [ ] 检查是否有其他Excel文件包含个人信息

### 3. 配置文件
- [ ] `.env` - 包含API密钥，**绝对不能上传**
- [ ] `project_analyzer_config.json` - 如果包含真实Google Drive链接，需要清理

### 4. 分析结果JSON
- [ ] `data/output/analysis_results.json` - 包含你的个人分析
- [ ] `data/output/analysis_request.json` - 可能包含个人信息

### 5. 提取的文本文件
- [ ] `data/project_texts/*.txt` - 项目文本内容
- [ ] `data/project_texts/all_projects_text.txt` - 合并的文本文件
- [ ] `data/project_texts/projects_index.json` - 项目索引

### 6. 个人数据文件
- [ ] `data/applied.json`
- [ ] `data/logs.json`
- [ ] `data/knowledge.json`
- [ ] `data/job-filters.json`
- [ ] `data/monitored-companies.json`
- [ ] `data/prompts.json`
- [ ] `data/resume-meta.json`

## 🔍 验证.gitignore

运行以下命令检查哪些文件会被忽略：

```bash
git status --ignored
```

或者：

```bash
git check-ignore -v data/projects/*.pdf
git check-ignore -v data/output/*.xlsx
git check-ignore -v .env
```

如果这些文件显示为 "ignored"，说明.gitignore工作正常。

## 📝 创建示例文件

如果项目需要配置文件，创建 `.example` 版本：

- ✅ `project_analyzer_config.example.json` - 已创建
- ✅ `.env.example` - 如果需要，可以创建

## 🚀 上传前最后检查

1. **运行检查命令**：
   ```bash
   git status
   ```

2. **确认没有以下文件出现在列表中**：
   - 任何 `.pdf` 文件
   - 任何 `.xlsx` 文件
   - `.env` 文件
   - `data/output/analysis_results.json`
   - `data/project_texts/` 目录下的文件

3. **如果看到不应该上传的文件**：
   ```bash
   # 从暂存区移除（如果已经添加）
   git reset HEAD 文件名
   
   # 确认.gitignore包含该文件模式
   # 如果不在.gitignore中，添加到.gitignore
   ```

## 📋 上传步骤

1. ✅ 完成上述检查清单
2. ✅ 初始化Git（如果还没有）: `git init`
3. ✅ 添加文件: `git add .`
4. ✅ 检查暂存区: `git status`
5. ✅ 提交: `git commit -m "Initial commit"`
6. ✅ 连接远程仓库: `git remote add origin <你的仓库地址>`
7. ✅ 上传: `git push -u origin main`

## ⚠️ 如果已经上传了隐私文件

如果发现隐私文件已经被上传：

1. **立即删除文件**（在GitHub网页上）
2. **从Git历史中删除**（需要重写历史）：
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch 文件路径" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **强制推送**（谨慎使用）：
   ```bash
   git push origin --force --all
   ```
4. **更改所有泄露的密钥/密码**

## 📞 需要帮助？

如果检查过程中遇到问题：
1. 查看 `GITHUB_GUIDE.md` 获取详细说明
2. 检查 `.gitignore` 文件内容
3. 在GitHub上创建Issue提问

---

**记住**：安全第一！宁可多检查几遍，也不要泄露隐私信息。

