---
title: "FlowStar Skills System Documentation"
description: "FlowStar-inspired workflow for landscape design, powered by Claude Code agent swarms"
category: "getting-started"
priority: 2
---

# Spoetzl Brewery Landscape Design Skills

**FlowStar-Inspired Workflow, Powered by Claude Code Agent Swarms**

## Overview

This skills system brings FlowStar's project management philosophy to landscape design, but **without requiring external LLM APIs**. Instead, it leverages Claude Code's built-in **agent orchestration** features to create specialized agent swarms that work together.

### What is FlowStar?

FlowStar is a project management framework that guides work through 9 phases across 5 arcs (Discover, Define, Deliver, Land, Learn). It emphasizes:
- **North Star Alignment**: Every decision held up to project vision
- **Crystal Clarity**: Dissolve ambiguity with multi-fidelity visuals
- **Adversarial Review**: Multiple perspectives catch gaps and conflicts
- **Honest Scoping**: Realistic timelines based on lessons learned

### Our Adaptation

We've adapted FlowStar's principles specifically for **landscape design** at Spoetzl Brewery:
- ✅ **Agent swarms** instead of external LLM API calls
- ✅ **Landscape-specific** phases and considerations
- ✅ **Texas climate** realities and seasonal timing
- ✅ **Guest experience** focus for brewery destination
- ✅ **German heritage** authenticity checks

## Architecture

```
SKILLS/
├── 00-CORE/                      # Foundational skills used across all phases
│   ├── north-star-check.md       # Vision alignment with agent personas
│   └── clarity-engine.md         # Multi-fidelity visualization system
│
├── 01-PHASE-SKILLS/              # Phase-specific workflow skills
│   ├── sense/
│   │   └── inspiration-gatherer.md    # Multi-domain research swarm
│   ├── validate/                      # (To be created)
│   ├── specify/
│   │   └── design-spec-review.md      # Adversarial spec critique
│   ├── scope/
│   │   └── landscape-scoping-lessons.md  # Honest timeline estimation
│   ├── build/                         # (To be created)
│   ├── verify/                        # (To be created)
│   ├── ship/                          # (To be created)
│   ├── adopt/                         # (To be created)
│   └── measure/                       # (To be created)
│
└── 02-META-SKILLS/               # System-level orchestration skills
    └── agent-swarm-orchestrator.md   # How to coordinate multiple agents
```

## The 9 Phases Applied to Landscape Design

| Arc | Phase | Question | Skill |
|-----|-------|----------|-------|
| **Discover** | 1. Sense | Does this inspiration align with German brewery heritage? | `/inspiration-gatherer` |
| | 2. Validate | Is this design element worth implementing? | (TBD) |
| **Define** | 3. Specify | Do these specs honor the vision while being practical? | `/design-spec-review` |
| | 4. Scope | Is this timeline honest about seasonal constraints? | `/landscape-scoping-lessons` |
| **Deliver** | 5. Build | Are we installing toward the vision? | (TBD) |
| | 6. Verify | Does the installation fulfill quality standards? | (TBD) |
| **Land** | 7. Ship | Are we completing so guests can enjoy it? | (TBD) |
| | 8. Adopt | Are visitors appreciating this enhancement? | (TBD) |
| **Learn** | 9. Measure | Did we achieve the intended impact? | (TBD) |

**At every phase**: `/north-star-check` ensures alignment with vision

## Core Philosophy: Agent Swarms Over External APIs

### FlowStar's Approach (External LLMs)

FlowStar uses multiple external LLM APIs for adversarial review:

```typescript
// Calls external services (OpenAI, Anthropic, Google)
const reviews = await Promise.all([
  anthropic.claude('Review this spec'),
  openai.gpt4('Review this spec'),
  google.gemini('Review this spec')
]);
```

### Our Approach (Claude Code Agent Swarms)

We achieve the same **multi-perspective analysis** using Claude Code's Task tool with specialized personas:

```typescript
// Uses built-in agent orchestration
const reviews = await Promise.all([
  Task('general-purpose', {
    persona: 'Heritage Keeper',
    task: 'Review for cultural authenticity'
  }),
  Task('general-purpose', {
    persona: 'Guest Experience Designer',
    task: 'Review for visitor satisfaction'
  }),
  Task('Plan', {
    persona: 'Practical Landscaper',
    task: 'Review for installation feasibility'
  })
]);
```

**Benefits**:
- ✅ No external API costs
- ✅ No network dependencies
- ✅ Works entirely within Claude Code CLI
- ✅ Same multi-perspective benefits
- ✅ Agent personas customized for landscape design

## Available Skills

### 00-CORE: Foundational Skills

