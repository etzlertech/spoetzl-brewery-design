---
name: agent-swarm-orchestrator
title: Agent Swarm Orchestration System
description: Coordinate multiple Claude Code agents working as specialized personas to solve complex landscape design challenges
category: meta
tags:
  - agent-swarm
  - orchestration
  - coordination
  - personas
  - critical
version: "1.0.0"
priority: 10
status: active
phases:
  - all
---

# Agent Swarm Orchestration System

## Purpose

This meta-skill teaches Claude Code how to orchestrate **multiple agents working in parallel**
as specialized personas to replicate FlowStar's multi-LLM approach **without external API calls**.

Instead of calling OpenAI, Anthropic, or other LLM APIs, this approach:
- Uses Claude Code's built-in Task tool
- Assigns each agent a specific persona and expertise
- Coordinates agents working in parallel (swarm behavior)
- Synthesizes results into cohesive output

## Core Principle: Personas Over APIs

**FlowStar approach (external APIs):**
```typescript
// Calls external LLM services
const [review1, review2, review3] = await Promise.all([
  anthropic.claude('Review this spec'),
  openai.gpt4('Review this spec'),
  google.gemini('Review this spec')
]);
```

**Our approach (Claude Code agent swarms):**
```typescript
// Uses Task tool with specialized personas
const [review1, review2, review3] = await Promise.all([
  Task('general-purpose', {
    persona: 'Heritage Keeper',
    expertise: 'German brewing tradition',
    task: 'Review spec for cultural authenticity'
  }),
  Task('general-purpose', {
    persona: 'Guest Experience Designer',
    expertise: 'Theme park immersion',
    task: 'Review spec for guest experience'
  }),
  Task('Plan', {
    persona: 'Practical Landscaper',
    expertise: 'Texas climate installation',
    task: 'Review spec for feasibility'
  })
]);
```

## Agent Types Available

Claude Code provides these agent types via the Task tool:

| Agent Type | Use For | Persona Examples |
|------------|---------|------------------|
| **general-purpose** | Complex reasoning, analysis, multi-step tasks | Heritage Keeper, Guest Experience Analyst, Budget Reality Checker |
| **Explore** | Fast codebase/knowledge exploration | Design Pattern Researcher, Best Practices Finder |
| **Plan** | Implementation planning, sequencing | Logistics Coordinator, Installation Sequencer |
| **Bash** | File operations, git, system commands | Project Setup Agent, Documentation Builder |

## Swarm Patterns

### Pattern 1: Parallel Expert Review

**Use when**: You need multiple perspectives on the same input

```markdown
SCENARIO: Review a design specification

SWARM COMPOSITION:
- Agent 1 (general-purpose): Heritage Keeper
  - Focus: Cultural authenticity, German tradition
  - Output: Authenticity score + concerns

- Agent 2 (general-purpose): Guest Experience Analyst
  - Focus: Immersion, flow, photo opportunities
  - Output: Experience quality score + suggestions

- Agent 3 (Plan): Practical Implementer
  - Focus: Feasibility, maintenance, cost
  - Output: Feasibility score + risks

ORCHESTRATION:
1. Spawn all three agents in parallel (single message, multiple Task calls)
2. Each agent receives the same specification document
3. Wait for all agents to complete
4. Synthesize findings into unified assessment
5. Identify conflicts between perspectives
6. Recommend balanced approach
```

**Claude Code Implementation**:
```bash
# User provides spec document
# Claude Code executes:

# Spawn agents in parallel
Use Task tool three times in same message:
1. Task(general-purpose, Heritage Keeper persona, analyze spec)
2. Task(general-purpose, Guest Experience Analyst persona, analyze spec)
3. Task(Plan, Practical Implementer persona, analyze spec)

# Synthesize results
Compare findings, identify alignment and conflicts
Generate unified recommendation
```

### Pattern 2: Sequential Pipeline

**Use when**: Each agent's output feeds the next agent's input

```markdown
SCENARIO: Transform rough idea → structured spec → visual diagram → presentation

SWARM COMPOSITION:
- Agent 1 (general-purpose): Idea Structurer
  - Input: Rough client description
  - Output: Structured markdown specification

- Agent 2 (general-purpose): Diagram Generator
  - Input: Structured specification from Agent 1
  - Output: Mermaid site plan diagram

- Agent 3 (general-purpose): Visual Designer
  - Input: Specification + diagram from Agents 1 & 2
  - Output: Interactive HTML visualization

- Agent 4 (general-purpose): Presentation Builder
  - Input: All outputs from Agents 1-3
  - Output: Stakeholder presentation deck

ORCHESTRATION:
1. Spawn Agent 1, wait for completion
2. Pass Agent 1 output to Agent 2, wait for completion
3. Pass Agents 1+2 outputs to Agent 3, wait for completion
4. Pass all outputs to Agent 4
5. Save all artifacts to project directory
```

### Pattern 3: Specialized Research Swarm

**Use when**: You need to gather information from multiple domains

```markdown
SCENARIO: Research German beer garden design for inspiration

SWARM COMPOSITION:
- Agent 1 (Explore): Historical Research
  - Search: Traditional German beer garden elements
  - Output: Historical design patterns, materials, layouts

- Agent 2 (Explore): Modern Examples
  - Search: Contemporary beer gardens in US
  - Output: Successful implementations, photos, case studies

- Agent 3 (Explore): Climate Adaptation
  - Search: Texas-appropriate German garden plants
  - Output: Plant lists, hardiness zones, maintenance notes

- Agent 4 (general-purpose): Synthesis Specialist
  - Input: All research from Agents 1-3
  - Output: Curated inspiration guide for Spoetzl project

ORCHESTRATION:
1. Spawn Agents 1-3 in parallel (research phase)
2. Wait for all to complete
3. Spawn Agent 4 with all research outputs
4. Generate actionable inspiration document
```

