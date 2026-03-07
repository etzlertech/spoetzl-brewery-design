---
name: dual-system-architecture
title: Dual-System Architecture - SOFTWARE vs PHYSICAL Projects
description: Understanding the two distinct project types and how FlowStar methodology applies to each
category: core
tags:
  - architecture
  - project-types
  - meta
  - critical
version: "1.0.0"
priority: 0
status: active
---

# Dual-System Architecture

## The Two Sides of This System

This skills system manages **two fundamentally different types of projects**:

### 🖥️ SIDE A: SOFTWARE PROJECT
**Building the Design Management Platform**

- **What**: Interactive, media-rich website for customer-contractor collaboration
- **Goal**: Replace PDF/email workflow with clarity and alignment
- **Stakeholders**: Evergold Landscaping (builder) ↔ Future clients (users)
- **Deliverable**: Web application with CAD integration, quotes, estimating
- **Skills needed**: Software development, UX design, product management

### 🌱 SIDE B: PHYSICAL PROJECTS
**Actual Landscape Installation & Maintenance**

- **What**: Real dirt, plants, hardscape, labor
- **Goal**: Transform Spoetzl Brewery grounds with quality execution
- **Stakeholders**: Spoetzl Manager (customer) ↔ Evergold Manager (contractor)
- **Deliverable**: Installed landscapes, ongoing maintenance
- **Skills needed**: Horticulture, installation, seasonal timing, field execution

## Why This Matters

**These are NOT the same project type** and require different workflows:

| Aspect | SOFTWARE Project | PHYSICAL Project |
|--------|------------------|------------------|
| **Build Phase** | Write code, design UI | Install plants, pour concrete |
| **Scope Risks** | Feature creep, tech debt | Weather delays, plant stress |
| **Timeline Drivers** | Sprint cycles, testing | Seasonal windows, soil conditions |
| **Quality Verification** | Unit tests, user testing | Plant health, installation quality |
| **Maintenance** | Bug fixes, updates | Watering, pruning, seasonal care |
| **Stakeholder Review** | Design mockups, demos | Site visits, photo updates |

## FlowStar 9 Phases Applied Differently

| Phase | SOFTWARE Project | PHYSICAL Project |
|-------|------------------|------------------|
| **1. Sense** | User research, market analysis | Site visit, inspiration gathering |
| **2. Validate** | Problem-solution fit, MVP test | Budget feasibility, design approval |
| **3. Specify** | User stories, wireframes, API specs | Plant lists, hardscape specs, CAD drawings |
| **4. Scope** | Sprint planning, story points | Installation timeline, seasonal windows |
| **5. Build** | Code, design, integrate | Install plants, build hardscape |
| **6. Verify** | Testing, QA, user acceptance | Installation quality, plant health check |
| **7. Ship** | Deploy to production | Complete installation, handoff |
| **8. Adopt** | User onboarding, training | Client satisfaction, usage patterns |
| **9. Measure** | Analytics, user feedback | Plant success rate, maintenance needs |

## Shared Core Philosophy

Both project types share these FlowStar principles:

✅ **North Star Alignment**
- SOFTWARE: Does this feature serve customer-contractor clarity?
- PHYSICAL: Does this design honor German heritage + guest experience?

✅ **Crystal Clarity**
- SOFTWARE: Mockups, wireframes, interactive prototypes
- PHYSICAL: CAD drawings, renderings, material samples

✅ **Adversarial Review**
- SOFTWARE: Code review, design critique, security audit
- PHYSICAL: Spec review, buildability check, horticulture validation

✅ **Honest Scoping**
- SOFTWARE: Realistic sprint estimates, tech debt consideration
- PHYSICAL: Seasonal timing, weather buffers, material lead times

## The Meta Layer: Platform ENABLES Physical Projects

