---
title: "Dual-System FlowStar Guide"
description: "Managing BOTH Platform Development AND Physical Landscape Projects"
category: "getting-started"
priority: 1
---

# Dual-System FlowStar Guide

**Understanding the Two Sides of This System**

## Quick Overview

This skills system manages **two fundamentally different project types**:

### 🖥️ **SIDE A: SOFTWARE**
Building the Evergold Design Management Platform

**What**: Interactive media-rich website that replaces PDF/email workflows
**Goal**: Enable absolute clarity between customers and contractors
**Deliverable**: Web application with CAD, quotes, live estimating
**Example Project**: "Live Cost Estimator Feature"

### 🌱 **SIDE B: PHYSICAL**
Actual landscape installation and maintenance work

**What**: Real dirt, plants, hardscape, labor in the field
**Goal**: Transform properties with quality execution
**Deliverable**: Installed landscapes, ongoing maintenance
**Example Project**: "Spoetzl Entrance Garden Installation"

---

## Why This Dual System Exists

```
The SOFTWARE platform ENABLES better PHYSICAL project execution

┌─────────────────────────────────────┐
│  SOFTWARE: Platform Development     │
│                                     │
│  Building tools for clarity:        │
│  - Interactive design canvas        │
│  - Live cost estimator              │
│  - Inline collaboration             │
│  - Visual confirmation              │
└─────────────────────────────────────┘
                │
                │ ENABLES
                ▼
┌─────────────────────────────────────┐
│  PHYSICAL: Landscape Projects       │
│                                     │
│  Using platform for:                │
│  - Design iteration (no PDF hell)   │
│  - Cost transparency                │
│  - Zero "I thought you meant..."    │
│  - Absolute clarity                 │
└─────────────────────────────────────┘
```

---

## How FlowStar's 9 Phases Apply Differently

| Phase | SOFTWARE Project | PHYSICAL Project |
|-------|------------------|------------------|
| **1. Sense** | User research, competitor analysis | Site visit, inspiration gathering |
| **2. Validate** | Problem-solution fit, user interviews | Budget feasibility, design approval |
| **3. Specify** | User stories, wireframes, API specs | Plant lists, CAD drawings, hardscape specs |
| **4. Scope** | Sprint planning, story points, dev timeline | Installation timeline, seasonal windows |
| **5. Build** | Write code, design UI, integrate features | Install plants, build hardscape, set irrigation |
| **6. Verify** | Unit tests, QA, user acceptance testing | Installation quality check, plant health |
| **7. Ship** | Deploy to production, launch | Complete installation, final walkthrough |
| **8. Adopt** | User onboarding, training | Client satisfaction, property usage |
| **9. Measure** | Analytics, user feedback, feature usage | Plant survival rate, maintenance needs, ROI |

---

## The Three Project Types

### 1. SOFTWARE
**Building applications/features**

```markdown
PROJECT TYPE: SOFTWARE
PROJECT: Live Cost Estimator Feature

NORTH STAR:
Enable customers to see cost impacts instantly as design changes

CONSTRAINTS:
- Budget: 6 days development
- Tech Stack: React, WebSocket, pricing database
- Integration: Design canvas, quote generator

PHASES:
1. Sense: Research how contractors estimate costs
2. Validate: Will this save time vs spreadsheets?
3. Specify: UI mockups, API specs, database schema
4. Scope: 48 hours realistic? Dependencies?
5. Build: Write code, design UI
6. Verify: Unit tests, integration tests, user testing
7. Ship: Deploy to production
8. Adopt: Train Evergold team on usage
9. Measure: Time saved per quote, user satisfaction
```

**Key Skills**:
- `/platform-feature-spec` - Spec and review features
- `/tech-scoping-lessons` - Realistic dev timelines
- `/code-quality-check` - Review before merge
- `/deployment-readiness` - Production launch criteria

---

### 2. PHYSICAL_INSTALLATION
**Installing landscape elements**

