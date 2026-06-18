/**
 * End-to-end test: create a project, verify it, delete it, verify deletion.
 * Logs every step + any challenges encountered.
 */

const BASE = "https://portfolio-z258.vercel.app";
const challenges = [];
const steps = [];

function log(msg) {
  console.log(`  ${msg}`);
}

function challenge(msg) {
  console.log(`  ⚠️  CHALLENGE: ${msg}`);
  challenges.push(msg);
}

function step(name, fn) {
  console.log(`\n▶ ${name}`);
  return fn().catch((e) => {
    challenge(`Step "${name}" threw: ${e.message}`);
    throw e;
  });
}

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

async function main() {
  /* STEP 1: Login */
  const loginRes = await step("Login to get auth token", async () => {
    const r = await api("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    if (!r.ok) {
      challenge(`Login failed with HTTP ${r.status}`);
      const t = await r.text();
      console.log("    Body:", t);
      throw new Error("Login failed");
    }
    const data = await r.json();
    if (!data.token) {
      challenge("Login response did not include a token");
      throw new Error("No token");
    }
    log(`✓ Got token: ${data.token.substring(0, 20)}...`);
    return data.token;
  });

  const token = loginRes;

  /* STEP 2: Create a project */
  const newProject = {
    title: "Test Project — Acme Brand Audit (E2E Test)",
    slug: "",
    category: "Brand Audit",
    description:
      "An end-to-end test project to verify the dashboard create → public view → delete flow works correctly.",
    tags: "Test,E2E,Verification",
    imageUrl: "/logos/pablo-abdo-logo.png",
    client: "Acme Corp (Test)",
    timeline: "Test Run",
    role: "Test Operator",
    overview:
      "This is a test project created via the dashboard API. It exercises every field in the project schema.\n\nIf you are reading this on the public site, the create flow worked end-to-end.",
    challenge:
      "The challenge here is purely operational: verify that the dashboard create flow accepts all fields, that the API auto-generates a slug when none is provided, and that the public detail page renders the new project correctly.",
    approach:
      "Approach was to script the full lifecycle so any regression in the flow surfaces immediately.\n\nEach step logs its outcome so failures are easy to localise.",
    outcome:
      "If you are seeing this text on the public site, the create + render flow is working. The deletion step that follows should remove this project.",
    keyTakeaways:
      "End-to-end testing catches integration bugs that unit tests miss.\nSlug auto-generation needs to handle collisions.\nThe public detail page must read fresh data, not a stale cache.\nDeletion should be irreversible from the public side.",
    galleryImages: "",
    order: 99,
    featured: false,
  };

  const createRes = await step("Create new project via POST /api/dashboard/projects", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(newProject),
    });
    if (!r.ok) {
      challenge(`Create failed with HTTP ${r.status}`);
      const t = await r.text();
      console.log("    Body:", t);
      throw new Error("Create failed");
    }
    const data = await r.json();
    log(`✓ Created project with id: ${data.id}`);
    log(`  Title: ${data.title}`);
    log(`  Slug: ${data.slug}`);
    if (!data.slug) {
      challenge("Created project has no slug — slug auto-generation failed");
    }
    return data;
  });

  const projectId = createRes.id;
  const projectSlug = createRes.slug;

  /* STEP 3: Verify project appears in public list */
  await step("Verify project appears in /api/projects (public)", async () => {
    const r = await api("/api/projects");
    const list = await r.json();
    const found = list.find((p) => p.id === projectId);
    if (!found) {
      challenge("Project not found in public /api/projects list immediately after creation");
      throw new Error("Not in public list");
    }
    log(`✓ Found in public list: ${found.title}`);
    log(`  Has overview field: ${!!found.overview}`);
    log(`  Has challenge field: ${!!found.challenge}`);
    log(`  Has approach field: ${!!found.approach}`);
    log(`  Has outcome field: ${!!found.outcome}`);
    log(`  Has keyTakeaways field: ${!!found.keyTakeaways}`);
    if (!found.overview) challenge("Public /api/projects does not return overview field");
    if (!found.challenge) challenge("Public /api/projects does not return challenge field");
    if (!found.approach) challenge("Public /api/projects does not return approach field");
    if (!found.outcome) challenge("Public /api/projects does not return outcome field");
    if (!found.keyTakeaways) challenge("Public /api/projects does not return keyTakeaways field");
  });

  /* STEP 4: Verify detail page renders */
  await step("Verify detail page /projects/[slug] returns 200", async () => {
    const r = await api(`/projects/${projectSlug}`);
    if (!r.ok) {
      challenge(`Detail page returned HTTP ${r.status} for slug "${projectSlug}"`);
      const body = await r.text();
      console.log("    Body snippet:", body.substring(0, 200));
      return;
    }
    const html = await r.text();
    const checks = [
      ["Title in HTML", html.includes("Acme Brand Audit")],
      ["Overview section header", html.includes("The Engagement")],
      ["Challenge section header", html.includes("The Problem")],
      ["Approach section header", html.includes("The Method")],
      ["Outcome section header", html.includes("The Result")],
      ["Key Takeaways section", html.includes("Key Takeaways")],
      ["Client meta", html.includes("Acme Corp")],
    ];
    for (const [name, ok] of checks) {
      if (ok) {
        log(`  ✓ ${name}`);
      } else {
        log(`  ✗ ${name} MISSING`);
        challenge(`Detail page HTML missing: ${name}`);
      }
    }
  });

  /* STEP 5: Test edit (PUT) */
  await step("Edit project via PUT (rename title)", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: projectId,
        title: "Test Project — Acme Brand Audit (RENAMED)",
        slug: projectSlug,
      }),
    });
    if (!r.ok) {
      challenge(`PUT failed with HTTP ${r.status}`);
      const t = await r.text();
      console.log("    Body:", t);
      return;
    }
    const data = await r.json();
    log(`✓ Renamed to: ${data.title}`);
    if (data.title !== "Test Project — Acme Brand Audit (RENAMED)") {
      challenge("PUT response did not reflect the new title");
    }
  });

  /* STEP 6: Delete the project */
  await step("Delete project via DELETE /api/dashboard/projects", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: projectId }),
    });
    if (!r.ok) {
      challenge(`DELETE failed with HTTP ${r.status}`);
      const t = await r.text();
      console.log("    Body:", t);
      throw new Error("Delete failed");
    }
    const data = await r.json();
    log(`✓ Delete response: ${JSON.stringify(data)}`);
  });

  /* STEP 7: Verify deletion */
  await step("Verify project is gone from public list", async () => {
    await new Promise((r) => setTimeout(r, 1500));
    const r = await api("/api/projects");
    const list = await r.json();
    const stillThere = list.find((p) => p.id === projectId);
    if (stillThere) {
      challenge("Project still appears in public /api/projects after deletion");
      throw new Error("Still visible");
    }
    log(`✓ Project no longer in public list (${list.length} projects remaining)`);
  });

  /* STEP 8: Verify detail page 404s */
  await step("Verify detail page returns 404 for deleted slug", async () => {
    const r = await api(`/projects/${projectSlug}`);
    if (r.status === 404) {
      log(`✓ Detail page correctly returns 404`);
    } else {
      challenge(`Detail page returned HTTP ${r.status} (expected 404) after deletion`);
    }
  });

  /* STEP 9: Delete non-existent project */
  await step("Verify delete of non-existent project returns 404", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: "nonexistent-id-12345" }),
    });
    if (r.status === 404) {
      log(`✓ Correctly returned 404 for non-existent project`);
    } else {
      challenge(`Delete of non-existent project returned HTTP ${r.status} (expected 404)`);
    }
  });

  /* STEP 10: Create without auth */
  await step("Verify create without auth token returns 401", async () => {
    const r = await api("/api/dashboard/projects", {
      method: "POST",
      body: JSON.stringify({ title: "Should Fail" }),
    });
    if (r.status === 401) {
      log(`✓ Correctly returned 401 for unauthenticated create`);
    } else {
      challenge(`Unauthenticated create returned HTTP ${r.status} (expected 401)`);
    }
  });

  /* Summary */
  console.log("\n" + "=".repeat(60));
  console.log("END-TO-END TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`Steps completed: 10`);
  console.log(`Challenges found: ${challenges.length}`);
  if (challenges.length === 0) {
    console.log("\n✅ No challenges — full create → edit → delete lifecycle works.");
  } else {
    console.log("\n⚠️  CHALLENGES ENCOUNTERED:");
    challenges.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  }
}

main().catch((e) => {
  console.error("\n❌ Test aborted:", e.message);
  process.exit(1);
});