```
┌─────────────────────────────────────────────────────┐
│  SOFTWARE PROJECT                                   │
│  (Building the Design Management Platform)          │
│                                                      │
│  North Star: Enable absolute clarity between        │
│  customers and contractors without PDFs/emails      │
│                                                      │
│  Deliverable: Interactive media-rich web platform   │
└─────────────────────────────────────────────────────┘
                         │
                         │ ENABLES
                         ▼
┌─────────────────────────────────────────────────────┐
│  PHYSICAL PROJECTS                                  │
│  (Landscape Installation & Maintenance Work)        │
│                                                      │
│  North Star: Transform brewery grounds with         │
│  German heritage theming and guest experience       │
│                                                      │
│  Deliverable: Installed landscapes, ongoing care    │
└─────────────────────────────────────────────────────┘
```

**The platform manages physical projects.**

## Project Type Configuration

Every time you start a project, declare its type:

```markdown
PROJECT TYPE: SOFTWARE | PHYSICAL_INSTALLATION | PHYSICAL_MAINTENANCE

PROJECT: {name}
NORTH STAR: {outcome for beneficiary}
STAKEHOLDERS:
  - Customer: {who is paying/requesting}
  - Provider: {who is building/installing}
CONSTRAINTS:
  - Budget: ${amount}
  - Timeline: {deadline or window}
  - [Type-specific constraints]
```

### SOFTWARE Project Example:

```markdown
PROJECT TYPE: SOFTWARE
PROJECT: Evergold Design Management Platform
NORTH STAR: Enable Spoetzl manager and Evergold manager to achieve
absolute clarity on design intent, costs, and timelines through
interactive media-rich collaboration (no PDF/email ping-pong)

STAKEHOLDERS:
  - Customer: Future landscape clients (Spoetzl is first)
  - Provider: Evergold Landscaping (building the platform)

CONSTRAINTS:
  - Budget: $50,000 development
  - Timeline: Beta launch in 12 weeks
  - Tech Stack: Web-based, mobile-responsive
  - Integration: CAD export, quote generation, photo upload
```

### PHYSICAL Project Example:

```markdown
PROJECT TYPE: PHYSICAL_INSTALLATION
PROJECT: Spoetzl Brewery Entrance Garden
NORTH STAR: Create welcoming German beer garden entrance that
honors brewing heritage and creates photo opportunities for visitors

STAKEHOLDERS:
  - Customer: Spoetzl Brewery Manager
  - Provider: Evergold Landscaping

CONSTRAINTS:
  - Budget: $15,000 installed
  - Timeline: Complete before Oktoberfest (Sept 15)
  - Season: Currently July - must phase for fall planting
  - Maintenance: Client prefers low-maintenance selections
```

## Skill Routing by Project Type

Certain skills are **type-specific**:

### SOFTWARE-Only Skills

- `/tech-stack-selection` - Choose frameworks, databases
- `/user-story-mapping` - Define features and flows
- `/ui-mockup-review` - Critique interface designs
- `/code-quality-check` - Review code for standards
- `/deployment-readiness` - Verify production launch criteria

### PHYSICAL-Only Skills

- `/site-assessment` - Evaluate soil, sun, drainage
- `/plant-selection` - Choose climate-appropriate species
- `/installation-sequencing` - Order of hardscape → irrigation → planting
- `/seasonal-timing-check` - Validate planting windows
- `/field-quality-inspection` - On-site installation verification

### Shared Skills (Work for Both)

- `/north-star-check` - Vision alignment (adapts to project type)
- `/clarity-engine` - Multi-fidelity outputs (mockups OR CAD)
- `/scoping-lessons` - Honest timelines (tech debt OR weather)
- `/adversarial-review` - Multi-perspective critique

## The Customer-Contractor Collaboration Layer

**Key innovation**: The SOFTWARE platform enables a new workflow for PHYSICAL projects

### Traditional Workflow (What We're Replacing):

```
1. Customer emails rough idea
2. Contractor sends PDF proposal
3. Customer has questions → email
4. Contractor sends revised PDF
5. More email back-and-forth
6. Ambiguity persists until installation
7. Surprises happen ("I thought you meant...")
```

