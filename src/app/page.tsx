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
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Gradient backgrounds for project cards                             */
/* ------------------------------------------------------------------ */

const cardGradients = [
  'from-emerald-900/40 via-teal-900/30 to-cyan-900/20',
  'from-teal-900/40 via-emerald-900/30 to-green-900/20',
  'from-green-900/40 via-emerald-900/30 to-teal-900/20',
  'from-cyan-900/40 via-teal-900/30 to-emerald-900/20',
];

/* ------------------------------------------------------------------ */
/*  Loading Skeleton Component                                         */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-16 w-3/4 bg-white/5" />
        <Skeleton className="h-8 w-1/2 bg-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="space-y-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-white/5 rounded-xl" />
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

  const featureCards = [
    {
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      title: 'Research-First',
      desc: 'Every strategy starts with data, competitive analysis, and deep audience understanding.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-emerald-400" />,
      title: 'Creative Problem Solving',
      desc: 'Turning insights into innovative campaigns that resonate and deliver measurable results.',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: 'Cross-Functional Leadership',
      desc: 'Bridging sales, marketing, and operations to align teams around shared objectives.',
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: 'Results-Driven',
      desc: 'Focused on measurable outcomes — from footfall to engagement rate to revenue impact.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* ================================================================ */}
      {/*  NAVIGATION                                                      */}
      {/* ================================================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent'
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
              <span className="text-emerald-500">.</span>
              <span className="text-white">A</span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors rounded-md hover:bg-white/5 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
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
              className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="block w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors rounded-md hover:bg-white/5 cursor-pointer"
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
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[#0a0a0a]">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              Mohamed
              <span className="text-emerald-500">Medhat</span>
              Ahmed
              <span className="text-emerald-500">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              {profile?.heroSubtitle || 'Marketing & Business Development'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                onClick={() => scrollTo('work')}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-6 text-base rounded-xl cursor-pointer"
              >
                View My Work
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => scrollTo('contact')}
                variant="outline"
                size="lg"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 px-8 py-6 text-base rounded-xl cursor-pointer"
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
                    <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl">
                      <CardContent className="p-4 sm:p-5 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-300">{stat.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
                      </CardContent>
                    </Card>
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
              <Separator className="bg-white/5 mb-6" />
              <p className="text-gray-500 italic text-sm sm:text-base">
                &ldquo;{profile?.quote || 'Understand the problem deeply, then solve it creatively.'}&rdquo;
              </p>
              <p className="text-gray-600 text-xs mt-2">— {profile?.name || 'Mohamed Medhat Ahmed'}</p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1">
              <div className="w-1 h-2 bg-emerald-500 rounded-full" />
            </div>
          </motion.div>
        </motion.section>

        {/* ============================================================== */}
        {/*  ABOUT SECTION                                                  */}
        {/* ============================================================== */}
        <section id="about" className="py-20 sm:py-28 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                About <span className="text-emerald-500">Me</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-8" />
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
                <h3 className="text-xl sm:text-2xl font-semibold text-white">{profile?.name}</h3>
                <p className="text-emerald-400 font-medium">{profile?.title}</p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:${profile?.email}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.email}</span>
                  </a>
                  <a
                    href={`tel:${profile?.phone}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile?.phone}</span>
                  </a>
                  <a
                    href={`https://linkedin.com/in/${profile?.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>

              {/* Right: Bio + Features */}
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
                    <p key={i} className="text-gray-400 leading-relaxed text-sm sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Feature cards */}
                <div className="grid sm:grid-cols-2 gap-3 pt-4">
                  {featureCards.map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                    >
                      <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 h-full rounded-xl">
                        <CardContent className="p-4 sm:p-5">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                            {feature.icon}
                          </div>
                          <h4 className="font-semibold text-white text-sm mb-1">{feature.title}</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                        </CardContent>
                      </Card>
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
        <section id="experience" className="py-20 sm:py-28 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Work <span className="text-emerald-500">Experience</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-12" />
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-transparent" />

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
                    <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                    <div className="absolute left-1.5 md:left-5.5 top-0.5 w-4.5 h-4.5 rounded-full border-2 border-emerald-500/30 bg-[#0d0d0d]" />

                    <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                            <p className="text-emerald-400 text-sm font-medium">{exp.company}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-emerald-500/20 text-emerald-400 text-xs w-fit shrink-0"
                          >
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exp.description}</p>
                        {exp.highlights && (
                          <div className="flex flex-wrap gap-2">
                            {exp.highlights.split(',').map((h, hi) => (
                              <Badge
                                key={hi}
                                className="bg-emerald-500/10 text-emerald-300 border-0 text-xs"
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
        <section id="work" className="py-20 sm:py-28 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Selected <span className="text-emerald-500">Work</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-8" />
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
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg cursor-pointer'
                      : 'border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 rounded-lg cursor-pointer'
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
                    <Card className="overflow-hidden bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 group rounded-xl h-full">
                      {/* Gradient header */}
                      <div
                        className={`h-32 sm:h-40 bg-gradient-to-br ${cardGradients[i % cardGradients.length]} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                          backgroundSize: '24px 24px',
                        }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Briefcase className="w-12 h-12 text-emerald-400/20 group-hover:text-emerald-400/40 transition-colors" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs backdrop-blur-sm">
                            {project.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.split(',').map((tag, ti) => (
                              <Badge
                                key={ti}
                                variant="outline"
                                className="border-white/10 text-gray-500 text-xs"
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
        <section id="campaigns" className="py-20 sm:py-28 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Campaign <span className="text-emerald-500">Concepts</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-12" />
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
                    <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl overflow-hidden">
                      <CardContent className="p-5 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Left: Campaign info */}
                          <div className="flex-1 space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">{campaign.title}</h3>
                            <p className="text-emerald-400 text-sm font-medium">{campaign.subtitle}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">{campaign.description}</p>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {tags.map((tag, ti) => (
                                  <Badge
                                    key={ti}
                                    className="bg-emerald-500/10 text-emerald-300 border-0 text-xs"
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
                              <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden">
                                <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-white/[0.06]">
                                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                    Campaign Details
                                  </span>
                                </div>
                                <div className="divide-y divide-white/[0.04]">
                                  {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="px-4 py-2.5 flex justify-between items-center gap-4">
                                      <span className="text-xs text-gray-500 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>
                                      <span className="text-xs text-gray-300 font-medium text-right">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
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
        {/*  SKILLS SECTION                                                 */}
        {/* ============================================================== */}
        <section id="skills" className="py-20 sm:py-28 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Skills & <span className="text-emerald-500">Expertise</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-12" />
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
                    <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 h-full rounded-xl">
                      <CardContent className="p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {category.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, si) => (
                            <span
                              key={si}
                              className="px-3 py-1.5 text-xs font-medium bg-white/[0.04] text-gray-300 rounded-lg border border-white/[0.06] hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20 transition-all duration-200"
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
        <section id="education" className="py-20 sm:py-28 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="text-emerald-500">Education</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-12" />
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
                  <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white">{edu.degree}</h3>
                            <Badge
                              variant="outline"
                              className="border-emerald-500/20 text-emerald-400 text-xs w-fit shrink-0"
                            >
                              {edu.year}
                            </Badge>
                          </div>
                          <p className="text-emerald-400 text-sm font-medium">{edu.institution}</p>
                          {edu.details && (
                            <p className="text-gray-400 text-sm leading-relaxed">{edu.details}</p>
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
        <section id="contact" className="py-20 sm:py-28 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={0}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Get In <span className="text-emerald-500">Touch</span>
              </h2>
              <Separator className="bg-emerald-500/30 w-16 mb-8 mx-auto" />
              <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-10">
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
                <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl cursor-pointer h-full">
                  <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-300 group-hover:text-emerald-400 transition-colors break-all">
                        {profile?.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href={`https://linkedin.com/in/${profile?.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl cursor-pointer h-full">
                  <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Linkedin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                      <p className="text-sm text-gray-300 group-hover:text-emerald-400 transition-colors">
                        View Profile
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href={`tel:${profile?.phone}`}
                className="group"
              >
                <Card className="bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 rounded-xl cursor-pointer h-full">
                  <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-sm text-gray-300 group-hover:text-emerald-400 transition-colors">
                        {profile?.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-6 text-base rounded-xl"
              >
                <a href={`mailto:${profile?.email}`}>
                  Send an Email
                  <Mail className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ================================================================ */}
      {/*  FOOTER                                                          */}
      {/* ================================================================ */}
      <footer className="mt-auto bg-[#080808] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                <span className="text-white">M</span>
                <span className="text-emerald-500">.</span>
                <span className="text-white">A</span>
              </span>
              <span className="text-gray-600 text-sm">|</span>
              <span className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Mohamed Medhat Ahmed. All rights reserved.
              </span>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-all cursor-pointer"
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
