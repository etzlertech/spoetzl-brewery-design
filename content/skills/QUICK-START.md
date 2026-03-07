---
title: "Quick Start Guide"
description: "Fast reference for common workflows using the skills system"
category: "getting-started"
priority: 3
---

# Quick Start Guide - Spoetzl Landscape Skills

Fast reference for common workflows using the skills system.

## Installation

The skills are already in the `SKILLS/` directory. Claude Code automatically recognizes markdown files with frontmatter as skills.

## Basic Commands

```bash
# Check alignment with project vision
/north-star-check

# Gather design inspiration
/inspiration-gatherer

# Review design specifications
/design-spec-review

# Get realistic project timeline
/landscape-scoping-lessons

# Generate multi-fidelity visuals
/clarity-engine

# Learn about agent orchestration
/agent-swarm-orchestrator
```

## Common Workflows

### 🌱 New Design Element Workflow

**Scenario**: Client wants to add a new landscape feature

```bash
# Step 1: Research inspiration
/inspiration-gatherer
# → Agent swarm researches historical, modern, climate, materials

# Step 2: Check vision alignment
/north-star-check
# → Agents verify: Heritage, Guest Experience, Feasibility

# Step 3: Create specification
[Draft initial spec based on inspiration]

# Step 4: Review specification
/design-spec-review
# → 5-agent panel reviews: Detail, Build, Plants, Experience, Cost

# Step 5: Scope the project
/landscape-scoping-lessons
# → Agents assess: Season, Logistics, Risk, Budget

# Step 6: Generate visuals
/clarity-engine
# → Agents create: Source docs, Diagrams, Interactive HTML, Presentation

# Ready for stakeholder approval!
```

---

### 🏗️ Evaluating Existing Proposal Workflow

**Scenario**: Contractor sent you a proposal to evaluate

```bash
# Step 1: Check alignment
/north-star-check
# → Does this serve the brewery vision?

# Step 2: Review specification quality
/design-spec-review
# → Is the spec complete? Buildable? Cost-realistic?

# Step 3: Validate timeline
/landscape-scoping-lessons
# → Is the timeline honest? Seasonal risks?

# Decision: Approve, Negotiate, or Reject
```

---

### 📊 Client Presentation Workflow

**Scenario**: Need to present design concept to stakeholders

```bash
# Step 1: Verify alignment
/north-star-check
# → Confirm design serves vision (show your work)

# Step 2: Generate multi-fidelity outputs
/clarity-engine
# → Create presentation deck, diagrams, interactive visuals

# Step 3: Prepare scope justification
/landscape-scoping-lessons
# → Explain timeline and phasing rationale

# Present with confidence - all perspectives considered!
```

---

### 🔍 Mid-Project Check-In Workflow

**Scenario**: Project is underway, stakeholder suggests changes

```bash
# Step 1: Check scope impact
/landscape-scoping-lessons
# → How does this change affect timeline/budget?

# Step 2: Check alignment
/north-star-check
# → Does this change serve the vision or create drift?

# Step 3: Update specification
[Revise spec to incorporate change]
/design-spec-review
# → Verify updated spec is still solid

# Step 4: Update visuals
/clarity-engine
# → Regenerate presentation materials

# Decision: Accept change or push back
```

---

## Understanding Agent Swarms

Each skill uses **specialized agent personas** working together:

### Example: `/north-star-check`

```
User runs: /north-star-check

Claude Code spawns 3 agents in parallel:
┌─────────────────────────────────────┐
│ Agent 1: Heritage Keeper            │
│ Persona: German tradition expert    │
│ Task: Check cultural authenticity   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Agent 2: Guest Experience Analyst   │
│ Persona: Theme park designer        │
│ Task: Evaluate visitor satisfaction │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Agent 3: Practical Implementer      │
│ Persona: Professional landscaper    │
│ Task: Assess feasibility/maintenance│
└─────────────────────────────────────┘

All agents complete, Claude Code synthesizes:
→ ALIGNED / DRIFTING / MISALIGNED
→ Evidence from each perspective
→ Recommendations
```