### New Platform Workflow (What We're Building):

```
1. Customer uploads photos, describes vision in platform
2. Platform runs /inspiration-gatherer (agent swarm research)
3. Contractor reviews research, adds design concepts (CAD + renders)
4. Customer sees interactive visual (not PDF), adds comments inline
5. Platform runs /design-spec-review (5-agent panel catches gaps)
6. Contractor updates spec based on review, costs update live
7. Platform runs /landscape-scoping-lessons (honest timeline)
8. Customer approves phased approach with clear milestones
9. Platform generates clarity tiers (Source → Diagrams → Visual → Presentation)
10. Both parties have ABSOLUTE CLARITY - zero ambiguity
```

**Result**: No email ping-pong, no PDF versioning hell, no "wait, what did we agree on?"

## Two Distinct North Stars

### SOFTWARE Project North Star:

> **Outcome**: Landscape contractors and clients achieve absolute clarity
> on design intent, costs, and timelines without traditional PDF/email workflows
>
> **Beneficiary**: Landscape professionals (Evergold) + Property managers (Spoetzl)
>
> **Done Looks Like**:
> - Design iterations happen in minutes (not days of email)
> - Cost changes are visible immediately as specs change
> - Both parties can see exactly what's included/excluded
> - Zero "I thought you meant..." surprises
> - Every decision has visual confirmation

### PHYSICAL Project North Star:

> **Outcome**: Transform Spoetzl Brewery into an extraordinary destination
> that honors German brewing heritage while creating immersive guest experiences
>
> **Beneficiary**: Brewery visitors, staff, and the broader community
>
> **Done Looks Like**:
> - Cohesive European village theming with distinct outdoor "rooms"
> - Professional landscaping with seasonal interest year-round
> - Strategic amenities placement for guest comfort
> - Photo opportunities that visitors want to share
> - Sustainable maintenance within client budget

## Agent Swarm Adaptation by Type

Agent personas change based on project type:

### SOFTWARE Project Agents:

**For `/north-star-check` on platform development:**
- UX Designer: Does this feature create clarity for users?
- Technical Architect: Is this buildable and maintainable?
- Business Analyst: Does this serve contractor workflow efficiency?

**For `/design-spec-review` on platform features:**
- Frontend Developer: Is the UI spec complete?
- Backend Developer: Are API requirements clear?
- QA Engineer: Is this testable?
- User Experience: Will users understand this?
- Cost Estimator: Development time realistic?

### PHYSICAL Project Agents:

**For `/north-star-check` on landscape design:**
- Heritage Keeper: German cultural authenticity?
- Guest Experience Analyst: Visitor satisfaction?
- Practical Implementer: Feasibility and maintenance?

**For `/design-spec-review` on planting plan:**
- Detail Detective: Complete specifications?
- Contractor: Buildable as specified?
- Horticulturist: Plants will thrive?
- Guest Experience Critic: Visitor-friendly?
- Budget Guardian: Cost-realistic?

## Integration Points

Where the two systems connect:

### 1. Platform Features Drive Physical Project Success

```
SOFTWARE Feature: "Live cost estimator as specs change"
↓ ENABLES
PHYSICAL Project: Client understands budget implications immediately
```

### 2. Physical Project Learnings Inform Platform Features

```
PHYSICAL Project: "Client was surprised by irrigation cost"
↓ INFORMS
SOFTWARE Feature: "Separate line items for irrigation vs plants in quotes"
```

### 3. Shared Clarity Engine

```
Both SOFTWARE and PHYSICAL use /clarity-engine but generate different outputs:
- SOFTWARE: Wireframes → Interactive Prototype → Demo Video
- PHYSICAL: CAD Drawings → 3D Rendering → Interactive Site Plan
```

## Workflow Examples

### Example 1: SOFTWARE Project (Building Quote Generator Feature)

