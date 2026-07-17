// 所有搜索组合
const SEARCH_COMBINATIONS = [
    // Data Scientist
    { keyword: "data scientist", location: "New York, New York, United States" },
    { keyword: "data scientist", location: "Hong Kong" },
    { keyword: "data scientist", location: "Shanghai, China" },
    { keyword: "data scientist", location: "Singapore" },
    { keyword: "data scientist", location: "Dubai, United Arab Emirates" },
    
    // Data Analyst
    { keyword: "data analyst", location: "New York, New York, United States" },
    { keyword: "data analyst", location: "Hong Kong" },
    { keyword: "data analyst", location: "Shanghai, China" },
    { keyword: "data analyst", location: "Singapore" },
    { keyword: "data analyst", location: "Dubai, United Arab Emirates" },
    
    // Equity Research
    { keyword: "equity research", location: "New York, New York, United States" },
    { keyword: "equity research", location: "Hong Kong" },
    { keyword: "equity research", location: "Shanghai, China" },
    { keyword: "equity research", location: "Singapore" },
    { keyword: "equity research", location: "Dubai, United Arab Emirates" },
    
    // Sales & Trading
    { keyword: "sales&trading", location: "New York, New York, United States" },
    { keyword: "sales&trading", location: "Hong Kong" },
    { keyword: "sales&trading", location: "Shanghai, China" },
    { keyword: "sales&trading", location: "Singapore" },
    { keyword: "sales&trading", location: "Dubai, United Arab Emirates" },
];

// 生成搜索URL
function generateSearchUrl(keyword, location) {
    const keywordEncoded = encodeURIComponent(keyword);
    const locationEncoded = encodeURIComponent(location);
    return `https://www.linkedin.com/jobs/search/?keywords=${keywordEncoded}&location=${locationEncoded}&f_TPR=r86400&f_AL=true`;
}

// 收集当前页面的职位信息
function collectJobsFromCurrentPage(keyword, location) {
    const jobs = [];
    const seenIds = new Set();
    
    const jobLinks = Array.from(document.querySelectorAll('a[href*="/jobs/view/"]'));
    
    jobLinks.forEach(link => {
        const jobIdMatch = link.href.match(/\/jobs\/view\/(\d+)/);
        if (!jobIdMatch || seenIds.has(jobIdMatch[1])) return;
        seenIds.add(jobIdMatch[1]);
        
        const card = link.closest('li, div[class*="job"], article, div[data-occludable-job-id]');
        if (!card) return;
        
        const title = link.textContent.trim().split('\n')[0].trim();
        if (!title || title.length < 3) return;
        
        let company = 'Unknown';
        const companyEl = card.querySelector('a[href*="/company/"], [class*="company"]');
        if (companyEl) company = companyEl.textContent.trim().split('\n')[0];
        
        let location_text = 'Unknown';
        const locationEl = card.querySelector('[class*="metadata-item"], [class*="location"]');
        if (locationEl) location_text = locationEl.textContent.trim();
        
        let postedTime = 'Unknown';
        const timeEl = card.querySelector('time');
        if (timeEl) postedTime = timeEl.textContent.trim();
        
        const hasEasyApply = card.querySelector('[aria-label*="Easy Apply"], [aria-label*="easy apply"]') !== null;
        
        jobs.push({
            jobId: jobIdMatch[1],
            title: title,
            company: company,
            location: location_text,
            postedTime: postedTime,
            link: link.href.split('?')[0],
            hasEasyApply: hasEasyApply,
            searchKeyword: keyword,
            searchLocation: location
        });
    });
    
    return jobs;
}


