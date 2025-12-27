import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_PROFILE_FILE = path.join(__dirname, 'user_profile.json');
const PROJECT_TEXTS_DIR = path.join(__dirname, 'data', 'project_texts');
const OUTPUT_DIR = path.join(__dirname, 'data', 'output');

// 读取用户配置文件
function loadUserProfile() {
    if (!fs.existsSync(USER_PROFILE_FILE)) {
        console.error('❌ 错误: 找不到用户配置文件 user_profile.json');
        console.log('📝 请先复制 user_profile.example.json 为 user_profile.json 并填写你的信息');
        process.exit(1);
    }
    
    const profile = JSON.parse(fs.readFileSync(USER_PROFILE_FILE, 'utf-8'));
    console.log(`\n✅ 已加载用户配置: ${profile.name || '未命名用户'}`);
    return profile;
}

// 读取项目文本文件
function loadProjectTexts() {
    if (!fs.existsSync(PROJECT_TEXTS_DIR)) {
        console.error('❌ 错误: 找不到项目文本目录');
        console.log('📝 请先运行 extract_pdfs.js 提取PDF文本');
        process.exit(1);
    }
    
    const files = fs.readdirSync(PROJECT_TEXTS_DIR)
        .filter(file => file.endsWith('.txt') && file.startsWith('P'));
    
    console.log(`\n📚 找到 ${files.length} 个项目文本文件\n`);
    return files;
}

// 分析单个项目（简化版，使用规则匹配）
function analyzeProject(textContent, projectId, profile) {
    const text = textContent.toLowerCase();
    
    // 提取基本信息
    const projectName = extractProjectName(textContent);
    const companyName = inferCompanyName(textContent);
    const industry = inferIndustry(text, profile);
    const application = extractApplication(textContent);
    const diligence = assessDiligence(textContent);
    const expectedOutcomes = extractExpectedOutcomes(textContent);
    const skills = extractSkills(textContent);
    
    // 计算适配度
    const suitability = calculateSuitability(text, profile);
    const biddingScore = calculateBiddingScore(suitability, profile);
    
    return {
        项目编号: projectId,
        项目名称: projectName,
        公司名称: companyName,
        推测公司: companyName,
        所处行业: industry,
        应用场景: application,
        公司用心程度: diligence,
        预期成果: expectedOutcomes,
        技能要求: skills,
        项目描述摘要: textContent.substring(0, 200) + '...',
        适配星级: suitability.stars,
        适配理由: suitability.reason,
        建议bidding分数: biddingScore.score,
        bidding理由: biddingScore.reason,
        源文件: `${projectId}.pdf`
    };
}

// 辅助函数
function extractProjectName(text) {
    const lines = text.split('\n').slice(0, 20);
    for (const line of lines) {
        if (line.toLowerCase().includes('project title') || 
            line.toLowerCase().includes('project name')) {
            return line.split(':').slice(1).join(':').trim() || '未命名项目';
        }
    }
    return lines.find(l => l.length > 10 && l.length < 100) || '未命名项目';
}

function inferCompanyName(text) {
    // 简单的公司名称推断逻辑
    const patterns = [
        /company name[:\s]+([^\n]+)/i,
        /sponsor[:\s]+([^\n]+)/i,
        /([A-Z][a-z]+ (?:Analytics|Intelligence|Capital|Partners|Group|Solutions))/g
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1] || match[0];
    }
    
    return '未明确';
}

function inferIndustry(text, profile) {
    const industryKeywords = {
        '金融': ['finance', 'financial', 'investment', 'banking', 'capital', 'equity', 'trading', 'mortgage', 'fintech'],
        '房地产': ['real estate', 'property', 'reit', 'housing', 'apartment'],
        '医疗': ['healthcare', 'medical', 'hospital', 'clinical', 'pharmaceutical', 'health'],
        '零售': ['retail', 'restaurant', 'merchant', 'pos'],
        '科技': ['tech', 'software', 'ai', 'ml', 'data science'],
        '咨询': ['consulting', 'advisory']
    };
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
        if (keywords.some(kw => text.includes(kw))) {
            return industry;
        }
    }
    
    return '其他';
}

function extractApplication(text) {
    const lines = text.split('\n');
    const descIndex = lines.findIndex(l => l.toLowerCase().includes('project description'));
    if (descIndex >= 0 && descIndex < lines.length - 1) {
        return lines.slice(descIndex + 1, descIndex + 5).join(' ').substring(0, 300);
    }
    return text.substring(0, 300) + '...';
}

function assessDiligence(text) {
    const hasDetailedData = text.includes('data') && text.length > 2000;
    const hasDeliverables = text.includes('deliverable');
    const hasSkills = text.includes('required skill') || text.includes('skill');
    const hasBackground = text.includes('background');
    
    let score = 5;
    if (hasDetailedData) score += 1;
    if (hasDeliverables) score += 1;
    if (hasSkills) score += 1;
    if (hasBackground) score += 1;
    
    return `${score}分 - ${hasDetailedData && hasDeliverables ? '文档详细' : '文档相对简略'}`;
}