#### `/north-star-check`
**Purpose**: Ensure design decisions align with Spoetzl Brewery vision

**Agent Swarm**:
- Heritage Keeper: Checks German cultural authenticity
- Guest Experience Analyst: Evaluates visitor satisfaction
- Practical Implementer: Assesses feasibility and maintenance

**When to use**: Before any major decision, at every phase gate

**Example**:
```bash
# Evaluating a water fountain proposal
/north-star-check

# Claude Code spawns 3 agents in parallel:
# 1. Heritage Keeper checks cultural authenticity
# 2. Guest Experience checks visitor impact
# 3. Practical Implementer checks feasibility
# Synthesizes into ALIGNED/DRIFTING/MISALIGNED assessment
```

---

#### `/clarity-engine`
**Purpose**: Transform complex concepts into crystal-clear multi-fidelity outputs

**Agent Swarm**:
- Data Structurer: Organizes specs into structured format
- Diagram Generator: Creates Mermaid spatial layouts
- Visual Designer: Builds interactive HTML visualizations
- Presentation Builder: Generates stakeholder-ready materials

**Output Tiers**:
1. Source (Markdown/JSON) - Raw truth
2. Diagrams (Mermaid/SVG) - Spatial relationships
3. Visual (HTML/CSS/SVG) - Interactive site plans
4. Presentation (HTML/PDF) - Executive materials

**When to use**: After specifications are complete, before stakeholder presentations

---

### 01-PHASE-SKILLS: Workflow Stages

#### `/inspiration-gatherer` (Sense Phase)
**Purpose**: Multi-domain research filtered through project vision

**Research Swarm**:
- Historical Design Researcher: Traditional German patterns
- Modern Examples Researcher: Contemporary success stories
- Climate Adaptation Specialist: Texas-appropriate selections
- Materials & Techniques Scout: Local sourcing options

**Output**: Comprehensive inspiration report with actionable design principles

**When to use**: Start of any new design element

---

#### `/design-spec-review` (Specify Phase)
**Purpose**: Adversarial critique to catch specification gaps and conflicts

**Review Panel**:
- Detail Detective: Completeness and precision
- Contractor: Buildability and installation reality
- Horticulturist: Plant success and long-term health
- Guest Experience Critic: Visitor satisfaction
- Budget Guardian: Cost realism and value

**Output**: Comprehensive review report + improved specification

**When to use**: After initial design concept, before scoping and pricing

---

#### `/landscape-scoping-lessons` (Scope Phase)
**Purpose**: Honest timeline estimation with seasonal and weather considerations

**Scoping Swarm**:
- Season Strategist: Planting windows and stress risks
- Logistics Coordinator: Installation sequencing
- Risk Assessor: Timeline killers and red flags
- Budget Reality Checker: Cost surprises and contingencies

**Output**: Realistic project timeline with phased "Bed 1 First" approach

**When to use**: Before committing to client timelines, when scoping projects

---

### 02-META-SKILLS: System Orchestration

#### `/agent-swarm-orchestrator`
**Purpose**: Master guide for coordinating multiple agents

**Swarm Patterns**:
1. **Parallel Expert Review**: Multiple perspectives on same input
2. **Sequential Pipeline**: Each agent feeds the next
3. **Specialized Research**: Gather info from multiple domains
4. **Adversarial Review**: Critical multi-perspective evaluation

**When to use**: When building new skills or complex workflows

---

## How to Use These Skills

### Quick Start

1. **Check Alignment First**
   ```bash
   /north-star-check
   ```
   Use before any major design decision

2. **Gather Inspiration**
   ```bash
   /inspiration-gatherer
   ```
   Research German beer garden design elements

3. **Review Specifications**
   ```bash
   /design-spec-review
   ```
   Get adversarial critique on design specs

4. **Scope Realistically**
   ```bash
   /landscape-scoping-lessons
   ```
   Get honest timeline with seasonal considerations

5. **Generate Clarity**
   ```bash
   /clarity-engine
   ```
   Create multi-fidelity visuals for stakeholders

### Example Workflow: Entrance Garden Enhancement

```bash
# Phase 1: SENSE - Gather inspiration
/inspiration-gatherer
# Agents research German garden traditions, modern examples, Texas plants

# Phase 2: VALIDATE - Check alignment
/north-star-check
# Agents confirm entrance garden aligns with brewery vision

# Phase 3: SPECIFY - Create detailed spec
[Work with team to draft initial specification]
/design-spec-review
# 5 agent panel reviews spec, identifies gaps and conflicts
# Revised spec generated

# Phase 4: SCOPE - Get realistic timeline
/landscape-scoping-lessons
# Agents assess seasonal timing (currently July)
# Recommendation: Hardscape before Oktoberfest, planting in fall
# Phased approach prevents summer plant stress

# Phase 5: CLARIFY - Generate visuals
/clarity-engine
# Agents generate:
# - Markdown source specs
# - Mermaid site plan diagrams
# - Interactive HTML visualization
# - Stakeholder presentation deck

# Phase 6: BUILD - Installation (with guidance TBD)

# Phase 7: VERIFY - Quality check (skill TBD)

# Phase 8: SHIP - Final completion (skill TBD)

# Phase 9: MEASURE - Assess impact (skill TBD)
```

