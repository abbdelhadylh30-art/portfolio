#!/bin/bash
# Test: create a full project via dashboard API
# This is the test the user asked for: add a project fully, then delete it.
set -e

TOKEN=$(cat /tmp/portfolio_token.txt)
BASE="https://portfolio-z258.vercel.app"

echo "=== Step 2: Create project ==="
CREATE_RESP=$(curl -s -w "\n__HTTP_STATUS__:%{http_code}" -X POST "$BASE/api/dashboard/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @- <<'JSON'
{
  "title": "Test Project — CRUD Verification",
  "slug": "",
  "category": "Case Study",
  "description": "A temporary project used to verify the add/delete workflow. Should NOT appear after deletion.",
  "tags": "test,verification,crud",
  "imageUrl": "/logos/ai-business-logo.png",
  "featured": "true",
  "order": 99,
  "client": "Internal QA",
  "timeline": "2026-06-18 (1 day)",
  "role": "Test Author",
  "overview": "This is a test project used to verify the add-then-delete workflow on the dashboard.\n\nIt exercises every field defined in the Project schema, including rich-text fields split into paragraphs by blank lines.\n\nAfter verification, this project is deleted and should no longer appear on the live site.",
  "challenge": "The challenge is to confirm that all fields round-trip through the dashboard API and render correctly on the public detail page.\n\nSpecifically: do paragraph breaks survive? Do Boolean fields get accepted by Prisma? Does the slug uniqueness check work?",
  "approach": "Use curl to send a JSON POST to /api/dashboard/projects with all fields populated.\n\nThen verify the response includes a generated slug.\n\nThen fetch /projects/[slug] to confirm the detail page renders.",
  "outcome": "Expected outcome: a 201 response with a complete project object including server-generated id and slug.\n\nIf any field fails validation, the response should be a 400 with a Prisma error message that we can use to fix the form.",
  "keyTakeaways": "All required fields must be present before POST\nBoolean fields need careful type handling\nSlug auto-generation must run server-side\nDelete must cascade cleanly with no orphaned references",
  "galleryImages": ""
}
JSON
)

HTTP_CODE=$(echo "$CREATE_RESP" | grep -o '__HTTP_STATUS__:[0-9]*' | cut -d: -f2)
BODY=$(echo "$CREATE_RESP" | sed 's/__HTTP_STATUS__:[0-9]*$//')
echo "HTTP status: $HTTP_CODE"
echo "Response body:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"

# Save the created ID for the delete step
PROJECT_ID=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null || echo "")
PROJECT_SLUG=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('slug',''))" 2>/dev/null || echo "")
echo "$PROJECT_ID" > /tmp/portfolio_project_id.txt
echo "$PROJECT_SLUG" > /tmp/portfolio_project_slug.txt
echo ""
echo "Created ID:   $PROJECT_ID"
echo "Created Slug: $PROJECT_SLUG"