```markdown
PROJECT TYPE: PHYSICAL_INSTALLATION
PROJECT: Spoetzl Entrance Garden

NORTH STAR:
Create welcoming German beer garden entrance with photo opportunities

CONSTRAINTS:
- Budget: $15,000 installed
- Timeline: Before Oktoberfest (Sept 15)
- Season: Currently July - fall planting window
- Climate: Zone 8b, Texas heat, full sun site

PHASES:
1. Sense: Research German gardens, Texas plants
2. Validate: Client approves design concept
3. Specify: Plant lists with photos, CAD site plan
4. Scope: Hardscape August, planting September
5. Build: Install edging, irrigation, plants
6. Verify: Quality check, plant health inspection
7. Ship: Final walkthrough, care instructions
8. Adopt: Client satisfaction, visitor feedback
9. Measure: Plant survival rate, guest photos taken
```

**Key Skills**:
- `/inspiration-gatherer` - Multi-domain research
- `/design-spec-review` - 5-agent panel review
- `/landscape-scoping-lessons` - Seasonal timing
- `/field-quality-inspection` - Installation verification

---

### 3. PHYSICAL_MAINTENANCE
**Ongoing property care**

```markdown
PROJECT TYPE: PHYSICAL_MAINTENANCE
PROJECT: Spoetzl Monthly Grounds Maintenance

NORTH STAR:
Maintain brewery grounds at destination-quality standards year-round

CONSTRAINTS:
- Budget: $2,000/month ($24,000/year)
- Frequency: Weekly visits (Mondays, 8am-12pm)
- Scope: Mowing, weeding, pruning, irrigation monitoring
- Standards: "Camera-ready at all times"

PHASES:
1. Sense: Assess current property condition
2. Validate: Client approves service scope and standards
3. Specify: Task checklist, quality standards, SLA
4. Scope: Crew size, equipment, seasonal variations
5. Build: Execute weekly maintenance tasks
6. Verify: Property inspection, quality check
7. Ship: Complete week's work, notify client
8. Adopt: Client satisfaction with ongoing quality
9. Measure: Property condition over time, client renewal
```

**Key Skills**:
- `/maintenance-scope-definition` - What's included/excluded
- `/service-level-standards` - Quality expectations
- `/seasonal-task-planning` - Year-round care calendar
- `/field-quality-inspection` - Weekly property check

---

## The Customer-Contractor Collaboration Layer

**This is the META layer where SOFTWARE enables PHYSICAL**

### Traditional Workflow (What We're Replacing):

```
1. Customer emails rough idea
2. Contractor sends PDF proposal (ambiguous)
3. Customer has questions → email back-and-forth (slow)
4. Contractor sends revised PDF (version confusion)
5. More email ping-pong (context lost)
6. Ambiguity persists until installation
7. Surprises happen: "I thought you meant flagstone, not limestone!"
```

**Problems**: Slow, ambiguous, cost surprises, version confusion

---

### Platform Workflow (What We're Building):

```
1. Customer uploads photos, describes vision in platform
2. Platform runs /inspiration-gatherer (AI research)
3. Contractor reviews research, adds design in interactive canvas
4. Customer sees design with PHOTOS of actual plants (visual confirmation)
5. Customer leaves inline comments: "Love! Can we add 2 more roses?"
6. Cost updates LIVE: $1,300 → $1,450 (cost transparency)
7. Contractor responds inline (no email)
8. Platform runs /design-spec-review (catches gaps)
9. Platform runs /landscape-scoping-lessons (honest timeline)
10. Both parties approve design (locked, timestamped)
11. Installation proceeds with ZERO surprises
```

**Benefits**: Fast (24 hours not 7 days), clear (photos not text), transparent (live costs), locked approval (no disputes)

---

## Example Workflows

### SOFTWARE Project: Building "Live Cost Estimator" Feature

```bash
# Step 1: Declare project type
/project-type-declaration
> TYPE: SOFTWARE
> PROJECT: Live Cost Estimator Feature

# Step 2: Research similar platforms
/inspiration-gatherer
# Agents research: How do other estimating tools work?
# Output: Best practices, UX patterns, technical approaches

# Step 3: Spec the feature
/platform-feature-spec
# 6-agent review panel:
# - UX Clarity Champion: Is this intuitive?
# - Technical Architect: Can we build this?
# - Contractor Workflow: Will contractors use it?
# - Client Experience: Does this create clarity?
# - QA & Edge Cases: What can go wrong?
# - Development Reality: Honest timeline?

# Output: Feature spec with panel feedback, 48-hour estimate

# Step 4: Check alignment
/north-star-check (SOFTWARE mode)
# Agents: UX Designer, Technical Architect, Business Analyst
# Question: Does this enable customer-contractor clarity?
# Output: ALIGNED - this is the killer feature

# Step 5: Build it
[Write code, design UI, integrate]

# Step 6: Test thoroughly
/qa-verification
# Unit tests, integration tests, user acceptance

# Step 7: Deploy
[Merge to main, deploy to production]

# Step 8: Measure success
[Track: Time saved per quote, user satisfaction]
```