## Key Advantages

### Versus Manual Design Process

❌ **Traditional**: Designer makes decisions alone, stakeholders surprised later
✅ **With Skills**: Multi-perspective review catches issues early

❌ **Traditional**: "This will take 3 weeks" (with no seasonal consideration)
✅ **With Skills**: Honest scoping with weather buffers and phasing

❌ **Traditional**: Specs are ambiguous, contractors interpret differently
✅ **With Skills**: Adversarial review eliminates ambiguity

### Versus External Multi-LLM Systems

❌ **External LLMs**: API costs, network dependencies, complex setup
✅ **Agent Swarms**: Built into Claude Code, no external services

❌ **External LLMs**: Generic reviews without domain expertise
✅ **Agent Swarms**: Personas tailored for landscape design in Texas

❌ **External LLMs**: Disconnected from project files and context
✅ **Agent Swarms**: Direct access to project specs, photos, documents

## Extending the System

### Creating New Skills

Follow this pattern:

1. **Define the phase or need**
   - Which FlowStar phase does this serve?
   - What decisions does it help make?

2. **Design the agent swarm**
   - What perspectives are needed?
   - What does each agent persona specialize in?
   - Do agents work in parallel or sequence?

3. **Structure the output**
   - What format serves stakeholders best?
   - Does this feed into other skills?

4. **Document clearly**
   - When to use this skill
   - What agents are spawned
   - Example usage and output

See `/agent-swarm-orchestrator` for detailed patterns.

### Skills Roadmap (To Be Created)

**Validate Phase**:
- `/feasibility-check` - Is this design worth pursuing?
- `/budget-validator` - Does this fit financial constraints?

**Build Phase**:
- `/installation-guide` - Step-by-step installation instructions
- `/contractor-coordinator` - Manage vendor communication

**Verify Phase**:
- `/quality-inspector` - Post-installation quality checks
- `/plant-health-monitor` - Ongoing plant success tracking

**Ship Phase**:
- `/completion-checklist` - Final delivery preparation
- `/guest-experience-test` - Visitor satisfaction preview

**Adopt Phase**:
- `/satisfaction-tracker` - Monitor guest feedback
- `/maintenance-planner` - Ongoing care scheduling

**Measure Phase**:
- `/outcome-assessor` - Did we achieve the vision?
- `/lessons-learned` - Feed back into future projects

## Success Metrics

These skills succeed when:
- ✅ Design decisions are made with confidence (multiple perspectives considered)
- ✅ Stakeholders understand the "why" behind recommendations
- ✅ Timelines are realistic and account for seasonal realities
- ✅ Specifications are unambiguous (contractors bid accurately)
- ✅ Budget surprises are eliminated
- ✅ Plant success rate improves (right plant, right place, right time)
- ✅ Guest experience outcomes are achieved
- ✅ Team learns from each project (measure phase feeds back)

## Philosophy: North Star Discipline

Every skill in this system serves the **Spoetzl Brewery North Star**:

> Transform Spoetzl Brewery into an extraordinary destination that honors
> German brewing heritage while creating immersive guest experiences through
> professional landscaping, cohesive theming, and strategic amenities.

**The Prism Test**: Every design element, every plant, every material choice is held up to this light.

- Does it honor German brewing heritage? (Heritage Keeper checks)
- Does it create guest experiences worth sharing? (Guest Experience Analyst checks)
- Can we build and maintain it successfully? (Practical Implementer checks)

If the answer is "no" to any of these, the design drifts. Fix it or don't build it.

## Credits

**Inspired by**: FlowStar framework (flowstar repo)
- North star alignment philosophy
- Multi-fidelity clarity approach
- Adversarial review methodology
- Honest scoping with lessons learned

**Adapted for**: Spoetzl Brewery Landscape Design
- German heritage authenticity
- Texas climate realities
- Guest experience focus
- Practical implementation constraints

**Powered by**: Claude Code CLI Agent Orchestration
- No external LLM APIs required
- Built-in Task tool with agent personas
- Agent swarms working in parallel
- Direct integration with project files

---

**Ready to get started?** Run `/north-star-check` on your next design decision.
