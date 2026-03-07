---
name: platform-feature-spec
title: Platform Feature Specification & Review
description: Define and review features for the Design Management Platform with multi-perspective critique
category: software
tags:
  - software
  - features
  - specification
  - platform
  - critical
version: "1.0.0"
priority: 7
status: active
phases:
  - specify
  - scope
project_types:
  - SOFTWARE
---

# Platform Feature Specification & Review

## Purpose

When building the Evergold Design Management Platform, every feature must serve
the north star: **Enable absolute clarity between customers and contractors**.

This skill uses an **agent swarm** to spec and review platform features, ensuring:
- Features solve real pain points (not just "nice to have")
- UX is intuitive for both contractors and clients
- Technical implementation is feasible
- Development timeline is realistic
- Features integrate with overall platform vision

## The Pain Points We're Solving

### Current PDF/Email Workflow Problems:

1. **Ambiguity**: "I thought you meant the limestone, not the flagstone"
2. **Slow Iteration**: Days of email back-and-forth per design revision
3. **Cost Surprises**: Changes happen mid-project, client didn't understand impact
4. **Lost Context**: Email threads become unmanageable
5. **Version Confusion**: Which PDF did we agree on?
6. **No Visual Confirmation**: Client approves text description, shocked by reality
7. **Difficult Collaboration**: Can't easily annotate designs or ask inline questions

### Platform Features Must Address These

## Feature Review Panel (Agent Swarm)

Six agent personas review each feature specification:

### Panel Member 1: UX Clarity Champion (general-purpose)
**Expertise**: User experience and interface design
**Focus**: Will users understand this? Does it create clarity?

**Questions Asked**:
- Is the user flow intuitive?
- Can both technical (contractor) and non-technical (client) users navigate this?
- Does this reduce cognitive load or increase it?
- Are there clear affordances (users know what to click)?
- Does this match user mental models?

### Panel Member 2: Technical Architect (Plan)
**Expertise**: Software architecture and implementation
**Focus**: Can we build this? How complex is it?

**Questions Asked**:
- What's the technical approach (frontend, backend, database)?
- Are there existing libraries/frameworks we can leverage?
- What are the performance implications?
- How does this integrate with existing features?
- What are the technical risks?

### Panel Member 3: Contractor Workflow Expert (general-purpose)
**Expertise**: Landscape professional's daily workflow
**Focus**: Does this serve how contractors actually work?

**Questions Asked**:
- Does this match how Evergold currently estimates/designs?
- Will this save time or add administrative burden?
- Can contractors quickly generate quotes without learning curve?
- Does this integrate with existing tools (CAD, spreadsheets)?
- Will contractors actually adopt this?

### Panel Member 4: Client Experience Advocate (general-purpose)
**Expertise**: Property manager's needs and expectations
**Focus**: Does this give clients confidence and clarity?

**Questions Asked**:
- Can clients see exactly what they're approving?
- Are costs transparent and understandable?
- Can clients ask questions inline (not email)?
- Does this reduce "wait, what?" moments?
- Will clients feel more confident with this vs PDF?

### Panel Member 5: QA & Edge Case Hunter (general-purpose)
**Expertise**: Testing, security, error handling
**Focus**: What can go wrong?

**Questions Asked**:
- What happens if user uploads 100MB file?
- How do we handle concurrent edits (client and contractor both editing)?
- What if calculations produce negative numbers?
- How do we prevent data loss?
- Are there security vulnerabilities (auth, file upload, XSS)?

### Panel Member 6: Development Reality Checker (Plan)
**Expertise**: Realistic timeline and scope estimation
**Focus**: How long will this actually take to build?

**Questions Asked**:
- What's the honest development timeline?
- What dependencies could delay this?
- Are there shortcuts (MVP vs full feature)?
- What's the testing burden?
- What's the ongoing maintenance cost?

## Feature Specification Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLATFORM FEATURE SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURE NAME: {Short, descriptive name}

PAIN POINT SOLVED:
{Which of the 7 PDF/email problems does this address?}

USER STORIES:
As a [contractor/client], I want to [action] so that [benefit]

NORTH STAR ALIGNMENT:
Does this feature enable clarity between customer and contractor?
How specifically?

UI/UX DESCRIPTION:
{What users see and interact with}

TECHNICAL APPROACH:
{High-level: frontend components, backend APIs, database schema}

USER FLOW:
1. User does X
2. System responds with Y
3. User sees Z
4. [Continue flow]

EDGE CASES:
- What if: {scenario 1}
- What if: {scenario 2}

SUCCESS METRICS:
- How we know this feature succeeds
- Measurable criteria

DEVELOPMENT ESTIMATE:
- Frontend: {hours/days}
- Backend: {hours/days}
- Testing: {hours/days}
- Total: {hours/days}

DEPENDENCIES:
- Requires: {what must exist first}
- Enables: {what becomes possible after this}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Example: Live Cost Estimator Feature

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLATFORM FEATURE SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEATURE NAME: Live Cost Estimator with Line Item Breakdown

