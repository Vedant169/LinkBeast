/**
 * BEAST — LinkBeast AI Marketing Advisor
 * Full conversation engine with state machine, budget parsing,
 * influencer matching, and structured recommendation output.
 */

// ============================================================
// DATA
// ============================================================

const INFLUENCER_DB = {
  nano: [
    { handle: '@delhi_eats_daily',  niche: ['food'],    city: ['delhi'],      followers: '8.2K',  rating: 4.8, rehire: 92,  priceMin: 5000,  priceMax: 15000 },
    { handle: '@fitlife_jaipur',    niche: ['fitness'], city: ['jaipur'],     followers: '6.5K',  rating: 4.7, rehire: 88,  priceMin: 5000,  priceMax: 15000 },
    { handle: '@mumbai_closet',     niche: ['fashion'], city: ['mumbai'],     followers: '9.1K',  rating: 4.9, rehire: 95,  priceMin: 5000,  priceMax: 15000 },
    { handle: '@techbites_india',   niche: ['tech'],    city: ['pan-india'],  followers: '7.8K',  rating: 4.6, rehire: 85,  priceMin: 5000,  priceMax: 15000 },
    { handle: '@bangaloremeals',    niche: ['food'],    city: ['bengaluru','bangalore'], followers: '5.4K', rating: 4.8, rehire: 90, priceMin: 5000, priceMax: 15000 },
  ],
  micro: [
    { handle: '@stylebyneha',       niche: ['fashion','lifestyle'], city: ['mumbai'],    followers: '78K', rating: 4.9, rehire: 94, priceMin: 15000, priceMax: 50000 },
    { handle: '@fitwithrohit',      niche: ['fitness'],             city: ['delhi'],     followers: '52K', rating: 4.7, rehire: 89, priceMin: 15000, priceMax: 50000 },
    { handle: '@thetravelkaur',     niche: ['travel'],              city: ['pan-india'], followers: '91K', rating: 4.8, rehire: 91, priceMin: 15000, priceMax: 50000 },
    { handle: '@beautybypriya',     niche: ['beauty'],              city: ['bengaluru','bangalore'], followers: '64K', rating: 4.9, rehire: 96, priceMin: 15000, priceMax: 50000 },
    { handle: '@financewitharjun',  niche: ['finance'],             city: ['pan-india'], followers: '88K', rating: 4.8, rehire: 93, priceMin: 15000, priceMax: 50000 },
    { handle: '@foodiefromindia',   niche: ['food'],                city: ['pan-india'], followers: '73K', rating: 4.7, rehire: 87, priceMin: 15000, priceMax: 50000 },
  ],
  midTier: [
    { handle: '@nikhilcreates',      niche: ['lifestyle'],         city: ['pan-india'],       followers: '320K', rating: 4.8, rehire: 90, priceMin: 50000,  priceMax: 200000 },
    { handle: '@fashionwithsimran',  niche: ['fashion'],           city: ['delhi','mumbai'],   followers: '210K', rating: 4.9, rehire: 92, priceMin: 50000,  priceMax: 200000 },
    { handle: '@healthheroinindia',  niche: ['fitness','wellness'], city: ['pan-india'],       followers: '450K', rating: 4.7, rehire: 88, priceMin: 50000,  priceMax: 200000 },
  ],
  macro: [
    { handle: '@megalifestyleind',  niche: ['lifestyle'],     city: ['pan-india'], followers: '1.2M', rating: 4.8, rehire: 85, priceMin: 200000, priceMax: 999999 },
    { handle: '@indiasfoodie',      niche: ['food','travel'], city: ['pan-india'], followers: '890K', rating: 4.7, rehire: 82, priceMin: 200000, priceMax: 999999 },
  ],
};

const SEO_PLANS = [
  { label: 'Basic SEO',       min: 5000,  max: 15000,  deliverables: ['On-page optimisation','Keyword research (India-focused)','Monthly performance report'], price: '₹5,000–₹15,000' },
  { label: 'Standard SEO',    min: 15000, max: 35000,  deliverables: ['Everything in Basic','Backlink building','Local SEO + Google Business','Competitor analysis'], price: '₹15,000–₹35,000' },
  { label: 'Advanced SEO',    min: 35000, max: 80000,  deliverables: ['Full technical SEO audit','Content strategy + writing','Priority support','Bi-weekly reporting'], price: '₹35,000–₹80,000' },
  { label: 'Enterprise SEO',  min: 80000, max: Infinity, deliverables: ['Dedicated account manager','Full-site authority building','Weekly reporting','Custom KPI dashboard'], price: '₹80,000+' },
];

