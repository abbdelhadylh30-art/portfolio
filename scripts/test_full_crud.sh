#!/bin/bash
# Full CRUD workflow test against local server (port 3001)
# This is the test the user asked for: add a project, verify, delete, verify.

set -e
BASE="http://localhost:3001"

echo "=========================================="
echo "  FULL CRUD WORKFLOW TEST"
echo "=========================================="
echo ""

echo "▶ Step 1: Authenticate"
AUTH_RESP=$(curl -s -X POST "$BASE/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')
TOKEN=$(echo "$AUTH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")
if [ -z "$TOKEN" ]; then
  echo "✗ Authentication failed!"
  echo "$AUTH_RESP"
  exit 1
fi
echo "✓ Got token (length: ${#TOKEN})"
echo ""

echo "▶ Step 2: Create project (with string 'true' for featured — coercion test)"
CREATE_RESP=$(curl -s -w "\n__HTTP__:%{http_code}" -X POST "$BASE/api/dashboard/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @- <<'JSON'
{
  "title": "TEST PROJECT — CRUD Verification",
  "slug": "",
  "category": "Case Study",
  "description": "A temporary project used to verify the add/delete workflow on the dashboard. Should NOT appear after deletion.",
  "tags": "test,verification,crud",
  "imageUrl": "/logos/ai-business-logo.png",
  "featured": "true",
  "order": 99,
  "client": "Internal QA",
  "timeline": "2026-06-18 (1 day)",
  "role": "Test Author",
  "overview": "This is a test project used to verify the add-then-delete workflow on the dashboard.\n\nIt exercises every field defined in the Project schema, including rich-text fields split into paragraphs by blank lines.\n\nSingle newlines within a paragraph should now also render as line breaks thanks to the pre-line CSS fix.",
  "challenge": "The challenge is to confirm that all fields round-trip through the dashboard API and render correctly on the public detail page.\n\nSpecifically: do paragraph breaks survive? Do Boolean fields get accepted by Prisma? Does the slug uniqueness check work?",
  "approach": "Use curl to send a JSON POST to /api/dashboard/projects with all fields populated.\n\nThen verify the response includes a generated slug.\n\nThen fetch /projects/[slug] to confirm the detail page renders.",
  "outcome": "Expected outcome: a 201 response with a complete project object including server-generated id and slug.\n\nIf any field fails validation, the response should be a 400 with a Prisma error message that we can use to fix the form.",
  "keyTakeaways": "All required fields must be present before POST\nBoolean fields need careful type handling\nSlug auto-generation must run server-side\nDelete must cascade cleanly with no orphaned references",
  "galleryImages": ""
}
JSON
)
HTTP_CODE=$(echo "$CREATE_RESP" | grep -o '__HTTP__:[0-9]*' | cut -d: -f2)
BODY=$(echo "$CREATE_RESP" | sed 's/__HTTP__:[0-9]*$//')
echo "HTTP status: $HTTP_CODE (expected: 201)"
if [ "$HTTP_CODE" != "201" ]; then
  echo "✗ Creation failed!"
  echo "$BODY" | head -c 500
  exit 1
fi
PROJECT_ID=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))")
PROJECT_SLUG=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('slug',''))")
PROJECT_FEATURED=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('featured',''))")
echo "✓ Created project"
echo "  - id:       $PROJECT_ID"
echo "  - slug:     $PROJECT_SLUG"
echo "  - featured: $PROJECT_FEATURED (should be True, not 'true' string)"
echo ""

echo "▶ Step 3: Verify project appears in /api/projects (public)"
PROJECTS=$(curl -s "$BASE/api/projects")
COUNT=$(echo "$PROJECTS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(sum(1 for p in d if p.get('id') == '$PROJECT_ID'))")
echo "Found $COUNT matching project(s) in public list (expected: 1)"
if [ "$COUNT" != "1" ]; then
  echo "✗ Project not found in public list!"
  exit 1
fi
echo "✓ Project is visible publicly"
echo ""

echo "▶ Step 4: Verify detail page /projects/$PROJECT_SLUG returns 200"
DETAIL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/projects/$PROJECT_SLUG")
echo "Detail page status: $DETAIL_STATUS (expected: 200)"
if [ "$DETAIL_STATUS" != "200" ]; then
  echo "✗ Detail page did not return 200!"
  exit 1
fi
echo "✓ Detail page renders"
echo ""

echo "▶ Step 5: Delete the project"
DEL_RESP=$(curl -s -w "\n__HTTP__:%{http_code}" -X DELETE "$BASE/api/dashboard/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id\":\"$PROJECT_ID\"}")
DEL_HTTP=$(echo "$DEL_RESP" | grep -o '__HTTP__:[0-9]*' | cut -d: -f2)
echo "Delete HTTP status: $DEL_HTTP (expected: 200)"
if [ "$DEL_HTTP" != "200" ]; then
  echo "✗ Delete failed!"
  echo "$DEL_RESP" | head -c 500
  exit 1
fi
echo "✓ Project deleted"
echo ""

echo "▶ Step 6: Verify project is GONE from /api/projects"
PROJECTS_AFTER=$(curl -s "$BASE/api/projects")
COUNT_AFTER=$(echo "$PROJECTS_AFTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(sum(1 for p in d if p.get('id') == '$PROJECT_ID'))")
echo "Found $COUNT_AFTER matching project(s) (expected: 0)"
if [ "$COUNT_AFTER" != "0" ]; then
  echo "✗ Project still in public list after delete!"
  exit 1
fi
echo "✓ Project is gone from public list"
echo ""

echo "▶ Step 7: Verify detail page now returns 404"
DETAIL_AFTER=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/projects/$PROJECT_SLUG")
echo "Detail page status: $DETAIL_AFTER (expected: 404)"
if [ "$DETAIL_AFTER" != "404" ]; then
  echo "✗ Detail page did not 404 after delete!"
  exit 1
fi
echo "✓ Detail page correctly 404s"
echo ""

echo "▶ Step 8: Verify upload endpoint accepts an image (base64 data URL response)"
# Create a tiny valid PNG (1x1 pixel)
python3 -c "
import base64
png = bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63000100000005000100c0e9080a0000000049454e44ae426082')
with open('/tmp/tiny.png','wb') as f: f.write(png)
"
UPLOAD_RESP=$(curl -s -w "\n__HTTP__:%{http_code}" -X POST "$BASE/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/tiny.png;type=image/png")
UPLOAD_HTTP=$(echo "$UPLOAD_RESP" | grep -o '__HTTP__:[0-9]*' | cut -d: -f2)
echo "Upload HTTP status: $UPLOAD_HTTP (expected: 200)"
echo "$UPLOAD_RESP" | sed 's/__HTTP__:[0-9]*$//' | python3 -c "
import sys, json
d = json.load(sys.stdin)
img = d.get('imageUrl','')
print(f'  - imageUrl starts with: {img[:30]}...')
print(f'  - size: {d.get(\"size\")} bytes')
print(f'  - type: {d.get(\"type\")}')
print(f'  - filename: {d.get(\"filename\")}')
"
if [ "$UPLOAD_HTTP" != "200" ]; then
  echo "✗ Upload failed!"
  exit 1
fi
echo "✓ Upload endpoint works and returns data URL"
echo ""

echo "=========================================="
echo "  ✅ ALL CRUD TESTS PASSED"
echo "=========================================="
