import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  User,
  Briefcase,
  Tag,
  CheckCircle2,
  Target,
  Lightbulb,
  Compass,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Champagne Noir — Editorial Deluxe palette                          */
/* ------------------------------------------------------------------ */
//
//  Mirrors the palette used in PortfolioClient.tsx so case study pages
//  feel like a continuation of the homepage, not a separate template.
//
const palette = {
  // Layered obsidian backgrounds
  onyx: "#08080c",
  onyxLight: "#0f0e14",
  charcoal: "#16151c",
  graphite: "#1c1a24",
  graphiteHi: "#252330",
  navyMid: "#1c1a24", // alias for compatibility with old refs

  // Warm text tiers
  pearl: "#faf8f4",
  silk: "#e8e4dc",
  chiffon: "#b8b3a8",
  cashmere: "#8a8278",
  stone: "#5a5347",

  // Champagne / copper / bronze accents
  champagne: "#d4af7a",
  champagneHi: "#e6c79f",
  champagneGlow: "#f4dcb5",
  copper: "#b87333",
  bronze: "#8a6e4b",
  bronzeDark: "#5a4730",

  // Hairlines / surfaces
  hairline: "rgba(212, 175, 122, 0.14)",
  hairlineHi: "rgba(212, 175, 122, 0.28)",
  hairlineSoft: "rgba(212, 175, 122, 0.08)",
};

const fonts = {
  serif: "'Fraunces', Georgia, 'Times New Roman', serif",
  sans: "'DM Sans', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
};

function getProjectImage(imageUrl: string): { src: string; isLogo: boolean } {
  if (!imageUrl) return { src: "/logos/ai-business-logo.png", isLogo: true };
  const isLogo = imageUrl.endsWith(".png");
  return { src: imageUrl, isLogo };
}