---

### PHYSICAL Project: Installing Entrance Garden

```bash
# Step 1: Declare project type
/project-type-declaration
> TYPE: PHYSICAL_INSTALLATION
> PROJECT: Spoetzl Entrance Garden

# Step 2: Gather inspiration
/inspiration-gatherer
# Agents research:
# - Historical: German beer garden traditions
# - Modern: Successful contemporary examples
# - Climate: Texas-appropriate plant selections
# - Materials: Local sourcing options

# Output: Curated inspiration board with design principles

# Step 3: Create specification
[Draft CAD plan, plant lists, hardscape specs]
/design-spec-review
# 5-agent review panel:
# - Detail Detective: Missing info? Ambiguous specs?
# - Contractor: Buildable as specified?
# - Horticulturist: Plants will thrive in Texas?
# - Guest Experience: Visitor-friendly?
# - Budget Guardian: Cost-realistic?

# Output: Improved spec with gaps filled

# Step 4: Scope timeline
/landscape-scoping-lessons
# 4-agent scoping panel:
# - Season Strategist: Currently July, fall planting ideal
# - Logistics Coordinator: Hardscape August, plants September
# - Risk Assessor: Weather buffers, heat stress risk
# - Budget Reality: Contingency for surprises

# Output: Phased timeline (hardscape before Oktoberfest, planting fall)

# Step 5: Check alignment
/north-star-check (PHYSICAL mode)
# Agents: Heritage Keeper, Guest Experience, Practical Implementer
# Question: Does this honor German heritage + guest experience?
# Output: ALIGNED - entrance garden serves vision

# Step 6: Generate clarity outputs
/clarity-engine
# Agents generate:
# - Source: Markdown spec with plant lists
# - Diagrams: Mermaid site plan
# - Visual: Interactive HTML site plan
# - Presentation: Stakeholder deck

# Step 7: Customer approval (via platform)
/interactive-design-approval
# Customer sees design, costs, timeline
# Leaves inline comments, approves
# Design locked and timestamped

# Step 8: Installation
[Field work: edging, irrigation, planting]
/field-quality-inspection
# Quality check, plant health verification

# Step 9: Measure success
[Plant survival rate, guest photos, client satisfaction]
```

---

## Shared Skills (Work for BOTH Types)

These skills adapt based on project type:

### `/north-star-check`
**SOFTWARE**: Spawns UX Designer, Technical Architect, Business Analyst
**PHYSICAL**: Spawns Heritage Keeper, Guest Experience, Practical Implementer

### `/clarity-engine`
**SOFTWARE**: Generates mockups, wireframes, interactive prototypes
**PHYSICAL**: Generates CAD drawings, renderings, interactive site plans

### `/scoping-lessons`
**SOFTWARE**: Tech debt, dependencies, sprint estimates
**PHYSICAL**: Seasonal timing, weather buffers, material lead times

### `/adversarial-review`
**SOFTWARE**: Code review, security audit, UX critique
**PHYSICAL**: Spec review, buildability check, horticulture validation

---

## When to Use Which Skills

### Starting ANY Project:
1. **`/project-type-declaration`** - Declare SOFTWARE | PHYSICAL_INSTALLATION | PHYSICAL_MAINTENANCE

### SOFTWARE Projects (Building Platform):
2. `/inspiration-gatherer` - Research similar platforms, UX patterns
3. `/platform-feature-spec` - Spec features with 6-agent panel
4. `/north-star-check` (SOFTWARE) - Does this enable clarity?
5. `/tech-scoping-lessons` - Honest dev timeline
6. `/code-quality-check` - Review before merge
7. `/deployment-readiness` - Ready for production?
8. `/qa-verification` - Testing complete?