**Why this works:**
- Multiple perspectives catch issues single-person review misses
- Agent personas have specialized expertise
- No external API costs (uses Claude Code's Task tool)
- All synthesis happens in your session

---

## Skill Reference Card

| Skill | Phase | Agent Count | Use When |
|-------|-------|-------------|----------|
| `/north-star-check` | All | 3 | Before any major decision |
| `/inspiration-gatherer` | Sense | 4→1 | Starting new design element |
| `/design-spec-review` | Specify | 5 | Reviewing design specifications |
| `/landscape-scoping-lessons` | Scope | 4 | Estimating project timeline |
| `/clarity-engine` | Multiple | 4 | Generating visuals for stakeholders |
| `/agent-swarm-orchestrator` | Meta | 0 | Learning orchestration patterns |

**Agent Count**: Number of agents spawned (→ means sequential)

---

## Seasonal Timing Quick Reference

From `/landscape-scoping-lessons`:

| Season | Best For | Avoid | Why |
|--------|----------|-------|-----|
| **Spring** (Mar-May) | Perennials, annuals, warm-season grass | Major hardscape | Rain delays concrete |
| **Summer** (Jun-Aug) | Hardscape, irrigation | Planting (unless intensive watering) | 100°+ temps |
| **Fall** (Sep-Nov) | Trees, shrubs, perennials | Water features with pumps | BEST planting season |
| **Winter** (Dec-Feb) | Hardscape, planning | Tropical plants, irrigation testing | Freeze risk |

**Current date**: Check before scoping!

---

## Red Flags Checklist

Run `/landscape-scoping-lessons` if you see ANY of these:

- ❌ "Before summer" when it's already April
- ❌ "For the event in 6 weeks"
- ❌ Client adding "just one more thing"
- ❌ No irrigation in place
- ❌ "We'll figure out plants later"
- ❌ Summer planting without irrigation commitment
- ❌ Concrete work during spring
- ❌ Special order materials
- ❌ "I want to see plants before you install"

These ALWAYS mean timeline is too aggressive.

---

## Output Locations

Skills save outputs to:

```
project-plans/{project-name}/
├── source.md                    # Structured specifications
├── diagrams/                    # Mermaid + SVG layouts
├── visual/                      # Interactive HTML
├── presentation/                # Stakeholder decks
└── README.md                    # Navigation guide
```

---

## Tips for Success

### ✅ DO:

1. **Run `/north-star-check` early and often**
   - Before major decisions
   - When stakeholders suggest changes
   - At every phase gate

2. **Use agent swarms for complex decisions**
   - Multiple perspectives = better outcomes
   - Catches conflicts early

3. **Trust the seasonal timing guidance**
   - Texas heat kills summer plantings
   - Fall is BEST for plant success

4. **Generate clarity for stakeholders**
   - Multi-fidelity outputs = better communication
   - Diagrams + visuals + presentations

5. **Propose "Bed 1 First" phasing**
   - Highest-impact, lowest-risk first
   - Prove value before expanding

### ❌ DON'T:

1. **Don't skip alignment checks**
   - "Wouldn't it be cool if..." is how drift starts

2. **Don't ignore agent warnings**
   - If Practical Implementer says "unbuildable", believe it

3. **Don't commit to aggressive timelines**
   - Weather delays are REAL
   - Client satisfaction > speed

4. **Don't plant in summer**
   - Unless committed to intensive watering
   - Fall plantings succeed, summer plantings struggle

5. **Don't skip specification review**
   - Ambiguous specs = budget surprises

---

## Getting Help

- **System overview**: Read `SKILLS/README.md`
- **Agent patterns**: Read `02-META-SKILLS/agent-swarm-orchestrator.md`
- **Specific skill**: Read individual skill markdown files

---

## Example Session

```bash
$ claude

# User: "I need to design the entrance garden for Spoetzl Brewery"

> Let me help you design that. First, let's gather inspiration.
> /inspiration-gatherer

[Agents research German traditions, modern examples, Texas plants, materials]

> I've researched German beer garden traditions and Texas-appropriate
> plants. Here's what I found...
>
> Key design principles:
> - Traditional elements: limestone edging, gravel paths, communal seating
> - Texas adaptations: Drought-tolerant perennials, drip irrigation
> - Guest experience: Seating near entrance, photo opportunity
>
> Ready to draft a specification?

# User: "Yes, let's spec out a 12x8 garden bed"

> I'll create an initial spec and then review it.
>
> [Creates draft specification]
>
> Now let me run it through adversarial review.
> /design-spec-review

[5 agents review: Detail, Contractor, Horticulturist, Experience, Budget]

> The review panel found some issues:
> - Missing: specific rose variety, irrigation specs
> - Risk: Summer planting timeline
> - Suggestion: Add seating nearby
>
> Here's the improved specification...
>
> Now let's scope the timeline realistically.
> /landscape-scoping-lessons

[4 agents assess: Season, Logistics, Risk, Budget]

> Timeline assessment:
> - Current date: July 15
> - Client wants: "Before Oktoberfest" (8 weeks)
> - Recommendation: Hardscape before Oktoberfest, planting in Fall
>
> This phasing prevents summer plant stress and ensures success.
>
> Ready to generate visuals for stakeholder presentation?

# User: "Yes, create the presentation materials"

> /clarity-engine

[4 agents generate: Source, Diagrams, Visual, Presentation]

> Created multi-fidelity outputs:
> - Source: Detailed specifications (Markdown)
> - Diagrams: Site layout (Mermaid → SVG)
> - Visual: Interactive HTML site plan
> - Presentation: Stakeholder deck (HTML → PDF)
>
> All saved to: project-plans/entrance-garden/
>
> You're ready to present!
```

---

**Start here**: Run `/north-star-check` on your next design decision.

**Questions?**: Read `SKILLS/README.md` for the full system overview.