const META_PLANS = [
  { label: 'Starter Ads',         min: 5000,   max: 20000,  deliverables: ['1 campaign','Basic audience targeting','Monthly performance report'], price: '₹5,000–₹20,000' },
  { label: 'Growth Ads',          min: 20000,  max: 50000,  deliverables: ['2–3 campaigns','A/B testing','Retargeting ads','Bi-weekly reporting'], price: '₹20,000–₹50,000' },
  { label: 'Scale Ads',           min: 50000,  max: 100000, deliverables: ['Full-funnel campaigns','Lookalike audiences','Weekly budget optimisation','City-specific ad sets'], price: '₹50,000–₹1,00,000' },
  { label: 'Performance Max',     min: 100000, max: Infinity, deliverables: ['Dedicated ads strategist','Daily monitoring','Custom dashboards','Creative production included'], price: '₹1,00,000+' },
];

const FREELANCER_PLANS = [
  { label: 'Basic Design',        min: 3000,  max: 8000,   deliverables: ['Logo design','Social media post design (5–10 posts)'], price: '₹3,000–₹8,000' },
  { label: 'Brand Kit Package',   min: 8000,  max: 20000,  deliverables: ['Landing page design','Brand kit (fonts, colours, guidelines)','Copywriting package'], price: '₹8,000–₹20,000' },
  { label: 'Website Package',     min: 20000, max: 60000,  deliverables: ['Full website design (5–7 pages)','Content strategy + writing','SEO-ready structure'], price: '₹20,000–₹60,000' },
  { label: 'Custom Digital',      min: 60000, max: Infinity, deliverables: ['Custom web app UI','Brand identity system','Video production','Dedicated freelancer team'], price: '₹60,000+' },
];

const SME_PLANS = [
  { label: 'Starter Bundle',  min: 10000, max: 20000,  deliverables: ['Basic SEO','1 Meta Ad campaign','2 social posts/week'], price: '₹10,000–₹20,000/month' },
  { label: 'Growth Bundle',   min: 20000, max: 40000,  deliverables: ['Standard SEO','2 Meta campaigns','1 nano influencer/month','Monthly strategy call'], price: '₹20,000–₹40,000/month' },
  { label: 'Pro Bundle',      min: 40000, max: 80000,  deliverables: ['Advanced SEO','3 Meta campaigns','2 micro influencers/month','Freelancer support (4 hrs/month)'], price: '₹40,000–₹80,000/month' },
  { label: 'Scale Bundle',    min: 80000, max: Infinity, deliverables: ['Full SEO','Performance Max Ads','Monthly macro influencer campaign','Dedicated account manager'], price: '₹80,000+/month' },
];

// ============================================================
// SESSION STATE
// ============================================================
let state = {
  step: 0,
  brand: null,
  budgetMin: null,
  budgetMax: null,
  services: [],
  niche: null,
  city: null,
  waitingForCity: false,
  shownCount: 3,
};

function resetState() {
  state = { step: 0, brand: null, budgetMin: null, budgetMax: null, services: [], niche: null, city: null, waitingForCity: false, shownCount: 3 };
}

// ============================================================
// HELPERS
// ============================================================

function parseBudget(text) {
  // Remove commas, lakhs notation
  const clean = text.replace(/[,₹\s]/g, '').toLowerCase();
  
  // Handle lakhs: 2L, 2.5L, 2lakh, 2.5lakhs
  const lakhMatch = clean.match(/(\d+\.?\d*)l(akh)?s?/);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]) * 100000;
    return { min: val * 0.8, max: val * 1.2 };
  }
  
  // Range: 10000-25000 or 10k-25k
  const rangeMatch = clean.match(/(\d+\.?\d*)(k?)[-–to]+(\d+\.?\d*)(k?)/);
  if (rangeMatch) {
    let a = parseFloat(rangeMatch[1]) * (rangeMatch[2] === 'k' ? 1000 : 1);
    let b = parseFloat(rangeMatch[3]) * (rangeMatch[4] === 'k' ? 1000 : 1);
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  
  // Single: 30000 or 30k
  const singleMatch = clean.match(/(\d+\.?\d*)(k?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]) * (singleMatch[2] === 'k' ? 1000 : 1);
    return { min: val * 0.8, max: val * 1.2 };
  }
  
  return null;
}

