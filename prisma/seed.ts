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
      bio: "I'm a marketing and business development professional with hands-on experience across FMCG, B2B, and digital industries. My work spans from executing below-the-line campaigns and supervising sales teams to conducting brand audits and designing creative campaign concepts for F&B brands.\n\nWith a dual degree in Marketing & International Business from the University of Greenwich and MSA University, I combine academic rigour with practical execution. I believe the best marketing strategies are built on solid research, creative storytelling, and measurable outcomes.\n\nWhether it's analysing competitor positioning, designing a World Cup newspaper campaign, or building a referral-loop mechanic for a pizza chain, I approach every project with the same principle: understand the problem deeply, then solve it creatively.",
      heroSubtitle: 'Marketing & Business Development',
      quote: 'Understand the problem deeply, then solve it creatively.',
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

  // Create projects
  const projects = [
    {
      category: 'Brand Audit',
      title: 'Maine — Brand Overview & Campaign Analysis',
      description: "A full audit of Maine's premium smash burger brand: business model, 4-6% engagement rate analysis, content mix breakdown (35% product, 28% reels, 12% UGC), competitor mapping against JJ's, 3 Diner, and Just Smash. Identified TikTok as an underutilized channel and designed a World Cup campaign with multi-touchpoint mechanics.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      order: 1,
    },
    {
      category: 'Digital',
      title: 'Pablo & Abdo — Digital Presence Audit',
      description: "The core question: Is Pablo & Abdo reaching the right audience in the right way? Mapped digital presence across Instagram (127K), TikTok (70K), and Facebook (55K), competitive analysis against 12+ F&B brands in two categories, SWOT breakdown, Meta Ads audit, and identified an untapped origin story opportunity that became the GTA-style campaign concept.",
      tags: 'Competitive Analysis,Digital Audit,Meta Ads',
      order: 2,
    },
    {
      category: 'Campaign',
      title: 'Pizza Station — Strategy & Repositioning',
      description: "An audit of Egypt's first NY-style pizza chain (est. 2002). Identified critical issues — quality control complaints, visual identity overlap with competitors using the same red & white palette, and low campaign ROI despite prize incentives. Designed two campaign concepts: a viral referral-mechanic challenge and a BTS kitchen transparency series.",
      tags: 'Brand Audit,Competitive Analysis,Campaign Design',
      order: 3,
    },
    {
      category: 'Research',
      title: 'Impact of AI on Smart Business Solutions',
      description: 'Research project exploring how artificial intelligence is transforming business operations, decision-making processes, and competitive strategy across industries.',
      tags: 'Research,AI,Business Strategy',
      order: 4,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: `project-${p.order}` },
      update: {},
      create: { id: `project-${p.order}`, ...p },
    });
  }

  // Create experiences
  const experiences = [
    {
      role: 'Customer Relationship Manager',
      company: 'FMCG Sector',
      period: '2023 — Present',
      description: 'Managing key client relationships and driving customer retention strategies across the FMCG portfolio.',
      highlights: 'Led CRM initiatives,Supervised 10+ team members,Implemented loyalty programs',
      order: 1,
    },
    {
      role: 'Sales & Marketing Supervisor',
      company: 'B2B Sector',
      period: '2021 — 2023',
      description: 'Supervised sales teams and executed below-the-line marketing campaigns for B2B clients.',
      highlights: 'Campaign execution,Sales team leadership,Client acquisition',
      order: 2,
    },
    {
      role: 'Marketing Intern',
      company: 'Digital Agency',
      period: '2020 — 2021',
      description: 'Gained hands-on experience in digital marketing, social media management, and brand audits.',
      highlights: 'Social media management,Brand audits,Content creation',
      order: 3,
    },
    {
      role: 'Business Development Intern',
      company: 'Corporate',
      period: '2019 — 2020',
      description: 'Supported business development activities including market research and competitor analysis.',
      highlights: 'Market research,Competitor analysis,Strategic planning',
      order: 4,
    },
    {
      role: 'Operations Intern',
      company: 'Operations',
      period: '2018 — 2019',
      description: 'Gained foundational understanding of operational processes and supply chain management.',
      highlights: 'Process optimization,Supply chain,Quality control',
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

  // Create campaigns
  const campaigns = [
    {
      title: '"أخبار كأس العالم" — World Cup Newspaper',
      subtitle: 'Maine World Cup Campaign',
      description: 'A branded newspaper distributed during the World Cup tournament, featuring match updates alongside hidden discount codes for Maine. Each edition included a prediction draw mechanic to drive repeat visits throughout the tournament.',
      projectId: 'project-1',
      tags: 'Print + Digital,Footfall Driver,Tournament-Length Engagement',
      details: JSON.stringify({
        objective: 'Awareness + Footfall',
        format: 'Branded Newspaper',
        mechanic: 'Hidden Discount',
        retention: 'Prediction Draw',
      }),
      order: 1,
    },
    {
      title: 'The Origin Story — GTA-Style Narrative Campaign',
      subtitle: 'Pablo & Abdo Brand Narrative',
      description: 'A GTA-style short film series telling the origin story of Pablo & Abdo. Designed for TikTok and Instagram Reels, each episode reveals a chapter of the founders\' journey, creating shareable content with high UGC potential.',
      projectId: 'project-2',
      tags: 'TikTok Series,Instagram Reels,Brand Narrative',
      details: JSON.stringify({
        objective: 'Brand Awareness',
        format: 'Short-Film Series',
        channels: 'TikTok · IG · FB',
        ugcPotential: 'High — Shareable',
      }),
      order: 2,
    },
    {
      title: '"طلع المستخبي" — The Hidden Pizza Challenge',
      subtitle: 'Pizza Station Referral Campaign',
      description: 'A split-screen interactive challenge: find the hidden small pizza inside a larger Pizza Station image to unlock a 10% discount. Each solver receives a unique promo code they can share with friends — friends who solve it also get discounts, chained up to 70% off, creating an organic referral loop. The audience names the promo codes themselves, building ownership and investment in the campaign. Complemented by "Ticket to Pizza" — a 60-second BTS kitchen series tackling quality trust issues head-on.',
      projectId: 'project-3',
      tags: 'Interactive,Referral Mechanic,Viral Challenge',
      details: JSON.stringify({
        objective: 'Footfall + Referral',
        format: 'Interactive Challenge',
        mechanic: 'Hidden Discount + Referral Loop',
        trust: 'BTS Kitchen Series',
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

  // Create skill categories
  const skillCategories = [
    {
      name: 'Marketing & Campaigns',
      skills: JSON.stringify(['Brand Audits', 'Campaign Design', 'Content Strategy', 'BTL Execution', 'Competitive Analysis', 'SWOT Analysis']),
      order: 1,
    },
    {
      name: 'Digital & Paid Media',
      skills: JSON.stringify(['Meta Ads', 'Social Media Management', 'SEO/SEM', 'TikTok Marketing', 'UGC Strategy', 'Influencer Outreach']),
      order: 2,
    },
    {
      name: 'Business Development',
      skills: JSON.stringify(['Client Relations', 'Market Research', 'Lead Generation', 'Strategic Partnerships', 'Pitch Decks', 'Proposal Writing']),
      order: 3,
    },
    {
      name: 'Analytics & Tools',
      skills: JSON.stringify(['Google Analytics', 'Meta Business Suite', 'Excel/Sheets', 'Canva', 'PowerPoint', 'CRM Systems']),
      order: 4,
    },
  ];

  for (const sc of skillCategories) {
    await prisma.skillCategory.upsert({
      where: { id: `skill-${sc.order}` },
      update: {},
      create: { id: `skill-${sc.order}`, ...sc },
    });
  }

  // Create education
  const education = [
    {
      degree: 'Dual Degree — Marketing & International Business',
      institution: 'University of Greenwich & MSA University',
      year: 'Graduated',
      details: 'Combined academic rigour in marketing strategy and international business with practical application through live projects and internships.',
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

  // Create default admin user (password: admin123)
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
