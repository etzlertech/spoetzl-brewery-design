---
name: project-type-declaration
title: Project Type Declaration & Configuration
description: Declare project type (SOFTWARE/PHYSICAL) to route skills and workflows appropriately
category: core
tags:
  - project-type
  - configuration
  - workflow
  - critical
version: "1.0.0"
priority: 0
status: active
phases:
  - all
---

# Project Type Declaration & Configuration

## Purpose

**Before using any other skills**, declare your project type. This routes you to
the appropriate workflows, agent personas, and success criteria.

## The Three Project Types

### 🖥️ Type: SOFTWARE
**Building software/platforms/applications**

Examples:
- Evergold Design Management Platform
- Quote generator feature
- CAD integration module
- Customer portal
- Mobile app

Characteristics:
- Deliverable is code/application
- Build = writing software
- Verification = testing
- Maintenance = bug fixes, updates

---

### 🌱 Type: PHYSICAL_INSTALLATION
**Installing physical landscape elements**

Examples:
- Spoetzl Entrance Garden
- Patio and seating area
- Water feature installation
- Full property transformation
- Irrigation system installation

Characteristics:
- Deliverable is installed landscape
- Build = physical construction/planting
- Verification = quality inspection, plant health
- Maintenance = watering, pruning, seasonal care

---

### 🔧 Type: PHYSICAL_MAINTENANCE
**Ongoing care and upkeep of installed landscapes**

Examples:
- Monthly maintenance contract
- Seasonal color rotation
- Irrigation repair and adjustment
- Tree and shrub pruning program
- Turf care and fertilization

Characteristics:
- Deliverable is ongoing service
- Build = executing maintenance tasks
- Verification = property condition standards
- Maintenance = continuous (the work itself)

## Declaration Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT TYPE DECLARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE: [SOFTWARE | PHYSICAL_INSTALLATION | PHYSICAL_MAINTENANCE]

PROJECT NAME: {Short descriptive name}

NORTH STAR:
  Outcome: {What changes in the world when we succeed?}
  Beneficiary: {Who benefits and how?}
  Done Looks Like: {Observable, measurable criteria}

STAKEHOLDERS:
  Customer: {Who is paying/requesting}
  Provider: {Who is building/installing/maintaining}
  [Other]: {Any other key stakeholders}

CONSTRAINTS:
  Budget: ${amount} or {range}
  Timeline: {Deadline or window}
  [Type-specific constraints]

CONTEXT:
  {Brief background - why this project, why now}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Type-Specific Constraints

### SOFTWARE Projects:

```markdown
CONSTRAINTS:
  Budget: ${amount} development cost
  Timeline: {Sprint schedule or deadline}
  Tech Stack: {Frameworks, languages, platforms}
  Integration: {What systems must connect}
  Performance: {Speed, scale, reliability requirements}
  Security: {Data protection, auth requirements}
  Accessibility: {WCAG standards, mobile support}
```

### PHYSICAL_INSTALLATION Projects:

```markdown
CONSTRAINTS:
  Budget: ${amount} installed
  Timeline: {Completion deadline}
  Season: {Current season and ideal install window}
  Climate: {Zone, temperature ranges, rainfall}
  Site Conditions: {Sun/shade, soil, drainage, access}
  Maintenance Capacity: {Client's ability to care for plants}
  Aesthetic: {Style requirements, theming}
```

### PHYSICAL_MAINTENANCE Projects:

```markdown
CONSTRAINTS:
  Budget: ${amount}/month or ${amount}/year
  Timeline: {Contract duration}
  Frequency: {Weekly, bi-weekly, monthly visits}
  Scope: {What's included/excluded}
  Standards: {Property condition expectations}
  Season: {Year-round or seasonal}
  Equipment: {Who provides mowers, tools, etc}
```

## Complete Examples

### Example 1: SOFTWARE Project

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT TYPE DECLARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE: SOFTWARE

PROJECT NAME: Evergold Design Management Platform (MVP)

