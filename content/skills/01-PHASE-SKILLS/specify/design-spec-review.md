---
name: design-spec-review
title: Adversarial Design Specification Review
description: Multi-perspective critique of landscape design specifications to catch gaps, conflicts, and ambiguities before implementation
category: specify
tags:
  - specification
  - review
  - adversarial
  - quality
  - critical
version: "1.0.0"
priority: 8
status: active
phases:
  - specify
  - scope
---

# Adversarial Design Specification Review

## Purpose

Inspired by FlowStar's Spekster tool, this skill uses an **agent swarm**
to perform adversarial review of landscape design specifications.

**Why adversarial?** Because a spec that survives critique from multiple
expert perspectives is:
- Complete (covers all necessary details)
- Unambiguous (clear to all stakeholders)
- Feasible (can actually be built)
- Valuable (serves the design vision)

## The Review Panel (Agent Swarm)

Five agent personas review the specification from different angles:

### Panel Member 1: The Detail Detective (general-purpose)
**Expertise**: Technical specification completeness
**Focus**: Missing information, ambiguous measurements, undefined terms

**Questions Asked**:
- Are all dimensions specified?
- Are plant quantities listed?
- Is irrigation coverage defined?
- Are material specs complete (size, color, finish)?
- Is installation depth/spacing specified?

### Panel Member 2: The Contractor (Plan)
**Expertise**: Installation reality and buildability
**Focus**: Can this actually be built as specified?

**Questions Asked**:
- Are there physical impossibilities in the spec?
- Are materials available in specified sizes/colors?
- Is the installation sequence logical?
- Are there access constraints?
- Is equipment needed specified?

### Panel Member 3: The Horticulturist (general-purpose)
**Expertise**: Plant health and long-term success
**Focus**: Will these plants thrive in this environment?

**Questions Asked**:
- Are plants appropriate for Texas climate zone?
- Are sun/shade requirements matched to site conditions?
- Are water requirements compatible?
- Are mature sizes considered for spacing?
- Are invasive or problematic species avoided?

### Panel Member 4: The Guest Experience Critic (general-purpose)
**Expertise**: End-user satisfaction and functionality
**Focus**: Will visitors actually enjoy this?

**Questions Asked**:
- Does this create comfortable gathering spaces?
- Are there photo opportunities?
- Is there seasonal interest (not just spring blooms)?
- Are thorny/allergenic plants near walkways?
- Is maintenance visible to guests (unsightly)?

### Panel Member 5: The Budget Guardian (general-purpose)
**Expertise**: Cost realism and value engineering
**Focus**: Does this spec match budget expectations?

**Questions Asked**:
- Are expensive materials justified?
- Are there cost-effective alternatives?
- Is maintenance cost sustainable long-term?
- Are there hidden costs (special equipment, permits)?
- What's the cost per square foot?

## Review Process

```markdown
STEP 1: Specification Intake
- Accept spec in any format (markdown, PDF, sketch, description)
- Extract key elements:
  - Location and dimensions
  - Plant lists with quantities
  - Hardscape materials and specs
  - Irrigation and drainage
  - Budget and timeline

STEP 2: Spawn Review Panel (Parallel Agent Swarm)
- Launch all 5 panel members simultaneously
- Each reviews the same specification
- Each generates critique from their perspective

STEP 3: Collect Findings
- Detail Detective: completeness issues
- Contractor: buildability concerns
- Horticulturist: plant viability warnings
- Guest Experience Critic: satisfaction risks
- Budget Guardian: cost concerns

STEP 4: Synthesize Report
- Critical issues (must fix before proceeding)
- Important improvements (should address)
- Suggestions (nice to have)
- Conflicts between panel members (design tradeoffs)

STEP 5: Generate Improved Spec
- Address critical issues
- Incorporate important improvements
- Document tradeoff decisions
- Output revised specification
```

## Output Format

```markdown
DESIGN SPECIFICATION REVIEW REPORT
Project: {name}
Specification Version: {version}
Review Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PANEL FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 DETAIL DETECTIVE (Completeness)
Status: ✅ PASS | ⚠️ NEEDS WORK | 🛑 INCOMPLETE

Critical Issues:
- {list of missing/ambiguous specifications}

Improvements Needed:
- {list of details that should be added}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔨 CONTRACTOR (Buildability)
Status: ✅ PASS | ⚠️ NEEDS WORK | 🛑 UNBUILDABLE

Critical Issues:
- {physical impossibilities, material availability issues}

Improvements Needed:
- {installation sequence suggestions, access concerns}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌱 HORTICULTURIST (Plant Success)
Status: ✅ PASS | ⚠️ NEEDS WORK | 🛑 PLANT FAILURE LIKELY

Critical Issues:
- {wrong climate zone, incompatible water needs}

Improvements Needed:
- {spacing adjustments, better plant selections}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 GUEST EXPERIENCE CRITIC (Satisfaction)
Status: ✅ PASS | ⚠️ NEEDS WORK | 🛑 POOR EXPERIENCE

Critical Issues:
- {safety hazards, unusable spaces}

Improvements Needed:
- {comfort enhancements, aesthetic suggestions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 BUDGET GUARDIAN (Cost Realism)
Status: ✅ PASS | ⚠️ OVER BUDGET | 🛑 NEEDS VALUE ENGINEERING

Estimated Cost: ${amount}
Budget Target: ${amount}
Delta: ${amount} ({percentage}%)

Cost Concerns:
- {expensive materials, hidden costs}

Value Engineering Suggestions:
- {cost-effective alternatives}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ✅ APPROVED | ⚠️ REVISE & RESUBMIT | 🛑 MAJOR REVISION NEEDED

Critical Issues Found: {count}
Must be addressed before proceeding.

Conflicts Between Panel Members:
{Description of design tradeoffs where panel members disagree}

Recommended Actions:
1. {prioritized list of revisions}
2. {second priority}
3. {third priority}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVISED SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Improved specification incorporating panel feedback}
```

