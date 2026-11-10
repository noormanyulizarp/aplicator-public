
const SEARCH_INDEX = [
{
"title": "Ajaib \u2014 Company Research",
"category": "research",
"url": "research/ajaib_research.html",
"snippet": "# ajaib \u2014 company research\n\n**researched:** 2026-11-10\n**source:** https://ajaib.co.id/tentang-kami + linkedin + web search\n\n## what is ajaib?\n\najaib is indonesia's leading digital investment platform..."
},
{
"title": "Bonapolia + Baltic Amadeus \u2014 Company Research",
"category": "research",
"url": "research/bonapolia_research.html",
"snippet": "# bonapolia + baltic amadeus \u2014 company research\n\n**researched:** 2026-11-10\n**source:** https://jobs.bonapolia.com + web search (bonapolia, baltic amadeus)\n\n---\n\n## about bonapolia (the contracting pa..."
},
{
"title": "CV Review \u2014 Original PDF (noormanyulizarp@gmail.com.pdf)",
"category": "research",
"url": "research/cv_review_issues.html",
"snippet": "# cv review \u2014 original pdf (noormanyulizarp@gmail.com.pdf)\n\n**date reviewed:** 2026-11-10\n**purpose:** pre-submission review before sending to ajaib (sdet role)\n**file reviewed:** upload/noormanyuliza..."
},
{
"title": "DNA.inc \u2014 Company Research",
"category": "research",
"url": "research/dnainc_research.html",
"snippet": "# dna.inc \u2014 company research\n\n**researched:** 2026-11-09\n**source:** https://www.dna.inc + https://careers.dna.inc/o/senior-quality-engineer\n\n## what is dna.inc?\n\ndigital consultancy that helps client..."
},
{
"title": "Shine QA Analyst \u2014 \"Tell us why you want to join Shine \u2728\"",
"category": "research",
"url": "research/shine_motivation.html",
"snippet": "# shine qa analyst \u2014 \"tell us why you want to join shine \u2728\"\n\n**question:** tell us why you want to join shine\n**application:** product & technology \u00b7 porto \u2014 quality assurance analyst\n**date:** 2026-1..."
},
{
"title": "Shine.co \u2014 Company Research",
"category": "research",
"url": "research/shine_research.html",
"snippet": "# shine.co \u2014 company research\n\n**researched:** 2026-11-09\n**source:** https://www.shine.co + web research\n\n## what is shine?\n\nshine is a **fintech company** that serves as \"the financial co-pilot for ..."
},
{
"title": "General Motivation \u2014 Noorman Yulizar Prabowo",
"category": "motivation",
"url": "motivation/general_motivation.html",
"snippet": "# general motivation \u2014 noorman yulizar prabowo\n\n> **purpose:** reusable motivation text for job applications. this is a general-purpose statement of why i'm seeking new opportunities and what i'm look..."
},
{
"title": "Shine QA Analyst \u2014 Final Motivation Answer",
"category": "motivation",
"url": "motivation/shine_motivation_final.html",
"snippet": "# shine qa analyst \u2014 final motivation answer\n\n**question:** tell us why you want to join shine \u2728\n**application:** product & technology \u00b7 porto \u2014 quality assurance analyst\n**date:** 2026-11-09\n**status..."
},
{
"title": "ATS Keywords \u2014 Per Role",
"category": "knowledge",
"url": "knowledge/ATS_keywords.html",
"snippet": "# ats keywords \u2014 per role\n\nats (applicant tracking systems) parse your cv for keyword matches against the jd.\nbelow: high-frequency keywords per role to weave into your cv (when truthful).\n\n## how to ..."
},
{
"title": "Apply Playbook \u2014 End-to-End Job Search SOP",
"category": "knowledge",
"url": "knowledge/apply_playbook.html",
"snippet": "# apply playbook \u2014 end-to-end job search sop\n\na repeatable workflow for each job application. goal: maximize signal per application, minimize wasted effort.\n\n---\n\n## phase 0: setup (one-time, already ..."
},
{
"title": "Target Companies",
"category": "knowledge",
"url": "knowledge/companies_target.html",
"snippet": "# target companies\n\nmaintain a list of companies you'd want to work at, with notes on why and how to apply.\n\n## format\n\n```\n### <company name>\n- **why**: <1-2 sentences on why you want to work here>\n-..."
},
{
"title": "Greenhouse Apply \u2014 Workflow & Tips",
"category": "knowledge",
"url": "knowledge/greenhouse_tips.html",
"snippet": "# greenhouse apply \u2014 workflow & tips\n\ngreenhouse is the most common ats in tech (used by stripe, notion, gitlab, etc.). forms are usually consistent across companies \u2014 once you learn the pattern, appl..."
},
{
"title": "Lever Apply \u2014 Workflow & Tips",
"category": "knowledge",
"url": "knowledge/lever_tips.html",
"snippet": "# lever apply \u2014 workflow & tips\n\nlever is the second most common ats in tech (used by notion, ramp, plaid, etc.). simpler than greenhouse \u2014 usually just cv + 1-2 questions.\n\n## why lever is great\n\n- \u2705..."
},
{
"title": "LinkedIn Easy Apply \u2014 Workflow & Tips",
"category": "knowledge",
"url": "knowledge/linkedin_easy_apply.html",
"snippet": "# linkedin easy apply \u2014 workflow & tips\n\n## what is easy apply?\nlinkedin easy apply lets you apply with 1-3 clicks using a pre-saved profile + cv. lower friction, but also lower signal \u2014 recruiters se..."
},
{
"title": "Referral Strategy \u2014 Your Strongest Apply Lever",
"category": "knowledge",
"url": "knowledge/referral_strategy.html",
"snippet": "# referral strategy \u2014 your strongest apply lever\n\na referral increases your interview chance by 5-10x compared to cold application. most engineers underuse this.\n\n## why referrals work\n\n- recruiters t..."
},
{
"title": "Workday / Company Site Apply \u2014 Workflow & Tips",
"category": "knowledge",
"url": "knowledge/workday_tips.html",
"snippet": "# workday / company site apply \u2014 workflow & tips\n\nworkday is the most painful ats in tech (used by many large enterprises \u2014 banks, telcos, fortune 500). plan 15-30 min per application.\n\n## why workday..."
}
];

const input = document.getElementById('searchInput');
const results = document.getElementById('searchResults');

input.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query || query.length < 2) {
    results.classList.remove('show');
    return;
  }
  const matches = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.snippet.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  ).slice(0, 8);

  if (matches.length === 0) {
    results.innerHTML = '<div class="search-result"><div class="search-result-title">No results</div></div>';
  } else {
    results.innerHTML = matches.map(m =>
      `<a class="search-result" href="${m.url}">
        <div class="search-result-title">${m.title}</div>
        <div class="search-result-meta">${m.category} · ${m.snippet.substring(0, 80)}...</div>
      </a>`
    ).join('');
  }
  results.classList.add('show');
});

document.addEventListener('click', (e) => {
  if (!input.contains(e.target) && !results.contains(e.target)) {
    results.classList.remove('show');
  }
});