```bash
# Declare project type
PROJECT TYPE: SOFTWARE
PROJECT: Quote Generator Feature

# Phase 1: SENSE - Research how contractors estimate
/inspiration-gatherer
# Agents research: Existing estimating software, contractor pain points

# Phase 2: VALIDATE - Is this worth building?
/north-star-check
# Agents: UX Designer, Technical Architect, Business Analyst
# Question: Does live quoting create customer-contractor clarity?

# Phase 3: SPECIFY - Define the feature
[Draft user stories, API specs, UI mockups]
/design-spec-review
# Agents: Frontend Dev, Backend Dev, QA, UX, Cost Estimator

# Phase 4: SCOPE - Timeline estimate
/tech-scoping-lessons  # (New SOFTWARE-specific skill)
# Agents assess: Complexity, dependencies, testing needs
# Estimate: 3 weeks (2 dev, 1 testing)

# Phase 5: BUILD - Develop the feature
[Write code, design UI, integrate]

# Phase 6: VERIFY - Test thoroughly
/qa-verification  # (New SOFTWARE-specific skill)
# Unit tests, integration tests, user acceptance

# Phase 7: SHIP - Deploy to production
[Merge to main, deploy, monitor]

# Phase 8: ADOPT - User onboarding
[Train Evergold team, document usage]

# Phase 9: MEASURE - Track success
[Analytics: Are quotes generated? Time saved vs PDF process?]
```

### Example 2: PHYSICAL Project (Installing Entrance Garden)

```bash
# Declare project type
PROJECT TYPE: PHYSICAL_INSTALLATION
PROJECT: Spoetzl Entrance Garden

# Phase 1: SENSE - Gather inspiration
/inspiration-gatherer
# Agents research: German gardens, Texas plants, materials

# Phase 2: VALIDATE - Client approval
/north-star-check
# Agents: Heritage Keeper, Guest Experience, Practical Implementer
# Question: Does entrance garden serve brewery vision?

# Phase 3: SPECIFY - Create planting plan
[Draft CAD drawings, plant lists, hardscape specs]
/design-spec-review
# Agents: Detail Detective, Contractor, Horticulturist, Experience, Budget

# Phase 4: SCOPE - Installation timeline
/landscape-scoping-lessons
# Agents: Season Strategist, Logistics, Risk Assessor, Budget
# Recommendation: Hardscape August, planting September (fall window)

# Phase 5: BUILD - Physical installation
[Install edging, irrigation, soil prep, planting]

# Phase 6: VERIFY - Quality check
/field-quality-inspection  # (New PHYSICAL-specific skill)
# Check: Plant health, irrigation coverage, hardscape quality

# Phase 7: SHIP - Complete installation
[Final walkthrough, handoff to client, care instructions]

# Phase 8: ADOPT - Client satisfaction
[Monitor: Are guests taking photos? Is client happy?]

# Phase 9: MEASURE - Long-term success
[Track: Plant survival rate, maintenance hours, guest feedback]
```

## Next Steps: Implementing Dual System

1. **Create type-specific skills** (SOFTWARE vs PHYSICAL)
2. **Create customer-contractor collaboration workflow** (for platform)
3. **Define project type declaration format**
4. **Build skill routing logic** (which skills for which type)
5. **Document workflows for each type**

## Success Criteria

### SOFTWARE Project Success:
- Platform enables clarity (measurable vs email/PDF workflow)
- Contractors save time generating quotes
- Clients understand exactly what they're approving
- Zero "I thought you meant..." conflicts after platform adoption

### PHYSICAL Project Success:
- Designs align with vision (no drift)
- Timelines are realistic (weather buffers included)
- Installations succeed (plants thrive, hardscape quality)
- Clients are delighted (adoption and satisfaction high)

---

**The ultimate goal**: Build a SOFTWARE platform that makes PHYSICAL projects dramatically better through absolute clarity.
