/**
 * Edge case tests to find real user-facing challenges.
 */

const BASE = "https://portfolio-z258.vercel.app";
const challenges = [];

function log(m) { console.log(`  ${m}`); }
function challenge(m) {
  console.log(`  ⚠️  CHALLENGE: ${m}`);
  challenges.push(m);
}
function step(name, fn) {
  console.log(`\n▶ ${name}`);
  return fn().catch((e) => {
    challenge(`Step "${name}" threw: ${e.message}`);
    console.log(`    Error: ${e.message}`);
  });
}

async function api(path, options = {}) {
  return await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function main() {
  // Login
  const loginRes = await api("/api/auth", {
    method: "POST",
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });
  const { token } = await loginRes.json();
  const authHeader = { Authorization: `Bearer ${token}` };
  const createdIds = [];

  /* EDGE 1: Slug collision — two projects with same title */
  await step("EDGE 1: Create two projects with identical titles (slug collision)", async () => {
    const body = {
      title: "Collision Test Project",
      description: "Testing slug collision handling.",
      category: "Case Study",
      tags: "test",
    };
    const r1 = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body),
    });
    const p1 = await r1.json();
    createdIds.push(p1.id);
    log(`Project 1 slug: ${p1.slug}`);

    const r2 = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body),
    });
    const p2 = await r2.json();
    if (r2.ok) createdIds.push(p2.id);
    log(`Project 2 slug: ${p2.slug}`);

    if (p1.slug === p2.slug) {
      challenge("Two projects with the same title got the same slug — collision logic did NOT suffix -2");
    } else if (p2.slug && p2.slug.startsWith("collision-test-project")) {
      log(`✓ Collision handled: second slug is "${p2.slug}"`);
    } else {
      challenge(`Unexpected slug behavior: p1="${p1.slug}", p2="${p2.slug}"`);
    }
  });

  /* EDGE 2: Title with special characters / accents */
  await step("EDGE 2: Title with special chars (émojis, accents, symbols)", async () => {
    const body = {
      title: "Café Résumé — Brand Audit ✨ (2024)",
      description: "Testing special chars.",
      category: "Brand Audit",
    };
    const r = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body),
    });
    const p = await r.json();
    if (r.ok) createdIds.push(p.id);
    log(`Title: "${p.title}"`);
    log(`Slug: "${p.slug}"`);
    if (!p.slug || p.slug.includes("é") || p.slug.includes("✨")) {
      challenge(`Slug contains non-URL-safe chars: "${p.slug}"`);
    } else {
      log(`✓ Slug is URL-safe`);
    }
    // Verify detail page works with this slug
    const dr = await api(`/projects/${p.slug}`);
    log(`  Detail page HTTP: ${dr.status}`);
    if (!dr.ok) challenge(`Detail page failed (${dr.status}) for special-char slug`);
  });

  /* EDGE 3: Empty required fields (no title) */
  await step("EDGE 3: Create project without title (should fail gracefully)", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader,
      body: JSON.stringify({ description: "no title" }),
    });
    log(`HTTP: ${r.status}`);
    if (r.ok) {
      const p = await r.json();
      createdIds.push(p.id);
      challenge("Project created without a title — should have been rejected");
    } else {
      log(`✓ Rejected with HTTP ${r.status}`);
    }
  });

  /* EDGE 4: Very long content (10KB overview) */
  await step("EDGE 4: Create project with very long overview (10KB)", async () => {
    const longOverview = "This is a paragraph. ".repeat(500);
    const body = {
      title: "Long Content Test",
      description: "x",
      overview: longOverview,
    };
    const r = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body),
    });
    const p = await r.json();
    if (r.ok) {
      createdIds.push(p.id);
      log(`✓ Created. Overview length: ${p.overview?.length || 0} chars`);
    } else {
      challenge(`Long content rejected: HTTP ${r.status}`);
      const t = await r.text();
      console.log("    Body:", t.substring(0, 300));
    }
  });

  /* EDGE 5: Image upload via /api/upload */
  await step("EDGE 5: Test image upload via /api/upload", async () => {
    // Create a tiny 1x1 PNG as form data
    const png1x1 = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      "base64"
    );
    const form = new FormData();
    form.append("file", new Blob([png1x1], { type: "image/png" }), "test.png");

    const r = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: authHeader,
      body: form,
    });
    log(`HTTP: ${r.status}`);
    const data = await r.json();
    log(`Response: ${JSON.stringify(data).substring(0, 200)}`);
    if (!r.ok) {
      challenge(`Image upload failed: HTTP ${r.status}, ${JSON.stringify(data)}`);
    } else if (!data.imageUrl) {
      challenge("Image upload response missing imageUrl");
    } else {
      log(`✓ Got imageUrl: ${data.imageUrl}`);
      // Try to fetch the uploaded image
      const ir = await api(data.imageUrl);
      log(`  Uploaded image fetch HTTP: ${ir.status}`);
      if (!ir.ok) challenge(`Uploaded image not fetchable at ${data.imageUrl}`);
    }
  });

  /* EDGE 6: PUT with no slug (should auto-generate, not blank it) */
  await step("EDGE 6: Edit project without passing slug field (preserve or auto-gen?)", async () => {
    // First create one
    const cr = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader,
      body: JSON.stringify({ title: "Slug Preserve Test", description: "x" }),
    });
    const created = await cr.json();
    if (cr.ok) createdIds.push(created.id);
    log(`Created slug: ${created.slug}`);

    // Now PUT with new title but no slug field
    const pr = await api("/api/dashboard/projects", {
      method: "PUT", headers: authHeader,
      body: JSON.stringify({ id: created.id, title: "Slug Preserve Test RENAMED" }),
    });
    const updated = await pr.json();
    log(`After PUT (no slug field): slug = "${updated.slug}"`);
    if (!updated.slug) {
      challenge("PUT without slug field blanked the slug — old links to /projects/[slug] would break");
    } else if (updated.slug === created.slug) {
      log(`✓ Slug preserved on edit (good — old links don't break)`);
    } else if (updated.slug === "slug-preserve-test-renamed") {
      challenge("PUT regenerated slug from new title — old /projects/[slug] links would 404");
    }
  });

  /* EDGE 7: Try to create a project with an explicit duplicate slug */
  await step("EDGE 7: Explicitly pass a slug that already exists", async () => {
    const body1 = { title: "Explicit Slug A", slug: "my-explicit-slug", description: "x" };
    const r1 = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body1),
    });
    const p1 = await r1.json();
    if (r1.ok) createdIds.push(p1.id);
    log(`Project 1 slug: ${p1.slug}`);

    const body2 = { title: "Explicit Slug B", slug: "my-explicit-slug", description: "y" };
    const r2 = await api("/api/dashboard/projects", {
      method: "POST", headers: authHeader, body: JSON.stringify(body2),
    });
    log(`Project 2 HTTP: ${r2.status}`);
    if (r2.ok) {
      const p2 = await r2.json();
      createdIds.push(p2.id);
      log(`Project 2 slug: ${p2.slug}`);
      if (p2.slug === "my-explicit-slug") {
        challenge("Two projects share the same explicit slug — unique constraint should have prevented this, OR API silently suffixed it");
      } else {
        log(`✓ API suffixed the second explicit slug to "${p2.slug}"`);
      }
    } else {
      const t = await r2.text();
      log(`  Rejected body: ${t.substring(0, 200)}`);
      log(`✓ Duplicate slug rejected (good, but error message may be cryptic for users)`);
    }
  });

  /* CLEANUP: Delete all created projects */
  console.log(`\n▶ CLEANUP: Deleting ${createdIds.length} test projects`);
  for (const id of createdIds) {
    const r = await api("/api/dashboard/projects", {
      method: "DELETE", headers: authHeader, body: JSON.stringify({ id }),
    });
    if (!r.ok) challenge(`Cleanup failed for id ${id}: HTTP ${r.status}`);
  }
  log(`✓ Cleanup done`);

  /* SUMMARY */
  console.log("\n" + "=".repeat(60));
  console.log("EDGE CASE TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`Challenges found: ${challenges.length}`);
  if (challenges.length === 0) {
    console.log("\n✅ No challenges — all edge cases handled.");
  } else {
    console.log("\n⚠️  CHALLENGES ENCOUNTERED:");
    challenges.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  }
}

main().catch((e) => {
  console.error("\n❌ Test aborted:", e.message);
  process.exit(1);
});
