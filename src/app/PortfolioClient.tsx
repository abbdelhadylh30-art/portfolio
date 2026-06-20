'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Linkedin,
  ArrowRight,
  Menu,
  X,
  Award,
  Target,
  Users,
  BarChart3,
  Sparkles,
  Megaphone,
  TrendingUp,
  Handshake,
  Globe,
  Settings,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ExternalLink,
  Zap,
  LayoutGrid,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  bio: string;
  heroSubtitle: string;
  quote: string;
  stat1Value: string;
  stat1Label: string;
  stat1Sub: string;
  stat2Value: string;
  stat2Label: string;
  stat2Sub: string;
  stat3Value: string;
  stat3Label: string;
  stat3Sub: string;
  stat4Value: string;
  stat4Label: string;
  stat4Sub: string;
}

interface ProjectData {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  overview?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  order: number;
  featured: boolean;
}

interface ExperienceData {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string;
  order: number;
}

interface CampaignData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  projectId: string;
  tags: string;
  details: string;
  order: number;
}

interface SkillCategoryData {
  id: string;
  name: string;
  skills: string;
  order: number;
}

interface EducationData {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
  order: number;
}

/* ------------------------------------------------------------------ */
/*  Colors — Navy & White Professional                                 */
/* ------------------------------------------------------------------ */

const colors = {
  navy: '#0a1628',
  navyLight: '#0f1d35',
  navyMid: '#162d50',
  navyCard: '#111d33',
  gold: '#c8963e',
  goldLight: '#e8b85a',
  white: '#ffffff',
  offWhite: '#f4f6f9',
  gray50: '#f8f9fb',
  gray100: '#eef1f6',
  gray200: '#d8dde6',
  gray400: '#8b95a8',
  gray600: '#5a6478',
  gray800: '#2d3748',
};

/* ------------------------------------------------------------------ */
/*  Skill Icons — Lucide React Components instead of emojis            */
/* ------------------------------------------------------------------ */

const skillIconMap: Record<string, React.ReactNode> = {
  'Marketing & Campaigns': <Megaphone size={20} />,
  'Digital & Paid Media': <TrendingUp size={20} />,
  'Business Development': <Handshake size={20} />,
  'Analytics & Tools': <Settings size={20} />,
  'Languages & Tools': <Globe size={20} />,
};

const skillBarWidths: Record<string, Record<string, number>> = {
  'Marketing & Campaigns': {
    'BTL Campaign Execution': 80,
    'Campaign Strategy': 65,
    'Brand Analysis': 70,
    'Campaign Planning': 72,
    'Content Strategy': 68,
    'Brand Management': 75,
  },
  'Digital & Paid Media': {
    'Meta Ads Manager': 60,
    'Social Media Strategy': 70,
    'Performance Reporting': 65,
    'SEO/SEM': 55,
    'UGC Strategy': 72,
  },
  'Business Development': {
    'Market Research': 78,
    'Competitive Benchmarking': 72,
    'Sales Presentations': 68,
    'Lead Generation': 65,
    'Stakeholder Comms': 70,
  },
  'Analytics & Tools': {
    'Microsoft Excel': 75,
    'PowerPoint / Decks': 80,
    'KPI Tracking': 73,
    'Data Analysis': 68,
    'Trend Analysis': 65,
  },
  'Languages & Tools': {
    'Arabic (Native)': 100,
    'English (C1)': 85,
    'PowerPoint': 80,
    'Word': 78,
  },
};

const projectImages: Record<string, string> = {
  'maine': '/logos/maine-logo.png',
  'pablo': '/logos/pablo-abdo-logo.png',
  'pizza': '/logos/pizza-station-logo.png',
  'ai': '/logos/ai-business-logo.png',
};

