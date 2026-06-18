import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  User,
  Briefcase,
  Tag,
  CheckCircle2,
  ArrowRight,
  Target,
  Lightbulb,
  Compass,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Colors & helpers                                                   */
/* ------------------------------------------------------------------ */

const colors = {
  navy: "#0a1628",
  navyLight: "#0f2038",
  navyMid: "#162d50",
  navyDeep: "#060f1f",
  gold: "#c8963e",
  goldLight: "#e8b85a",
  goldDim: "rgba(200,150,62,0.15)",
  white: "#ffffff",
  gray400: "#8b95a8",
  gray500: "#6b7689",
  gray600: "#5a6478",
  border: "rgba(200,150,62,0.18)",
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
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

function Section({
  icon,
  label,
  title,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.4rem",
          color: colors.gold,
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {icon}
        {label}
      </div>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "1.6rem",
          color: colors.white,
          marginBottom: "1rem",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: colors.gray400,
          fontSize: "0.98rem",
          lineHeight: 1.8,
          maxWidth: 760,
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
        // pre-line preserves embedded single \n as line breaks, while still
        // collapsing runs of spaces/tabs. This means authors can use either
        // blank lines (\n\n) to start a new Paragraph OR single \n for a soft
        // line break inside a paragraph.
        whiteSpace: "pre-line",
        lineHeight: 1.7,
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
        background: `linear-gradient(180deg, ${colors.navyDeep} 0%, ${colors.navy} 100%)`,
        color: colors.white,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/*  Top navigation bar                                              */}
      {/* ---------------------------------------------------------------- */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(6,15,31,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${colors.border}`,
          padding: "1rem 0",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/#work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: colors.gray400,
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: colors.gold,
              letterSpacing: "0.08em",
            }}
          >
            MOHAMED MEDHAT AHMED
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/*  Hero                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "4rem 1.5rem 2rem",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: colors.gray500,
            fontSize: "0.78rem",
            marginBottom: "2rem",
            letterSpacing: "0.04em",
          }}
        >
          <Link
            href="/"
            style={{
              color: colors.gray500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Portfolio
          </Link>
          <span>/</span>
          <Link
            href="/#work"
            style={{
              color: colors.gray500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Projects
          </Link>
          <span>/</span>
          <span style={{ color: colors.gold }}>{project.category}</span>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "inline-block",
            background: colors.goldDim,
            color: colors.gold,
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1.2rem",
          }}
        >
          {project.category}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            color: colors.white,
            lineHeight: 1.1,
            marginBottom: "1.2rem",
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "1.1rem",
            color: colors.gray400,
            lineHeight: 1.7,
            maxWidth: 760,
            marginBottom: "2rem",
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
              gap: "1rem",
              maxWidth: 800,
              padding: "1.4rem",
              background: colors.navyLight,
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
            }}
          >
            {project.client && (
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                <Briefcase size={18} color={colors.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: colors.gray500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Client
                  </div>
                  <div style={{ fontSize: "0.9rem", color: colors.white, lineHeight: 1.4 }}>
                    {project.client}
                  </div>
                </div>
              </div>
            )}
            {project.timeline && (
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                <Calendar size={18} color={colors.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: colors.gray500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Timeline
                  </div>
                  <div style={{ fontSize: "0.9rem", color: colors.white, lineHeight: 1.4 }}>
                    {project.timeline}
                  </div>
                </div>
              </div>
            )}
            {project.role && (
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                <User size={18} color={colors.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: colors.gray500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Role
                  </div>
                  <div style={{ fontSize: "0.9rem", color: colors.white, lineHeight: 1.4 }}>
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
              marginTop: "1.5rem",
              alignItems: "center",
            }}
          >
            <Tag size={14} color={colors.gray500} />
            {tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  background: "rgba(200,150,62,0.08)",
                  color: colors.goldLight,
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------- */}
      {/*  Hero logo / image                                               */}
      {/* ---------------------------------------------------------------- */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 1.5rem 3rem" }}>
        <div
          style={{
            width: "100%",
            height: isLogo ? 320 : 420,
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            background: isLogo
              ? `radial-gradient(circle at center, ${colors.navyMid} 0%, ${colors.navyDeep} 70%)`
              : colors.navyLight,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imgSrc}
            alt={project.title}
            style={{
              width: isLogo ? "auto" : "100%",
              height: isLogo ? "60%" : "100%",
              maxWidth: isLogo ? "60%" : "none",
              objectFit: isLogo ? "contain" : "cover",
            }}
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Rich content body                                               */}
      {/* ---------------------------------------------------------------- */}
      {hasRichContent ? (
        <article
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 1.5rem 4rem",
          }}
        >
          {project.overview && (
            <Section
              icon={<Compass size={14} />}
              label="Overview"
              title="The Engagement"
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
              icon={<Target size={14} />}
              label="Challenge"
              title="The Problem"
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
              icon={<Lightbulb size={14} />}
              label="Approach"
              title="The Method"
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
              icon={<TrendingUp size={14} />}
              label="Outcome"
              title="The Result"
            >
              {project.outcome
                .split("\n\n")
                .filter(Boolean)
                .map((p, i) => (
                  <Paragraph key={i}>{p}</Paragraph>
                ))}
            </Section>
          )}

          {/* ---------------------------------------------------------------- */}
          {/*  Key takeaways                                                  */}
          {/* ---------------------------------------------------------------- */}
          {takeaways.length > 0 && (
            <section style={{ marginBottom: "3.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.4rem",
                  color: colors.gold,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                <CheckCircle2 size={14} />
                Key Takeaways
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: colors.white,
                  marginBottom: "1.5rem",
                  lineHeight: 1.2,
                }}
              >
                What This Project Taught Me
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {takeaways.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      background: colors.navyLight,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: "1.2rem 1.2rem 1.2rem 1rem",
                      position: "relative",
                      display: "flex",
                      gap: "0.8rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: colors.gold,
                        background: colors.goldDim,
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        fontSize: "0.92rem",
                        color: colors.white,
                        lineHeight: 1.55,
                      }}
                    >
                      {t}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---------------------------------------------------------------- */}
          {/*  Gallery                                                        */}
          {/* ---------------------------------------------------------------- */}
          {galleryImages.length > 0 && (
            <section style={{ marginBottom: "3.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.4rem",
                  color: colors.gold,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Gallery
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: colors.white,
                  marginBottom: "1.5rem",
                  lineHeight: 1.2,
                }}
              >
                Visuals & Artifacts
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                        borderRadius: 12,
                        overflow: "hidden",
                        background: isImgLogo
                          ? `radial-gradient(circle at center, ${colors.navyMid} 0%, ${colors.navyDeep} 70%)`
                          : colors.navyLight,
                        border: `1px solid ${colors.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
            padding: "0 1.5rem 4rem",
          }}
        >
          <p style={{ color: colors.gray400, fontSize: "1rem", lineHeight: 1.7 }}>
            Full case study content for this project is being prepared. In the
            meantime, the summary above captures the scope and deliverables.
          </p>
        </article>
      )}

      {/* ---------------------------------------------------------------- */}
      {/*  Related projects                                                */}
      {/* ---------------------------------------------------------------- */}
      {related.length > 0 && (
        <section
          style={{
            borderTop: `1px solid ${colors.border}`,
            background: colors.navyDeep,
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: colors.gold,
                marginBottom: "0.6rem",
              }}
            >
              Keep Reading
            </div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "2rem",
                color: colors.white,
                marginBottom: "2rem",
              }}
            >
              More Projects
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.2rem",
              }}
            >
              {related.map((rp) => {
                const rImg = getProjectImage(rp.imageUrl);
                return (
                  <Link
                    key={rp.id}
                    href={`/projects/${rp.slug}`}
                    style={{
                      display: "block",
                      background: colors.navyLight,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "transform 0.25s, border-color 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 140,
                        background: rImg.isLogo
                          ? `radial-gradient(circle at center, ${colors.navyMid} 0%, ${colors.navyDeep} 70%)`
                          : colors.navyMid,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={rImg.src}
                        alt={rp.title}
                        style={{
                          width: rImg.isLogo ? "55%" : "100%",
                          height: rImg.isLogo ? "55%" : "100%",
                          objectFit: rImg.isLogo ? "contain" : "cover",
                        }}
                      />
                    </div>
                    <div style={{ padding: "1.1rem 1.2rem" }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: colors.gold,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {rp.category}
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 600,
                          fontSize: "1rem",
                          color: colors.white,
                          marginBottom: "0.5rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {rp.title}
                      </h3>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: colors.gold,
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        Read case study
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/*  Footer                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <Link
          href="/#work"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: colors.gold,
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to all projects
        </Link>
      </footer>

      {/* ---------------------------------------------------------------- */}
      {/*  Global styles for hover effects                                 */}
      {/* ---------------------------------------------------------------- */}
      <style>{`
        @media (max-width: 640px) {
          h1 { font-size: 1.8rem !important; }
        }
      `}</style>
    </main>
  );
}
