'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Linkedin,
  ArrowRight,
  ArrowUpRight,
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
  Quote,
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
/*  Champagne Noir — Editorial Deluxe palette                          */
/* ------------------------------------------------------------------ */
//
//  Warm, layered darks instead of cold blue. Champagne gold + bronze
//  instead of saturated yellow-gold. Pearl/silk/cashmere text tiers
//  for editorial depth. Inspired by luxury fashion editorial layouts
//  (Vogue, Harper's Bazaar, Aman Resorts brand).
//
const palette = {
  // Layered obsidian backgrounds (deepest → elevated)
  onyx: '#08080c',
  onyxLight: '#0f0e14',
  charcoal: '#16151c',
  graphite: '#1c1a24',
  graphiteHi: '#252330',

  // Warm text tiers (brightest → most muted)
  pearl: '#faf8f4',
  silk: '#e8e4dc',
  chiffon: '#b8b3a8',
  cashmere: '#8a8278',
  stone: '#5a5347',

  // Champagne / copper / bronze accents
  champagne: '#d4af7a',
  champagneHi: '#e6c79f',
  champagneGlow: '#f4dcb5',
  copper: '#b87333',
  bronze: '#8a6e4b',
  bronzeDark: '#5a4730',

  // Hairlines / surfaces
  hairline: 'rgba(212, 175, 122, 0.14)',
  hairlineHi: 'rgba(212, 175, 122, 0.28)',
  hairlineSoft: 'rgba(212, 175, 122, 0.08)',
  glass: 'rgba(28, 26, 36, 0.72)',
};

/* ------------------------------------------------------------------ */
/*  Font stacks                                                        */
/* ------------------------------------------------------------------ */

const fonts = {
  serif: "'Fraunces', Georgia, 'Times New Roman', serif",
  sans: "'DM Sans', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
};

/* ------------------------------------------------------------------ */
/*  Skill Icons — Lucide React Components                              */
/* ------------------------------------------------------------------ */