PAIN POINT SOLVED:
- Cost Surprises: Client doesn't understand how changes affect price
- Ambiguity: "What's included in that $15K quote?"
- Slow Iteration: Contractor must manually recalculate after each change

USER STORIES:
- As a contractor, I want to adjust quantities and see costs update instantly,
  so I don't waste time recalculating spreadsheets
- As a client, I want to see exactly what I'm paying for with line items,
  so I understand the breakdown and can make informed tradeoffs
- As a contractor, I want clients to see cost implications immediately,
  so they understand why certain choices cost more

NORTH STAR ALIGNMENT:
YES - This creates absolute clarity on costs. Client sees:
- Exactly what they're paying for (line items)
- How design changes affect price (live updates)
- Where they can make tradeoffs (high-cost items highlighted)

No more "I didn't know the irrigation would cost that much" surprises.

UI/UX DESCRIPTION:

Left Panel (Design Canvas):
- Interactive site plan with clickable elements
- Client/contractor can add/remove plants, hardscape, etc.

Right Panel (Live Cost Breakdown):
┌─────────────────────────────────┐
│ PROJECT COST ESTIMATE           │
│                                 │
│ 📍 Plants & Materials           │
│   3x Knockout Roses       $90   │
│   8x Lantana              $64   │
│   12x Liriope             $36   │
│   Mulch (8 cu ft)         $40   │
│   Subtotal:              $230   │
│                                 │
│ 🛠️ Hardscape                    │
│   Limestone edging        $240  │
│   Decomposed granite      $180  │
│   Subtotal:              $420   │
│                                 │
│ 💧 Irrigation                   │
│   Drip system materials   $120  │
│   Installation labor      $180  │
│   Subtotal:              $300   │
│                                 │
│ 👷 Labor                        │
│   Site prep & install     $350  │
│   Subtotal:              $350   │
│                                 │
│ TOTAL: $1,300                   │
│                                 │
│ [Export Quote PDF]              │
└─────────────────────────────────┘

When user changes quantity (e.g., 5x Lantana instead of 8x):
→ Cost updates INSTANTLY (no page refresh)
→ Total updates
→ Contractor and client both see change immediately

TECHNICAL APPROACH:

Frontend:
- React component for cost breakdown panel
- State management (React Context or Zustand) for live updates
- WebSocket connection for multi-user sync (contractor + client see same thing)

Backend:
- Cost calculation API endpoint: POST /api/estimate/calculate
- Pricing database: materials, labor rates, markups
- Real-time sync via WebSocket (Socket.io)

Database Schema:
```sql
estimates (id, project_id, version, total, created_at)
line_items (id, estimate_id, category, description, quantity, unit_cost, total)
pricing (id, item_type, item_name, unit_cost, markup_percentage)
```

USER FLOW:

1. Contractor creates initial design in platform
2. Platform auto-generates cost estimate based on elements
3. Client logs in, sees design + cost breakdown
4. Client clicks on plant (e.g., Knockout Rose)
5. Modal appears: "Change quantity?" [3] → [5]
6. Client changes to 5
7. Cost updates instantly: $90 → $150
8. Total updates: $1,300 → $1,360
9. Both contractor and client see update in real-time
10. Client clicks "Looks good, request quote"
11. Contractor receives notification
12. Contractor reviews, adjusts labor if needed, approves
13. System generates PDF quote with line items
14. Both parties have exact agreement on scope and cost

EDGE CASES:

- What if: Client changes 50 items rapidly?
  → Debounce updates (wait 500ms after last change)

- What if: Contractor and client edit simultaneously?
  → Last edit wins, but show conflict warning
  → "Contractor just updated this - refresh to see latest"

- What if: Item pricing not in database?
  → Allow contractor to enter custom price
  → Flag for admin to add to pricing database

- What if: Total exceeds client's stated budget?
  → Highlight in red, suggest value engineering options
  → "You're $2K over budget - consider these alternatives"