### Pattern 4: Adversarial Review (Multi-Perspective Critique)

**Use when**: You need critical evaluation to prevent groupthink

```markdown
SCENARIO: Review a proposed design before stakeholder presentation

SWARM COMPOSITION:
- Agent 1 (general-purpose): The Optimist
  - Focus: Best-case scenarios, potential upside
  - Output: What could go exceptionally well

- Agent 2 (general-purpose): The Skeptic
  - Focus: Risks, failure modes, edge cases
  - Output: What could go wrong, hidden costs

- Agent 3 (general-purpose): The Client Advocate
  - Focus: Guest experience, satisfaction, long-term value
  - Output: Will clients actually love this?

- Agent 4 (Plan): The Builder
  - Focus: Installation reality, maintenance burden
  - Output: Can we actually build and maintain this?

ORCHESTRATION:
1. Spawn all agents in parallel with same proposal
2. Collect diverse perspectives
3. Identify consensus points (all agents agree)
4. Identify conflicts (agents disagree)
5. Generate balanced recommendation addressing concerns
```

## Orchestration Best Practices

### ✅ DO:

1. **Define clear personas** with specific expertise and perspective
2. **Spawn parallel agents in single message** when they don't depend on each other
3. **Pass complete context** to each agent (don't assume they share knowledge)
4. **Synthesize results** into unified output (don't just dump raw agent responses)
5. **Handle conflicts** when agents disagree (this is valuable signal!)
6. **Save artifacts** to structured directories

### ❌ DON'T:

1. **Don't spawn 10+ agents** (diminishing returns, use 3-5 for most tasks)
2. **Don't use agent swarms for simple tasks** (single agent is faster)
3. **Don't forget to wait** for sequential dependencies
4. **Don't lose agent outputs** (save them to files for reference)
5. **Don't spawn agents serially** when they could run in parallel

## Example: Complete Swarm Workflow

**User Request**: "Evaluate this water fountain proposal for the brewery entrance"

**Claude Code Orchestration**:

```markdown
STEP 1: Spawn Parallel Expert Review Swarm

Message contains 3 Task tool calls:

Task 1 (general-purpose):
  Persona: Heritage Keeper - German brewing tradition expert
  Task: Review fountain proposal for cultural authenticity
  Context: Spoetzl Brewery is German heritage, fountain should honor this
  Output: Authenticity assessment

Task 2 (general-purpose):
  Persona: Guest Experience Designer - Theme park background
  Task: Review fountain proposal for guest experience impact
  Context: Entrance area, first impression, photo opportunity
  Output: Experience quality assessment

Task 3 (Plan):
  Persona: Practical Landscaper - Texas installation expert
  Task: Review fountain proposal for feasibility, maintenance, cost
  Context: Texas heat, water consumption, freeze risk, ongoing maintenance
  Output: Feasibility assessment

[WAIT FOR ALL AGENTS TO COMPLETE]

STEP 2: Synthesize Findings

Heritage Keeper says:
  ✅ ALIGNED - Traditional tiered fountain design honors German village aesthetic
  ⚠️ Consider adding German-style tile accents

Guest Experience Designer says:
  ✅ ALIGNED - Excellent focal point, sound of water creates ambiance
  ⚠️ Ensure seating nearby to enjoy the feature

Practical Landscaper says:
  ⚠️ NEEDS ADJUSTMENT - 3-tier fountain has freeze risk in Texas winters
  💡 Recommend: Pondless fountain (safer) or winterization plan

STEP 3: Unified Recommendation

OVERALL: ALIGNED with modifications

Recommendation:
- Keep traditional German fountain aesthetic (Heritage Keeper approved)
- Add seating area within earshot (Guest Experience Designer suggestion)
- Switch to pondless design OR add winterization plan (Practical Landscaper requirement)
- Consider German tile accents for authenticity boost

Next Steps:
1. Get stakeholder approval on pondless vs. traditional design
2. Source German-style tile options
3. Plan seating area layout
```

## When to Use Agent Swarms

✅ **Good use cases:**
- Multi-perspective design reviews
- Complex scoping with many risk factors
- Generating multi-fidelity outputs (diagrams + visuals + presentations)
- Research across multiple domains
- Adversarial spec reviews

❌ **Bad use cases:**
- Simple questions ("What plants are drought-tolerant?")
- Single-perspective tasks ("Create a plant list")
- Quick lookups (just use Read or Grep tools)

## Success Criteria

- Decisions are better because multiple perspectives were considered
- Risks are identified that single-perspective review would miss
- Stakeholders trust recommendations because they're thoroughly vetted
- Design conflicts are surfaced early (not during installation)
- Team can explain "we considered X, Y, Z perspectives before recommending this"

## Integration with Other Skills

This orchestration pattern is used by:
- `/north-star-check` - spawns Heritage, Experience, Practical agents
- `/landscape-scoping-lessons` - spawns Season, Logistics, Risk, Budget agents
- `/clarity-engine` - spawns Structurer, Diagram, Visual, Presentation agents

## Notes

- **No external API calls required** - everything runs via Claude Code's Task tool
- **Agent personas are instructions** - not separate LLM instances
- **Swarm coordination happens in your session** - results synthesized locally
- **Saves on API costs** - no external LLM bills
- **Works offline** - no network dependencies for swarm orchestration