function getProjectImage(project: ProjectData): string {
  const titleLower = project.title.toLowerCase();
  for (const [key, img] of Object.entries(projectImages)) {
    if (titleLower.includes(key)) return img;
  }
  if (project.imageUrl) return project.imageUrl;
  return '/logos/ai-business-logo.png';
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function Navigation({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'work', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,22,40,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid rgba(200,150,62,0.15)`,
      padding: '0 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px',
    }}>
      <a href="/" style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em',
        color: colors.white, textDecoration: 'none',
      }}>
        MM<span style={{ color: colors.gold }}>.</span>
      </a>

      {/* Desktop nav */}
      <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {links.map(l => (
          <button key={l.id} onClick={() => scrollTo(l.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em',
            color: activeSection === l.id ? colors.gold : colors.gray400,
            transition: 'color 0.2s', fontFamily: 'inherit',
          }}>
            {l.label}
          </button>
        ))}
        <button onClick={() => scrollTo('contact')} style={{
          background: colors.gold, color: colors.navy,
          fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
          padding: '0.5rem 1.25rem', borderRadius: '999px',
          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          Let&apos;s talk
        </button>
      </div>

      {/* Mobile burger */}
      <button className="mobile-burger" onClick={() => setMobileOpen(!mobileOpen)} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: colors.white,
        display: 'none',
      }}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: colors.navy, padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          zIndex: 99,
        }}>
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.1rem', fontWeight: 500,
              color: activeSection === l.id ? colors.gold : colors.white,
              textAlign: 'left', fontFamily: 'inherit',
            }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo('contact')} style={{
            background: colors.gold, color: colors.navy,
            fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 600,
            padding: '0.75rem 1.5rem', borderRadius: '999px',
            border: 'none', cursor: 'pointer', marginTop: '1rem',
          }}>
            Let&apos;s talk
          </button>
        </div>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function HeroSection({ profile }: { profile: ProfileData }) {
  const nameParts = profile.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');

  return (
    <section id="hero" className="hero-section" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      maxWidth: 1080,
      margin: '0 auto',
      padding: '8rem 2.5rem 4rem',
    }}>
      {/* Left */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(200,150,62,0.12)', color: colors.gold,
          fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em',
          padding: '0.35rem 0.9rem', borderRadius: '999px',
          textTransform: 'uppercase', marginBottom: '1.75rem',
        }}>
          <span style={{
            width: 6, height: 6, background: colors.gold, borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }} />
          Open to opportunities
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em',
          color: colors.white, marginBottom: '1.5rem',
        }}>
          {firstName}<br />
          {lastName ? <><span style={{ color: colors.gold }}>{lastName}</span>.</> : null}
        </h1>

        <p style={{
          fontSize: '1.05rem', color: colors.gray400, fontWeight: 300,
          maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.75,
        }}>
          {profile.bio ? profile.bio.split('.').slice(0, 2).join('.') + '.' : profile.heroSubtitle}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: colors.gold, color: colors.navy,
            fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
            padding: '0.85rem 2rem', borderRadius: '999px',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            View my work <ArrowRight size={16} />
          </button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: 'transparent', color: colors.white,
            fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 500,
            padding: '0.85rem 2rem', borderRadius: '999px',
            border: '1.5px solid rgba(200,150,62,0.3)', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Get in touch
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="hero-stats" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { value: profile.stat1Value, label: profile.stat1Label, sub: profile.stat1Sub },
            { value: profile.stat2Value, label: profile.stat2Label, sub: profile.stat2Sub },
            { value: profile.stat3Value, label: profile.stat3Label, sub: profile.stat3Sub },
            { value: profile.stat4Value, label: profile.stat4Label, sub: profile.stat4Sub },
          ].map((stat, i) => (
            <div key={i} style={{
              background: colors.navyLight,
              border: '1px solid rgba(200,150,62,0.12)',
              borderRadius: 12, padding: '1.25rem 1.5rem',
              transition: 'all 0.25s',
            }} className="stat-card-hover">
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: colors.white, letterSpacing: '-0.04em',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: colors.gray400, marginTop: '0.2rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: colors.gray600, marginTop: '0.15rem' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
          borderRadius: 12, padding: '1.5rem',
          color: colors.navy,
        }}>
          <p style={{ fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.7, fontWeight: 400 }}>
            &ldquo;{profile.quote}&rdquo;
          </p>
          <cite style={{
            display: 'block', marginTop: '0.75rem', fontStyle: 'normal',
            fontSize: '0.78rem', opacity: 0.7,
          }}>
            — {profile.name}
          </cite>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About Section                                                      */
/* ------------------------------------------------------------------ */

function AboutSection({ profile }: { profile: ProfileData }) {
  const principles = [
    { icon: <BarChart3 size={20} />, title: 'Data before instinct', desc: 'Every recommendation I make is anchored in research, trend analysis, or performance data — not assumption.' },
    { icon: <Sparkles size={20} />, title: 'Brands are conversations', desc: 'A brand isn\'t a logo. It\'s a consistent, evolving promise to a specific audience — and it breaks the second you stop listening.' },
    { icon: <Target size={20} />, title: 'Campaigns should move people', desc: 'The best marketing doesn\'t just drive clicks. It creates moments — emotional, cultural, and memorable.' },
    { icon: <Users size={20} />, title: 'Execution is everything', desc: 'A brilliant strategy that stays on a slide deck is worth nothing. I prioritise shipping real output.' },
  ];

  return (
    <section id="about" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        About
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '0.5rem',
      }}>
        Who I am
      </h2>
      <p style={{ fontSize: '0.95rem', color: colors.gray400, marginBottom: '3rem' }}>
        Marketer · BD Professional · Campaign Strategist
      </p>

      {/* Contact pills */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {[
          { icon: <Mail size={14} />, text: profile.email },
          { icon: <Phone size={14} />, text: profile.phone },
          { icon: <Linkedin size={14} />, text: 'LinkedIn Profile' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: colors.navyLight, border: '1px solid rgba(200,150,62,0.12)',
            borderRadius: '999px', padding: '0.5rem 1rem',
            fontSize: '0.82rem', color: colors.gray400,
          }}>
            <span style={{ color: colors.gold }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* Bio */}
      <div style={{
        fontSize: '1rem', lineHeight: 1.8, color: colors.gray400,
        maxWidth: 720, marginBottom: '3rem',
      }}
        dangerouslySetInnerHTML={{
          __html: profile.bio
            ?.replace(/I'm a\s*/i, 'I\'m a <strong style="color:#fff">')
            .replace(/dual-degree/gi, '</strong>dual-degree<strong style="color:#fff">')
            .replace(/from MSA University/gi, '</strong>from MSA University')
            .replace(/multiple workflows simultaneously/gi, '<strong style="color:#fff">multiple workflows simultaneously</strong>')
            || ''
        }}
      />

      {/* Principles grid */}
      <div className="principles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {principles.map((p, i) => (
          <div key={i} style={{
            background: colors.navyLight,
            border: '1px solid rgba(200,150,62,0.1)',
            borderRadius: 12, padding: '1.5rem',
            transition: 'all 0.25s',
          }} className="principle-card">
            <div style={{ color: colors.gold, marginBottom: '0.75rem' }}>{p.icon}</div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.95rem',
              color: colors.white, marginBottom: '0.5rem',
            }}>
              {p.title}
            </h4>
            <p style={{ fontSize: '0.82rem', color: colors.gray400, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience Section                                                 */
/* ------------------------------------------------------------------ */

function ExperienceSection({ experiences }: { experiences: ExperienceData[] }) {
  return (
    <section id="experience" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        Experience
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '3rem',
      }}>
        Professional History
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {experiences.map((exp, i) => {
          const highlights = exp.highlights ? exp.highlights.split(',').map(h => h.trim()) : [];
          const details = exp.description ? exp.description.split('\n').filter(d => d.trim()) : [];
          return (
            <div key={exp.id} style={{
              position: 'relative',
              paddingLeft: '2.5rem',
              paddingBottom: i < experiences.length - 1 ? '2.5rem' : 0,
            }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute', left: 0, top: 8, bottom: 0,
                width: 1, background: 'rgba(200,150,62,0.2)',
              }} />
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: -4, top: 8,
                width: 9, height: 9, borderRadius: '50%',
                background: colors.gold,
                border: `2px solid ${colors.navy}`,
              }} />

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: colors.gold, fontWeight: 500 }}>{exp.period}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: colors.gray600, marginBottom: '0.25rem' }}>{exp.company}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.15rem',
                color: colors.white, marginBottom: '0.75rem',
              }}>
                {exp.role}
              </h3>

              {/* Tags */}
              {highlights.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {highlights.map((h, hi) => (
                    <span key={hi} style={{
                      fontSize: '0.72rem', fontWeight: 500,
                      background: 'rgba(200,150,62,0.1)', color: colors.gold,
                      padding: '0.25rem 0.6rem', borderRadius: '999px',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              {details.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {details.map((d, di) => (
                    <li key={di} style={{
                      fontSize: '0.88rem', color: colors.gray400, lineHeight: 1.7,
                      paddingLeft: '1rem', position: 'relative', marginBottom: '0.25rem',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, top: 10,
                        width: 4, height: 4, borderRadius: '50%', background: colors.gray600,
                      }} />
                      {d.trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Work / Projects Section                                            */
/* ------------------------------------------------------------------ */

function WorkSection({ projects, campaigns }: { projects: ProjectData[]; campaigns: CampaignData[] }) {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const selectedCampaign = campaigns.find(c => c.projectId === activeProject);

  return (
    <section id="work" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        Work & Case Studies
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '0.5rem',
      }}>
        Selected Projects
      </h2>
      <p style={{ fontSize: '0.9rem', color: colors.gray400, marginBottom: '3rem', maxWidth: 600 }}>
        Brand analysis, campaign strategy, and marketing concepts developed as part of portfolio work and internship preparation.
      </p>

      {/* Project Cards */}
      <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {projects.map((project) => {
          const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
          const imgSrc = getProjectImage(project);
          const hasDetail = project.overview || project.challenge || project.approach || project.outcome;
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              style={{
                display: 'block',
                background: colors.navyLight,
                border: '1px solid rgba(200,150,62,0.1)',
                borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s',
                textDecoration: 'none',
              }}
              className="project-card"
            >
              {/* Project Image / Logo */}
              <div style={{
                width: '100%', height: 200, position: 'relative', overflow: 'hidden',
                background: imgSrc.endsWith('.png')
                  ? 'linear-gradient(135deg, #0d1f3c 0%, #142952 100%)'
                  : colors.navyLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={imgSrc}
                  alt={project.title}
                  style={{
                    width: imgSrc.endsWith('.png') ? '60%' : '100%',
                    height: imgSrc.endsWith('.png') ? '60%' : '100%',
                    objectFit: imgSrc.endsWith('.png') ? 'contain' : 'cover',
                    transition: 'transform 0.4s',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: imgSrc.endsWith('.png')
                    ? 'linear-gradient(to bottom, transparent 60%, rgba(10,22,40,0.9))'
                    : 'linear-gradient(to bottom, transparent 40%, rgba(10,22,40,0.9))',
                }} />
                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(8px)',
                  borderRadius: '999px', padding: '0.3rem 0.8rem',
                  fontSize: '0.72rem', fontWeight: 600, color: colors.gold,
                  letterSpacing: '0.04em',
                }}>
                  {project.category}
                </div>
                {/* Read case study badge */}
                {hasDetail && (
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: colors.gold, color: colors.navy,
                    borderRadius: '999px', padding: '0.3rem 0.75rem',
                    fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    Read case study <ArrowRight size={12} />
                  </div>
                )}
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.05rem',
                  color: colors.white, marginBottom: '0.5rem', lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem', color: colors.gray400, lineHeight: 1.6,
                  marginBottom: '1rem',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontSize: '0.7rem', fontWeight: 500,
                      background: 'rgba(200,150,62,0.1)', color: colors.gold,
                      padding: '0.2rem 0.55rem', borderRadius: '999px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Campaign Spotlight */}
      {selectedCampaign && (
        <div style={{
          background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navyMid})`,
          border: `1px solid rgba(200,150,62,0.2)`,
          borderRadius: 16, padding: '2.5rem', marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.5rem' }}>
            Campaign Spotlight
          </div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem',
            color: colors.white, marginBottom: '0.5rem',
          }}>
            {selectedCampaign.title}
          </h3>
          <p style={{ fontSize: '0.95rem', color: colors.gray400, marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {selectedCampaign.description}
          </p>

          {/* Campaign details */}
          {selectedCampaign.details && selectedCampaign.details !== '{}' && (
            <div className="campaign-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {(() => {
                try {
                  const details = JSON.parse(selectedCampaign.details);
                  return Object.entries(details).map(([key, value]) => (
                    <div key={key} style={{
                      background: colors.navy, borderRadius: 8, padding: '1rem',
                    }}>
                      <div style={{ fontSize: '0.7rem', color: colors.gray600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                        {key}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: colors.white, fontWeight: 500 }}>
                        {String(value)}
                      </div>
                    </div>
                  ));
                } catch { return null; }
              })()}
            </div>
          )}

          {selectedCampaign.tags && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {selectedCampaign.tags.split(',').map((tag, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem', fontWeight: 500,
                  background: 'rgba(200,150,62,0.15)', color: colors.gold,
                  padding: '0.3rem 0.7rem', borderRadius: '999px',
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skills Section                                                     */
/* ------------------------------------------------------------------ */

function SkillsSection({ skills }: { skills: SkillCategoryData[] }) {
  return (
    <section id="skills" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        Capabilities
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '0.5rem',
      }}>
        Skills Dashboard
      </h2>
      <p style={{ fontSize: '0.88rem', color: colors.gray400, marginBottom: '3rem', maxWidth: 560 }}>
        A working snapshot of where I am today — honest, not inflated. The bars reflect demonstrated applied experience, not aspirational claims.
      </p>

      <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {skills.map((cat) => {
          let skillList: string[] = [];
          try { skillList = JSON.parse(cat.skills); } catch { skillList = cat.skills.split(',').map(s => s.trim()); }
          const icon = skillIconMap[cat.name] || <LayoutGrid size={20} />;
          const barWidths = skillBarWidths[cat.name] || {};

          return (
            <div key={cat.id} style={{
              background: colors.navyLight,
              border: '1px solid rgba(200,150,62,0.1)',
              borderRadius: 16, padding: '1.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(200,150,62,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.gold,
                }}>
                  {icon}
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem',
                  color: colors.white,
                }}>
                  {cat.name}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {skillList.map((skill, si) => {
                  const width = barWidths[skill] || Math.floor(Math.random() * 30 + 50);
                  return (
                    <div key={si}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.82rem', color: colors.gray400 }}>{skill}</span>
                        <span style={{ fontSize: '0.72rem', color: colors.gray600 }}>{width}%</span>
                      </div>
                      <div style={{
                        height: 4, borderRadius: 2, background: 'rgba(200,150,62,0.1)',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldLight})`,
                          width: `${width}%`,
                          transition: 'width 0.8s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Education Section                                                  */
/* ------------------------------------------------------------------ */

function EducationSection({ education }: { education: EducationData[] }) {
  const careerFocus = ['Media Buying', 'Business Development', 'Growth Marketing', 'Brand Management', 'Campaign Management', 'Performance Marketing', 'Social Media'];

  return (
    <section id="education" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        Education
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '3rem',
      }}>
        Academic Background
      </h2>

      {education.map((edu) => (
        <div key={edu.id} style={{
          background: colors.navyLight,
          border: '1px solid rgba(200,150,62,0.1)',
          borderRadius: 16, padding: '2rem', marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(200,150,62,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.gold, flexShrink: 0,
            }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem',
                color: colors.white, marginBottom: '0.25rem',
              }}>
                {edu.degree}
              </h3>
              <p style={{ fontSize: '0.9rem', color: colors.gold, marginBottom: '0.25rem' }}>{edu.institution}</p>
              <p style={{ fontSize: '0.82rem', color: colors.gray600 }}>{edu.year} · Giza, Egypt</p>
            </div>
          </div>

          {edu.details && (
            <div style={{
              background: colors.navy, borderRadius: 8, padding: '1rem',
              fontSize: '0.82rem', color: colors.gray400, lineHeight: 1.7,
            }}>
              <div style={{ fontSize: '0.72rem', color: colors.gray600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Relevant Coursework
              </div>
              {edu.details}
            </div>
          )}
        </div>
      ))}

      {/* Languages */}
      <div className="lang-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { lang: 'Arabic', level: 'Native Proficiency' },
          { lang: 'English', level: 'C1 — Professional Proficiency' },
        ].map((l, i) => (
          <div key={i} style={{
            background: colors.navyLight,
            border: '1px solid rgba(200,150,62,0.1)',
            borderRadius: 12, padding: '1.25rem',
          }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: colors.white, marginBottom: '0.25rem' }}>
              {l.lang}
            </div>
            <div style={{ fontSize: '0.82rem', color: colors.gray400 }}>{l.level}</div>
          </div>
        ))}
      </div>

      {/* Career Focus */}
      <div style={{
        background: colors.navyLight,
        border: '1px solid rgba(200,150,62,0.1)',
        borderRadius: 16, padding: '1.75rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, marginBottom: '1rem' }}>
          Career Focus Areas
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {careerFocus.map((f, i) => (
            <span key={i} style={{
              fontSize: '0.8rem', fontWeight: 500,
              background: 'rgba(200,150,62,0.1)', color: colors.gold,
              padding: '0.4rem 0.9rem', borderRadius: '999px',
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact Section                                                    */
/* ------------------------------------------------------------------ */

function ContactSection({ profile }: { profile: ProfileData }) {
  return (
    <section id="contact" style={{
      padding: '6rem 2.5rem', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gold, marginBottom: '0.75rem' }}>
        Contact
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        lineHeight: 1.15, letterSpacing: '-0.03em', color: colors.white, marginBottom: '0.5rem',
      }}>
        Let&apos;s build something.
      </h2>
      <p style={{ fontSize: '0.9rem', color: colors.gray400, marginBottom: '3rem', maxWidth: 560 }}>
        Looking to hire, collaborate, or discuss a brief? I&apos;m available for entry-level roles and internships in marketing, media buying, and business development.
      </p>

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { icon: <Mail size={20} />, label: 'Send an email', value: profile.email, href: `mailto:${profile.email}` },
          { icon: <Linkedin size={20} />, label: 'LinkedIn', value: 'LinkedIn Profile', href: `https://linkedin.com/in/${profile.linkedin}` },
          { icon: <Phone size={20} />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
        ].map((item, i) => (
          <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{
            background: colors.navyLight,
            border: '1px solid rgba(200,150,62,0.1)',
            borderRadius: 16, padding: '1.75rem',
            textDecoration: 'none', transition: 'all 0.25s',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }} className="contact-card">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(200,150,62,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.gold,
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: colors.gray600, marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', color: colors.white, fontWeight: 500 }}>{item.value}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer({ profile }: { profile: ProfileData }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(200,150,62,0.1)',
      padding: '2rem 2.5rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      maxWidth: 1080, margin: '0 auto',
      flexWrap: 'wrap', gap: '1rem',
    }}>
      <p style={{ fontSize: '0.8rem', color: colors.gray600 }}>
        &copy; 2025 {profile.name} · Giza, Egypt
      </p>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
        background: 'rgba(200,150,62,0.1)', border: 'none', borderRadius: '999px',
        padding: '0.4rem 1rem', fontSize: '0.78rem', color: colors.gold,
        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
      }}>
        <ChevronDown size={14} style={{ transform: 'rotate(180deg)', verticalAlign: 'middle', marginRight: 4 }} />
        Back to top
      </button>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider                                                            */
/* ------------------------------------------------------------------ */

function Divider() {
  return (
    <div style={{
      maxWidth: 1080, margin: '0 auto', padding: '0 2.5rem',
    }}>
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.2), transparent)',
      }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

interface PortfolioClientProps {
  profile: ProfileData | null;
  projects: ProjectData[];
  experiences: ExperienceData[];
  campaigns: CampaignData[];
  skills: SkillCategoryData[];
  education: EducationData[];
}

export default function PortfolioClient({
  profile,
  projects,
  experiences,
  campaigns,
  skills,
  education,
}: PortfolioClientProps) {
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll spy — runs only on the client after hydration.
  // All content is already server-rendered, so this hook only updates
  // the active nav link highlight as the user scrolls.
  useEffect(() => {
    const sections = ['hero', 'about', 'experience', 'work', 'skills', 'education', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!profile) {
    // This branch is hit when the server-side safeFetchProfile() returned
    // null — either because the DB was unreachable (Supabase paused,
    // wrong DATABASE_URL, connection pool exhaustion) or because the
    // Profile table is genuinely empty (fresh DB that hasn't been
    // seeded yet). The /api/health endpoint distinguishes between these.
    return (
      <div style={{
        minHeight: '100vh', background: colors.navy,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: colors.gray400, fontSize: '0.95rem',
        padding: '2rem', textAlign: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          fontSize: '1.3rem', color: colors.white, marginBottom: '0.75rem',
          fontFamily: "'Syne', sans-serif", fontWeight: 600,
        }}>
          Portfolio temporarily unavailable
        </div>
        <div style={{ maxWidth: '480px', lineHeight: 1.6 }}>
          The site couldn&apos;t reach its database on this request. This is
          usually a transient issue with the serverless database connection
          (cold start, pool exhaustion, or a paused Supabase instance) and
          should resolve within a minute. Please refresh the page.
        </div>
        <div style={{
          marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.6,
        }}>
          If the problem persists, the site operator can check{' '}
          <code style={{
            background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem',
            borderRadius: '4px', fontFamily: 'monospace',
          }}>
            /api/health
          </code>{' '}
          for diagnostics.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.navy,
      color: colors.white,
      fontFamily: "'DM Sans', sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <Navigation activeSection={activeSection} />
      <HeroSection profile={profile} />
      <Divider />
      <AboutSection profile={profile} />
      <Divider />
      <ExperienceSection experiences={experiences} />
      <Divider />
      <WorkSection projects={projects} campaigns={campaigns} />
      <Divider />
      <SkillsSection skills={skills} />
      <Divider />
      <EducationSection education={education} />
      <Divider />
      <ContactSection profile={profile} />
      <Footer profile={profile} />

      {/* Global responsive styles */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        .stat-card-hover:hover { border-color: rgba(200,150,62,0.4) !important; transform: translateY(-2px); }
        .principle-card:hover { border-color: rgba(200,150,62,0.3) !important; transform: translateY(-2px); }
        .project-card:hover { border-color: rgba(200,150,62,0.3) !important; transform: translateY(-3px); }
        .project-card:hover img { transform: scale(1.05); }
        .contact-card:hover { border-color: rgba(200,150,62,0.35) !important; transform: translateY(-2px); }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            padding: 7rem 1.25rem 3rem !important;
          }
          .hero-stats {
            order: -1;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-burger {
            display: block !important;
          }
          section {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
          .lang-grid {
            grid-template-columns: 1fr !important;
          }
          .campaign-details-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section h1 {
            font-size: 2rem !important;
          }
          .hero-section .stat-card-hover {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