function parseServices(text) {
  const t = text.toLowerCase();
  const selected = [];
  if (t.includes('all')) return [1, 2, 3, 4, 5];
  if (t.includes('1') || t.includes('seo')) selected.push(1);
  if (t.includes('2') || t.includes('meta') || t.includes('ads')) selected.push(2);
  if (t.includes('3') || t.includes('influencer')) selected.push(3);
  if (t.includes('4') || t.includes('freelancer')) selected.push(4);
  if (t.includes('5') || t.includes('sme') || t.includes('package') || t.includes('bundle')) selected.push(5);
  return selected;
}

function getPlan(plans, budget) {
  return plans.find(p => budget >= p.min && budget <= p.max) || plans[plans.length - 1];
}

function matchInfluencers(niche, city, budget) {
  const nicheLC = (niche || '').toLowerCase();
  const cityLC  = (city  || '').toLowerCase();
  const allCreators = [
    ...INFLUENCER_DB.nano,
    ...INFLUENCER_DB.micro,
    ...INFLUENCER_DB.midTier,
    ...INFLUENCER_DB.macro,
  ];

  // Filter by budget fit
  const affordable = allCreators.filter(c => c.priceMin <= budget);

  // Score: niche match + city match + rating
  const scored = affordable.map(c => {
    let score = 0;
    if (c.niche.some(n => nicheLC.includes(n) || n.includes(nicheLC))) score += 3;
    if (c.city.some(ct => cityLC.includes(ct) || ct.includes(cityLC) || ct === 'pan-india')) score += 2;
    score += c.rating;
    score += c.rehire / 100;
    return { ...c, score };
  });

  return scored.sort((a, b) => b.score - a.score);
}