### PHYSICAL Projects (Landscape Work):
2. `/inspiration-gatherer` - Research design inspiration
3. `/design-spec-review` - Review specs with 5-agent panel
4. `/landscape-scoping-lessons` - Seasonal timing, realistic timeline
5. `/north-star-check` (PHYSICAL) - Does this serve vision?
6. `/clarity-engine` - Generate multi-fidelity outputs
7. `/interactive-design-approval` - Customer collaboration via platform
8. `/field-quality-inspection` - Installation verification

---

## Success Metrics

### SOFTWARE Project Success:
- ✅ Platform enables clarity (vs PDF/email baseline)
- ✅ Contractors save 2+ hours per quote
- ✅ Clients understand exactly what they're approving
- ✅ Zero "I thought you meant..." conflicts after platform adoption
- ✅ Customer satisfaction: 95%+ "clearer than PDF"

### PHYSICAL Installation Success:
- ✅ Designs align with vision (no drift)
- ✅ Timelines are realistic (weather buffers included)
- ✅ Installations succeed (plants thrive, hardscape quality)
- ✅ Zero cost surprises (client knew all costs upfront)
- ✅ Client delighted: "This is exactly what I saw in the platform"

### PHYSICAL Maintenance Success:
- ✅ Property maintained at destination standards
- ✅ No surprise costs (scope clearly defined)
- ✅ Client renewal rate: 95%+
- ✅ Plant health sustained (professional care)
- ✅ Predictable budget and quality

---

## The Meta Goal

**Build a SOFTWARE platform that makes PHYSICAL projects dramatically better through absolute clarity.**

1. Start with PHYSICAL pain points (PDF/email confusion)
2. Build SOFTWARE solution (interactive platform)
3. Use platform for all future PHYSICAL projects
4. Measure improvement (time saved, surprises eliminated)
5. Iterate platform based on PHYSICAL project learnings

**It's a flywheel**: Better physical projects → insights for platform → better platform → even better physical projects.

---

## Directory Structure

```
SKILLS/
├── 00-CORE/                                  # Universal skills
│   ├── dual-system-architecture.md           # THIS CONCEPT
│   ├── project-type-declaration.md           # Declare SOFTWARE/PHYSICAL
│   ├── north-star-check.md                   # Alignment (adapts to type)
│   └── clarity-engine.md                     # Multi-fidelity outputs
│
├── 01-PHASE-SKILLS/                          # PHYSICAL project skills
│   ├── sense/
│   │   └── inspiration-gatherer.md           # Design inspiration research
│   ├── specify/
│   │   └── design-spec-review.md             # 5-agent spec review
│   └── scope/
│       └── landscape-scoping-lessons.md      # Seasonal timing, honest estimates
│
├── 02-META-SKILLS/                           # System orchestration
│   └── agent-swarm-orchestrator.md           # How to coordinate agents
│
├── 03-SOFTWARE-SKILLS/                       # SOFTWARE project skills
│   └── platform-feature-spec.md              # 6-agent feature review
│
└── 04-COLLABORATION-WORKFLOW/                # Where SOFTWARE enables PHYSICAL
    └── interactive-design-approval.md        # Replace PDF/email hell
```

---

## Quick Start

### Building Platform (SOFTWARE Project):

```bash
# 1. Declare
/project-type-declaration → SOFTWARE

# 2. Spec features
/platform-feature-spec

# 3. Build iteratively
# 4. Deploy
# 5. Measure adoption
```

### Installing Landscape (PHYSICAL Project):

```bash
# 1. Declare
/project-type-declaration → PHYSICAL_INSTALLATION

# 2. Gather inspiration
/inspiration-gatherer

# 3. Review specification
/design-spec-review

# 4. Scope realistically
/landscape-scoping-lessons

# 5. Generate clarity
/clarity-engine

# 6. Get customer approval
/interactive-design-approval (via platform)

# 7. Install
# 8. Verify quality
/field-quality-inspection

# 9. Measure success
```

---

**The ultimate innovation**: Using agent swarms to manage BOTH platform development AND the landscape projects that platform enables - all without external LLM APIs.

**Start here**: `/project-type-declaration`

---
