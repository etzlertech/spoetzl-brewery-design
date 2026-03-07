---
name: interactive-design-approval
title: Interactive Design Approval Workflow
description: Replace PDF/email cycles with interactive media-rich collaboration for landscape design approval
category: collaboration
tags:
  - collaboration
  - approval
  - customer
  - contractor
  - clarity
  - critical
version: "1.0.0"
priority: 9
status: active
phases:
  - specify
  - scope
  - validate
project_types:
  - PHYSICAL_INSTALLATION
  - SOFTWARE (when building this feature)
---

# Interactive Design Approval Workflow

## Purpose

This skill defines the **killer feature** of the Evergold Design Management Platform:
Replacing the ambiguous PDF/email approval process with interactive, media-rich collaboration
that creates **absolute clarity** between customer and contractor.

## The Problem: Traditional PDF/Email Hell

### Current Workflow (What We're Killing):

```
DAY 1:
Customer: "I want to enhance the entrance garden" [sends email]

DAY 3:
Contractor: [sends PDF proposal with text description]
  "12x8 bed, roses, lantana, groundcover, limestone edging, mulch"
Customer: "Looks good!" [doesn't realize ambiguity]

DAY 10: Installation begins
Contractor arrives with Knockout roses (thornless, red)
Customer: "Wait, I thought we were getting tea roses (pink)?"
Contractor: "The PDF didn't specify variety..."

RESULT: Misalignment discovered too late, $500 plant budget wasted
```

### Why This Happens:

- ❌ PDFs are static (can't annotate or ask inline questions)
- ❌ Email threads lose context after 5+ exchanges
- ❌ Text descriptions are ambiguous ("roses" = 100+ varieties)
- ❌ No visual confirmation (client approves without seeing what plants look like)
- ❌ Cost changes hidden (client doesn't know lantana quantity affects price)
- ❌ Version confusion ("Wait, which PDF did we agree on?")

## The Solution: Interactive Design Approval

### New Platform Workflow (What We're Building):

```
DAY 1:
Customer: Logs into platform, uploads entrance photos, describes vision
  "German beer garden feel, low maintenance, budget $15K"

Platform: Runs /inspiration-gatherer (agent swarm)
  → Historical German gardens research
  → Texas-appropriate plant selections
  → Material options (limestone, decomposed granite, etc.)
  → Generates inspiration board with images

DAY 1 (30 minutes later):
Contractor: Reviews AI-generated inspiration, adds custom touches
  → Uploads CAD site plan
  → Drags plants onto design (from curated Texas-hardy German-aesthetic library)
  → Clicks Knockout Rose thumbnail → sees PHOTO of actual plant
  → Adds 3x Knockout Rose to bed
  → Cost updates LIVE: +$90

Customer: Gets notification, logs in, sees interactive design
  → Clicks on rose icon in design
  → Sees PHOTO: "Knockout Rose - Double Red, thornless, heat-tolerant"
  → Sees SPECS: "3-4' mature height, full sun, Zone 7-9"
  → Sees COST: "$30 each x 3 = $90"
  → Leaves inline comment: "Love these! Can we add 2 more?"

Contractor: Sees comment notification (no email needed)
  → Drags 2 more roses into design
  → Cost updates: $90 → $150
  → Adds reply: "Added! Total is now $1,450. Still under budget."

Customer: Sees update in real-time
  → Clicks "Approve This Version"
  → Design is LOCKED (timestamped, version-controlled)
  → Both parties have exact agreement with visual confirmation

DAY 2: Installation begins
Contractor arrives with exactly what was approved (with photos)
Customer: "Perfect! This is exactly what I saw in the platform."

RESULT: Zero surprises, zero wasted budget, delighted customer
```

## The Three Pillars of Clarity

### 1. Visual Confirmation
**Never approve without seeing**

Traditional PDF:
```
3x Roses, 8x Lantana, 12x Groundcover
```
❌ Client imagines pink tea roses, contractor brings red knockouts

Platform Version:
```
[PHOTO: Knockout Rose - Double Red]
Knockout Rose (Rosa 'Radtko')
- Double red blooms, thornless
- 3-4' height x 3-4' width
- Full sun, Zone 7-9, heat-tolerant
- Low maintenance, disease-resistant

Quantity: [3] [$30 each = $90]
```
✅ Client sees EXACTLY what they're getting

---

### 2. Inline Collaboration
**Ask questions where they arise**

Traditional PDF:
```
Customer: "What does 'decomposed granite' mean?" [sends email]
[Wait 6 hours]
Contractor: "It's a walkway surface..." [sends email]
[Customer forgot original context]
```
❌ Slow, context lost, email clutter

Platform Version:
```
Design shows "Decomposed Granite Walkway"
Customer clicks "?" icon next to it
→ Tooltip appears: "Crushed granite that compacts into firm walkway.
  Natural look, permeable, comfortable to walk on."
→ Photo gallery of DG walkways
Customer clicks chat bubble: "How does this compare to flagstone?"
Contractor gets notification, replies inline: "DG is $180, flagstone
  would be $600 for same area. DG feels more casual/natural."
Customer: "Perfect, let's go with DG"
```
✅ Fast, contextual, decision made in minutes

---

### 3. Cost Transparency
**Every change shows price impact**

Traditional PDF:
```
"Entrance Garden - $15,000"
[Black box - client doesn't know what's included]
Customer later: "Can we add a fountain?"
Contractor: "Sure, that's an additional $5,000"
Customer: "What?! I thought it was included!"
```
❌ Cost surprises, trust erosion

Platform Version:
```
Right panel shows LIVE cost breakdown:
┌─────────────────────────────┐
│ Plants:          $230       │
│ Hardscape:       $420       │
│ Irrigation:      $300       │
│ Labor:           $350       │
│ TOTAL:           $1,300     │
│                             │
│ Your Budget:     $15,000    │
│ Remaining:       $13,700    │
└─────────────────────────────┘

Customer: "Can we add a fountain?"
→ Drags fountain icon into design
→ Cost updates INSTANTLY: $1,300 → $6,500
→ Remaining budget: $13,700 → $8,500
→ Platform flags: "This is a significant add. Consider phasing?"

Customer sees impact immediately, makes informed decision
```
✅ No surprises, informed tradeoffs

## Interactive Elements

### Element 1: Design Canvas

```
┌─────────────────────────────────────────────┐
│  🏠 Spoetzl Brewery - Entrance Garden       │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │      [Entrance]                       │  │
│  │         ▼                             │  │
│  │    ┌─────────┐                        │  │
│  │    │  BED A1 │                        │  │
│  │    │  🌹🌹🌹  │  ← Clickable plants   │  │
│  │    │  🌺🌺🌺  │                        │  │
│  │    │  🌺🌺🌺  │                        │  │
│  │    │  🌿🌿🌿  │                        │  │
│  │    └─────────┘                        │  │
│  │         │                             │  │
│  │    [DG Path] ← Click for details      │  │
│  │         │                             │  │
│  │    [Seating Area]                     │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Tools:                                     │
│  [+ Plant] [+ Hardscape] [+ Irrigation]     │
│  [💬 Comment] [📐 Measure] [📷 Upload]       │
└─────────────────────────────────────────────┘
```

**Interactions:**
- Click plant → See photo, specs, cost
- Drag to add/move elements
- Right-click → Edit quantity
- Click comment icon → Leave inline question
- Upload photo → "I want it to look like this"

---

### Element 2: Plant/Material Library

```
┌──────────────────────────────────────┐
│  PLANT LIBRARY                       │
│  Filters: [Full Sun] [Zone 8b]       │
│           [German Aesthetic]         │
│  ┌────────────────────────────────┐  │
│  │ [PHOTO]  Knockout Rose         │  │
│  │          Double Red, thornless │  │
│  │          $30 ea   [+ Add]      │  │
│  ├────────────────────────────────┤  │
│  │ [PHOTO]  Lantana               │  │
│  │          Dallas Red, pollinator│  │
│  │          $8 ea    [+ Add]      │  │
│  ├────────────────────────────────┤  │
│  │ [PHOTO]  Liriope               │  │
│  │          Big Blue, evergreen   │  │
│  │          $3 ea    [+ Add]      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Why This Works:**
- Pre-curated for Texas climate (no bad suggestions)
- Photos prevent "I thought roses were pink" confusion
- Prices visible upfront (no surprises)
- Contractor can add custom items (not limited to library)

---

### Element 3: Approval Workflow

```
┌─────────────────────────────────────────┐
│  DESIGN STATUS: Draft v3                │
│                                         │
│  Customer View:                         │
│  ✅ I approve this design               │
│  💬 I have questions                    │
│  ✏️  I want changes                     │
│                                         │
│  Contractor View:                       │
│  ✅ Ready for customer approval         │
│  ✏️  Still working on this              │
│                                         │
│  Once BOTH approve:                     │
│  → Design is LOCKED                     │
│  → Version timestamped                  │
│  → PDF quote generated                  │
│  → Installation can begin               │
└─────────────────────────────────────────┘
```

**Version Control:**
- Every change creates new version (v1, v2, v3)
- Can view history: "What changed from v2 to v3?"
- Approved version is locked (can't be edited)
- If changes needed after approval → create v4 (requires re-approval)

## Workflow States

### State 1: Customer Initiates

```
Customer Actions:
1. Logs in, clicks "New Project"
2. Uploads site photos
3. Describes vision (text, reference photos)
4. Sets budget and timeline

Platform Actions:
1. Runs /inspiration-gatherer (agent swarm)
2. Generates inspiration board
3. Notifies contractor: "New project request from Spoetzl"

Contractor Actions:
1. Reviews customer vision + AI inspiration
2. Begins designing in platform
3. Status: "Draft - Working on It"
```

---

### State 2: Contractor Designs

```
Contractor Actions:
1. Creates CAD site plan OR uses platform design canvas
2. Adds plants from library (with photos)
3. Adds hardscape elements
4. Adds irrigation zones
5. Reviews live cost estimate
6. Adds notes: "This phase before Oktoberfest, planting in fall"
7. Clicks "Ready for Customer Review"

Platform Actions:
1. Runs /design-spec-review (5-agent panel)
2. Catches gaps: "No irrigation specified for roses?"
3. Contractor fixes gaps
4. Notifies customer: "Design ready for your review"

Customer Actions:
1. Gets notification (email + SMS)
2. Logs in, sees design
3. Status: "Customer Reviewing"
```

---

### State 3: Customer Reviews

```
Customer Actions:
1. Views interactive design
2. Clicks on each element to see details
3. Leaves inline comments:
   💬 "Love the roses! Can we add 2 more?"
   💬 "What's the maintenance on this?"
   💬 "Can we do flagstone instead of DG?"

Platform Actions:
1. Notifies contractor of comments
2. Updates cost if customer drags elements

Contractor Actions:
1. Sees comments inline
2. Responds:
   ✅ "Added 2 more roses - cost updated"
   ✅ "Low maintenance - water 2x/week first month, then drought-tolerant"
   ⚠️ "Flagstone would be $600 vs $180 for DG - worth it?"

Customer Actions:
1. Sees responses
2. Makes decision: "DG is fine"
3. Clicks "Approve This Version"
4. Status: "Customer Approved - Awaiting Contractor Final Review"
```

---

### State 4: Mutual Approval

```
Contractor Actions:
1. Reviews customer-approved version
2. Checks quantities, costs, timeline one last time
3. Clicks "Contractor Approves - Ready to Install"

Platform Actions:
1. Design is LOCKED (version v3 approved by both)
2. Timestamp recorded
3. Generates PDF quote with line items
4. Creates installation checklist
5. Sends both parties confirmation:
   📄 "Design Approved - Installation Scheduled Sept 1"

Status: "Approved - In Production"
```

---

### State 5: Installation Phase

```
Contractor Actions:
1. Accesses approved design on mobile device (in field)
2. Checks off installation steps:
   ✅ Edging installed
   ✅ Irrigation tested
   ✅ Plants installed
3. Uploads progress photos

Customer Actions:
1. Receives notifications with photos
2. Can see progress in real-time
3. No surprises - matches exactly what was approved

Platform Actions:
1. Tracks completion percentage
2. Flags any deviations: "Liriope out of stock, substituted Mondo Grass (same price)"
3. Requests customer approval for substitutions

Status: "Installation In Progress - 75% Complete"
```

---

### State 6: Final Approval

```
Contractor Actions:
1. Uploads final installation photos
2. Marks project complete
3. Delivers care instructions via platform

Customer Actions:
1. Reviews final photos vs. approved design
2. Walks property with contractor
3. Clicks "Installation Approved - Looks Great!"

Platform Actions:
1. Generates satisfaction survey
2. Archives project (with all versions, photos, comments)
3. Prompts for Phase 2: "Ready to design the patio area?"

Status: "Complete - Customer Satisfied"
```

## Agent Swarm Support for Workflow

### Swarm 1: Initial Inspiration (Sense Phase)

When customer describes vision, platform spawns:

- Historical Research Agent: German garden traditions
- Climate Specialist Agent: Texas-appropriate plants
- Materials Scout Agent: Local sourcing options
- Experience Designer Agent: Guest flow and photo ops

Output: Curated inspiration board contractor can refine

---

### Swarm 2: Design Review (Specify Phase)

When contractor marks design "ready for review," platform spawns:

- Detail Detective: Missing specs (irrigation? soil prep?)
- Horticulturist: Plant compatibility and climate fit
- Budget Guardian: Cost reality check
- Guest Experience: Will visitors love this?
- Contractor Buildability: Installation sequence makes sense?

Output: Gaps caught BEFORE customer sees it (professional quality)

---

### Swarm 3: Scoping Reality Check (Scope Phase)

When timeline is proposed, platform spawns:

- Season Strategist: Is this the right planting window?
- Logistics Coordinator: Material lead times, crew availability
- Risk Assessor: Weather buffers, freeze risk, heat stress
- Budget Reality: Contingency for unknowns

Output: Honest timeline with phasing recommendation

## Success Metrics

### For Platform (SOFTWARE Project):

- ✅ Reduce time to design approval: 7 days → 24 hours
- ✅ Reduce email exchanges: 10+ → 2-3 (just notifications)
- ✅ Eliminate cost surprises: 100% of costs visible upfront
- ✅ Zero version confusion: Approved design is locked and timestamped
- ✅ Customer satisfaction: 95%+ "This was clearer than PDF"

### For Physical Projects (Using Platform):

- ✅ Zero "I thought you meant..." conflicts
- ✅ Plant success rate improves (right plant specified from start)
- ✅ Budget adherence: 100% (no surprise costs)
- ✅ Customer delighted: "I knew exactly what I was getting"
- ✅ Contractor efficiency: 2 hours saved per project

## Implementation Roadmap

### Phase 1: MVP (12 weeks)

Features:
- Photo upload and site documentation
- Design canvas with plant library
- Live cost estimator
- Inline commenting
- Approval workflow
- PDF quote generation

What's NOT in MVP:
- CAD import/export (contractors use design canvas)
- Real-time WebSocket sync (polling instead)
- Mobile app (mobile web is good enough)
- Payment processing (handle offline)

### Phase 2: Enhancements (next 8 weeks)

Features:
- CAD file import/export (DWG, DXF)
- Real-time sync for contractor + client editing simultaneously
- Mobile app for field access
- Progress tracking with photo timeline
- Payment processing integration
- Maintenance scheduling

### Phase 3: Scale (beyond)

Features:
- Multi-contractor support (marketplace model)
- Template library (pre-designed common elements)
- AR visualization (point phone at site, see design overlaid)
- Integration with irrigation controllers
- Client DIY mode (basic designs without contractor)

## Usage

```bash
# When building this feature (SOFTWARE project):
/platform-feature-spec
# Spec the interactive design approval workflow

# When using this workflow (PHYSICAL project):
/interactive-design-approval
# Guide customer-contractor collaboration through platform
```

## Integration with Other Skills

SOFTWARE Project (Building This):
- `/platform-feature-spec` - Spec each element
- `/north-star-check` - Does this create clarity?
- `/tech-scoping-lessons` - Honest dev timeline

PHYSICAL Project (Using This):
- `/inspiration-gatherer` - AI-powered research
- `/design-spec-review` - Catch gaps before customer sees
- `/landscape-scoping-lessons` - Realistic timeline
- `/clarity-engine` - Generate all fidelity levels

---

**The killer feature**: No more PDF/email hell. Absolute clarity, every time.