## Example: Entrance Garden Specification Review

**Original Spec**:
```markdown
Entrance Garden Bed
- Size: 12' x 8'
- Plants: Roses, lantana, groundcover
- Edging: Limestone
- Mulch: Hardwood
```

**Panel Findings**:

🔍 **Detail Detective**: 🛑 INCOMPLETE
- No rose variety specified (how many? which color? which type?)
- No lantana quantity (how many plants?)
- "Groundcover" is too vague (which species? how much coverage?)
- Limestone edging height not specified
- Mulch depth not specified
- No irrigation mentioned

🔨 **Contractor**: ⚠️ NEEDS WORK
- 12' x 8' bed needs 96 sq ft of coverage
- "Groundcover" quantity depends on species (6" spacing vs 12" spacing = huge difference)
- Limestone edging install requires soil grade specification
- Need to know if irrigation exists or must be installed

🌱 **Horticulturist**: 🛑 PLANT FAILURE LIKELY
- "Roses" is too vague - tea roses will struggle in Texas heat, Knockouts will thrive
- Lantana is excellent choice for Texas BUT needs full sun confirmation
- "Groundcover" could be anything - need sun/shade matched species
- No mature size consideration - roses + lantana could overgrow 8' width in 2 years

👥 **Guest Experience Critic**: ⚠️ NEEDS WORK
- Roses with thorns near entrance = guest hazard
- No seasonal color plan (what happens in winter?)
- 12' x 8' feels small for "entrance garden" of a brewery
- Missing seating or gathering space

💰 **Budget Guardian**: ⚠️ OVER BUDGET (if interpreted expensively)
- "Roses" could be $15 tea roses or $30 specimens = $45 to $90 just for roses
- "Limestone" could be $8/linear foot basic or $25/linear foot premium
- Spec is too vague to estimate accurately
- Could range from $800 to $2,500 depending on interpretation

**Revised Spec** (post-review):
```markdown
Entrance Garden Bed - Spoetzl Brewery
Location: Main entrance, south-facing, full sun 8+ hours
Dimensions: 12' x 8' (96 sq ft)

PLANTS (all Texas heat-tolerant, Zone 8b):
- 3x Knockout Roses (Red Double) - 3 gallon - focal points, 4' spacing
  (thornless variety for guest safety)
- 8x Lantana (Dallas Red) - 1 gallon - seasonal color, 18" spacing
  (drought-tolerant once established)
- 12x Liriope (Big Blue) - 1 gallon - evergreen border, 12" spacing
  (provides winter interest)

HARDSCAPE:
- Edging: Limestone blocks, 4" height, 6" width, natural finish
  (20 linear feet required)
- Soil: Amended with 2 cubic yards compost, well-draining
- Mulch: Hardwood mulch, 3" depth (8 cubic feet)

IRRIGATION:
- Drip system, Zone A, 2 GPH emitters
- 1 emitter per plant
- Connected to existing irrigation controller (Zone 3)
- Inline filter required

INSTALLATION NOTES:
- Install edging first, grade soil 1" below edging top
- Install irrigation and test before planting
- Plant in early fall (Sept-Oct) for best establishment
- Mulch after planting, keep 2" away from plant stems

MAINTENANCE:
- Water daily for 2 weeks, then taper
- Trim lantana in late winter before spring growth
- Replace mulch annually

BUDGET:
- Plants: $180
- Hardscape: $240
- Irrigation: $120
- Soil/Mulch: $80
- Labor: $450
- TOTAL: $1,070 (installed)
```

## Usage

```bash
# User provides design spec in any format
/design-spec-review

# Claude Code will:
# 1. Spawn all 5 panel members in parallel (agent swarm)
# 2. Each reviews the specification from their expertise
# 3. Collect findings from all agents
# 4. Synthesize into comprehensive review report
# 5. Generate improved specification addressing issues
# 6. Save both report and revised spec to project directory
```

## Success Criteria

- Specifications are complete and unambiguous
- Contractors can bid accurately from spec
- Plants are appropriate for climate and site
- Guest experience is considered upfront
- Budget surprises are eliminated
- No more "I thought you meant..." conflicts during installation

## Integration with Other Skills

- Run after initial design concept (/sense, /validate)
- Run before scoping (/landscape-scoping-lessons)
- Feed into clarity engine (/clarity-engine) for visualization
- Check alignment with vision (/north-star-check)