NORTH STAR:
  Outcome: Landscape contractors and property managers achieve absolute
           clarity on design intent, costs, and timelines without
           traditional PDF/email workflows
  Beneficiary: Landscape professionals (Evergold team) and property
               managers (like Spoetzl)
  Done Looks Like:
    - Design iterations happen in minutes (not days of email)
    - Cost changes are visible immediately as specs change
    - Both parties can see exactly what's included/excluded
    - Zero "I thought you meant..." surprises
    - Every decision has visual confirmation

STAKEHOLDERS:
  Customer: Future landscape clients (Spoetzl is pilot customer)
  Provider: Evergold Landscaping (platform builder)
  End Users: Evergold project managers, Client property managers
  Technical: Development team (internal or contracted)

CONSTRAINTS:
  Budget: $50,000 MVP development
  Timeline: Beta launch in 12 weeks (Sept 30)
  Tech Stack: Web-based (React/Next.js), mobile-responsive
  Integration:
    - Photo/video upload and gallery
    - CAD file import/export
    - Quote generation with line items
    - Interactive commenting on designs
    - Email notifications (but not for primary workflow)
  Performance: Fast load times, works on slow connections
  Security: Role-based access (contractor vs client views)
  Accessibility: WCAG 2.1 AA, mobile-first design

CONTEXT:
  Evergold currently uses email and PDF proposals, leading to:
  - Ambiguity about what client approved
  - Slow iteration cycles (days per revision)
  - Misaligned expectations on scope and cost
  - Client surprises during installation

  Spoetzl Brewery project highlighted these pain points.
  Platform will pilot with Spoetzl, then expand to other clients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: PHYSICAL_INSTALLATION Project

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT TYPE DECLARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE: PHYSICAL_INSTALLATION

PROJECT NAME: Spoetzl Brewery Entrance Garden Enhancement

NORTH STAR:
  Outcome: Create welcoming German beer garden entrance that honors
           brewing heritage and creates photo opportunities for visitors
  Beneficiary: Brewery visitors (thousands monthly), brewery staff,
               local community
  Done Looks Like:
    - Cohesive German/European village theming at entrance
    - Seasonal interest (color) across all four seasons
    - Clear "entrance moment" with photo opportunity
    - Professional installation quality (no dead plants)
    - Sustainable within brewery's maintenance capacity

STAKEHOLDERS:
  Customer: Spoetzl Brewery Manager (John Smith)
  Provider: Evergold Landscaping (Sarah Johnson, PM)
  End Users: Brewery visitors, brewery maintenance staff
  Approvers: Brewery ownership (via manager)

CONSTRAINTS:
  Budget: $15,000 installed (firm cap)
  Timeline: Complete before Oktoberfest (September 15)
  Season: Currently July - summer heat, ideal window is fall
  Climate: Zone 8b, Texas heat, 100°+ summer temps
  Site Conditions:
    - South-facing, full sun 8+ hours
    - Clay soil, moderate drainage
    - Existing irrigation (needs extension)
    - High visibility, heavy foot traffic
  Maintenance Capacity: Brewery staff, limited horticultural knowledge
  Aesthetic: German heritage, European village, beer garden feel

CONTEXT:
  Spoetzl Brewery entrance currently has:
  - Bare mulch beds, no plants
  - Limestone edging in poor condition
  - No focal point or "entrance moment"
  - Visitors walk past without photo opportunity

  Brewery wants to create destination appeal, honor German heritage,
  and improve curb appeal for Instagram/social sharing.

  This is Phase 1 of multi-year property transformation.
  Success here leads to additional phases (patio, water feature, etc).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 3: PHYSICAL_MAINTENANCE Project

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT TYPE DECLARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE: PHYSICAL_MAINTENANCE

PROJECT NAME: Spoetzl Brewery Grounds Maintenance Contract