function formatMoney(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} lakh`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

function influencerTier(inf) {
  if (inf.priceMin >= 200000) return 'Macro';
  if (inf.priceMin >= 50000)  return 'Mid-Tier';
  if (inf.priceMin >= 15000)  return 'Micro';
  return 'Nano';
}

function whyTheyFit(inf, brand, niche) {
  const reasons = {
    food: 'Their food content drives high local engagement — great for restaurant and F&B brands.',
    fitness: 'Their fitness audience is highly engaged and conversion-ready for health products.',
    fashion: 'Their styling content gets strong saves and profile visits — ideal for fashion brands.',
    beauty: 'Their review-style beauty content drives strong product trial intent.',
    tech: 'Their tech-savvy followers are early adopters — great for app and gadget launches.',
    travel: 'Their travel content reaches aspirational, high-spending audiences.',
    lifestyle: 'Their lifestyle mix gives your brand wide reach across demographics.',
    finance: 'Their finance audience trusts product recommendations — high conversion for fintech/banking.',
  };
  for (const [key, val] of Object.entries(reasons)) {
    if (inf.niche.includes(key)) return val;
  }
  return `Their audience aligns well with the ${niche || brand} space.`;
}

// ============================================================
// RECOMMENDATION GENERATOR
// ============================================================

function generateRecommendation() {
  const { brand, budgetMin, budgetMax, services, niche, city } = state;
  const midBudget = (budgetMin + budgetMax) / 2;

  let rec = `<div class="beast-rec">`;
  rec += `<div class="rec-header">🎯 <strong>YOUR LINKBEAST MARKETING PLAN</strong></div>`;
  rec += `<div class="rec-meta">
    <span>🏷️ Brand: <strong>${brand}</strong></span>
    <span>💰 Budget: <strong>${formatMoney(budgetMin)} – ${formatMoney(budgetMax)}/month</strong></span>
    ${city ? `<span>📍 Region: <strong>${city}</strong></span>` : ''}
  </div>`;

  // Edge case: budget too low
  if (budgetMax < 5000) {
    rec += `<div class="rec-note">⚠️ Your budget is on the lower side for paid campaigns. I'd recommend starting with our <strong>Nano Influencer package</strong> or <strong>Basic SEO</strong> to maximise your ₹ value.</div>`;
  }

  // Scale budget
  if (midBudget >= 200000) {
    rec += `<div class="rec-note">🚀 With your budget, I'd strongly recommend the <strong>Scale Bundle + Macro Influencer + Dedicated Account Manager</strong> — you're in peak territory for brand-wide campaigns.</div>`;
  }

  rec += `<div class="rec-section-title">📦 RECOMMENDED SERVICES</div>`;

  const allSelected = services.length === 5 || services.includes('all');

  if (services.length === 0 || (services.includes(5) && services.length === 1) || allSelected) {
    // SME Bundle recommendation
    const plan = getPlan(SME_PLANS, midBudget);
    rec += serviceBlock('SME PACKAGE', plan.label, plan.deliverables, plan.price);
  } else {
    if (services.includes(1)) {
      const plan = getPlan(SEO_PLANS, midBudget);
      rec += serviceBlock('SEO SERVICES', plan.label, plan.deliverables, plan.price);
    }
    if (services.includes(2)) {
      const plan = getPlan(META_PLANS, midBudget);
      rec += serviceBlock('META ADS', plan.label, plan.deliverables, plan.price);
    }
    if (services.includes(4)) {
      const plan = getPlan(FREELANCER_PLANS, midBudget);
      rec += serviceBlock('FREELANCER NETWORK', plan.label, plan.deliverables, plan.price);
    }
  }

  // Influencers
  if (services.includes(3) || allSelected) {
    const matches = matchInfluencers(niche, city, midBudget);
    const top = matches.slice(0, 3);

    if (top.length > 0) {
      rec += `<div class="rec-section-title">🌟 TOP INFLUENCER MATCHES</div>`;
      top.forEach((inf, i) => {
        rec += `<div class="inf-card">
          <div class="inf-rank">${i + 1}</div>
          <div class="inf-info">
            <div class="inf-handle">${inf.handle} <span class="inf-tier">${influencerTier(inf)}</span></div>
            <div class="inf-meta">
              ${inf.niche[0].charAt(0).toUpperCase() + inf.niche[0].slice(1)} | ${inf.city[0].charAt(0).toUpperCase() + inf.city[0].slice(1)} | ${inf.followers} followers
            </div>
            <div class="inf-stats">
              ⭐ Rating: <strong>${inf.rating}</strong> &nbsp; 🔁 Rehire: <strong>${inf.rehire}%</strong> &nbsp; 💰 <strong>₹${inf.priceMin.toLocaleString('en-IN')}–₹${Math.min(inf.priceMax, 200000).toLocaleString('en-IN')}/post</strong>
            </div>
            <div class="inf-why">💡 ${whyTheyFit(inf, brand, niche)}</div>
          </div>
        </div>`;
      });
    } else {
      rec += `<div class="rec-note">No exact influencer match for your niche/city combo — I've shown the closest alternatives above. Want me to expand the search?</div>`;
    }
  }

  // Beast's smart take
  rec += `<div class="beast-take">`;
  rec += `<div class="rec-section-title">💡 BEAST'S RECOMMENDATION</div>`;
  rec += `<p>${generateSmartTip(brand, budgetMin, budgetMax, services, city, niche)}</p>`;
  rec += `</div>`;

  // CTA
  rec += `<div class="rec-cta">
    <div class="rec-section-title">📞 READY TO START?</div>
    <div class="cta-btns">
      <button class="chat-btn-action" onclick="sendQuick('Book a call')">📅 Book a Call</button>
      ${(services.includes(3) || services.includes('all')) ? `<button class="chat-btn-action secondary" onclick="sendQuick('Show more influencers')">👥 Show More Influencers</button>` : ''}
      <button class="chat-btn-action secondary" onclick="restartChat()">🔄 Start Over</button>
    </div>
  </div>`;

  rec += `</div>`;
  return rec;
}

function serviceBlock(name, label, deliverables, price) {
  return `<div class="service-block">
    <div class="service-name">✅ ${name}</div>
    <div class="service-label">Plan: <strong>${label}</strong></div>
    <ul class="service-delivers">
      ${deliverables.map(d => `<li>${d}</li>`).join('')}
    </ul>
    <div class="service-price">Monthly cost: <strong>${price}</strong></div>
  </div>`;
}