- What if: Client screenshots old estimate, claims that's what was agreed?
  → Version all estimates, timestamp all changes
  → Approval workflow: Client must explicitly approve estimate
  → Approved estimate is locked (can't be edited, only superseded)

SUCCESS METRICS:

- Reduce time to generate quote: from 2 hours → 15 minutes
- Reduce email back-and-forth: from 5+ exchanges → 1-2 clarifications
- Zero cost surprises: Client never says "I didn't know X cost that much"
- Measurable: Track # of estimate revisions, time to approval, client satisfaction

DEVELOPMENT ESTIMATE:

- Frontend (React components, UI):      16 hours
- Backend (API, WebSocket, pricing DB):  20 hours
- Testing (unit, integration, E2E):      12 hours
- Total:                                 48 hours (6 days)

DEPENDENCIES:

Requires:
- User authentication (contractor/client roles)
- Project creation workflow
- Design canvas (where elements are placed)

Enables:
- Approval workflow (once estimate is agreed)
- PDF quote generation
- Budget tracking vs. actual costs
- Value engineering suggestions (automated)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Panel Review Process

```bash
# Contractor writes initial feature spec (above)

/platform-feature-spec

# Claude Code spawns 6 agents in parallel:

Agent 1 (UX Clarity Champion):
✅ STRONG - Live updates create immediate clarity
✅ Line item breakdown is transparent
⚠️ Consider: Is the interface too busy? Maybe collapsible sections?
⚠️ Mobile view: Right panel might need to be bottom sheet

Agent 2 (Technical Architect):
✅ FEASIBLE - Standard React + WebSocket pattern
⚠️ Pricing database needs seeding (who maintains prices?)
⚠️ Real-time sync could have race conditions (use operational transforms?)
💡 Suggestion: Start with polling (simpler), add WebSocket later

Agent 3 (Contractor Workflow Expert):
✅ HUGE WIN - Saves 2 hours per quote, this is the killer feature
✅ Contractor can adjust on the fly during client meetings
⚠️ Need "contractor-only" pricing view (show markup separately)
⚠️ Integration with existing spreadsheet pricing (import/export)

Agent 4 (Client Experience Advocate):
✅ LOVE IT - Clients can finally see what they're paying for
✅ Transparency builds trust
⚠️ Clients might fixate on small line items ("Why is mulch $40?")
💡 Suggestion: Group small items, show detail on click

Agent 5 (QA & Edge Case Hunter):
⚠️ CONCERN: Concurrent editing needs conflict resolution
⚠️ CONCERN: Pricing data integrity (who can change prices?)
🛑 CRITICAL: Version locking after approval (prevent disputes)
💡 Test: Simulate client changing 100 items rapidly

Agent 6 (Development Reality Checker):
✅ REALISTIC - 6 days is reasonable for MVP
⚠️ WebSocket adds 3-4 days complexity
💡 Suggestion: Phase 1 = polling (4 days), Phase 2 = WebSocket (2 days)
💡 Defer PDF export to Phase 2, focus on interactive estimate first

OVERALL ASSESSMENT: ✅ BUILD THIS (with adjustments)

Critical Changes:
1. Version locking after approval (prevent disputes)
2. Conflict resolution for concurrent edits

Important Improvements:
1. Start with polling, add WebSocket in Phase 2
2. Collapsible sections for mobile UX
3. Contractor-only pricing view (show markup)

Suggestions:
1. Defer PDF export to Phase 2
2. Group small line items, show detail on click
```

## Output Format

```markdown
PLATFORM FEATURE REVIEW REPORT
Feature: {name}
Review Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PANEL FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 UX CLARITY CHAMPION
Status: ✅ CLEAR | ⚠️ NEEDS WORK | 🛑 CONFUSING
{Findings}

🏗️ TECHNICAL ARCHITECT
Status: ✅ FEASIBLE | ⚠️ RISKY | 🛑 TOO COMPLEX
{Findings}

👷 CONTRACTOR WORKFLOW EXPERT
Status: ✅ VALUABLE | ⚠️ MARGINAL | 🛑 BURDEN
{Findings}

👤 CLIENT EXPERIENCE ADVOCATE
Status: ✅ DELIGHTFUL | ⚠️ ACCEPTABLE | 🛑 FRUSTRATING
{Findings}

🐛 QA & EDGE CASE HUNTER
Status: ✅ ROBUST | ⚠️ NEEDS HARDENING | 🛑 FRAGILE
{Findings}

⏱️ DEVELOPMENT REALITY CHECKER
Status: ✅ REALISTIC | ⚠️ OPTIMISTIC | 🛑 UNDERESTIMATED
{Findings}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Decision: ✅ BUILD | ⚠️ REVISE & RESUBMIT | 🛑 DEFER

Critical Changes (must address):
- {Issue 1}
- {Issue 2}

Important Improvements (should address):
- {Improvement 1}
- {Improvement 2}

Suggestions (nice to have):
- {Suggestion 1}
- {Suggestion 2}

Revised Timeline: {days/weeks}

Next Steps:
1. {Action 1}
2. {Action 2}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Usage

```bash
# When specifying platform feature:

/platform-feature-spec

# Claude Code will:
# 1. Prompt for feature details (or accept draft spec)
# 2. Spawn 6-agent review panel in parallel
# 3. Collect findings from all perspectives
# 4. Synthesize into review report
# 5. Recommend: BUILD | REVISE | DEFER
# 6. Generate revised spec with panel feedback
# 7. Save to project-plans/features/{feature-name}/
```

## Success Criteria

- Features solve real PDF/email pain points
- UX creates clarity (not more confusion)
- Technical approach is feasible
- Timeline estimates are realistic
- All edge cases are considered
- Both contractor and client workflows are improved

## Integration with Other Skills

- Run after `/inspiration-gatherer` (research similar platforms)
- Run before `/feature-scope-estimate` (detailed timeline)
- Check alignment with `/north-star-check` (SOFTWARE project)
- Generate visuals with `/clarity-engine` (mockups, wireframes)
