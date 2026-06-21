/**
 * Generate a bcrypt hash for the admin password.
 *
 * Usage:
 *   npx tsx scripts/generate-password-hash.ts
 *   npx tsx scripts/generate-password-hash.ts "my-secret-password"
 *
 * Output:
 *   Prints the bcrypt hash to stdout. Copy it and set it as the
 *   ADMIN_PASSWORD_HASH env var in Vercel Project Settings →
 *   Environment Variables.
 *
 * After updating the env var, redeploy for it to take effect.
 */

import bcrypt from "bcryptjs";
import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";

async function main() {
  // Allow passing the password as a CLI arg, otherwise prompt interactively.
  let password = process.argv[2];

  if (!password) {
    const rl = createInterface({ input: stdin, output: stdout });
    password = await rl.question("Enter new admin password: ");
    rl.close();

    if (!password || password.length < 8) {
      console.error(
        "Error: password must be at least 8 characters. Aborting."
      );
      process.exit(1);
    }

    const rl2 = createInterface({ input: stdin, output: stdout });
    const confirm = await rl2.question("Confirm password: ");
    rl2.close();

    if (password !== confirm) {
      console.error("Error: passwords do not match. Aborting.");
      process.exit(1);
    }
  }

  if (password.length < 8) {
    console.error(
      "Error: password must be at least 8 characters. Aborting."
    );
    process.exit(1);
  }

  // bcrypt cost factor 10 — ~50ms per verify, fast enough for serverless.
  // Bump to 12 if you want extra hardening (each +1 doubles CPU time).
  const hash = await bcrypt.hash(password, 10);

  console.log("");
  console.log("=== Bcrypt hash generated ===");
  console.log("");
  console.log(hash);
  console.log("");
  console.log("=== Next steps ===");
  console.log("1. Copy the hash above.");
  console.log("2. Go to Vercel → Project Settings → Environment Variables.");
  console.log("3. Create/update ADMIN_PASSWORD_HASH with the hash.");
  console.log("4. Also set ADMIN_USERNAME (e.g. 'admin' or a custom value).");
  console.log("5. Redeploy the project for the change to take effect.");
  console.log("");
  console.log("WARNING: Do NOT commit this hash to git. Treat it as a secret.");
}

main().catch((err) => {
  console.error("Failed to generate hash:", err);
  process.exit(1);
});