function generateSmartTip(brand, min, max, services, city, niche) {
  const mid = (min + max) / 2;
  const cityStr = city || 'your target region';

  if (services.includes(2) && services.includes(3)) {
    const adsBudget = formatMoney(Math.round(mid * 0.6));
    const infBudget = formatMoney(Math.round(mid * 0.4));
    return `With your ${formatMoney(min)}–${formatMoney(max)} budget, I'd split ${adsBudget} on Meta Ads for reach and ${infBudget} on an influencer collab for trust. That's your fastest path to brand awareness in ${cityStr}.`;
  }
  if (services.includes(1) && services.includes(2)) {
    return `For ${brand}, combining SEO + Meta Ads is a power move — SEO builds long-term authority while paid ads drive immediate traffic. Start with the Growth Ads plan and let SEO compound over 3 months.`;
  }
  if (services.includes(3) && mid < 50000) {
    return `For ${brand} in ${cityStr}, Nano and Micro influencers often outperform bigger names on ROI — their audiences are tight-knit and trust their recommendations. Start with 2–3 creators this month.`;
  }
  if (services.includes(5)) {
    return `The SME Bundle is your best value at this budget. It bundles everything you need — SEO, Ads, and creator collabs — under one roof with a single point of contact. No juggling vendors.`;
  }
  return `For ${brand} targeting ${cityStr}, the recommended plan above gives you the best ROI at your budget. Start lean, track results after 30 days, and we'll scale what works.`;
}

// ============================================================
// CONVERSATION ENGINE
// ============================================================

function processInput(userText) {
  const text = userText.trim();
  const lower = text.toLowerCase();

  // Handle quick actions
  if (lower === 'book a call') {
    return `<div>Great! 🎉 Our team will reach out to you within 24 hours.<br><br>
    You can also WhatsApp us directly: <a href="https://wa.me/919999999999?text=Hi! Beast sent me — I'd like to book a call about LinkBeast services." target="_blank" class="chat-wa-link">💬 WhatsApp us now</a>
    <br><br>Want to <button class="chat-inline-btn" onclick="restartChat()">start a new consultation?</button></div>`;
  }

  if (lower === 'show more influencers') {
    if (!state.niche && !state.brand) return `I'd need to know your niche and budget first. Let me start fresh — ${getGreeting()}`;
    const mid = (state.budgetMin + state.budgetMax) / 2;
    const matches = matchInfluencers(state.niche, state.city, mid);
    const next = matches.slice(state.shownCount, state.shownCount + 3);
    state.shownCount += 3;
    if (next.length === 0) return `That's all the creators we have in your niche/budget combo right now. We add new creators weekly! Want to <button class="chat-inline-btn" onclick="sendQuick('Book a call')">book a call</button> for custom sourcing?`;
    let out = `<strong>More influencers for your brand:</strong><br><br>`;
    next.forEach((inf, i) => {
      out += `<div class="inf-card">
        <div class="inf-rank">${state.shownCount - 3 + i + 1}</div>
        <div class="inf-info">
          <div class="inf-handle">${inf.handle} <span class="inf-tier">${influencerTier(inf)}</span></div>
          <div class="inf-meta">${inf.niche[0]} | ${inf.city[0]} | ${inf.followers} followers</div>
          <div class="inf-stats">⭐ ${inf.rating} &nbsp; 🔁 ${inf.rehire}% &nbsp; 💰 ₹${inf.priceMin.toLocaleString('en-IN')}–₹${Math.min(inf.priceMax, 200000).toLocaleString('en-IN')}/post</div>
        </div>
      </div>`;
    });
    return out;
  }

  // Step-based flow
  switch (state.step) {
    case 0: // After greeting — capture brand
      state.brand = text;
      state.step = 1;
      return `Got it! <strong>${state.brand}</strong> sounds promising. 👏<br><br>Now tell me — what's your monthly marketing budget? You can give a range like <em>₹10,000–₹25,000</em> or a single number.`;

    case 1: // Capture budget
      const budget = parseBudget(text);
      if (!budget) {
        return `Hmm, I didn't quite catch that number. Try something like <em>₹20,000</em> or <em>₹15,000–₹40,000</em>. What's your monthly marketing budget?`;
      }
      if (budget.max < 5000) {
        state.budgetMin = budget.min;
        state.budgetMax = budget.max;
        state.step = 2;
        return `Your budget is on the lower side for paid campaigns, but don't worry — Nano Influencers and Basic SEO are excellent starting points! 💪<br><br>Here's what LinkBeast offers — which services are you looking for?<br><br>${servicesMenu()}`;
      }
      state.budgetMin = budget.min;
      state.budgetMax = budget.max;
      state.step = 2;
      return `Great — working with <strong>${formatMoney(budget.min)}–${formatMoney(budget.max)}/month</strong>. 💰<br><br>Here's what LinkBeast offers — which services are you looking for?<br><br>${servicesMenu()}`;

    case 2: // Capture services
      const selected = parseServices(text);
      if (selected.length === 0) {
        return `I didn't catch which services you want. Type the numbers — e.g. <em>1, 3</em> or <em>all</em>.<br><br>${servicesMenu()}`;
      }
      state.services = selected;
      if (selected.includes(3) || selected.includes(5) || (selected.length === 5)) {
        state.step = 3;
        return `Perfect! For influencer matching, what <strong>category best fits your brand?</strong><br><br>e.g. <em>Lifestyle, Fashion, Food, Fitness, Tech, Travel, Finance, Beauty</em>`;
      } else {
        // Skip influencer questions
        state.step = 5;
        return generateRecommendation();
      }

    case 3: // Capture niche
      state.niche = text;
      state.step = 4;
      return `Great choice! And <strong>which city or region</strong> are you targeting?<br><br>e.g. <em>Delhi, Mumbai, Pan-India, Tier 2 cities, Bengaluru</em>`;

    case 4: // Capture city → generate rec
      state.city = text;
      state.step = 5;
      return generateRecommendation();

    case 5: // Post-recommendation
      if (lower.includes('restart') || lower.includes('start over') || lower.includes('new')) {
        resetState();
        return getGreeting();
      }
      return `I've already sent your plan above! 🎯<br><br>Want to <button class="chat-inline-btn" onclick="restartChat()">start a new consultation</button> or <button class="chat-inline-btn" onclick="sendQuick('Book a call')">book a call</button>?`;

    default:
      resetState();
      return getGreeting();
  }
}