NORTH STAR:
  Outcome: Maintain brewery grounds at professional destination standards
           year-round without surprise costs or property deterioration
  Beneficiary: Brewery visitors (consistent quality experience),
               brewery management (predictable costs)
  Done Looks Like:
    - Beds are weed-free, mulch is fresh
    - Plants are healthy, appropriately pruned
    - Irrigation operates correctly, no dry spots
    - Seasonal color rotations happen on schedule
    - Property always "camera-ready" for visitors

STAKEHOLDERS:
  Customer: Spoetzl Brewery Manager
  Provider: Evergold Landscaping (maintenance crew)
  End Users: Brewery visitors experiencing the grounds

CONSTRAINTS:
  Budget: $2,000/month ($24,000/year)
  Timeline: 12-month contract (renewable annually)
  Frequency: Weekly visits (Mondays, 8am-12pm)
  Scope Included:
    - Mowing, edging, blowing (all turf areas)
    - Weeding and mulch replenishment (all beds)
    - Pruning and deadheading (all plants)
    - Irrigation monitoring and minor repairs
    - Seasonal color rotation (spring and fall)
    - Fertilization (quarterly)
  Scope Excluded:
    - Major irrigation repairs (billed separately)
    - Tree work requiring climbers/bucket truck
    - Pest/disease treatment (billed separately)
    - Snow/ice removal
  Standards: "Camera-ready at all times" - destination quality
  Season: Year-round service (Texas climate)
  Equipment: Evergold provides all equipment and materials

CONTEXT:
  After completing entrance garden installation (Phase 1),
  brewery needs ongoing professional maintenance to protect investment.

  Brewery previously used "guy with a truck" service:
  - Inconsistent quality
  - Missed visits
  - No horticultural knowledge
  - Plants deteriorated

  This contract ensures professional standards match installation quality.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Skill Routing by Type

Once type is declared, skills route appropriately:

### Skills for ALL Types:
- `/north-star-check` (adapts agent personas to project type)
- `/clarity-engine` (generates appropriate output formats)
- `/project-type-declaration` (this skill)

### Skills for SOFTWARE:
- `/tech-stack-selection`
- `/user-story-mapping`
- `/ui-mockup-review`
- `/code-quality-check`
- `/deployment-readiness`
- `/feature-scope-estimate`

### Skills for PHYSICAL_INSTALLATION:
- `/site-assessment`
- `/inspiration-gatherer`
- `/design-spec-review`
- `/landscape-scoping-lessons`
- `/plant-selection`
- `/installation-sequencing`
- `/field-quality-inspection`

### Skills for PHYSICAL_MAINTENANCE:
- `/maintenance-scope-definition`
- `/service-level-standards`
- `/seasonal-task-planning`
- `/field-quality-inspection`
- `/client-expectation-alignment`

## Usage

```bash
# At the start of ANY project:
/project-type-declaration

# Claude Code will:
# 1. Prompt you to choose: SOFTWARE | PHYSICAL_INSTALLATION | PHYSICAL_MAINTENANCE
# 2. Guide you through filling out the declaration template
# 3. Save the declaration to project root (PROJECT.md)
# 4. Configure skill routing for this project type
# 5. Set appropriate agent personas for north-star-check
# 6. Recommend next steps based on type
```

## After Declaration

The declaration file becomes the **single source of truth** for:
- What we're building/installing/maintaining
- Why it matters (north star)
- Who's involved (stakeholders)
- What's realistic (constraints)
- How we measure success (done looks like)

**All subsequent skills reference this declaration.**

Example:
```bash
# After declaring SOFTWARE project:
/north-star-check
# → Spawns: UX Designer, Technical Architect, Business Analyst

# After declaring PHYSICAL_INSTALLATION project:
/north-star-check
# → Spawns: Heritage Keeper, Guest Experience, Practical Implementer
```

## Success Criteria

- Every project has a clear type declaration
- Stakeholders understand north star and constraints
- Skills route to appropriate workflows
- Agent personas match project context
- No confusion about "what kind of project is this?"

---

**Start every project with**: `/project-type-declaration`