function splitLines(s: string): string[] {
  if (!s) return [];
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function splitTags(s: string): string[] {
  if (!s) return [];
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/*  Data fetch                                                         */
/* ------------------------------------------------------------------ */

async function getProject(slug: string) {
  const project = await db.project.findUnique({
    where: { slug },
  });
  return project;
}

async function getRelatedProjects(currentId: string, limit = 3) {
  const projects = await db.project.findMany({
    where: { id: { not: currentId } },
    orderBy: { order: "asc" },
    take: limit,
  });
  return projects;
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  return {
    title: `${project.title} — Mohamed Medhat Ahmed`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Static params (pre-render known slugs)                             */
/* ------------------------------------------------------------------ */

// Force dynamic rendering — content can be updated via dashboard,
// so we always read fresh data from the database.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ------------------------------------------------------------------ */
/*  Eyebrow — small mono uppercase label with hairline                 */
/* ------------------------------------------------------------------ */

function Eyebrow({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginBottom: "1.25rem",
      }}
    >
      {icon && (
        <span style={{ color: palette.champagne, display: "flex" }}>
          {icon}
        </span>
      )}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: "0.68rem",
          fontWeight: 500,
          color: palette.champagne,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${palette.hairline}, transparent)`,
          maxWidth: 80,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

function Section({
  icon,
  label,
  title,
  children,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
  index: string;
}) {
  return (
    <section style={{ marginBottom: "4rem", position: "relative" }}>
      <Eyebrow icon={icon} label={`${index} · ${label}`} />
      <h2
        style={{
          fontFamily: fonts.serif,
          fontWeight: 400,
          fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
          color: palette.pearl,
          marginBottom: "1.25rem",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          fontVariationSettings: '"opsz" 144',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: palette.silk,
          fontSize: "1rem",
          lineHeight: 1.85,
          maxWidth: 760,
          fontWeight: 300,
          fontFamily: fonts.sans,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        marginBottom: "1.1rem",
        whiteSpace: "pre-line",
        lineHeight: 1.8,
      }}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const related = await getRelatedProjects(project.id);
  const { src: imgSrc, isLogo } = getProjectImage(project.imageUrl);
  const tags = splitTags(project.tags);
  const takeaways = splitLines(project.keyTakeaways);
  const galleryImages = splitLines(project.galleryImages);
  const hasRichContent =
    project.overview ||
    project.challenge ||
    project.approach ||
    project.outcome;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${palette.onyx} 0%, ${palette.onyxLight} 100%)`,
        color: palette.pearl,
        fontFamily: fonts.sans,
        WebkitFontSmoothing: "antialiased",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Subtle film grain for editorial depth */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
          mixBlendMode: "overlay",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ---------------------------------------------------------- */}
        {/*  Top navigation bar                                        */}
        {/* ---------------------------------------------------------- */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(8,8,12,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: `1px solid ${palette.hairline}`,
            padding: "1.1rem 0",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/#work"
              className="noir-case-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: palette.chiffon,
                fontSize: "0.74rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.3s",
                fontFamily: fonts.mono,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to Portfolio
            </Link>
            <Link
              href="/"
              style={{
                fontFamily: fonts.serif,
                fontWeight: 500,
                fontSize: "1rem",
                color: palette.pearl,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                fontVariationSettings: '"opsz" 144',
                display: "flex",
                alignItems: "baseline",
                gap: "0.1rem",
              }}
            >
              MM
              <span
                style={{
                  color: palette.champagne,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                ·
              </span>
            </Link>
          </div>
        </nav>

        {/* ---------------------------------------------------------- */}
        {/*  Hero                                                      */}
        {/* ---------------------------------------------------------- */}
        <header
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "4rem 1.75rem 2rem",
            position: "relative",
          }}
        >
          {/* Soft champagne ambient glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "10%",
              right: "-10%",
              width: 600,
              height: 600,
              background: `radial-gradient(circle, rgba(212,175,122,0.08) 0%, transparent 65%)`,
              filter: "blur(80px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: palette.cashmere,
                fontFamily: fonts.mono,
                fontSize: "0.7rem",
                marginBottom: "2.5rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <Link
                href="/"
                className="noir-case-link"
                style={{
                  color: palette.cashmere,
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                Portfolio
              </Link>
              <span style={{ color: palette.bronze }}>/</span>
              <Link
                href="/#work"
                className="noir-case-link"
                style={{
                  color: palette.cashmere,
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                Projects
              </Link>
              <span style={{ color: palette.bronze }}>/</span>
              <span style={{ color: palette.champagne }}>
                {project.category}
              </span>
            </div>

            {/* Category + index */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1.5rem",
                padding: "0.4rem 0.9rem",
                background: "rgba(212, 175, 122, 0.05)",
                border: `1px solid ${palette.hairline}`,
                borderRadius: 2,
                fontFamily: fonts.mono,
                fontSize: "0.66rem",
                fontWeight: 500,
                color: palette.champagne,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  background: palette.champagne,
                  borderRadius: "50%",
                  boxShadow: `0 0 6px ${palette.champagne}`,
                }}
              />
              {project.category}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: fonts.serif,
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
                color: palette.pearl,
                lineHeight: 1.05,
                marginBottom: "1.5rem",
                letterSpacing: "-0.03em",
                maxWidth: 920,
                fontVariationSettings: '"opsz" 144',
              }}
            >
              {project.title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "1.1rem",
                color: palette.chiffon,
                lineHeight: 1.75,
                maxWidth: 760,
                marginBottom: "2.25rem",
                fontWeight: 300,
              }}
            >
              {project.description}
            </p>

            {/* Meta grid */}
            {(project.client || project.timeline || project.role) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 0,
                  maxWidth: 820,
                  background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {project.client && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      padding: "1.4rem 1.5rem",
                      borderRight: `1px solid ${palette.hairline}`,
                    }}
                  >
                    <Briefcase
                      size={16}
                      strokeWidth={1.5}
                      color={palette.champagne}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: "0.62rem",
                          color: palette.bronze,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Client
                      </div>
                      <div
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: "0.95rem",
                          color: palette.pearl,
                          lineHeight: 1.4,
                          fontWeight: 500,
                          fontVariationSettings: '"opsz" 144',
                        }}
                      >
                        {project.client}
                      </div>
                    </div>
                  </div>
                )}
                {project.timeline && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      padding: "1.4rem 1.5rem",
                      borderRight: `1px solid ${palette.hairline}`,
                    }}
                  >
                    <Calendar
                      size={16}
                      strokeWidth={1.5}
                      color={palette.champagne}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: "0.62rem",
                          color: palette.bronze,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Timeline
                      </div>
                      <div
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: "0.95rem",
                          color: palette.pearl,
                          lineHeight: 1.4,
                          fontWeight: 500,
                          fontVariationSettings: '"opsz" 144',
                        }}
                      >
                        {project.timeline}
                      </div>
                    </div>
                  </div>
                )}
                {project.role && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      padding: "1.4rem 1.5rem",
                    }}
                  >
                    <User
                      size={16}
                      strokeWidth={1.5}
                      color={palette.champagne}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: "0.62rem",
                          color: palette.bronze,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Role
                      </div>
                      <div
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: "0.95rem",
                          color: palette.pearl,
                          lineHeight: 1.4,
                          fontWeight: 500,
                          fontVariationSettings: '"opsz" 144',
                        }}
                      >
                        {project.role}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginTop: "1.75rem",
                  alignItems: "center",
                }}
              >
                <Tag
                  size={13}
                  strokeWidth={1.5}
                  color={palette.bronze}
                />
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: "0.66rem",
                      fontWeight: 500,
                      background: "rgba(212, 175, 122, 0.05)",
                      color: palette.champagne,
                      padding: "0.32rem 0.7rem",
                      borderRadius: 2,
                      border: `1px solid ${palette.hairline}`,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ---------------------------------------------------------- */}
        {/*  Hero logo / image                                         */}
        {/* ---------------------------------------------------------- */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "1.5rem 1.75rem 3.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: isLogo ? 340 : 440,
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              background: isLogo
                ? `radial-gradient(circle at center, ${palette.graphite} 0%, ${palette.onyxLight} 70%)`
                : palette.charcoal,
              border: `1px solid ${palette.hairline}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Corner accents */}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 18,
                height: 18,
                borderTop: `1px solid ${palette.champagne}`,
                borderLeft: `1px solid ${palette.champagne}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 18,
                height: 18,
                borderTop: `1px solid ${palette.champagne}`,
                borderRight: `1px solid ${palette.champagne}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 18,
                height: 18,
                borderBottom: `1px solid ${palette.champagne}`,
                borderLeft: `1px solid ${palette.champagne}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 18,
                height: 18,
                borderBottom: `1px solid ${palette.champagne}`,
                borderRight: `1px solid ${palette.champagne}`,
              }}
            />

            <img
              src={imgSrc}
              alt={project.title}
              style={{
                width: isLogo ? "auto" : "100%",
                height: isLogo ? "60%" : "100%",
                maxWidth: isLogo ? "55%" : "none",
                objectFit: isLogo ? "contain" : "cover",
              }}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  Rich content body                                         */}
        {/* ---------------------------------------------------------- */}
        {hasRichContent ? (
          <article
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 1.75rem 4rem",
            }}
          >
            {project.overview && (
              <Section
                icon={<Compass size={13} strokeWidth={1.5} />}
                label="Overview"
                title="The Engagement"
                index="01"
              >
                {project.overview
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <Paragraph key={i}>{p}</Paragraph>
                  ))}
              </Section>
            )}

            {project.challenge && (
              <Section
                icon={<Target size={13} strokeWidth={1.5} />}
                label="Challenge"
                title="The Problem"
                index="02"
              >
                {project.challenge
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <Paragraph key={i}>{p}</Paragraph>
                  ))}
              </Section>
            )}

            {project.approach && (
              <Section
                icon={<Lightbulb size={13} strokeWidth={1.5} />}
                label="Approach"
                title="The Method"
                index="03"
              >
                {project.approach
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <Paragraph key={i}>{p}</Paragraph>
                  ))}
              </Section>
            )}

            {project.outcome && (
              <Section
                icon={<TrendingUp size={13} strokeWidth={1.5} />}
                label="Outcome"
                title="The Result"
                index="04"
              >
                {project.outcome
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <Paragraph key={i}>{p}</Paragraph>
                  ))}
              </Section>
            )}

            {/* ---------------------------------------------------------- */}
            {/*  Key takeaways                                            */}
            {/* ---------------------------------------------------------- */}
            {takeaways.length > 0 && (
              <section style={{ marginBottom: "4rem" }}>
                <Eyebrow
                  icon={<CheckCircle2 size={13} strokeWidth={1.5} />}
                  label="05 · Key Takeaways"
                />
                <h2
                  style={{
                    fontFamily: fonts.serif,
                    fontWeight: 400,
                    fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                    color: palette.pearl,
                    marginBottom: "1.75rem",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    fontVariationSettings: '"opsz" 144',
                  }}
                >
                  What This Project Taught Me
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {takeaways.map((t, i) => (
                    <div
                      key={i}
                      className="noir-takeaway-card"
                      style={{
                        background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
                        border: `1px solid ${palette.hairline}`,
                        borderRadius: 4,
                        padding: "1.4rem 1.4rem 1.4rem 1.2rem",
                        position: "relative",
                        display: "flex",
                        gap: "0.85rem",
                        alignItems: "flex-start",
                        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: palette.champagne,
                          background: "rgba(212, 175, 122, 0.06)",
                          border: `1px solid ${palette.hairline}`,
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: "0.92rem",
                          color: palette.silk,
                          lineHeight: 1.65,
                          fontWeight: 300,
                        }}
                      >
                        {t}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ---------------------------------------------------------- */}
            {/*  Gallery                                                  */}
            {/* ---------------------------------------------------------- */}
            {galleryImages.length > 0 && (
              <section style={{ marginBottom: "4rem" }}>
                <Eyebrow label="06 · Gallery" />
                <h2
                  style={{
                    fontFamily: fonts.serif,
                    fontWeight: 400,
                    fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                    color: palette.pearl,
                    marginBottom: "1.75rem",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    fontVariationSettings: '"opsz" 144',
                  }}
                >
                  Visuals & Artifacts
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {galleryImages.map((g, i) => {
                    const isImgLogo = g.endsWith(".png");
                    return (
                      <div
                        key={i}
                        style={{
                          aspectRatio: "4 / 3",
                          borderRadius: 4,
                          overflow: "hidden",
                          background: isImgLogo
                            ? `radial-gradient(circle at center, ${palette.graphite} 0%, ${palette.onyxLight} 70%)`
                            : palette.charcoal,
                          border: `1px solid ${palette.hairline}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            fontFamily: fonts.mono,
                            fontSize: "0.6rem",
                            color: palette.champagne,
                            letterSpacing: "0.14em",
                            padding: "0.2rem 0.4rem",
                            background: "rgba(8,8,12,0.65)",
                            border: `1px solid ${palette.hairline}`,
                            borderRadius: 2,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <img
                          src={g}
                          alt={`${project.title} — image ${i + 1}`}
                          style={{
                            width: isImgLogo ? "60%" : "100%",
                            height: isImgLogo ? "60%" : "100%",
                            objectFit: isImgLogo ? "contain" : "cover",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </article>
        ) : (
          <article
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 1.75rem 4rem",
            }}
          >
            <div
              style={{
                padding: "2rem 2.25rem",
                background: `linear-gradient(170deg, ${palette.charcoal}, ${palette.onyxLight})`,
                border: `1px solid ${palette.hairline}`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.66rem",
                  color: palette.bronze,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Case study in progress
              </div>
              <p
                style={{
                  color: palette.chiffon,
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  fontFamily: fonts.sans,
                  fontWeight: 300,
                }}
              >
                Full case study content for this project is being prepared. In
                the meantime, the summary above captures the scope and
                deliverables.
              </p>
            </div>
          </article>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  Related projects                                          */}
        {/* ---------------------------------------------------------- */}
        {related.length > 0 && (
          <section
            style={{
              borderTop: `1px solid ${palette.hairline}`,
              background: palette.onyx,
              padding: "4.5rem 1.75rem",
              position: "relative",
            }}
          >
            {/* Soft champagne glow line above */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${palette.champagne}aa, transparent)`,
              }}
            />
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Eyebrow label="Keep Reading" />
              <h2
                style={{
                  fontFamily: fonts.serif,
                  fontWeight: 400,
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  color: palette.pearl,
                  marginBottom: "2.25rem",
                  letterSpacing: "-0.025em",
                  fontVariationSettings: '"opsz" 144',
                }}
              >
                More <em style={{ fontStyle: "italic", color: palette.champagne, fontWeight: 300 }}>projects</em>
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {related.map((rp, i) => {
                  const rImg = getProjectImage(rp.imageUrl);
                  return (
                    <Link
                      key={rp.id}
                      href={`/projects/${rp.slug}`}
                      className="noir-case-related"
                      style={{
                        display: "block",
                        background: palette.charcoal,
                        border: `1px solid ${palette.hairline}`,
                        borderRadius: 4,
                        overflow: "hidden",
                        textDecoration: "none",
                        transition:
                          "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: 150,
                          background: rImg.isLogo
                            ? `radial-gradient(circle at center, ${palette.graphite} 0%, ${palette.onyxLight} 70%)`
                            : palette.graphite,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            fontFamily: fonts.mono,
                            fontSize: "0.6rem",
                            color: palette.champagne,
                            letterSpacing: "0.14em",
                            padding: "0.25rem 0.45rem",
                            background: "rgba(8,8,12,0.65)",
                            border: `1px solid ${palette.hairline}`,
                            borderRadius: 2,
                          }}
                        >
                          0{i + 1}
                        </span>
                        <img
                          src={rImg.src}
                          alt={rp.title}
                          style={{
                            width: rImg.isLogo ? "55%" : "100%",
                            height: rImg.isLogo ? "55%" : "100%",
                            objectFit: rImg.isLogo ? "contain" : "cover",
                            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                          }}
                        />
                      </div>
                      <div style={{ padding: "1.2rem 1.3rem 1.3rem" }}>
                        <div
                          style={{
                            fontFamily: fonts.mono,
                            fontSize: "0.62rem",
                            color: palette.champagne,
                            fontWeight: 500,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {rp.category}
                        </div>
                        <h3
                          style={{
                            fontFamily: fonts.serif,
                            fontWeight: 500,
                            fontSize: "1.1rem",
                            color: palette.pearl,
                            marginBottom: "0.75rem",
                            lineHeight: 1.3,
                            letterSpacing: "-0.02em",
                            fontVariationSettings: '"opsz" 144',
                          }}
                        >
                          {rp.title}
                        </h3>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            color: palette.champagne,
                            fontFamily: fonts.mono,
                            fontSize: "0.68rem",
                            fontWeight: 500,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          Read case study
                          <ArrowUpRight size={12} strokeWidth={2} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  Footer                                                    */}
        {/* ---------------------------------------------------------- */}
        <footer
          style={{
            borderTop: `1px solid ${palette.hairline}`,
            padding: "2.5rem 1.75rem",
            textAlign: "center",
          }}
        >
          <Link
            href="/#work"
            className="noir-case-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: palette.champagne,
              fontSize: "0.74rem",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: fonts.mono,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.7rem 1.4rem",
              border: `1px solid ${palette.hairlineHi}`,
              borderRadius: 2,
              background: "rgba(212, 175, 122, 0.05)",
              transition: "all 0.3s",
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to all projects
          </Link>
        </footer>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Global styles for hover effects                           */}
      {/* ---------------------------------------------------------- */}
      <style>{`
        .noir-case-link:hover {
          color: ${palette.champagne} !important;
        }

        .noir-takeaway-card:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-3px);
          background: linear-gradient(170deg, ${palette.graphite}, ${palette.charcoal}) !important;
        }

        .noir-case-related {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .noir-case-related:hover {
          border-color: ${palette.hairlineHi} !important;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -16px rgba(212, 175, 122, 0.18);
        }
        .noir-case-related:hover img {
          transform: scale(1.06);
        }

        @media (max-width: 640px) {
          h1 { font-size: 1.9rem !important; }
        }
      `}</style>
    </main>
  );
}
