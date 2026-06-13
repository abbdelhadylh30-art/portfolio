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
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f5] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-16 w-3/4 bg-warm-100" />
        <Skeleton className="h-8 w-1/2 bg-warm-100" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 bg-warm-100 rounded-xl" />
          ))}
        </div>
        <div className="space-y-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-warm-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
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
          profileRes.json(),
          projectsRes.json(),
          expRes.json(),
          campRes.json(),
          skillsRes.json(),
          eduRes.json(),
        ]);

        setProfile(profileData);
        setProjects(projectsData);
        setExperiences(expData);
        setCampaings(campData);
        setSkillCategories(skillsData);
        setEducation(eduData);
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
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1a1816]">
      {/* ================================================================ */}
      {/*  NAVIGATION                                                      */}
      {/* ================================================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#faf8f5]/95 backdrop-blur-xl border-b border-[#e8e2d8] shadow-sm'
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
              <span className={scrolled ? 'text-[#1a1816]' : 'text-white'}>M</span>
              <span className="text-[#c45d2c]">.</span>
              <span className={scrolled ? 'text-[#1a1816]' : 'text-white'}>A</span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3 py-2 text-sm transition-colors rounded-md cursor-pointer ${
                    scrolled
                      ? 'text-[#7a7570] hover:text-[#c45d2c] hover:bg-[#f3efe8]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className={`md:hidden p-2 transition-colors cursor-pointer ${
                scrolled ? 'text-[#7a7570] hover:text-[#1a1816]' : 'text-white/70 hover:text-white'
              }`}
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
              className={`md:hidden backdrop-blur-xl border-b overflow-hidden ${
                scrolled ? 'bg-[#faf8f5]/95 border-[#e8e2d8]' : 'bg-[#1a1816]/95 border-white/10'
              }`}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`block w-full text-left px-3 py-2.5 text-sm transition-colors rounded-md cursor-pointer ${
                      scrolled
                        ? 'text-[#7a7570] hover:text-[#c45d2c] hover:bg-[#f3efe8]'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
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
          <div className="absolute inset-0 bg-[#1a1816]">
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '48px 48px',
            }} />
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#c45d2c]/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c45d2c]/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            {/* Available badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c45d2c]/15 border border-[#c45d2c]/25 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#c45d2c] animate-pulse" />
              <span className="text-[#e8915a] text-xs font-medium tracking-wide uppercase">Open to Opportunities</span>
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
              <span className="text-[#c45d2c]">Medhat</span>
              <br className="hidden sm:block" />
              {' '}Ahmed
              <span className="text-[#c45d2c]">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg sm:text-xl text-[#9a9590] mb-10 max-w-xl mx-auto"
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
                className="bg-[#c45d2c] hover:bg-[#a84d24] text-white font-semibold px-8 py-6 text-base rounded-xl cursor-pointer shadow-lg shadow-[#c45d2c]/20"
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

            {/* Stats */}
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
                    <div className="bg-white/[0.04] border border-white/[0.08] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl p-4 sm:p-5 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#c45d2c] mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-white/80">{stat.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{stat.sub}</div>
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
              <Separator className="bg-white/10 mb-6" />
              <p className="text-white/40 italic text-sm sm:text-base">
                &ldquo;{profile?.quote || 'Understand the problem deeply, then solve it creatively.'}&rdquo;
              </p>
              <p className="text-white/25 text-xs mt-2">— {profile?.name || 'Mohamed Medhat Ahmed'}</p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1">
              <div className="w-1 h-2 bg-[#c45d2c] rounded-full" />
            </div>
          </motion.div>
        </motion.section>

        {/* ============================================================== */}
        {/*  ABOUT SECTION                                                  */}
        {/* ============================================================== */}
        <section id="about" className="py-20 sm:py-28 bg-[#faf8f5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">About</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1a1816]">
                Get to Know Me
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-10" />
            </motion.div>

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
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1a1816]">{profile?.name}</h3>
                <p className="text-[#c45d2c] font-medium">{profile?.title}</p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:${profile?.email}`}
                    className="flex items-center gap-3 text-[#7a7570] hover:text-[#c45d2c] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#f3efe8] flex items-center justify-center group-hover:bg-[#c45d2c]/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.email}</span>
                  </a>
                  <a
                    href={`tel:${profile?.phone}`}
                    className="flex items-center gap-3 text-[#7a7570] hover:text-[#c45d2c] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#f3efe8] flex items-center justify-center group-hover:bg-[#c45d2c]/10 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.phone}</span>
                  </a>
                  <a
                    href={`https://linkedin.com/in/${profile?.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#7a7570] hover:text-[#c45d2c] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#f3efe8] flex items-center justify-center group-hover:bg-[#c45d2c]/10 transition-colors">
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
                    <p key={i} className="text-[#5a5550] leading-relaxed text-sm sm:text-base">
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
                      <div className="bg-white border border-[#e8e2d8] hover:border-[#c45d2c]/30 transition-all duration-300 h-full rounded-xl p-4 sm:p-5">
                        <div className="w-10 h-10 rounded-lg bg-[#c45d2c]/10 flex items-center justify-center mb-3 text-[#c45d2c]">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-[#1a1816] text-sm mb-1">{feature.title}</h4>
                        <p className="text-[#7a7570] text-xs leading-relaxed">{feature.desc}</p>
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
        <section id="experience" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Career</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1a1816]">
                Work Experience
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-12" />
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#c45d2c]/40 via-[#c45d2c]/15 to-transparent" />

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
                    <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3 h-3 rounded-full bg-[#c45d2c] shadow-lg shadow-[#c45d2c]/30" />
                    <div className="absolute left-1.5 md:left-5.5 top-0.5 w-4.5 h-4.5 rounded-full border-2 border-[#c45d2c]/20 bg-white" />

                    <Card className="bg-white border-[#e8e2d8] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#1a1816]">{exp.role}</h3>
                            <p className="text-[#c45d2c] text-sm font-medium">{exp.company}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-[#c45d2c]/20 text-[#c45d2c] text-xs w-fit shrink-0 bg-[#c45d2c]/5"
                          >
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="text-[#5a5550] text-sm mb-4 leading-relaxed">{exp.description}</p>
                        {exp.highlights && (
                          <div className="flex flex-wrap gap-2">
                            {exp.highlights.split(',').map((h, hi) => (
                              <Badge
                                key={hi}
                                className="bg-[#f3efe8] text-[#5a5550] border-0 text-xs font-medium"
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
        <section id="work" className="py-20 sm:py-28 bg-[#faf8f5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1a1816]">
                Selected Work
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-8" />
            </motion.div>

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
                      ? 'bg-[#c45d2c] hover:bg-[#a84d24] text-white font-medium rounded-lg cursor-pointer'
                      : 'border-[#e8e2d8] text-[#7a7570] hover:text-[#c45d2c] hover:border-[#c45d2c]/30 rounded-lg cursor-pointer'
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
                    <Card className="overflow-hidden bg-white border-[#e8e2d8] hover:border-[#c45d2c]/30 transition-all duration-300 group rounded-xl shadow-sm h-full">
                      {/* Gradient header */}
                      <div className="h-32 sm:h-40 bg-gradient-to-br from-[#2c2825] via-[#3a3228] to-[#1a1816] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.08]" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(196,93,44,0.3) 1px, transparent 0)`,
                          backgroundSize: '24px 24px',
                        }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Briefcase className="w-12 h-12 text-[#c45d2c]/20 group-hover:text-[#c45d2c]/40 transition-colors" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#c45d2c]/20 text-[#e8915a] border-0 text-xs backdrop-blur-sm">
                            {project.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1a1816] mb-2 group-hover:text-[#c45d2c] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-[#5a5550] text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.split(',').map((tag, ti) => (
                              <Badge
                                key={ti}
                                variant="outline"
                                className="border-[#e8e2d8] text-[#7a7570] text-xs"
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
        <section id="campaigns" className="py-20 sm:py-28 bg-[#1a1816]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Creative</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                Campaign Concepts
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-12" />
            </motion.div>

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
                    <div className="bg-white/[0.03] border border-white/[0.08] hover:border-[#c45d2c]/25 transition-all duration-300 rounded-xl overflow-hidden">
                      <div className="p-5 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Left: Campaign info */}
                          <div className="flex-1 space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">{campaign.title}</h3>
                            <p className="text-[#c45d2c] text-sm font-medium">{campaign.subtitle}</p>
                            <p className="text-[#9a9590] text-sm leading-relaxed">{campaign.description}</p>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {tags.map((tag, ti) => (
                                  <Badge
                                    key={ti}
                                    className="bg-[#c45d2c]/10 text-[#e8915a] border-0 text-xs"
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
                              <div className="bg-white/[0.04] rounded-lg border border-white/[0.08] overflow-hidden">
                                <div className="px-4 py-2.5 bg-[#c45d2c]/10 border-b border-white/[0.08]">
                                  <span className="text-xs font-semibold text-[#c45d2c] uppercase tracking-wider">
                                    Campaign Details
                                  </span>
                                </div>
                                <div className="divide-y divide-white/[0.05]">
                                  {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="px-4 py-2.5 flex justify-between items-center gap-4">
                                      <span className="text-xs text-[#7a7570] capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>
                                      <span className="text-xs text-[#d4c8bc] font-medium text-right">
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
        <section id="skills" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Expertise</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1a1816]">
                Skills & Competencies
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-12" />
            </motion.div>

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
                    <Card className="bg-white border-[#e8e2d8] hover:border-[#c45d2c]/30 transition-all duration-300 h-full rounded-xl shadow-sm">
                      <CardContent className="p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1a1816] mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#c45d2c]" />
                          {category.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, si) => (
                            <span
                              key={si}
                              className="px-3 py-1.5 text-xs font-medium bg-[#f3efe8] text-[#5a5550] rounded-lg border border-[#e8e2d8] hover:bg-[#c45d2c]/10 hover:text-[#c45d2c] hover:border-[#c45d2c]/20 transition-all duration-200"
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
        <section id="education" className="py-20 sm:py-28 bg-[#faf8f5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Background</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1a1816]">
                Education
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-12" />
            </motion.div>

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
                  <Card className="bg-white border-[#e8e2d8] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl shadow-sm">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#c45d2c]/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-6 h-6 text-[#c45d2c]" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-[#1a1816]">{edu.degree}</h3>
                            <Badge
                              variant="outline"
                              className="border-[#c45d2c]/20 text-[#c45d2c] text-xs w-fit shrink-0 bg-[#c45d2c]/5"
                            >
                              {edu.year}
                            </Badge>
                          </div>
                          <p className="text-[#c45d2c] text-sm font-medium">{edu.institution}</p>
                          {edu.details && (
                            <p className="text-[#5a5550] text-sm leading-relaxed">{edu.details}</p>
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
        <section id="contact" className="py-20 sm:py-28 bg-[#1a1816]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
              className="text-center"
            >
              <p className="text-[#c45d2c] text-sm font-semibold tracking-wider uppercase mb-2">Connect</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                Get In Touch
              </h2>
              <Separator className="bg-[#c45d2c]/30 w-16 mb-8 mx-auto" />
              <p className="text-[#9a9590] text-sm sm:text-base max-w-lg mx-auto mb-10">
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
                <div className="bg-white/[0.04] border border-white/[0.08] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#c45d2c]/10 flex items-center justify-center group-hover:bg-[#c45d2c]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#c45d2c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7a7570] mb-1">Email</p>
                    <p className="text-sm text-[#d4c8bc] group-hover:text-[#c45d2c] transition-colors break-all">
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
                <div className="bg-white/[0.04] border border-white/[0.08] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#c45d2c]/10 flex items-center justify-center group-hover:bg-[#c45d2c]/20 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#c45d2c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7a7570] mb-1">LinkedIn</p>
                    <p className="text-sm text-[#d4c8bc] group-hover:text-[#c45d2c] transition-colors">
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
                <div className="bg-white/[0.04] border border-white/[0.08] hover:border-[#c45d2c]/30 transition-all duration-300 rounded-xl cursor-pointer h-full p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#c45d2c]/10 flex items-center justify-center group-hover:bg-[#c45d2c]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[#c45d2c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7a7570] mb-1">Phone</p>
                    <p className="text-sm text-[#d4c8bc] group-hover:text-[#c45d2c] transition-colors">
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
                className="bg-[#c45d2c] hover:bg-[#a84d24] text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-[#c45d2c]/20"
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
      <footer className="mt-auto bg-[#0f0e0d] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                <span className="text-white/80">M</span>
                <span className="text-[#c45d2c]">.</span>
                <span className="text-white/80">A</span>
              </span>
              <span className="text-white/20 text-sm">|</span>
              <span className="text-white/40 text-xs">
                &copy; {new Date().getFullYear()} Mohamed Medhat Ahmed. All rights reserved.
              </span>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#c45d2c]/20 flex items-center justify-center text-white/40 hover:text-[#c45d2c] transition-all cursor-pointer"
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
