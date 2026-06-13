'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Mail,
  Phone,
  Linkedin,
  ChevronUp,
  ExternalLink,
  Search,
  Lightbulb,
  Users,
  Target,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Menu,
  X,
  MapPin,
  Award,
  Sparkles,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

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
  category: string;
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  order: number;
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
  tags: string;
  imageUrl: string;
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
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Color Constants                                                    */
/* ------------------------------------------------------------------ */

const colors = {
  navy: '#0B1120',
  navyLight: '#111827',
  navyCard: '#1A2332',
  gold: '#D4A853',
  goldLight: '#E4BD6E',
  goldDark: '#B8923F',
  white: '#FFFFFF',
  slate: '#94A3B8',
  slateMuted: '#64748B',
  border: '#1E293B',
};

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B1120] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-16 w-3/4 bg-[#1A2332]" />
        <Skeleton className="h-8 w-1/2 bg-[#1A2332]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 bg-[#1A2332] rounded-xl" />
          ))}
        </div>
        <div className="space-y-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-[#1A2332] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Heading Component                                          */
/* ------------------------------------------------------------------ */

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      custom={0}
    >
      <p className="text-[#D4A853] text-sm font-semibold tracking-wider uppercase mb-2">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">{title}</h2>
      <div className="w-12 h-0.5 bg-[#D4A853] mb-10" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [campaigns, setCampaings] = useState<CampaignData[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategoryData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  /* ---- Data fetching ---- */
  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, projectsRes, expRes, campRes, skillsRes, eduRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/projects'),
          fetch('/api/experiences'),
          fetch('/api/campaigns'),
          fetch('/api/skills'),
          fetch('/api/education'),
        ]);

        const [profileData, projectsData, expData, campData, skillsData, eduData] = await Promise.all([
          profileRes.ok ? profileRes.json() : null,
          projectsRes.ok ? projectsRes.json() : [],
          expRes.ok ? expRes.json() : [],
          campRes.ok ? campRes.json() : [],
          skillsRes.ok ? skillsRes.json() : [],
          eduRes.ok ? eduRes.json() : [],
        ]);

        setProfile(profileData);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setExperiences(Array.isArray(expData) ? expData : []);
        setCampaings(Array.isArray(campData) ? campData : []);
        setSkillCategories(Array.isArray(skillsData) ? skillsData : []);
        setEducation(Array.isArray(eduData) ? eduData : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ---- Scroll detection for nav ---- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---- Smooth scroll ---- */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  /* ---- Project filter ---- */
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter);

  /* ---- Loading state ---- */
  if (loading) return <LoadingSkeleton />;
  if (!profile) return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-[#94A3B8]">Loading portfolio...</p>
      </div>
    </div>
  );

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'work', label: 'Work' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  const approachCards = [
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Research-First',
      desc: 'Every strategy starts with data, competitive analysis, and deep audience understanding before creative execution begins.',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Creative Problem Solving',
      desc: 'Turning insights into innovative campaigns that resonate with audiences and deliver measurable business results.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Cross-Functional Leadership',
      desc: 'Bridging sales, marketing, and operations to align cross-functional teams around shared strategic objectives.',
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Results-Driven',
      desc: 'Focused on measurable outcomes — from footfall and engagement rate to revenue impact and brand equity growth.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-white">
      {/* ================================================================ */}
      {/*  NAVIGATION                                                      */}
      {/* ================================================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B1120]/95 backdrop-blur-xl border-b border-[#1E293B] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl font-bold tracking-tight cursor-pointer"
            >
              <span className="text-white">M</span>
              <span className="text-[#D4A853]">.</span>
              <span className="text-white">A</span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-3 py-2 text-sm transition-colors rounded-md cursor-pointer text-[#94A3B8] hover:text-[#D4A853] hover:bg-[#D4A853]/10"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 transition-colors cursor-pointer text-[#94A3B8] hover:text-[#D4A853]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden backdrop-blur-xl border-b overflow-hidden bg-[#0B1120]/95 border-[#1E293B]"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="block w-full text-left px-3 py-2.5 text-sm transition-colors rounded-md cursor-pointer text-[#94A3B8] hover:text-[#D4A853] hover:bg-[#D4A853]/10"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================================================================ */}
      {/*  MAIN CONTENT                                                    */}
      {/* ================================================================ */}
      <main className="flex-1">
        {/* ============================================================== */}
        {/*  HERO SECTION                                                   */}
        {/* ============================================================== */}
        <motion.section style={{ opacity: heroOpacity }} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[#0B1120]">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,168,83,0.15) 1px, transparent 0)`,
              backgroundSize: '48px 48px',
            }} />
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D4A853]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#D4A853]/3 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            {/* Available badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A853]/10 border border-[#D4A853]/25 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-pulse" />
              <span className="text-[#D4A853] text-xs font-medium tracking-wide uppercase">Open to Opportunities</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]"
            >
              Mohamed{' '}
              <span className="text-[#D4A853]">Medhat</span>
              <br className="hidden sm:block" />
              {' '}Ahmed
              <span className="text-[#D4A853]">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg sm:text-xl text-[#94A3B8] mb-10 max-w-xl mx-auto"
            >
              {profile?.heroSubtitle || 'Marketing & Business Development'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                onClick={() => scrollTo('work')}
                size="lg"
                className="bg-[#D4A853] hover:bg-[#B8923F] text-[#0B1120] font-semibold px-8 py-6 text-base rounded-xl cursor-pointer shadow-lg shadow-[#D4A853]/20"
              >
                View My Work
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => scrollTo('contact')}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6 text-base rounded-xl cursor-pointer"
              >
                Get In Touch
              </Button>
            </motion.div>

            {/* Stats — 2x2 grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-16"
            >
              {profile &&
                [
                  { value: profile.stat1Value, label: profile.stat1Label, sub: profile.stat1Sub },
                  { value: profile.stat2Value, label: profile.stat2Label, sub: profile.stat2Sub },
                  { value: profile.stat3Value, label: profile.stat3Label, sub: profile.stat3Sub },
                  { value: profile.stat4Value, label: profile.stat4Label, sub: profile.stat4Sub },
                ].map((stat, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <div className="bg-[#1A2332]/60 border border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl p-4 sm:p-5 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#D4A853] mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-white/80">{stat.label}</div>
                      <div className="text-xs text-[#64748B] mt-0.5">{stat.sub}</div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>

            {/* Quote */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="max-w-2xl mx-auto"
            >
              <Separator className="bg-[#1E293B] mb-6" />
              <p className="text-[#64748B] italic text-sm sm:text-base">
                &ldquo;{profile?.quote || 'Understand the problem deeply, then solve it creatively.'}&rdquo;
              </p>
              <p className="text-[#4A5568] text-xs mt-2">— {profile?.name || 'Mohamed Medhat Ahmed'}</p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1">
              <div className="w-1 h-2 bg-[#D4A853] rounded-full" />
            </div>
          </motion.div>
        </motion.section>

        {/* ============================================================== */}
        {/*  ABOUT SECTION                                                  */}
        {/* ============================================================== */}
        <section id="about" className="py-20 sm:py-28 bg-[#111827]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="About" title="Get to Know Me" />

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
              {/* Left: Info */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                custom={1}
                className="lg:col-span-2 space-y-5"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white">{profile?.name}</h3>
                <p className="text-[#D4A853] font-medium">{profile?.title}</p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:${profile?.email}`}
                    className="flex items-center gap-3 text-[#94A3B8] hover:text-[#D4A853] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1A2332] border border-[#1E293B] flex items-center justify-center group-hover:bg-[#D4A853]/10 group-hover:border-[#D4A853]/30 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.email}</span>
                  </a>
                  <a
                    href={`tel:${profile?.phone}`}
                    className="flex items-center gap-3 text-[#94A3B8] hover:text-[#D4A853] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1A2332] border border-[#1E293B] flex items-center justify-center group-hover:bg-[#D4A853]/10 group-hover:border-[#D4A853]/30 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.phone}</span>
                  </a>
                  <a
                    href={`https://linkedin.com/in/${profile?.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#94A3B8] hover:text-[#D4A853] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1A2332] border border-[#1E293B] flex items-center justify-center group-hover:bg-[#D4A853]/10 group-hover:border-[#D4A853]/30 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>

              {/* Right: Bio + Approach */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                custom={2}
                className="lg:col-span-3 space-y-8"
              >
                <div className="space-y-4">
                  {profile?.bio.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-[#94A3B8] leading-relaxed text-sm sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Approach cards */}
                <div className="grid sm:grid-cols-2 gap-3 pt-4">
                  {approachCards.map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                    >
                      <div className="bg-[#1A2332] border border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 h-full rounded-xl p-4 sm:p-5">
                        <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10 flex items-center justify-center mb-3 text-[#D4A853]">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-1">{feature.title}</h4>
                        <p className="text-[#64748B] text-xs leading-relaxed">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  EXPERIENCE SECTION                                             */}
        {/* ============================================================== */}
        <section id="experience" className="py-20 sm:py-28 bg-[#0B1120]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Career" title="Work Experience" />

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4A853]/40 via-[#D4A853]/15 to-transparent" />

              <div className="space-y-8 sm:space-y-10">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    custom={i}
                    className="relative pl-12 md:pl-20"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3 h-3 rounded-full bg-[#D4A853] shadow-lg shadow-[#D4A853]/30" />
                    <div className="absolute left-1.5 md:left-5.5 top-0.5 w-4.5 h-4.5 rounded-full border-2 border-[#D4A853]/20 bg-[#0B1120]" />

                    <Card className="bg-[#1A2332] border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                            <p className="text-[#D4A853] text-sm font-medium">{exp.company}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-[#D4A853]/20 text-[#D4A853] text-xs w-fit shrink-0 bg-[#D4A853]/5"
                          >
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="text-[#94A3B8] text-sm mb-4 leading-relaxed">{exp.description}</p>
                        {exp.highlights && (
                          <div className="flex flex-wrap gap-2">
                            {exp.highlights.split(',').map((h, hi) => (
                              <Badge
                                key={hi}
                                className="bg-[#111827] text-[#94A3B8] border border-[#1E293B] text-xs font-medium"
                              >
                                {h.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  SELECTED WORK SECTION                                          */}
        {/* ============================================================== */}
        <section id="work" className="py-20 sm:py-28 bg-[#111827]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Portfolio" title="Selected Work" />

            {/* Filter buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="flex flex-wrap gap-2 mb-8"
            >
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeFilter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(cat)}
                  className={
                    activeFilter === cat
                      ? 'bg-[#D4A853] hover:bg-[#B8923F] text-[#0B1120] font-medium rounded-lg cursor-pointer'
                      : 'border-[#1E293B] text-[#94A3B8] hover:text-[#D4A853] hover:border-[#D4A853]/30 rounded-lg cursor-pointer'
                  }
                >
                  {cat}
                </Button>
              ))}
            </motion.div>

            {/* Project grid */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    custom={i}
                  >
                    <Card className="overflow-hidden bg-[#1A2332] border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 group rounded-xl shadow-sm h-full">
                      {/* Image / Logo header */}
                      <div className="h-40 sm:h-48 relative overflow-hidden bg-[#111827]">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A2332] via-[#162030] to-[#0B1120]">
                            <div className="w-20 h-20 rounded-2xl bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
                              <span className="text-3xl font-bold text-[#D4A853]">
                                {project.title?.charAt(0)?.toUpperCase() || 'P'}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#D4A853]/20 text-[#D4A853] border-0 text-xs backdrop-blur-sm">
                            {project.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-[#D4A853] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.split(',').map((tag, ti) => (
                              <Badge
                                key={ti}
                                variant="outline"
                                className="border-[#1E293B] text-[#64748B] text-xs"
                              >
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  CAMPAIGN CONCEPTS SECTION                                      */}
        {/* ============================================================== */}
        <section id="campaigns" className="py-20 sm:py-28 bg-[#0B1120]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Creative" title="Campaign Concepts" />

            <div className="space-y-6">
              {campaigns.map((campaign, i) => {
                let details: Record<string, string> = {};
                try {
                  details = JSON.parse(campaign.details || '{}');
                } catch {
                  // ignore parse errors
                }

                const tags = campaign.tags ? campaign.tags.split(',').map((t) => t.trim()) : [];

                return (
                  <motion.div
                    key={campaign.id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    custom={i}
                  >
                    <div className="bg-[#1A2332] border border-[#1E293B] hover:border-[#D4A853]/25 transition-all duration-300 rounded-xl overflow-hidden">
                      {/* Campaign image if available */}
                      {campaign.imageUrl && (
                        <div className="h-48 sm:h-56 relative overflow-hidden">
                          <img
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-5 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Left: Campaign info */}
                          <div className="flex-1 space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">{campaign.title}</h3>
                            <p className="text-[#D4A853] text-sm font-medium">{campaign.subtitle}</p>
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{campaign.description}</p>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {tags.map((tag, ti) => (
                                  <Badge
                                    key={ti}
                                    className="bg-[#D4A853]/10 text-[#D4A853] border-0 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right: Details table */}
                          {Object.keys(details).length > 0 && (
                            <div className="lg:w-72 shrink-0">
                              <div className="bg-[#111827] rounded-lg border border-[#1E293B] overflow-hidden">
                                <div className="px-4 py-2.5 bg-[#D4A853]/10 border-b border-[#1E293B]">
                                  <span className="text-xs font-semibold text-[#D4A853] uppercase tracking-wider">
                                    Campaign Details
                                  </span>
                                </div>
                                <div className="divide-y divide-[#1E293B]">
                                  {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="px-4 py-2.5 flex justify-between items-center gap-4">
                                      <span className="text-xs text-[#64748B] capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>
                                      <span className="text-xs text-[#94A3B8] font-medium text-right">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  SKILLS SECTION                                                 */}
        {/* ============================================================== */}
        <section id="skills" className="py-20 sm:py-28 bg-[#111827]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Expertise" title="Skills & Competencies" />

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {skillCategories.map((category, i) => {
                let skills: string[] = [];
                try {
                  skills = JSON.parse(category.skills || '[]');
                } catch {
                  // ignore
                }

                return (
                  <motion.div
                    key={category.id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <Card className="bg-[#1A2332] border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 h-full rounded-xl shadow-sm">
                      <CardContent className="p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#D4A853]" />
                          {category.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, si) => (
                            <span
                              key={si}
                              className="px-3 py-1.5 text-xs font-medium bg-[#111827] text-[#94A3B8] rounded-lg border border-[#1E293B] hover:bg-[#D4A853]/10 hover:text-[#D4A853] hover:border-[#D4A853]/20 transition-all duration-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  EDUCATION SECTION                                              */}
        {/* ============================================================== */}
        <section id="education" className="py-20 sm:py-28 bg-[#0B1120]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Background" title="Education" />

            <div className="space-y-4 sm:space-y-6">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <Card className="bg-[#1A2332] border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl shadow-sm">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-6 h-6 text-[#D4A853]" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white">{edu.degree}</h3>
                            <Badge
                              variant="outline"
                              className="border-[#D4A853]/20 text-[#D4A853] text-xs w-fit shrink-0 bg-[#D4A853]/5"
                            >
                              {edu.year}
                            </Badge>
                          </div>
                          <p className="text-[#D4A853] text-sm font-medium">{edu.institution}</p>
                          {edu.details && (
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{edu.details}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/*  CONTACT SECTION                                                */}
        {/* ============================================================== */}
        <section id="contact" className="py-20 sm:py-28 bg-[#111827]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
              className="text-center"
            >
              <p className="text-[#D4A853] text-sm font-semibold tracking-wider uppercase mb-2">Connect</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
                Get In Touch
              </h2>
              <div className="w-12 h-0.5 bg-[#D4A853] mx-auto mb-8" />
              <p className="text-[#94A3B8] text-sm sm:text-base max-w-lg mx-auto mb-10">
                Interested in working together or have a project in mind? I&apos;d love to hear from you.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
            >
              <motion.a
                variants={staggerItem}
                href={`mailto:${profile?.email}`}
                className="group"
              >
                <div className="bg-[#1A2332] border border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center group-hover:bg-[#D4A853]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Email</p>
                    <p className="text-sm text-[#94A3B8] group-hover:text-[#D4A853] transition-colors break-all">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href={`https://linkedin.com/in/${profile?.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-[#1A2332] border border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center group-hover:bg-[#D4A853]/20 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">LinkedIn</p>
                    <p className="text-sm text-[#94A3B8] group-hover:text-[#D4A853] transition-colors">
                      View Profile
                    </p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href={`tel:${profile?.phone}`}
                className="group"
              >
                <div className="bg-[#1A2332] border border-[#1E293B] hover:border-[#D4A853]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center group-hover:bg-[#D4A853]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Phone</p>
                    <p className="text-sm text-[#94A3B8] group-hover:text-[#D4A853] transition-colors">
                      {profile?.phone}
                    </p>
                  </div>
                </div>
              </motion.a>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              className="text-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#D4A853] hover:bg-[#B8923F] text-[#0B1120] font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-[#D4A853]/20"
              >
                <a href={`mailto:${profile?.email}`}>
                  Send an Email
                  <Send className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ================================================================ */}
      {/*  FOOTER                                                          */}
      {/* ================================================================ */}
      <footer className="mt-auto bg-[#070D18] border-t border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                <span className="text-white/80">M</span>
                <span className="text-[#D4A853]">.</span>
                <span className="text-white/80">A</span>
              </span>
              <span className="text-[#1E293B] text-sm">|</span>
              <span className="text-[#64748B] text-xs">
                &copy; {new Date().getFullYear()} Mohamed Medhat Ahmed. All rights reserved.
              </span>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-xl bg-[#1A2332] hover:bg-[#D4A853]/20 flex items-center justify-center text-[#64748B] hover:text-[#D4A853] transition-all cursor-pointer border border-[#1E293B]"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
