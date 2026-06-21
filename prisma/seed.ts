// Set DATABASE_URL before any imports so Prisma Client picks it up
// Use direct connection (port 5432) for seeding — PgBouncer (6543) doesn't support transactions needed for upserts
process.env.DATABASE_URL = 'postgresql://postgres.trklgpgtctwiibgeicjx:Medhat23568914@aws-0-eu-west-1.pooler.supabase.com:5432/postgres';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create profile
  await prisma.profile.upsert({
    where: { id: 'profile-1' },
    update: {},
    create: {
      id: 'profile-1',
      name: 'Mohamed Medhat Ahmed',
      title: 'Marketing & Business Development Specialist',
      email: 'Mohamed.ahmed9009mm@gmail.com',
      phone: '+20 112 535 3053',
      linkedin: 'mohamed-ahmed-210b41394',
      bio: `I'm a dual-degree Marketing & International Business graduate from MSA University and the University of Greenwich, with hands-on experience spanning digital campaign support, B2B business development, client relationship management, and team leadership.

My career has moved across industries — from managing BTL promotional campaigns for investment products at Mining City, to client data analysis at a confidential marketing operations firm, to internships in brand support, business development, and operations. Each step has sharpened my ability to handle multiple workflows simultaneously, synthesize data into decisions, and coordinate across teams and vendors.

Outside the desk, I invest time into understanding the Egyptian and regional marketing ecosystem — studying campaigns, analyzing brand behaviour, and building case studies on brands I believe are doing something interesting.`,
      heroSubtitle: 'Marketing & Business Development',
      quote: 'Ownership-oriented. Execution-first. Every campaign, every data point, every stakeholder interaction — done with intent.',
      stat1Value: '2×',
      stat1Label: 'Degree holder',
      stat1Sub: 'Greenwich & MSA University',
      stat2Value: '10+',
      stat2Label: 'Team members led',
      stat2Sub: 'in a supervisory role',
      stat3Value: '3+',
      stat3Label: 'Industries',
      stat3Sub: 'FMCG, B2B, digital, operations',
      stat4Value: 'C1',
      stat4Label: 'English proficiency',
      stat4Sub: 'bilingual Arabic/English',
    },
  });

  // Create projects with real content from old portfolio
  const projects = [
    {
      category: 'Case Study',
      title: 'Pablo & Abdo — Brand & Digital Presence Audit',
      slug: 'pablo-abdo-brand-audit',
      description: 'A comprehensive brand analysis asking: Is Pablo & Abdo reaching the right audience in the right way? Covered digital presence across Instagram (127K), TikTok (70K), and Facebook (55K), competitive mapping against 12+ F&B brands, SWOT breakdown, Meta Ads audit, and five concrete growth recommendations including an original campaign concept.',
      tags: 'Competitive Analysis,Digital Audit,Meta Ads,Campaign Strategy,Deck Design',
      imageUrl: '/logos/pablo-abdo-logo.png',
      client: 'Pablo & Abdo (F&B — Burger Concept)',
      timeline: 'Portfolio Case Study',
      role: 'Brand Analyst & Strategist',
      overview: `Pablo & Abdo is a fast-growing Egyptian burger concept with a strong personality and an active social presence — but the team had no clear answer to whether their digital execution was actually converting audience into business. This case study was built as a full brand and digital presence audit, asking one question upfront: Is Pablo & Abdo reaching the right audience, in the right way, with the right message?

The work covered four pillars: a quantitative audit of their Instagram (127K), TikTok (70K) and Facebook (55K) channels; a competitive mapping exercise against twelve+ regional F&B brands; a SWOT breakdown of their content, paid and community strategies; and a Meta Ads audit looking at creative, targeting, and funnel structure. The output was a thirty-slide deck with five concrete growth recommendations — including an original campaign concept designed to fill the brand's biggest narrative gap.`,
      challenge: `Pablo & Abdo's audience was growing, but their content strategy was running on instinct rather than insight. The team had no documented understanding of which content types actually drove engagement, which audience segments were most valuable, or how their paid spend was performing relative to peers. There was also a clear brand-narrative gap — the restaurant had an interesting origin story that was almost entirely absent from their digital presence, leaving a meaningful emotional hook on the table.

On the paid side, Meta Ads were being run without a clear funnel structure — awareness, consideration, and conversion creative were all being served to broadly overlapping audiences, diluting performance. The competitive landscape was also shifting: newer F&B brands were stealing share of voice with sharper TikTok strategies while Pablo & Abdo remained anchored to Instagram-first thinking.`,
      approach: `I structured the audit around four parallel workstreams, each ending in a concrete deliverable.

The first was a quantitative channel audit: I pulled a six-month sample of posts across Instagram, TikTok, and Facebook, categorised them by content type (product, lifestyle, UGC, promotional), and computed engagement rates per category. This surfaced the fact that reels were outperforming static product shots by roughly 3x on Instagram, while TikTok was being used as a repost channel rather than a native platform.

The second was competitive mapping — twelve regional F&B brands were benchmarked across posting cadence, content mix, average engagement, and follower growth. The output was a positioning matrix that placed Pablo & Abdo visually against direct and indirect competitors, highlighting where they were leading and where they were behind.

The third was a SWOT synthesis translating the raw data into strategy — what to keep doing, what to stop, what to start. The fourth was a Meta Ads audit reviewing active campaigns for creative quality, audience overlap, and funnel structure, with specific recommendations on creative testing roadmaps and budget reallocation.

The final deliverable closed the loop with five prioritised recommendations and an original campaign concept — The Origin Story — designed to fill the brand's narrative gap.`,
      outcome: `The audit delivered a thirty-slide deck including the full competitive matrix, channel-by-channel performance breakdown, SWOT, Meta Ads audit findings, and five prioritised recommendations ranked by impact-to-effort ratio. The headline recommendation — an original GTA-style narrative campaign called The Origin Story — became the centrepiece of the deliverable and is documented as a separate project entry in this portfolio.

The work demonstrated that Pablo & Abdo's TikTok channel was the single most underutilised asset in their stack: a 70K follower base producing only 4% of total content output. Reallocating 30% of Instagram promotional posts to native TikTok was projected to lift overall reach by an estimated 18–25% within one quarter, based on benchmarks from comparable F&B brands in the competitive set.`,
      keyTakeaways: `Audience size without content discipline is wasted distribution.
TikTok was Pablo & Abdo's most underutilised asset — 70K followers, minimal native output.
Meta Ads were running without a funnel — awareness, consideration and conversion creative were cannibalising each other.
The brand's origin story was the single biggest untapped emotional hook.
Prioritised recommendations beat laundry lists — five clear moves ranked by impact-to-effort.`,
      galleryImages: '',
      order: 1,
      featured: true,
    },
    {
      category: 'Campaign Concept',
      title: 'The Origin Story — Pablo & Abdo Campaign',
      slug: 'pablo-abdo-origin-story',
      description: "Original campaign concept built on GTA-style narrative: Pablo (modern city) meets Abdo (chaotic Cairo streets) through a digital glitch that merges two worlds — culminating in the birth of the restaurant. Designed for Reels, TikTok, and short-form series. Addresses the brand's untold origin story gap.",
      tags: 'Brand Storytelling,Content Strategy,Social Media',
      imageUrl: '/logos/pablo-abdo-logo.png',
      client: 'Pablo & Abdo (F&B — Burger Concept)',
      timeline: 'Concept Phase',
      role: 'Campaign Strategist & Concept Writer',
      overview: `The Origin Story is an original campaign concept developed as the headline recommendation of the Pablo & Abdo brand audit. The brand had a strong visual identity and an active audience, but no narrative backbone — customers knew the logo, not the story. The Origin Story fills that gap with a culturally-rooted, platform-native narrative designed to live across Reels, TikTok, and a short-form series.

The concept uses a GTA-style narrative device: two characters from parallel worlds — Pablo, who lives in a sleek modern city, and Abdo, who lives in chaotic Cairo — collide through a digital glitch that merges their worlds. The collision produces something new: the restaurant itself. The campaign is structured as a serialised short-form series, with each episode driving a specific brand or product message while building the overarching narrative.`,
      challenge: `The brief was simple but hard: take a burger restaurant with a recognisable logo and an active social following, and give it a story that audiences actually want to follow. The brand's existing content was functional — product shots, promotions, the occasional UGC repost — but had no emotional spine. Audiences were engaging with individual posts but not with the brand as a character.

The second challenge was platform fit. The concept needed to live natively on TikTok and Reels, which meant short-form, hook-driven, and culturally relatable — not a polished TV-style ad dropped onto social. It also needed to feel authentic to an Egyptian audience, not a translated global concept.`,
      approach: `I started from the brand name itself. Pablo and Abdo are two names from two cultural worlds — one Western-coded, one Egyptian — sitting side by side in the logo. That juxtaposition was already doing narrative work; the campaign just had to bring it to life.

The GTA framing solved two problems at once. First, it gave the concept a visual language — split-screen, parallel worlds, digital glitch transitions — that was native to short-form social and instantly recognisable to a young Egyptian audience. Second, it gave the brand a generative narrative engine: Pablo and Abdo could keep colliding in different contexts, producing an endless run of episodes without the concept getting stale.

The series was structured in three-episode arcs: setup, collision, resolution. Each arc would land a specific product or brand message — a new menu item, a price promotion, a brand value — while advancing the meta-story. The pilot arc was scripted in detail, with storyboards and platform-specific cutdowns for TikTok, Reels, and YouTube Shorts.`,
      outcome: `The deliverable was a full campaign concept document including the narrative bible, character descriptions, pilot arc script, storyboards, platform cutdown strategy, and UGC amplification plan. The concept was positioned as the centrepiece recommendation of the broader Pablo & Abdo brand audit.

The campaign's strength is its extensibility. Unlike a one-shot ad, The Origin Story is a narrative asset that can run for months — each new episode adding depth to the brand while driving a specific commercial message. The GTA-inspired visual language also makes the content instantly recognisable in feed, addressing the share-of-voice problem identified in the audit.`,
      keyTakeaways: `Brand names already contain narrative — Pablo × Abdo was a story waiting to be told.
GTA framing solved platform-fit and cultural-authenticity in one move.
Serialised short-form beats one-shot ads for sustained brand building.
Three-episode arcs balance narrative depth with platform-native pacing.
A narrative engine — not a single creative — is what scales.`,
      galleryImages: '',
      order: 2,
      featured: true,
    },
    {
      category: 'Brand Audit',
      title: 'Maine — Brand Overview & Campaign Analysis',
      slug: 'maine-brand-audit',
      description: "A full audit of Maine's premium smash burger brand: business model, 4-6% engagement rate analysis, content mix breakdown (35% product, 28% reels, 12% UGC), competitor mapping against JJ's, 3 Diner, and Just Smash. Identified TikTok as an underutilized channel and designed a World Cup campaign with multi-touchpoint mechanics.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      imageUrl: '/logos/maine-logo.png',
      client: 'Maine (Premium Smash Burger Concept)',
      timeline: 'Portfolio Case Study',
      role: 'Brand Analyst & Campaign Designer',
      overview: `Maine is a premium smash burger brand operating in the Egyptian market, positioned at the intersection of quality-led fast-casual and social-first brand building. This case study was a full audit covering business model, social performance, content mix, competitive positioning, and campaign opportunity — ending in an original World Cup campaign concept designed to drive awareness and footfall across the tournament window.

The brand's social presence showed strong fundamentals — a 4–6% engagement rate, well above the F&B category benchmark — but the content mix was heavily skewed toward product photography (35%) at the expense of more shareable formats like reels (28%) and UGC (12%). The audit identified this imbalance, along with an underutilised TikTok presence, as the two highest-leverage opportunities for growth.`,
      challenge: `Maine's challenge was the classic premium F&B trap: a high-quality product with a loyal following, but a content strategy that was more catalogue than conversation. The team was posting beautiful burger photography on a regular cadence, but the audience had limited reasons to share, save, or return. The brand was building appetite, not building story.

The competitive landscape added pressure. JJ's, 3 Diner, and Just Smash were all chasing the same premium smash burger audience, with similar visual codes (dark backgrounds, melted cheese close-ups, indie soundtrack reels). Standing out required either a sharper content strategy, a sharper campaign, or both. The audit was commissioned to figure out which.`,
      approach: `The audit was structured in five layers.

First, a business model review — how Maine makes money, what the unit economics look like, where the growth bottlenecks are. Second, a quantitative social audit pulling six months of content and computing engagement rate, content mix, posting cadence, and follower growth across Instagram and TikTok. Third, a competitive mapping exercise benchmarking Maine against JJ's, 3 Diner, and Just Smash on the same metrics.

Fourth, a content mix analysis breaking down the 35/28/12 split between product, reels, and UGC, with engagement rates per category — confirming that reels were the highest-performing format but the lowest-volume one. Fifth, a TikTok opportunity assessment showing that Maine's TikTok presence was a fraction of its Instagram, despite TikTok being where the category's conversation was happening.

The output closed with an original World Cup campaign concept — a branded newspaper distributed during the tournament, featuring match updates alongside hidden discount codes, with a prediction draw mechanic to drive repeat visits across the four-week window.`,
      outcome: `The audit delivered a full brand overview deck including the business model review, social performance dashboard, competitive matrix, content mix analysis, TikTok opportunity assessment, and the World Cup campaign concept with multi-touchpoint mechanics.

The headline finding — that Maine's content mix was inverted relative to engagement performance — gave the team a clear, data-backed mandate to rebalance toward reels and UGC. The World Cup campaign provided a time-bound activation that could be executed within one quarter, with the prediction draw mechanic specifically designed to drive repeat footfall across the tournament rather than a one-off spike.`,
      keyTakeaways: `Engagement rate of 4–6% is strong — the issue was content mix, not audience.
Product photography was over-indexed (35%); reels (28%) were under-indexed despite outperforming on engagement.
TikTok was the highest-leverage channel — present but underinvested.
A tournament-length campaign beats a one-off activation for sustained footfall.
Multi-touchpoint mechanics (newspaper + hidden code + prediction draw) compound engagement.`,
      galleryImages: '',
      order: 3,
      featured: true,
    },
    {
      category: 'Campaign',
      title: 'Pizza Station — Strategy & Repositioning',
      slug: 'pizza-station-strategy',
      description: "An audit of Egypt's first NY-style pizza chain (est. 2002). Identified critical issues — quality control complaints, visual identity overlap with competitors using the same red & white palette, and low campaign ROI despite prize incentives. Designed two campaign concepts: a viral referral-mechanic challenge and a BTS kitchen transparency series.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      imageUrl: '/logos/pizza-station-logo.png',
      client: 'Pizza Station (NY-Style Pizza Chain, est. 2002)',
      timeline: 'Portfolio Case Study',
      role: 'Brand Strategist & Campaign Designer',
      overview: `Pizza Station is Egypt's first NY-style pizza chain, founded in 2002 and operating multiple branches across Cairo. Despite two decades of brand equity and a recognisable product, the brand was showing signs of strategic drift — quality control complaints on social, visual identity overlap with competitors using the same red-and-white palette, and campaign ROI that wasn't justifying the prize spend behind it. This case study was a full strategic audit ending in two campaign concepts designed to address the brand's two biggest gaps: trust and differentiation.

The first concept — "طلع المستخبي" (Find the Hidden One) — is a viral referral-mechanic challenge built around a split-screen puzzle. The second — "Ticket to Pizza" — is a 60-second BTS kitchen series designed to tackle the quality trust issue head-on by showing the kitchen, the ingredients, and the people behind the product.`,
      challenge: `Pizza Station's challenges operated on three layers.

The first was product trust. Social listening surfaced a recurring pattern of quality control complaints — cold pizza on delivery, inconsistent topping portions, slow service during peak hours. These were not isolated incidents but a systemic signal that the brand's operational quality was drifting out of sync with its premium positioning.

The second was visual differentiation. Pizza Station's red-and-white palette was nearly identical to at least three direct competitors in the Egyptian pizza market. In feed, the brand was functionally invisible — a customer scrolling past a Pizza Station post and a competitor post would struggle to tell them apart.

The third was campaign efficiency. Recent promotions had been prize-led — large giveaways with high production costs — but the ROI was weak. The mechanics were driving one-off transactions, not repeat visits, and the prize structure was attracting deal-hunters rather than loyal customers.`,
      approach: `The audit was structured to surface each of the three challenges with data, then design a campaign concept addressing each one directly.

For the trust issue, I designed "Ticket to Pizza" — a 60-second BTS kitchen series shot documentary-style, showing the dough being made, the ingredients being prepped, and the team working the line during a real service. The format was chosen specifically because it does the one thing polished ads cannot: it shows the truth. If the kitchen is clean and the team is skilled, the trust problem solves itself. If it isn't, no ad campaign can save the brand.

For the differentiation and ROI issues, I designed "طلع المستخبي" — a split-screen interactive challenge where users find a hidden small pizza inside a larger Pizza Station image to unlock a 10% discount. Each solver receives a unique promo code they can share with friends, who also get discounts when they solve it, chained up to 70% off. The mechanic creates an organic referral loop — the brand only pays discount when acquisition happens — and the visual puzzle format is native to social feeds in a way that red-and-white product photography is not.

The two concepts are designed to run in parallel: Ticket to Pizza building trust over months, طلع المستخبي driving acquisition in bursts.`,
      outcome: `The deliverable was a full strategic audit deck including the social listening findings, competitive visual analysis, campaign ROI breakdown, and the two campaign concepts with mechanics, storyboards, and rollout plans.

The "طلع المستخبي" concept is the strongest referral mechanic in the project portfolio because it aligns cost with outcome — the brand only pays discount when a new customer is acquired, and the discount itself is gated behind an engagement action that creates investment in the brand. The "Ticket to Pizza" concept addresses the harder, slower problem of trust with the only tool that actually works: transparency.`,
      keyTakeaways: `Trust problems can't be solved with ads — only transparency works.
Referral mechanics should align cost with acquisition, not with impressions.
Red-and-white pizza branding is functionally invisible — differentiation has to come from format, not palette.
Prize-led promotions attract deal-hunters, not loyal customers.
Two campaigns running in parallel — one for trust, one for acquisition — beats a single hybrid push.`,
      galleryImages: '',
      order: 4,
      featured: true,
    },
    {
      category: 'Research',
      title: 'Impact of AI on Smart Business Solutions',
      slug: 'ai-smart-business-solutions',
      description: 'Research paper evaluating AI adoption trends across business tools, their strategic impact on brand operations, and practical implementation recommendations. Structured analytical report with competitive and market intelligence synthesis.',
      tags: 'Market Intelligence,Strategic Analysis,Research',
      imageUrl: '/logos/ai-business-logo.png',
      client: 'Academic / Industry Research',
      timeline: 'Research Project',
      role: 'Independent Researcher',
      overview: `This research project evaluates the impact of artificial intelligence on smart business solutions — how AI is being adopted across enterprise tools, what strategic implications that adoption carries for brand operations, and what practical implementation paths make sense for organisations looking to integrate AI without becoming a cautionary tale.

The work synthesises competitive and market intelligence from across the AI-in-business landscape, structured as an analytical report rather than a marketing document. The goal is to give a reader — whether a marketing leader, a business development manager, or a founder — a clear, honest picture of where AI is actually creating value in business operations today, and where the hype is outrunning the substance.`,
      challenge: `The AI-in-business conversation in 2024–2025 has a signal-to-noise problem. Every vendor is rebranding their feature list as "AI-powered," every consultancy is publishing thought leadership, and every LinkedIn post is announcing a revolution. The actual signal — which categories of AI tool are producing measurable business impact, which are still experimental, and which are actively counterproductive — is buried under the noise.

The research challenge was to cut through that noise and produce a document that an operator could actually use to make decisions. That meant being honest about what AI does well, what it does badly, and what it does dangerously — and tying each finding back to a concrete business context rather than speaking in abstractions.`,
      approach: `The research was structured in four phases.

The first was a landscape scan — mapping the major categories of AI-powered business tools (customer service, content generation, analytics, sales automation, operations) and identifying the leading vendors and open-source projects in each. The second was a competitive intelligence pass — looking at how specific companies in each category were actually using these tools, what results they were reporting, and where the gaps between vendor claims and operational reality were showing up.

The third was a market intelligence synthesis — pulling together analyst reports, earnings calls, vendor case studies, and independent assessments into a single picture of where the market is, where it's going, and what the adoption curve looks like across company sizes and industries. The fourth was the practical layer — translating the synthesis into implementation recommendations a real organisation could act on, including build-vs-buy guidance, change management considerations, and risk factors to watch for.

The output is structured to be read either end-to-end or as a reference — each section stands alone.`,
      outcome: `The deliverable is a structured analytical report covering AI adoption trends, strategic impact on brand operations, and practical implementation recommendations. The report's value is in its honesty: rather than presenting AI as either a silver bullet or a threat, it categorises applications by maturity and impact, giving the reader a usable map of where to invest, where to wait, and where to be cautious.

The research feeds directly into the broader portfolio theme — understanding how technology, brand, and operations intersect. AI is not a marketing tactic; it is a capability layer that touches every part of how a modern business operates, and the brands that win will be the ones that integrate it deliberately rather than reactively.`,
      keyTakeaways: `AI vendor claims outrun operational reality — independent verification is non-negotiable.
Customer service and content generation are the highest-maturity AI use cases today.
Analytics and sales automation are mid-maturity — promising but uneven.
Build-vs-buy decisions should be driven by data sensitivity, not by feature lists.
Change management is the bottleneck, not the technology itself.`,
      galleryImages: '',
      order: 5,
      featured: true,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: `project-${p.order}` },
      update: {},
      create: { id: `project-${p.order}`, ...p },
    });
  }

  // Create experiences with real content
  const experiences = [
    {
      role: 'Customer Relationship Manager',
      company: 'Confidential — Marketing Operations, Giza',
      period: 'Sep 2023 — Feb 2025',
      description: `Monitored and analysed client interaction data weekly, identifying trends and delivering actionable insights to team leadership — directly applicable to campaign performance monitoring.
Managed concurrent operational workflows across multiple client accounts with structured records, task tracking, and timely resolution.
Coordinated with internal teams and third-party vendors through structured communication channels to ensure alignment on deliverables.
Promoted within 12 months based on consistent output quality and demonstrated accountability in a high-volume environment.`,
      highlights: 'CRM,Analytics,Vendor Coordination',
      order: 1,
    },
    {
      role: 'Sales & Marketing Supervisor',
      company: 'Mining City, Cairo',
      period: 'Nov 2019 — Dec 2020',
      description: `Planned and executed BTL promotional campaigns for investment products, managing full delivery from strategy through on-ground activation.
Led a team of 10, setting performance targets, tracking KPIs, and ensuring brand messaging consistency across all promotional materials.
Conducted competitive market analysis to identify positioning opportunities and inform campaign direction.
Produced regular performance reports summarising team and campaign metrics to support senior-level decision-making.`,
      highlights: 'BTL Campaigns,Team Leadership,KPI Tracking',
      order: 2,
    },
    {
      role: 'Marketing Intern',
      company: 'Elsewedy Trading Enterprises, Cairo',
      period: 'Jun 2023 — Jul 2023',
      description: `Supported the brand team in planning and deploying paid advertising campaigns across digital channels.
Conducted competitive intelligence research to identify market opportunities and emerging consumer trends.
Contributed customer acquisition ideas that were adopted into the team's promotional strategy.`,
      highlights: 'Paid Ads,Competitive Research,Campaign Support',
      order: 3,
    },
    {
      role: 'Business Development Intern',
      company: 'Scientific and Trading, Cairo',
      period: 'Feb 2023 — Mar 2023',
      description: `Conducted market research and competitor benchmarking to support brand positioning and sales initiatives.
Assisted in preparing marketing and sales presentations for external partners and prospects.
Supported lead generation activities using a structured, data-driven approach to prospect identification.`,
      highlights: 'Market Research,BD,Pitch Support',
      order: 4,
    },
    {
      role: 'Operations Intern',
      company: 'Xerox IBSX, Cairo',
      period: 'May 2022 — Jun 2022',
      description: `Coordinated internal meetings, communications, and cross-departmental administrative workflows.
Maintained organised documentation and file systems, contributing to measurable improvements in operational efficiency.`,
      highlights: 'Operations,Documentation,Process Improvement',
      order: 5,
    },
  ];

  for (const e of experiences) {
    await prisma.experience.upsert({
      where: { id: `exp-${e.order}` },
      update: {},
      create: { id: `exp-${e.order}`, ...e },
    });
  }

  // Create campaigns with real content
  const campaigns = [
    {
      title: 'The Origin Story — GTA-Style Narrative Campaign',
      subtitle: 'Pablo & Abdo Brand Narrative',
      description: "A multi-format campaign concept anchored in the brand's untapped GTA DNA. Two characters from parallel worlds — modern and chaotic — collide through a digital glitch to create something new together. Designed to go viral through relatability, cultural duality, and serialised short-form content.",
      projectId: 'project-2',
      tags: 'TikTok Series,Instagram Reels,Brand Narrative',
      details: JSON.stringify({
        Objective: 'Brand Awareness',
        Format: 'Short-Film Series',
        Channels: 'TikTok · IG · FB',
        'UGC Potential': 'High — shareable',
      }),
      order: 1,
    },
    {
      title: '"أخبار كأس العالم" — World Cup Newspaper',
      subtitle: 'Maine World Cup Campaign',
      description: 'A branded newspaper distributed during the World Cup tournament, featuring match updates alongside hidden discount codes for Maine. Each edition included a prediction draw mechanic to drive repeat visits throughout the tournament.',
      projectId: 'project-3',
      tags: 'Print + Digital,Footfall Driver,Tournament-Length Engagement',
      details: JSON.stringify({
        Objective: 'Awareness + Footfall',
        Format: 'Branded Newspaper',
        Mechanic: 'Hidden Discount',
        Retention: 'Prediction Draw',
      }),
      order: 2,
    },
    {
      title: '"طلع المستخبي" — The Hidden Pizza Challenge',
      subtitle: 'Pizza Station Referral Campaign',
      description: 'A split-screen interactive challenge: find the hidden small pizza inside a larger Pizza Station image to unlock a 10% discount. Each solver receives a unique promo code they can share with friends — friends who solve it also get discounts, chained up to 70% off, creating an organic referral loop. Complemented by "Ticket to Pizza" — a 60-second BTS kitchen series tackling quality trust issues head-on.',
      projectId: 'project-4',
      tags: 'Interactive,Referral Mechanic,Viral Challenge',
      details: JSON.stringify({
        Objective: 'Footfall + Referral',
        Format: 'Interactive Challenge',
        Mechanic: 'Hidden Discount + Referral Loop',
        Trust: 'BTS Kitchen Series',
      }),
      order: 3,
    },
  ];

  for (const c of campaigns) {
    await prisma.campaign.upsert({
      where: { id: `campaign-${c.order}` },
      update: {},
      create: { id: `campaign-${c.order}`, ...c },
    });
  }

  // Create skill categories with real content
  const skillCategories = [
    {
      name: 'Marketing & Campaigns',
      skills: JSON.stringify(['BTL Campaign Execution', 'Campaign Strategy', 'Brand Analysis', 'Campaign Planning', 'Content Strategy', 'Brand Management']),
      order: 1,
    },
    {
      name: 'Digital & Paid Media',
      skills: JSON.stringify(['Meta Ads Manager', 'Social Media Strategy', 'Performance Reporting', 'SEO/SEM', 'UGC Strategy']),
      order: 2,
    },
    {
      name: 'Business Development',
      skills: JSON.stringify(['Market Research', 'Competitive Benchmarking', 'Sales Presentations', 'Lead Generation', 'Stakeholder Comms']),
      order: 3,
    },
    {
      name: 'Analytics & Tools',
      skills: JSON.stringify(['Microsoft Excel', 'PowerPoint / Decks', 'KPI Tracking', 'Data Analysis', 'Trend Analysis']),
      order: 4,
    },
    {
      name: 'Languages & Tools',
      skills: JSON.stringify(['Arabic (Native)', 'English (C1)', 'PowerPoint', 'Word']),
      order: 5,
    },
  ];

  for (const sc of skillCategories) {
    await prisma.skillCategory.upsert({
      where: { id: `skill-${sc.order}` },
      update: {},
      create: { id: `skill-${sc.order}`, ...sc },
    });
  }

  // Create education with real content
  const education = [
    {
      degree: 'Dual Degree — Marketing & International Business',
      institution: 'University of Greenwich / MSA University',
      year: '2019 — 2024',
      details: 'Brand Management · Marketing Strategy · Consumer Behaviour · Market Research · Digital Marketing · Financial Management · International Business',
      order: 1,
    },
  ];

  for (const e of education) {
    await prisma.education.upsert({
      where: { id: `edu-${e.order}` },
      update: {},
      create: { id: `edu-${e.order}`, ...e },
    });
  }

  // Auth note: AdminUser seeding has been removed.
  //
  // The dashboard auth flow now reads credentials from environment
  // variables (ADMIN_USERNAME + ADMIN_PASSWORD_HASH) instead of the
  // database — see src/app/api/auth/route.ts. This is more secure
  // (no plaintext password in the DB) AND more reliable (login works
  // even when the DB is unreachable).
  //
  // The AdminUser table still exists in schema.prisma for backward
  // compatibility, but is no longer seeded or queried. To set your
  // admin password:
  //   1. Run: npx tsx scripts/generate-password-hash.ts
  //   2. Set ADMIN_PASSWORD_HASH env var in Vercel (and .env locally)
  //   3. Optionally set ADMIN_USERNAME (defaults to "admin")
  //   4. Redeploy

  console.log('✅ Database seeded successfully!');
  console.log('   Note: Admin credentials are now managed via env vars.');
  console.log('   Run: npx tsx scripts/generate-password-hash.ts to set a new password.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