const skillIconMap: Record<string, React.ReactNode> = {
  'Marketing & Campaigns': <Megaphone size={18} strokeWidth={1.5} />,
  'Digital & Paid Media': <TrendingUp size={18} strokeWidth={1.5} />,
  'Business Development': <Handshake size={18} strokeWidth={1.5} />,
  'Analytics & Tools': <Settings size={18} strokeWidth={1.5} />,
  'Languages & Tools': <Globe size={18} strokeWidth={1.5} />,
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
/*  Deluxe Edition — premium enhancements                              */
/* ------------------------------------------------------------------ */
//
//  ScrollReveal: wraps children in a div that starts at opacity 0 + 28px
//  below its final position, then fades + slides in when scrolled into
//  view (IntersectionObserver). Falls back to visible if JS disabled
//  or IntersectionObserver unavailable. Respects prefers-reduced-motion.
//
function ScrollReveal({
  children,
  delay = 0,
  as: Tag = 'div',
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={visible ? 'noir-reveal noir-reveal--in' : 'noir-reveal'}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

//
//  useCountUp: animates a number from 0 to target when `active` becomes
//  true. Used for the hero stat cards. Parses values like "2x", "10+",
//  "3+", "C1" — non-numeric values just render as-is (no animation).
//
function useCountUp(rawValue: string, active: boolean, duration = 1400) {
  const match = rawValue.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numericPart = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(
    numericPart !== null ? `0${suffix}` : rawValue
  );

  useEffect(() => {
    if (numericPart === null) {
      setDisplay(rawValue);
      return;
    }
    if (!active) return;

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(`${numericPart}${suffix}`);
      return;
    }

    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericPart * eased;
      const formatted = Number.isInteger(numericPart)
        ? Math.round(current).toString()
        : current.toFixed(1);
      setDisplay(`${formatted}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, rawValue, duration]);

  return display;
}

//
//  Eyebrow — the small mono uppercase label that sits above each
//  section heading. Editorial newspaper-style: number + label + rule.
//
function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      marginBottom: '1.5rem',
      animation: 'noir-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
    }}>
      <span style={{
        fontFamily: fonts.mono,
        fontSize: '0.7rem', fontWeight: 500,
        color: palette.champagne,
        letterSpacing: '0.18em',
      }}>
        {index}
      </span>
      <span style={{
        width: 28, height: 1,
        background: `linear-gradient(90deg, ${palette.champagne}, transparent)`,
      }} />
      <span style={{
        fontFamily: fonts.mono,
        fontSize: '0.7rem', fontWeight: 500,
        color: palette.chiffon,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
}

//
//  SectionHeading — large editorial serif heading. Optional italic
//  accent for a more magazine-like feel.
//
function SectionHeading({
  children, italic, sub,
}: {
  children: React.ReactNode;
  italic?: string;
  sub?: string;
}) {
  return (
    <>
      <h2 style={{
        fontFamily: fonts.serif,
        fontWeight: 400,
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.025em',
        color: palette.pearl,
        marginBottom: sub ? '1rem' : '2.5rem',
        fontVariationSettings: '"opsz" 144',
      }}>
        {children}
        {italic && (
          <em style={{
            fontStyle: 'italic',
            fontWeight: 300,
            color: palette.champagne,
            background: `linear-gradient(120deg, ${palette.champagne} 0%, ${palette.champagneHi} 50%, ${palette.champagne} 100%)`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'noir-shimmer 8s ease-in-out infinite',
            marginLeft: '0.25em',
          }}>
            {italic}
          </em>
        )}
      </h2>
      {sub && (
        <p style={{
          fontSize: '0.95rem',
          color: palette.chiffon,
          marginBottom: '3rem',
          maxWidth: 620,
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {sub}
        </p>
      )}
    </>
  );
}

//
//  AnimatedStat: stat card with count-up animation triggered on scroll.
//  Refined for editorial luxe: serif numerals, mono label, hairline.
//
function AnimatedStat({
  value, label, sub, delay = 0, index,
}: {
  value: string; label: string; sub: string; delay?: number; index: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const displayValue = useCountUp(value, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="noir-stat-card"
      style={{
        position: 'relative',
        padding: '1.5rem 1.5rem 1.35rem',
        background: 'linear-gradient(170deg, rgba(28,26,36,0.92), rgba(15,14,20,0.85))',
        border: `1px solid ${palette.hairline}`,
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        animation: `noir-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
      }}
    >
      {/* Hairline corner accents */}
      <span style={{
        position: 'absolute', top: 0, left: 0,
        width: 12, height: 12,
        borderTop: `1px solid ${palette.champagne}`,
        borderLeft: `1px solid ${palette.champagne}`,
        opacity: 0.7,
      }} />
      <span style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 12, height: 12,
        borderBottom: `1px solid ${palette.champagne}`,
        borderRight: `1px solid ${palette.champagne}`,
        opacity: 0.7,
      }} />

      {/* Shimmer sweep on hover */}
      <div className="noir-shimmer-sweep" style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(120deg, transparent 35%, ${palette.hairlineHi} 50%, transparent 65%)`,
        opacity: 0, transition: 'opacity 0.5s', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: '0.62rem', fontWeight: 500,
          color: palette.bronze,
          letterSpacing: '0.16em',
          marginBottom: '0.6rem',
        }}>
          {index}
        </div>
        <div style={{
          fontFamily: fonts.serif,
          fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          color: palette.pearl,
          lineHeight: 1,
          fontVariationSettings: '"opsz" 144',
          marginBottom: '0.6rem',
        }}>
          {displayValue}
        </div>
        <div style={{
          fontSize: '0.78rem', fontWeight: 500,
          color: palette.silk,
          letterSpacing: '0.02em',
          marginBottom: '0.2rem',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 300,
          color: palette.cashmere,
          fontStyle: 'italic',
          fontFamily: fonts.serif,
        }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

//
//  DeluxeBadge — small "Deluxe Edition" mark for the footer.
//
function DeluxeBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
      fontFamily: fonts.mono,
      fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: palette.champagne,
      padding: '0.4rem 0.85rem',
      border: `1px solid ${palette.hairlineHi}`,
      borderRadius: 2,
      background: 'rgba(212, 175, 122, 0.05)',
    }}>
      <Sparkles size={10} strokeWidth={1.5} />
      Deluxe Edition · v3
    </div>
  );
}

//
//  FilmGrainOverlay — very subtle film grain texture for premium depth.
//  Pure CSS, pointer-events:none, low z-index so it never blocks clicks.
//
function FilmGrainOverlay() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 1,
      pointerEvents: 'none',
      opacity: 0.035,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
      mixBlendMode: 'overlay',
    }} />
  );
}

//
//  AmbientGlow — soft champagne radial glow positioned behind content.
//  Used in hero and footer for a warm, luxe ambient lighting effect.
//
function AmbientGlow({
  position, size = 600, opacity = 0.08,
}: {
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: number;
  opacity?: number;
}) {
  return (
    <div aria-hidden style={{
      position: 'absolute',
      ...position,
      width: size, height: size,
      background: `radial-gradient(circle, rgba(212,175,122,${opacity}) 0%, transparent 65%)`,
      filter: 'blur(80px)',
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function Navigation({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'work', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(8,8,12,0.88)' : 'rgba(8,8,12,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? palette.hairline : 'transparent'}`,
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '68px',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <a href="/" style={{
        fontFamily: fonts.serif,
        fontWeight: 500, fontSize: '1.3rem',
        letterSpacing: '-0.02em',
        color: palette.pearl, textDecoration: 'none',
        fontVariationSettings: '"opsz" 144',
        display: 'flex', alignItems: 'baseline', gap: '0.1rem',
      }}>
        MM
        <span style={{
          color: palette.champagne,
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '1.1rem',
        }}>·</span>
      </a>

      {/* Desktop nav */}
      <div className="desktop-nav" style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            className="noir-nav-link"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeSection === l.id ? palette.champagne : palette.chiffon,
              transition: 'color 0.3s', fontFamily: fonts.mono,
              position: 'relative', padding: '0.25rem 0',
            }}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => scrollTo('contact')}
          className="noir-cta-primary"
          style={{
            background: `linear-gradient(135deg, ${palette.champagne}, ${palette.champagneHi})`,
            color: palette.onyx,
            fontFamily: fonts.mono, fontSize: '0.7rem', fontWeight: 600,
            padding: '0.6rem 1.4rem', borderRadius: 2,
            border: 'none', cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <span className="noir-cta-shine" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
            transform: 'translateX(-100%)', transition: 'transform 0.6s',
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>Let&apos;s talk</span>
          <ArrowRight size={12} style={{ position: 'relative', zIndex: 1 }} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile burger */}
      <button
        className="mobile-burger"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.pearl, display: 'none',
        }}
      >
        {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, bottom: 0,
          background: palette.onyx, padding: '2.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1.75rem',
          zIndex: 99,
          animation: 'noir-fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.5rem', fontWeight: 400,
                color: activeSection === l.id ? palette.champagne : palette.pearl,
                textAlign: 'left', fontFamily: fonts.serif,
                fontStyle: 'italic',
                fontVariationSettings: '"opsz" 144',
                animation: `noir-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
              }}
            >
              <span style={{
                fontFamily: fonts.mono, fontSize: '0.7rem',
                color: palette.bronze, marginRight: '1rem',
                fontStyle: 'normal', letterSpacing: '0.18em',
              }}>
                0{i + 1}
              </span>
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            style={{
              background: `linear-gradient(135deg, ${palette.champagne}, ${palette.champagneHi})`,
              color: palette.onyx,
              fontFamily: fonts.mono, fontSize: '0.78rem', fontWeight: 600,
              padding: '1rem 2rem', borderRadius: 2,
              border: 'none', cursor: 'pointer', marginTop: '1rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            Let&apos;s talk →
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
      gridTemplateColumns: '1.15fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      maxWidth: 1180,
      margin: '0 auto',
      padding: '9rem 2.5rem 5rem',
      position: 'relative',
    }}>
      {/* Champagne ambient glow — warm, not cold */}
      <AmbientGlow position={{ top: '10%', right: '-15%' }} size={750} opacity={0.1} />
      <AmbientGlow position={{ bottom: '-10%', left: '-10%' }} size={500} opacity={0.05} />

      {/* Left */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
          background: 'rgba(212, 175, 122, 0.06)',
          color: palette.champagne,
          fontFamily: fonts.mono,
          fontSize: '0.66rem', fontWeight: 500, letterSpacing: '0.2em',
          padding: '0.45rem 1rem', borderRadius: 2,
          textTransform: 'uppercase', marginBottom: '2rem',
          border: `1px solid ${palette.hairline}`,
          animation: 'noir-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <span style={{
            width: 5, height: 5, background: palette.champagne, borderRadius: '50%',
            boxShadow: `0 0 8px ${palette.champagne}`,
            animation: 'noir-pulse 2.5s infinite',
          }} />
          Open to opportunities
        </div>

        <h1 className="noir-hero-name" style={{
          fontFamily: fonts.serif,
          fontSize: 'clamp(2.6rem, 6vw, 5rem)',
          fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.035em',
          color: palette.pearl, marginBottom: '1.75rem',
          fontVariationSettings: '"opsz" 144',
          animation: 'noir-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both',
        }}>
          {firstName}<br />
          {lastName && (
            <>
              <span style={{
                fontStyle: 'italic',
                fontWeight: 300,
                background: `linear-gradient(120deg, ${palette.champagne} 0%, ${palette.champagneHi} 30%, ${palette.champagneGlow} 50%, ${palette.champagneHi} 70%, ${palette.champagne} 100%)`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'noir-shimmer 7s ease-in-out infinite',
              }}>
                {lastName}
              </span>
              <span style={{ color: palette.champagne, fontStyle: 'italic' }}>.</span>
            </>
          )}
        </h1>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1.75rem',
          animation: 'noir-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both',
        }}>
          <span style={{
            width: 32, height: 1,
            background: palette.champagne,
          }} />
          <span style={{
            fontFamily: fonts.mono,
            fontSize: '0.7rem', fontWeight: 500,
            letterSpacing: '0.18em', color: palette.chiffon,
            textTransform: 'uppercase',
          }}>
            {profile.title}
          </span>
        </div>

        <p style={{
          fontSize: '1.05rem', color: palette.chiffon, fontWeight: 300,
          maxWidth: 500, marginBottom: '2.75rem', lineHeight: 1.75,
          fontFamily: fonts.sans,
          animation: 'noir-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both',
        }}>
          {profile.bio ? profile.bio.split('.').slice(0, 2).join('.') + '.' : profile.heroSubtitle}
        </p>

        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          animation: 'noir-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both',
        }}>
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="noir-cta-primary"
            style={{
              background: `linear-gradient(135deg, ${palette.champagne}, ${palette.champagneHi})`,
              color: palette.onyx,
              fontFamily: fonts.mono, fontSize: '0.74rem', fontWeight: 600,
              padding: '0.95rem 2rem', borderRadius: 2,
              border: 'none', cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
              position: 'relative', overflow: 'hidden',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: `0 8px 32px -8px rgba(212, 175, 122, 0.35)`,
            }}
          >
            <span className="noir-cta-shine" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
              transform: 'translateX(-100%)', transition: 'transform 0.7s',
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>View my work</span>
            <ArrowRight size={14} style={{ position: 'relative', zIndex: 1 }} strokeWidth={2} />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="noir-cta-secondary"
            style={{
              background: 'transparent', color: palette.pearl,
              fontFamily: fonts.mono, fontSize: '0.74rem', fontWeight: 500,
              padding: '0.95rem 2rem', borderRadius: 2,
              border: `1px solid ${palette.hairlineHi}`,
              cursor: 'pointer', transition: 'all 0.4s',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            Get in touch
          </button>
        </div>
      </div>

      {/* Right — stats + quote */}
      <div className="hero-stats" style={{
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        position: 'relative', zIndex: 2,
        animation: 'noir-fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.6s both',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <AnimatedStat
            value={profile.stat1Value} label={profile.stat1Label} sub={profile.stat1Sub}
            delay={700} index="01"
          />
          <AnimatedStat
            value={profile.stat2Value} label={profile.stat2Label} sub={profile.stat2Sub}
            delay={820} index="02"
          />
          <AnimatedStat
            value={profile.stat3Value} label={profile.stat3Label} sub={profile.stat3Sub}
            delay={940} index="03"
          />
          <AnimatedStat
            value={profile.stat4Value} label={profile.stat4Label} sub={profile.stat4Sub}
            delay={1060} index="04"
          />
        </div>

        {/* Quote card — editorial pull-quote style */}
        <div style={{
          background: `linear-gradient(135deg, ${palette.graphite}, ${palette.charcoal})`,
          border: `1px solid ${palette.hairlineHi}`,
          borderRadius: 4, padding: '1.75rem 1.85rem',
          position: 'relative', overflow: 'hidden',
          animation: 'noir-fade-up 1s cubic-bezier(0.16,1,0.3,1) 1.2s both',
        }}>
          {/* Decorative corner accent */}
          <span style={{
            position: 'absolute', top: 0, left: 0,
            width: 14, height: 14,
            borderTop: `1px solid ${palette.champagne}`,
            borderLeft: `1px solid ${palette.champagne}`,
          }} />
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 14, height: 14,
            borderBottom: `1px solid ${palette.champagne}`,
            borderRight: `1px solid ${palette.champagne}`,
          }} />

          {/* Shimmer sweep */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(120deg, transparent 35%, ${palette.hairlineHi} 50%, transparent 65%)`,
            animation: 'noir-sweep 9s ease-in-out infinite',
          }} />

          <Quote
            size={28}
            strokeWidth={1}
            style={{
              color: palette.champagne,
              opacity: 0.4,
              marginBottom: '0.75rem',
              position: 'relative', zIndex: 1,
            }}
          />
          <p style={{
            fontFamily: fonts.serif,
            fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 400,
            lineHeight: 1.6, color: palette.pearl,
            position: 'relative', zIndex: 1,
            fontVariationSettings: '"opsz" 144',
          }}>
            {profile.quote}
          </p>
          <div style={{
            marginTop: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{
              width: 20, height: 1, background: palette.champagne,
            }} />
            <cite style={{
              fontFamily: fonts.mono, fontStyle: 'normal',
              fontSize: '0.68rem', fontWeight: 500,
              color: palette.champagne,
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              {profile.name}
            </cite>
          </div>
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
    { icon: <BarChart3 size={18} strokeWidth={1.5} />, title: 'Data before instinct', desc: 'Every recommendation I make is anchored in research, trend analysis, or performance data — not assumption.' },
    { icon: <Sparkles size={18} strokeWidth={1.5} />, title: 'Brands are conversations', desc: 'A brand isn\'t a logo. It\'s a consistent, evolving promise to a specific audience — and it breaks the second you stop listening.' },
    { icon: <Target size={18} strokeWidth={1.5} />, title: 'Campaigns should move people', desc: 'The best marketing doesn\'t just drive clicks. It creates moments — emotional, cultural, and memorable.' },
    { icon: <Users size={18} strokeWidth={1.5} />, title: 'Execution is everything', desc: 'A brilliant strategy that stays on a slide deck is worth nothing. I prioritise shipping real output.' },
  ];

  // Build bio with editorial drop cap on first letter
  const bioText = profile.bio || '';
  const firstLetter = bioText.charAt(0);
  const restOfBio = bioText.slice(1);

  return (
    <section id="about" style={{
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <Eyebrow index="01" label="About" />
      <SectionHeading italic="Who I am">
        The
      </SectionHeading>

      {/* Contact pills */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {[
          { icon: <Mail size={13} strokeWidth={1.5} />, text: profile.email, href: `mailto:${profile.email}` },
          { icon: <Phone size={13} strokeWidth={1.5} />, text: profile.phone, href: `tel:${profile.phone}` },
          { icon: <Linkedin size={13} strokeWidth={1.5} />, text: 'LinkedIn Profile', href: `https://linkedin.com/in/${profile.linkedin}` },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: palette.charcoal,
              border: `1px solid ${palette.hairline}`,
              borderRadius: 2, padding: '0.55rem 1.05rem',
              fontSize: '0.78rem', color: palette.chiffon,
              textDecoration: 'none',
              fontFamily: fonts.mono, letterSpacing: '0.02em',
              transition: 'all 0.3s',
            }}
            className="noir-pill"
          >
            <span style={{ color: palette.champagne }}>{item.icon}</span>
            {item.text}
          </a>
        ))}
      </div>

      {/* Bio with drop cap */}
      <div style={{
        fontSize: '1.08rem', lineHeight: 1.85, color: palette.silk,
        maxWidth: 760, marginBottom: '3.5rem', fontWeight: 300,
        fontFamily: fonts.sans,
      }}>
        <span style={{
          fontFamily: fonts.serif,
          float: 'left',
          fontSize: '4.2rem',
          lineHeight: 0.85,
          fontWeight: 500,
          marginRight: '0.65rem',
          marginTop: '0.35rem',
          color: palette.champagne,
          fontVariationSettings: '"opsz" 144',
        }}>
          {firstLetter}
        </span>
        {restOfBio}
      </div>

      {/* Principles grid — editorial numbered cards */}
      <div className="principles-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        {principles.map((p, i) => (
          <div
            key={i}
            className="noir-principle-card"
            style={{
              background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: 4, padding: '1.75rem 1.5rem',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              position: 'relative',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '1rem',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 2,
                background: 'rgba(212, 175, 122, 0.08)',
                border: `1px solid ${palette.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.champagne,
              }}>
                {p.icon}
              </div>
              <span style={{
                fontFamily: fonts.mono,
                fontSize: '0.7rem', fontWeight: 500,
                color: palette.bronze,
                letterSpacing: '0.16em',
              }}>
                0{i + 1}
              </span>
            </div>
            <h4 style={{
              fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.05rem',
              color: palette.pearl, marginBottom: '0.65rem',
              lineHeight: 1.3, letterSpacing: '-0.01em',
              fontVariationSettings: '"opsz" 144',
            }}>
              {p.title}
            </h4>
            <p style={{
              fontSize: '0.82rem', color: palette.chiffon,
              lineHeight: 1.65, fontWeight: 300, fontFamily: fonts.sans,
            }}>
              {p.desc}
            </p>
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
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <Eyebrow index="02" label="Experience" />
      <SectionHeading italic="history">
        Professional
      </SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {experiences.map((exp, i) => {
          const highlights = exp.highlights ? exp.highlights.split(',').map(h => h.trim()) : [];
          const details = exp.description ? exp.description.split('\n').filter(d => d.trim()) : [];
          return (
            <div
              key={exp.id}
              className="noir-exp-row"
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: '2.5rem',
                padding: '2.5rem 0',
                borderTop: `1px solid ${palette.hairline}`,
              }}
            >
              {/* Period column */}
              <div style={{ paddingTop: '0.15rem' }}>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.72rem', fontWeight: 500,
                  color: palette.champagne,
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}>
                  {exp.period}
                </div>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.65rem',
                  color: palette.cashmere,
                  letterSpacing: '0.16em',
                }}>
                  0{i + 1} / {experiences.length}
                </div>
              </div>

              {/* Content column */}
              <div>
                <h3 style={{
                  fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.4rem',
                  color: palette.pearl, marginBottom: '0.3rem',
                  letterSpacing: '-0.02em',
                  fontVariationSettings: '"opsz" 144',
                }}>
                  {exp.role}
                </h3>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  marginBottom: '1.25rem',
                }}>
                  <span style={{
                    width: 16, height: 1, background: palette.champagne,
                  }} />
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '0.72rem', fontWeight: 500,
                    color: palette.champagne,
                    letterSpacing: '0.1em',
                  }}>
                    {exp.company}
                  </span>
                </div>

                {/* Tags */}
                {highlights.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {highlights.map((h, hi) => (
                      <span key={hi} style={{
                        fontFamily: fonts.mono,
                        fontSize: '0.66rem', fontWeight: 500,
                        background: 'rgba(212, 175, 122, 0.06)',
                        border: `1px solid ${palette.hairline}`,
                        color: palette.champagne,
                        padding: '0.3rem 0.7rem', borderRadius: 2,
                        letterSpacing: '0.06em',
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
                        fontSize: '0.88rem', color: palette.chiffon,
                        lineHeight: 1.75,
                        paddingLeft: '1.25rem', position: 'relative',
                        marginBottom: '0.4rem', fontWeight: 300,
                        fontFamily: fonts.sans,
                      }}>
                        <span style={{
                          position: 'absolute', left: 0, top: 12,
                          width: 8, height: 1, background: palette.bronze,
                        }} />
                        {d.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <Eyebrow index="03" label="Work & Case Studies" />
      <SectionHeading
        italic="projects"
        sub="Brand analysis, campaign strategy, and marketing concepts developed as part of portfolio work and internship preparation."
      >
        Selected
      </SectionHeading>

      {/* Project Cards */}
      <div className="projects-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem', marginBottom: '3rem',
      }}>
        {projects.map((project, i) => {
          const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
          const imgSrc = getProjectImage(project);
          const hasDetail = project.overview || project.challenge || project.approach || project.outcome;
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              style={{
                display: 'block',
                background: palette.charcoal,
                border: `1px solid ${palette.hairline}`,
                borderRadius: 4, overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                textDecoration: 'none',
                position: 'relative',
              }}
              className="noir-project-card"
            >
              {/* Project image / logo */}
              <div style={{
                width: '100%', height: 220, position: 'relative', overflow: 'hidden',
                background: imgSrc.endsWith('.png')
                  ? `linear-gradient(135deg, ${palette.graphite} 0%, ${palette.onyxLight} 100%)`
                  : palette.charcoal,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={imgSrc}
                  alt={project.title}
                  style={{
                    width: imgSrc.endsWith('.png') ? '55%' : '100%',
                    height: imgSrc.endsWith('.png') ? '55%' : '100%',
                    objectFit: imgSrc.endsWith('.png') ? 'contain' : 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: imgSrc.endsWith('.png')
                    ? `linear-gradient(to bottom, transparent 55%, ${palette.onyxLight}99)`
                    : `linear-gradient(to bottom, transparent 35%, ${palette.onyxLight}cc)`,
                }} />

                {/* Editorial number badge */}
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  fontFamily: fonts.mono,
                  fontSize: '0.65rem', fontWeight: 500,
                  color: palette.champagne,
                  letterSpacing: '0.16em',
                  padding: '0.3rem 0.55rem',
                  background: 'rgba(8,8,12,0.65)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: 2,
                }}>
                  0{i + 1}
                </div>

                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'rgba(8,8,12,0.65)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 2, padding: '0.3rem 0.7rem',
                  fontFamily: fonts.mono,
                  fontSize: '0.62rem', fontWeight: 500,
                  color: palette.champagne,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: `1px solid ${palette.hairline}`,
                }}>
                  {project.category}
                </div>

                {/* Read case study badge */}
                {hasDetail && (
                  <div style={{
                    position: 'absolute', bottom: 14, right: 14,
                    background: `linear-gradient(135deg, ${palette.champagne}, ${palette.champagneHi})`,
                    color: palette.onyx,
                    borderRadius: 2, padding: '0.4rem 0.8rem',
                    fontFamily: fonts.mono,
                    fontSize: '0.62rem', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  }}>
                    Case study <ArrowUpRight size={11} strokeWidth={2} />
                  </div>
                )}
              </div>

              <div style={{ padding: '1.5rem 1.65rem 1.65rem' }}>
                <h3 style={{
                  fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.2rem',
                  color: palette.pearl, marginBottom: '0.6rem', lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  fontVariationSettings: '"opsz" 144',
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '0.86rem', color: palette.chiffon, lineHeight: 1.65,
                  marginBottom: '1.1rem', fontWeight: 300, fontFamily: fonts.sans,
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontFamily: fonts.mono,
                      fontSize: '0.62rem', fontWeight: 500,
                      background: 'rgba(212, 175, 122, 0.06)',
                      border: `1px solid ${palette.hairline}`,
                      color: palette.champagne,
                      padding: '0.25rem 0.6rem', borderRadius: 2,
                      letterSpacing: '0.05em',
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
          background: `linear-gradient(135deg, ${palette.charcoal}, ${palette.onyxLight})`,
          border: `1px solid ${palette.hairlineHi}`,
          borderRadius: 4, padding: '2.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 18, height: 18,
            borderTop: `1px solid ${palette.champagne}`,
            borderLeft: `1px solid ${palette.champagne}`,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 18, height: 18,
            borderBottom: `1px solid ${palette.champagne}`,
            borderRight: `1px solid ${palette.champagne}`,
          }} />

          <Eyebrow index="★" label="Campaign Spotlight" />
          <h3 style={{
            fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.85rem',
            color: palette.pearl, marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
            fontVariationSettings: '"opsz" 144',
          }}>
            {selectedCampaign.title}
          </h3>
          <p style={{
            fontSize: '0.96rem', color: palette.chiffon, marginBottom: '1.75rem',
            lineHeight: 1.75, maxWidth: 640, fontWeight: 300,
            fontFamily: fonts.sans,
          }}>
            {selectedCampaign.description}
          </p>

          {selectedCampaign.details && selectedCampaign.details !== '{}' && (
            <div className="campaign-details-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
            }}>
              {(() => {
                try {
                  const details = JSON.parse(selectedCampaign.details);
                  return Object.entries(details).map(([key, value]) => (
                    <div key={key} style={{
                      background: palette.onyx, borderRadius: 2, padding: '1.1rem',
                      border: `1px solid ${palette.hairline}`,
                    }}>
                      <div style={{
                        fontFamily: fonts.mono,
                        fontSize: '0.62rem', color: palette.bronze,
                        textTransform: 'uppercase', letterSpacing: '0.14em',
                        marginBottom: '0.45rem',
                      }}>
                        {key}
                      </div>
                      <div style={{
                        fontFamily: fonts.serif,
                        fontSize: '1rem', color: palette.pearl, fontWeight: 500,
                        fontVariationSettings: '"opsz" 144',
                      }}>
                        {String(value)}
                      </div>
                    </div>
                  ));
                } catch { return null; }
              })()}
            </div>
          )}

          {selectedCampaign.tags && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              {selectedCampaign.tags.split(',').map((tag, i) => (
                <span key={i} style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.66rem', fontWeight: 500,
                  background: 'rgba(212, 175, 122, 0.1)',
                  border: `1px solid ${palette.hairline}`,
                  color: palette.champagne,
                  padding: '0.35rem 0.75rem', borderRadius: 2,
                  letterSpacing: '0.06em',
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
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <Eyebrow index="04" label="Capabilities" />
      <SectionHeading
        italic="dashboard"
        sub="A working snapshot of where I am today — honest, not inflated. The bars reflect demonstrated applied experience, not aspirational claims."
      >
        Skills
      </SectionHeading>

      <div className="skills-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {skills.map((cat, ci) => {
          let skillList: string[] = [];
          try { skillList = JSON.parse(cat.skills); } catch { skillList = cat.skills.split(',').map(s => s.trim()); }
          const icon = skillIconMap[cat.name] || <LayoutGrid size={18} strokeWidth={1.5} />;
          const barWidths = skillBarWidths[cat.name] || {};

          return (
            <div
              key={cat.id}
              style={{
                background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
                border: `1px solid ${palette.hairline}`,
                borderRadius: 4, padding: '1.85rem 1.65rem',
                position: 'relative',
              }}
              className="noir-skill-card"
            >
              {/* Number badge */}
              <span style={{
                position: 'absolute', top: 14, right: 14,
                fontFamily: fonts.mono,
                fontSize: '0.62rem', fontWeight: 500,
                color: palette.bronze, letterSpacing: '0.16em',
              }}>
                0{ci + 1}
              </span>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                marginBottom: '1.75rem',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 2,
                  background: 'rgba(212, 175, 122, 0.08)',
                  border: `1px solid ${palette.hairline}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: palette.champagne,
                }}>
                  {icon}
                </div>
                <h3 style={{
                  fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.1rem',
                  color: palette.pearl, letterSpacing: '-0.01em',
                  fontVariationSettings: '"opsz" 144',
                }}>
                  {cat.name}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {skillList.map((skill, si) => {
                  const width = barWidths[skill] || Math.floor(Math.random() * 30 + 50);
                  return (
                    <div key={si}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '0.45rem', alignItems: 'baseline',
                      }}>
                        <span style={{
                          fontSize: '0.82rem', color: palette.silk,
                          fontWeight: 400, fontFamily: fonts.sans,
                        }}>
                          {skill}
                        </span>
                        <span style={{
                          fontFamily: fonts.mono,
                          fontSize: '0.66rem', color: palette.champagne,
                          fontWeight: 500,
                        }}>
                          {width}%
                        </span>
                      </div>
                      <div style={{
                        height: 2, background: palette.hairlineSoft,
                        borderRadius: 0, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${palette.bronze}, ${palette.champagne}, ${palette.champagneHi})`,
                          width: `${width}%`,
                          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                          boxShadow: `0 0 8px rgba(212, 175, 122, 0.4)`,
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
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <Eyebrow index="05" label="Education" />
      <SectionHeading italic="background">
        Academic
      </SectionHeading>

      {education.map((edu, i) => (
        <div
          key={edu.id}
          style={{
            background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
            border: `1px solid ${palette.hairline}`,
            borderRadius: 4, padding: '2rem 2.25rem', marginBottom: '1.5rem',
            position: 'relative',
          }}
          className="noir-edu-card"
        >
          <span style={{
            position: 'absolute', top: 16, right: 18,
            fontFamily: fonts.mono,
            fontSize: '0.66rem', fontWeight: 500,
            color: palette.bronze, letterSpacing: '0.16em',
          }}>
            0{i + 1}
          </span>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 2,
              background: 'rgba(212, 175, 122, 0.08)',
              border: `1px solid ${palette.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: palette.champagne, flexShrink: 0,
            }}>
              <GraduationCap size={22} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.25rem',
                color: palette.pearl, marginBottom: '0.35rem',
                letterSpacing: '-0.02em', lineHeight: 1.3,
                fontVariationSettings: '"opsz" 144',
              }}>
                {edu.degree}
              </h3>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.25rem',
              }}>
                <span style={{
                  width: 14, height: 1, background: palette.champagne,
                }} />
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.74rem', fontWeight: 500,
                  color: palette.champagne, letterSpacing: '0.08em',
                }}>
                  {edu.institution}
                </span>
              </div>
              <p style={{
                fontFamily: fonts.mono,
                fontSize: '0.68rem', color: palette.cashmere,
                letterSpacing: '0.12em',
              }}>
                {edu.year} · GIZA, EGYPT
              </p>
            </div>
          </div>

          {edu.details && (
            <div style={{
              background: palette.onyx, borderRadius: 2, padding: '1.1rem 1.25rem',
              border: `1px solid ${palette.hairlineSoft}`,
            }}>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.62rem', color: palette.bronze,
                textTransform: 'uppercase', letterSpacing: '0.16em',
                marginBottom: '0.55rem',
              }}>
                Relevant Coursework
              </div>
              <div style={{
                fontSize: '0.84rem', color: palette.chiffon, lineHeight: 1.7,
                fontWeight: 300, fontFamily: fonts.sans,
              }}>
                {edu.details}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Languages */}
      <div className="lang-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {[
          { lang: 'Arabic', level: 'Native Proficiency', percent: 100 },
          { lang: 'English', level: 'C1 — Professional Proficiency', percent: 85 },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: 4, padding: '1.5rem 1.65rem',
              position: 'relative',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: '0.5rem',
            }}>
              <div style={{
                fontFamily: fonts.serif, fontWeight: 500, fontSize: '1.15rem',
                color: palette.pearl,
                fontVariationSettings: '"opsz" 144',
              }}>
                {l.lang}
              </div>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.7rem', color: palette.champagne, fontWeight: 500,
              }}>
                {l.percent}%
              </div>
            </div>
            <div style={{
              fontSize: '0.78rem', color: palette.chiffon,
              marginBottom: '0.85rem', fontFamily: fonts.sans,
              fontStyle: 'italic',
            }}>
              {l.level}
            </div>
            <div style={{
              height: 2, background: palette.hairlineSoft,
            }}>
              <div style={{
                height: '100%',
                background: `linear-gradient(90deg, ${palette.bronze}, ${palette.champagne}, ${palette.champagneHi})`,
                width: `${l.percent}%`,
                boxShadow: `0 0 8px rgba(212, 175, 122, 0.4)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Career Focus */}
      <div style={{
        background: `linear-gradient(135deg, ${palette.charcoal}, ${palette.onyxLight})`,
        border: `1px solid ${palette.hairline}`,
        borderRadius: 4, padding: '1.85rem 2rem',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.7rem',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: '0.66rem', fontWeight: 500,
            color: palette.champagne,
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            Career Focus
          </span>
          <span style={{
            flex: 1, height: 1,
            background: `linear-gradient(90deg, ${palette.hairlineHi}, transparent)`,
          }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {careerFocus.map((f, i) => (
            <span key={i} style={{
              fontFamily: fonts.mono,
              fontSize: '0.72rem', fontWeight: 500,
              background: 'rgba(212, 175, 122, 0.06)',
              border: `1px solid ${palette.hairline}`,
              color: palette.champagne,
              padding: '0.5rem 1rem', borderRadius: 2,
              letterSpacing: '0.06em',
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
      padding: '7rem 2.5rem', maxWidth: 1180, margin: '0 auto',
      position: 'relative',
    }}>
      <AmbientGlow position={{ bottom: '0%', right: '-10%' }} size={500} opacity={0.07} />

      <Eyebrow index="06" label="Contact" />
      <SectionHeading
        italic="something."
        sub="Looking to hire, collaborate, or discuss a brief? I'm available for entry-level roles and internships in marketing, media buying, and business development."
      >
        Let&apos;s build
      </SectionHeading>

      <div className="contact-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem', marginBottom: '2rem', position: 'relative', zIndex: 2,
      }}>
        {[
          { icon: <Mail size={20} strokeWidth={1.5} />, label: 'Send an email', value: profile.email, href: `mailto:${profile.email}` },
          { icon: <Linkedin size={20} strokeWidth={1.5} />, label: 'LinkedIn', value: 'LinkedIn Profile', href: `https://linkedin.com/in/${profile.linkedin}` },
          { icon: <Phone size={20} strokeWidth={1.5} />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: 4, padding: '1.85rem 1.65rem',
              textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              display: 'flex', flexDirection: 'column', gap: '1rem',
              position: 'relative', overflow: 'hidden',
            }}
            className="noir-contact-card"
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 2,
                background: 'rgba(212, 175, 122, 0.08)',
                border: `1px solid ${palette.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.champagne,
              }}>
                {item.icon}
              </div>
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                style={{ color: palette.bronze }}
                className="noir-arrow"
              />
            </div>
            <div>
              <div style={{
                fontFamily: fonts.mono,
                fontSize: '0.66rem', color: palette.cashmere,
                marginBottom: '0.4rem', letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: fonts.serif,
                fontSize: '0.95rem', color: palette.pearl, fontWeight: 500,
                fontVariationSettings: '"opsz" 144',
                letterSpacing: '-0.01em',
              }}>
                {item.value}
              </div>
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
      borderTop: `1px solid ${palette.hairline}`,
      padding: '3rem 2.5rem 2.5rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      maxWidth: 1180, margin: '0 auto',
      flexWrap: 'wrap', gap: '1.5rem',
      position: 'relative',
    }}>
      {/* Soft champagne glow line above footer */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 1,
        background: `linear-gradient(90deg, transparent, ${palette.champagne}aa, transparent)`,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <p style={{
          fontFamily: fonts.mono,
          fontSize: '0.72rem', color: palette.cashmere, margin: 0,
          letterSpacing: '0.08em',
        }}>
          &copy; 2025 {profile.name.toUpperCase()} · GIZA, EGYPT
        </p>
        <DeluxeBadge />
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="noir-back-top"
        style={{
          background: 'rgba(212, 175, 122, 0.06)',
          border: `1px solid ${palette.hairlineHi}`,
          borderRadius: 2,
          padding: '0.6rem 1.2rem',
          fontFamily: fonts.mono,
          fontSize: '0.68rem', color: palette.champagne,
          cursor: 'pointer', fontWeight: 500,
          transition: 'all 0.3s',
          display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}
      >
        <ChevronDown size={13} style={{ transform: 'rotate(180deg)' }} strokeWidth={2} />
        Back to top
      </button>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider — luxe hairline with center ornament                       */
/* ------------------------------------------------------------------ */

function Divider() {
  return (
    <div style={{
      maxWidth: 1180, margin: '0 auto', padding: '0 2.5rem',
      display: 'flex', alignItems: 'center', gap: '0.85rem',
    }}>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, transparent, ${palette.hairline})`,
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{
          width: 4, height: 4, transform: 'rotate(45deg)',
          background: palette.champagne,
          boxShadow: `0 0 6px ${palette.champagne}`,
        }} />
        <span style={{
          width: 2, height: 2, transform: 'rotate(45deg)',
          background: palette.bronze,
        }} />
        <span style={{
          width: 4, height: 4, transform: 'rotate(45deg)',
          background: palette.champagne,
          boxShadow: `0 0 6px ${palette.champagne}`,
        }} />
      </div>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, ${palette.hairline}, transparent)`,
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
    return (
      <div style={{
        minHeight: '100vh', background: palette.onyx,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: palette.chiffon, fontSize: '0.95rem',
        padding: '2rem', textAlign: 'center',
        fontFamily: fonts.sans,
      }}>
        <div style={{
          fontSize: '1.5rem', color: palette.pearl, marginBottom: '1rem',
          fontFamily: fonts.serif, fontWeight: 400, fontStyle: 'italic',
          fontVariationSettings: '"opsz" 144',
        }}>
          Portfolio temporarily unavailable
        </div>
        <div style={{
          maxWidth: '480px', lineHeight: 1.7, color: palette.chiffon,
          fontWeight: 300,
        }}>
          The site couldn&apos;t reach its database on this request. This is
          usually a transient issue with the serverless database connection
          (cold start, pool exhaustion, or a paused Supabase instance) and
          should resolve within a minute. Please refresh the page.
        </div>
        <div style={{
          marginTop: '1.75rem', fontSize: '0.78rem', opacity: 0.6,
          fontFamily: fonts.mono, letterSpacing: '0.08em',
        }}>
          If the problem persists, the site operator can check{' '}
          <code style={{
            background: 'rgba(212, 175, 122, 0.08)',
            border: `1px solid ${palette.hairline}`,
            padding: '0.15rem 0.5rem', borderRadius: 2,
            fontFamily: fonts.mono, color: palette.champagne,
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
      background: `linear-gradient(180deg, ${palette.onyx} 0%, ${palette.onyxLight} 100%)`,
      color: palette.pearl,
      fontFamily: fonts.sans,
      WebkitFontSmoothing: 'antialiased',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <FilmGrainOverlay />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navigation activeSection={activeSection} />
        <HeroSection profile={profile} />
        <Divider />
        <ScrollReveal><AboutSection profile={profile} /></ScrollReveal>
        <Divider />
        <ScrollReveal><ExperienceSection experiences={experiences} /></ScrollReveal>
        <Divider />
        <ScrollReveal><WorkSection projects={projects} campaigns={campaigns} /></ScrollReveal>
        <Divider />
        <ScrollReveal><SkillsSection skills={skills} /></ScrollReveal>
        <Divider />
        <ScrollReveal><EducationSection education={education} /></ScrollReveal>
        <Divider />
        <ScrollReveal><ContactSection profile={profile} /></ScrollReveal>
        <Footer profile={profile} />
      </div>

      {/* Global responsive styles + Noir Edition animations */}
      <style>{`
        @keyframes noir-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px rgba(212, 175, 122, 0.6); }
          50% { opacity: 0.5; transform: scale(0.7); box-shadow: 0 0 4px rgba(212, 175, 122, 0.3); }
        }

        /* ---- Noir Edition keyframes ---- */
        @keyframes noir-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes noir-shimmer {
          0%, 100% { background-position: 200% 0; }
          50%      { background-position: -200% 0; }
        }
        @keyframes noir-sweep {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50%      { transform: translateX(100%); opacity: 1; }
        }
        @keyframes noir-reveal-in {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---- ScrollReveal ---- */
        .noir-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }
        .noir-reveal--in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---- Stat card shimmer on hover ---- */
        .noir-stat-card:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-3px);
          box-shadow: 0 16px 40px -12px rgba(212, 175, 122, 0.18);
        }
        .noir-stat-card:hover .noir-shimmer-sweep {
          opacity: 1;
        }

        /* ---- CTA primary shine on hover ---- */
        .noir-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px -8px rgba(212, 175, 122, 0.55) !important;
        }
        .noir-cta-primary:hover .noir-cta-shine {
          transform: translateX(100%);
        }

        /* ---- CTA secondary ---- */
        .noir-cta-secondary:hover {
          border-color: ${palette.champagne} !important;
          background: rgba(212, 175, 122, 0.06);
        }

        /* ---- Pill (contact in About) ---- */
        .noir-pill:hover {
          border-color: ${palette.hairlineHi} !important;
          background: ${palette.graphite};
          color: ${palette.pearl};
        }

        /* ---- Nav links underline ---- */
        .noir-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 1px;
          background: ${palette.champagne};
          transition: width 0.3s, left 0.3s;
        }
        .noir-nav-link:hover::after,
        .noir-nav-link[style*="color: #d4af7a"]::after {
          width: 18px; left: calc(50% - 9px);
        }

        /* ---- Principle cards ---- */
        .noir-principle-card:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-3px);
          background: linear-gradient(170deg, ${palette.graphite}, ${palette.charcoal}) !important;
        }

        /* ---- Project cards ---- */
        .noir-project-card { transition: all 0.45s cubic-bezier(0.16,1,0.3,1); }
        .noir-project-card:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -16px rgba(212, 175, 122, 0.18);
        }
        .noir-project-card:hover img {
          transform: scale(1.06);
        }

        /* ---- Skill cards ---- */
        .noir-skill-card {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .noir-skill-card:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-3px);
        }

        /* ---- Education cards ---- */
        .noir-edu-card {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .noir-edu-card:hover {
          border-color: ${palette.hairlineHi} !important;
        }

        /* ---- Contact cards ---- */
        .noir-contact-card { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .noir-contact-card:hover {
          border-color: ${palette.champagne} !important;
          transform: translateY(-4px);
          box-shadow: 0 16px 40px -12px rgba(212, 175, 122, 0.18);
        }
        .noir-contact-card:hover .noir-arrow {
          color: ${palette.champagne};
          transform: translate(2px, -2px);
        }
        .noir-arrow { transition: all 0.3s; }

        /* ---- Experience rows ---- */
        .noir-exp-row {
          transition: background 0.3s;
        }
        .noir-exp-row:hover {
          background: rgba(212, 175, 122, 0.02);
        }

        /* ---- Back to top button ---- */
        .noir-back-top:hover {
          background: rgba(212, 175, 122, 0.12);
          border-color: ${palette.champagne} !important;
          transform: translateY(-2px);
        }

        /* ---- Reduced motion: disable all noir animations ---- */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .noir-reveal { opacity: 1 !important; transform: none !important; }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
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
          .noir-exp-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section h1 {
            font-size: 2.4rem !important;
          }
        }
      `}</style>
    </div>
  );
}