function extractExpectedOutcomes(text) {
    const lines = text.split('\n');
    const deliverablesIndex = lines.findIndex(l => l.toLowerCase().includes('deliverable'));
    if (deliverablesIndex >= 0) {
        return lines.slice(deliverablesIndex + 1, deliverablesIndex + 5)
            .filter(l => l.trim().length > 0)
            .join('; ');
    }
    return '未明确';
}

function extractSkills(text) {
    const lines = text.split('\n');
    const skillsIndex = lines.findIndex(l => 
        l.toLowerCase().includes('required skill') || 
        l.toLowerCase().includes('skill')
    );
    if (skillsIndex >= 0) {
        return lines.slice(skillsIndex, skillsIndex + 3)
            .filter(l => l.trim().length > 0)
            .join(' ');
    }
    return '未明确';
}

function calculateSuitability(text, profile) {
    let score = 0;
    const reasons = [];
    
    // 检查行业匹配
    const preferredIndustries = profile.preferences?.preferred_industries || [];
    const industry = inferIndustry(text, profile);
    if (preferredIndustries.some(ind => text.includes(ind.toLowerCase()))) {
        score += 2;
        reasons.push('行业匹配你的兴趣');
    }
    
    // 检查金融相关关键词
    const financeKeywords = ['finance', 'financial', 'investment', 'equity', 'trading', 'portfolio', 'risk'];
    if (financeKeywords.some(kw => text.includes(kw))) {
        score += 2;
        reasons.push('涉及金融/投资分析');
    }
    
    // 检查技能要求
    const userSkills = profile.background?.technical_skills?.programming || [];
    if (userSkills.some(skill => text.includes(skill.toLowerCase()))) {
        score += 1;
        reasons.push('技能要求匹配');
    }
    
    // 检查ML要求（如果用户ML基础较弱）
    if (profile.preferences?.skill_level?.ml === 'basic' && 
        (text.includes('deep learning') || text.includes('neural network') || text.includes('computer vision'))) {
        score -= 1;
        reasons.push('需要高级ML技能，可能超出你的基础');
    }
    
    // 转换为星级
    let stars = '⭐⭐';
    if (score >= 4) stars = '⭐⭐⭐⭐⭐';
    else if (score >= 3) stars = '⭐⭐⭐⭐';
    else if (score >= 2) stars = '⭐⭐⭐';
    else if (score >= 1) stars = '⭐⭐';
    else stars = '⭐';
    
    return {
        stars: stars,
        reason: reasons.length > 0 ? reasons.join('。') : '一般匹配'
    };
}

function calculateBiddingScore(suitability, profile) {
    const strategy = profile.preferences?.bidding_strategy || {};
    const stars = suitability.stars;
    
    let score = '50-80分';
    let reason = '如果必须bid 20个项目，可以作为备选';
    
    if (stars.includes('⭐⭐⭐⭐⭐')) {
        score = '550-600分';
        reason = '完美匹配！强烈建议最高分bid';
    } else if (stars.includes('⭐⭐⭐⭐')) {
        score = '300-450分';
        reason = '高度匹配，建议高分bid';
    } else if (stars.includes('⭐⭐⭐')) {
        score = '100-200分';
        reason = '中等匹配，可以考虑';
    }
    
    return { score, reason };
}

// 主函数
async function main() {
    console.log('============================================================');
    console.log('项目分析工具 - 基于用户配置的个性化分析');
    console.log('============================================================');
    
    // 加载用户配置
    const profile = loadUserProfile();
    
    // 加载项目文本
    const projectFiles = loadProjectTexts();
    
    // 分析每个项目
    const results = [];
    for (let i = 0; i < projectFiles.length; i++) {
        const file = projectFiles[i];
        const projectId = file.replace('.txt', '').replace('.docx', '');
        const filePath = path.join(PROJECT_TEXTS_DIR, file);
        
        console.log(`[${i + 1}/${projectFiles.length}] 分析: ${projectId}`);
        
        try {
            const textContent = fs.readFileSync(filePath, 'utf-8');
            const analysis = analyzeProject(textContent, projectId, profile);
            results.push(analysis);
            console.log(`  ✓ ${analysis.适配星级} - ${analysis.建议bidding分数}`);
        } catch (error) {
            console.error(`  ✗ 分析失败: ${error.message}`);
        }
    }
    
    // 保存结果
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const jsonPath = path.join(OUTPUT_DIR, `analysis_results_${timestamp}.json`);
    const excelPath = path.join(OUTPUT_DIR, `项目分析_${timestamp}.xlsx`);
    
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n✅ JSON结果已保存: ${jsonPath}`);
    
    // 生成Excel
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '项目分析');
    XLSX.writeFile(workbook, excelPath);
    console.log(`✅ Excel文件已生成: ${excelPath}`);
    console.log(`\n📊 共分析 ${results.length} 个项目\n`);
}

main().catch(console.error);

