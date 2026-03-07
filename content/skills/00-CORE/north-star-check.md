---
name: north-star-check
title: Design Vision Alignment Check
description: Ensure landscape design decisions align with the Spoetzl Brewery vision
category: core
tags:
  - north-star
  - alignment
  - vision
  - critical
version: "1.0.0"
priority: 1
status: active
phases:
  - sense
  - validate
  - specify
  - scope
  - build
  - verify
  - ship
  - adopt
  - measure
---

# Design Vision Alignment Check

## Purpose

This is the foundational skill for the Spoetzl Brewery landscape design project.
Every design decision, every element, every enhancement proposal is held up to
the light of the project vision. This prevents scope creep, misaligned aesthetics,
and ensures cohesive theming throughout the property.

## The Vision Prism

Given the project's north star:
- **Outcome**: Transform Spoetzl Brewery into an extraordinary destination that honors German brewing heritage while creating immersive guest experiences
- **Beneficiary**: Brewery visitors, staff, and the broader community
- **Done Looks Like**: Cohesive European village theming with distinct outdoor "rooms", professional landscaping with seasonal interest, strategic amenities placement

## Phase-Specific Questions

Ask the appropriate question based on current phase:

| Phase | Question |
|-------|----------|
| Sense | Does this inspiration align with German brewery heritage and European village theming? |
| Validate | Is this design element worth implementing for the guest experience and brewery identity? |
| Specify | Do these specifications honor the vision while remaining practical and maintainable? |
| Scope | Is this scope honest about materials, labor, timing, and seasonal considerations? |
| Build | Are we implementing this in a way that serves the cohesive theme? |
| Verify | Does this installation fulfill the vision criteria and quality standards? |
| Ship | Are we completing this so visitors and staff can enjoy it immediately? |
| Adopt | Are guests experiencing and appreciating this enhancement? |
| Measure | Did the enhancement achieve its intended impact? What did we learn? |

## Agent Swarm Approach

Instead of calling external LLMs, this skill uses **Claude Code agent personas** to evaluate alignment:

### 1. Heritage Keeper (Explore Agent)
**Persona**: German brewing tradition expert focused on authenticity
**Task**: Search for and evaluate European village design elements, German garden traditions
**Command**:
```
Use Task tool with subagent_type=Explore to research:
- German beer garden design principles
- European village landscaping patterns
- Authentic materials and plantings
```

### 2. Guest Experience Analyst (General-Purpose Agent)
**Persona**: Theme park designer focused on immersive experiences
**Task**: Evaluate how design elements create "outdoor rooms" and photo opportunities
**Command**:
```
Use Task tool with subagent_type=general-purpose to analyze:
- Traffic flow and gathering spaces
- Seasonal interest across all four seasons
- Accessibility and comfort amenities
```

### 3. Practical Implementer (Plan Agent)
**Persona**: Professional landscaper focused on maintainability
**Task**: Assess feasibility, maintenance requirements, and longevity
**Command**:
```
Use Task tool with subagent_type=Plan to evaluate:
- Installation complexity and timeline
- Ongoing maintenance requirements
- Material durability for Texas climate
```

## Output Format

```
DESIGN VISION ALIGNMENT CHECK
Project: Spoetzl Brewery Landscape Enhancement
Element: {design element or proposal}
Phase: {current phase}
Question: {phase-specific question}

AGENT SWARM ASSESSMENT:

Heritage Keeper (Authenticity): ALIGNED | NEEDS_ADJUSTMENT | MISALIGNED
- {cultural/historical alignment evidence}

Guest Experience Analyst (Immersion): ALIGNED | NEEDS_ADJUSTMENT | MISALIGNED
- {experience quality evidence}

Practical Implementer (Feasibility): ALIGNED | NEEDS_ADJUSTMENT | MISALIGNED
- {implementation reality evidence}

OVERALL: ALIGNED | DRIFTING | MISALIGNED

If drifting or misaligned:
- What would realign this design element?
- Should the vision be expanded to include this? (requires stakeholder approval)
- Alternative approaches that better serve the vision
```

## When to Run

- Before adding new design elements to proposals (mandatory)
- When scope or materials change
- When budget constraints require substitutions
- When team members feel uncertain about design direction
- At every project milestone review
- Before finalizing vendor contracts

## Example Usage

```bash
# User invokes this skill when evaluating a water feature proposal
/north-star-check

# Claude Code will:
# 1. Spawn Explore agent to research German fountain traditions
# 2. Spawn General-Purpose agent to analyze guest experience flow
# 3. Spawn Plan agent to assess installation feasibility
# 4. Synthesize findings into alignment assessment
# 5. Provide recommendations
```

## Success Criteria

- Prevents "wouldn't it be cool if..." additions that break theming
- Ensures cohesive aesthetic across all design phases
- Maintains focus on guest experience outcomes
- Balances authenticity with practical implementation
- Creates accountability for design decisions