function servicesMenu() {
  return `<div class="services-menu">
    <div class="svc-item" onclick="clickService(this, 1)"><span class="svc-num">01</span> <strong>SEO SERVICES</strong> — Rank higher, stay there.</div>
    <div class="svc-item" onclick="clickService(this, 2)"><span class="svc-num">02</span> <strong>META ADS</strong> — Live performance Facebook + Instagram.</div>
    <div class="svc-item" onclick="clickService(this, 3)"><span class="svc-num">03</span> <strong>INFLUENCER MARKETPLACE</strong> — Verified creators, zero guesswork.</div>
    <div class="svc-item" onclick="clickService(this, 4)"><span class="svc-num">04</span> <strong>FREELANCER NETWORK</strong> — Design, content, digital assets on-demand.</div>
    <div class="svc-item" onclick="clickService(this, 5)"><span class="svc-num">05</span> <strong>SME PACKAGES</strong> — Bundled, fixed ₹ pricing for Indian businesses.</div>
    <div class="svc-confirm"><button class="chat-btn-action" onclick="confirmServices()">Confirm Selection ✓</button> &nbsp; <button class="chat-btn-action secondary" onclick="sendQuick('all')">Select All</button></div>
  </div>`;
}

let selectedServices = [];
function clickService(el, num) {
  el.classList.toggle('selected');
  if (selectedServices.includes(num)) {
    selectedServices = selectedServices.filter(s => s !== num);
  } else {
    selectedServices.push(num);
  }
}
function confirmServices() {
  if (selectedServices.length === 0) {
    return appendBeast(`Please select at least one service, or type <em>all</em> to select everything.`);
  }
  sendQuick(selectedServices.join(', '));
  selectedServices = [];
}

function getGreeting() {
  return `Hey! 👋 I'm <strong>Beast</strong>, your LinkBeast marketing advisor.<br><br>
  I'll help you find the best services and influencers for your brand in under 2 minutes.<br><br>
  Let's start — <strong>what's your brand or business about?</strong><br>
  <em style="font-size:0.85rem;color:#a0aec0;">(e.g. fashion, food, fitness, tech, D2C, restaurant, salon...)</em>`;
}

// ============================================================
// EXPORTS
// ============================================================
window.BeastChat = { processInput, getGreeting, resetState };
