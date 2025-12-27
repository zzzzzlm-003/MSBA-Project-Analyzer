# GitHub 使用指南

这是一个简单的GitHub使用指南，帮助你把这个项目上传到GitHub并与同学分享。

## 第一步：在GitHub上创建仓库

1. **登录GitHub**
   - 访问 https://github.com
   - 使用你刚注册的账号登录

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"
   - 填写仓库信息：
     - **Repository name**: `project-analyzer` (或你喜欢的名字)
     - **Description**: "A tool to analyze and evaluate project proposals for course selection"
     - **Visibility**: 选择 "Public" (公开) 或 "Private" (私有)
     - **不要**勾选 "Initialize this repository with a README" (我们已经有了)
   - 点击 "Create repository"

3. **复制仓库地址**
   - 创建后会显示一个页面，复制HTTPS地址（类似：`https://github.com/你的用户名/project-analyzer.git`）

## 第二步：在本地准备代码

### 检查哪些文件会被上传

我们已经创建了 `.gitignore` 文件，它会自动排除：
- ✅ 所有PDF文件（你的简历、项目PDF等）
- ✅ 分析结果Excel文件
- ✅ 个人配置文件（.env）
- ✅ 提取的文本文件
- ✅ 其他隐私数据

### 验证.gitignore是否生效

在项目目录下运行：

```bash
# Windows PowerShell
git status

# 或者查看会被忽略的文件
git status --ignored
```

你应该看到 `data/projects/`、`data/output/*.xlsx` 等文件被标记为 "ignored"。

## 第三步：初始化Git并上传代码

### 1. 初始化Git仓库（如果还没有）

```bash
# 在项目根目录下运行
git init
```

### 2. 添加所有文件（.gitignore会自动排除隐私文件）

```bash
git add .
```

### 3. 创建第一次提交

```bash
git commit -m "Initial commit: Project analyzer tool"
```

### 4. 连接到GitHub仓库

```bash
# 替换成你的实际仓库地址
git remote add origin https://github.com/你的用户名/project-analyzer.git
```

### 5. 上传代码

```bash
# 上传到GitHub
git push -u origin main
```

**注意**：如果是第一次使用，GitHub可能会要求你登录。按照提示操作即可。

## 第四步：验证上传成功

1. 刷新你的GitHub仓库页面
2. 你应该能看到所有代码文件
3. **确认隐私文件没有上传**：
   - 检查 `data/projects/` 目录是否存在（应该不存在或为空）
   - 检查 `data/output/` 目录中是否有Excel文件（应该没有）
   - 检查是否有 `.env` 文件（应该没有）

## 常用Git命令

### 查看状态
```bash
git status
```

### 添加新文件
```bash
git add 文件名
# 或添加所有更改
git add .
```

### 提交更改
```bash
git commit -m "描述你的更改"
```

### 上传到GitHub
```bash
git push
```

### 从GitHub下载最新代码
```bash
git pull
```

## 分享给同学

### 方式1：直接分享仓库链接

1. 复制你的仓库地址：`https://github.com/你的用户名/project-analyzer`
2. 发送给同学
3. 他们可以：
   - 点击 "Code" 按钮
   - 选择 "Download ZIP" 下载整个项目
   - 或者使用 `git clone` 命令克隆项目

### 方式2：让同学成为协作者

1. 在仓库页面，点击 "Settings"
2. 左侧菜单选择 "Collaborators"
3. 点击 "Add people"
4. 输入同学的GitHub用户名或邮箱
5. 同学会收到邀请邮件，接受后就可以共同编辑

## 后续更新代码

当你修改了代码并想更新到GitHub：

```bash
# 1. 查看更改
git status

# 2. 添加更改
git add .

# 3. 提交更改
git commit -m "描述你的更改，比如：添加新功能"

# 4. 上传到GitHub
git push
```

## 重要提醒

### ✅ 安全检查清单

在上传前，确认：

- [ ] `.gitignore` 文件存在且正确
- [ ] 没有PDF文件在仓库中（检查 `data/projects/`）
- [ ] 没有Excel分析结果文件（检查 `data/output/`）
- [ ] 没有 `.env` 文件（包含API密钥）
- [ ] 没有个人简历文件
- [ ] 没有项目原始PDF文件

### 🔒 如果意外上传了隐私文件

如果发现隐私文件被上传了：

1. **立即删除文件**（在GitHub网页上）
2. **从Git历史中删除**（需要高级操作，可以搜索 "git remove file from history"）
3. **更改API密钥**（如果.env文件被上传了）

## 常见问题

### Q: 提示需要用户名和密码？

A: GitHub已经不再支持密码登录，你需要：
1. 生成Personal Access Token
2. 或者使用GitHub Desktop客户端
3. 或者配置SSH密钥

### Q: 如何生成Personal Access Token？

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token"
3. 选择权限（至少需要 `repo`）
4. 复制生成的token
5. 在Git push时，密码处输入这个token

### Q: 如何让仓库私有？

1. 在仓库页面点击 "Settings"
2. 滚动到底部，找到 "Danger Zone"
3. 点击 "Change visibility"
4. 选择 "Make private"

### Q: 如何删除仓库？

1. 在仓库页面点击 "Settings"
2. 滚动到底部，找到 "Danger Zone"
3. 点击 "Delete this repository"
4. 输入仓库名称确认

## 需要帮助？

- GitHub官方文档：https://docs.github.com
- Git官方文档：https://git-scm.com/doc
- 可以在仓库中创建 "Issue" 来提问

---

**记住**：永远不要上传包含个人隐私或学校机密信息的文件！

