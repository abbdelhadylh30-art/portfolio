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
      description: 'A comprehensive brand analysis asking: Is Pablo & Abdo reaching the right audience in the right way? Covered digital presence across Instagram (127K), TikTok (70K), and Facebook (55K), competitive mapping against 12+ F&B brands, SWOT breakdown, Meta Ads audit, and five concrete growth recommendations including an original campaign concept.',
      tags: 'Competitive Analysis,Digital Audit,Meta Ads,Campaign Strategy,Deck Design',
      imageUrl: '/images/pablo-abdo.jpg',
      order: 1,
      featured: true,
    },
    {
      category: 'Campaign Concept',
      title: 'The Origin Story — Pablo & Abdo Campaign',
      description: "Original campaign concept built on GTA-style narrative: Pablo (modern city) meets Abdo (chaotic Cairo streets) through a digital glitch that merges two worlds — culminating in the birth of the restaurant. Designed for Reels, TikTok, and short-form series. Addresses the brand's untold origin story gap.",
      tags: 'Brand Storytelling,Content Strategy,Social Media',
      imageUrl: '/images/pablo-abdo.jpg',
      order: 2,
      featured: true,
    },
    {
      category: 'Brand Audit',
      title: 'Maine — Brand Overview & Campaign Analysis',
      description: "A full audit of Maine's premium smash burger brand: business model, 4-6% engagement rate analysis, content mix breakdown (35% product, 28% reels, 12% UGC), competitor mapping against JJ's, 3 Diner, and Just Smash. Identified TikTok as an underutilized channel and designed a World Cup campaign with multi-touchpoint mechanics.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      imageUrl: '/images/maine.jpg',
      order: 3,
      featured: true,
    },
    {
      category: 'Campaign',
      title: 'Pizza Station — Strategy & Repositioning',
      description: "An audit of Egypt's first NY-style pizza chain (est. 2002). Identified critical issues — quality control complaints, visual identity overlap with competitors using the same red & white palette, and low campaign ROI despite prize incentives. Designed two campaign concepts: a viral referral-mechanic challenge and a BTS kitchen transparency series.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      imageUrl: '/images/pizza-station.jpg',
      order: 4,
      featured: true,
    },
    {
      category: 'Research',
      title: 'Impact of AI on Smart Business Solutions',
      description: 'Research paper evaluating AI adoption trends across business tools, their strategic impact on brand operations, and practical implementation recommendations. Structured analytical report with competitive and market intelligence synthesis.',
      tags: 'Market Intelligence,Strategic Analysis,Research',
      imageUrl: '/images/ai-business.jpg',
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

  // Create default admin user
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123',
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
