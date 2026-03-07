import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const SKILLS_DIR = path.join(process.cwd(), 'content', 'skills')

// Security: Sanitize slug to prevent path traversal attacks
export function sanitizeSlug(slug: string): string {
  // Remove all characters except letters, numbers, and hyphens
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

  // Validate slug hasn't been modified (detect attack attempts)
  if (safe !== slug.toLowerCase()) {
    throw new Error('Invalid slug characters detected')
  }

  // Prevent DOS attacks with unreasonably long slugs
  if (safe.length > 100) {
    throw new Error('Slug too long')
  }

  // Prevent empty slugs
  if (safe.length === 0) {
    throw new Error('Slug cannot be empty')
  }

  return safe
}

// Security: Get skill file path with path traversal prevention
function getSkillFilePath(slug: string): string {
  const sanitized = sanitizeSlug(slug)

  // Try to find the markdown file in skills directory tree
  // We don't construct the path from user input, we search within allowed directory
  const skillsDir = path.resolve(SKILLS_DIR)

  // This will be populated by findSkillFile
  return path.join(skillsDir, `${sanitized}.md`)
}

// Security: Verify path is within allowed directory
function isPathSafe(filePath: string): boolean {
  const resolved = path.resolve(filePath)
  const skillsDir = path.resolve(SKILLS_DIR)

  // Ensure the resolved path starts with skills directory
  return resolved.startsWith(skillsDir)
}

// Recursively find skill file by slug
async function findSkillFile(dir: string, slug: string): Promise<string | null> {
  const sanitized = sanitizeSlug(slug)

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      // Security check: ensure we're still within skills directory
      if (!isPathSafe(fullPath)) {
        continue
      }

      if (entry.isDirectory()) {
        // Recurse into subdirectories
        const found = await findSkillFile(fullPath, slug)
        if (found) return found
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Check if filename (without .md) matches slug
        const baseName = entry.name.replace(/\.md$/, '')
        if (baseName.toLowerCase() === sanitized) {
          return fullPath
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error)
    return null
  }

  return null
}

export interface SkillMetadata {
  name?: string
  title?: string
  description?: string
  category?: string
  tags?: string[]
  version?: string
  priority?: number
  status?: string
  phases?: string[]
  project_types?: string[]
}

export interface Skill {
  slug: string
  metadata: SkillMetadata
  content: string
  filePath: string
}

// Get a single skill by slug with security checks
export async function getSkill(slug: string): Promise<Skill | null> {
  try {
    const sanitized = sanitizeSlug(slug)

    // Find the file
    const filePath = await findSkillFile(SKILLS_DIR, sanitized)

    if (!filePath) {
      return null
    }

    // Final security check
    if (!isPathSafe(filePath)) {
      console.error(`Path traversal attempt detected: ${filePath}`)
      return null
    }

    // Read file
    const fileContents = await fs.readFile(filePath, 'utf8')

    // Parse frontmatter
    const { data, content } = matter(fileContents)

    return {
      slug: sanitized,
      metadata: data as SkillMetadata,
      content,
      filePath
    }
  } catch (error) {
    console.error(`Error loading skill "${slug}":`, error)
    return null
  }
}

// Get all skills (for index page and static generation)
export async function getAllSkills(): Promise<Skill[]> {
  const skills: Skill[] = []

  async function scanDirectory(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        // Security check
        if (!isPathSafe(fullPath)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDirectory(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8')
            const { data, content } = matter(fileContents)

            // Generate slug from filename
            const slug = entry.name.replace(/\.md$/, '').toLowerCase()

            skills.push({
              slug,
              metadata: data as SkillMetadata,
              content,
              filePath: fullPath
            })
          } catch (error) {
            console.error(`Error reading skill file ${fullPath}:`, error)
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error)
    }
  }

  await scanDirectory(SKILLS_DIR)

  // Sort by priority (higher first), then by title
  return skills.sort((a, b) => {
    const priorityA = a.metadata.priority ?? 999
    const priorityB = b.metadata.priority ?? 999

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    const titleA = a.metadata.title || a.slug
    const titleB = b.metadata.title || b.slug
    return titleA.localeCompare(titleB)
  })
}

// Get all skill slugs (for static generation)
export async function getAllSkillSlugs(): Promise<string[]> {
  const skills = await getAllSkills()
  return skills.map(skill => skill.slug)
}

// Group skills by category
export interface SkillCategory {
  id: string
  title: string
  description: string
  skills: Skill[]
}

export async function getSkillsByCategory(): Promise<SkillCategory[]> {
  const allSkills = await getAllSkills()

  // Define categories
  const categories: SkillCategory[] = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      description: 'Essential guides to understand the FlowStar system',
      skills: []
    },
    {
      id: 'core',
      title: '⭐ Core Skills',
      description: 'Universal skills for all project types',
      skills: []
    },
    {
      id: 'phase',
      title: '📋 Phase Skills',
      description: 'Workflow skills for each project phase',
      skills: []
    },
    {
      id: 'software',
      title: '💻 Software Development',
      description: 'Skills for building the platform',
      skills: []
    },
    {
      id: 'collaboration',
      title: '🤝 Collaboration',
      description: 'Customer-contractor workflows',
      skills: []
    },
    {
      id: 'meta',
      title: '🧠 Meta Skills',
      description: 'System orchestration and agent swarms',
      skills: []
    }
  ]

  // Categorize skills
  for (const skill of allSkills) {
    // Getting started (README, guides)
    if (skill.slug.includes('readme') || skill.slug.includes('guide') || skill.slug.includes('quick-start')) {
      categories[0].skills.push(skill)
    }
    // Core skills
    else if (skill.metadata.category === 'core' || skill.filePath.includes('00-CORE')) {
      categories[1].skills.push(skill)
    }
    // Phase skills
    else if (skill.metadata.category === 'sense' || skill.metadata.category === 'specify' || skill.metadata.category === 'scope' || skill.filePath.includes('01-PHASE-SKILLS')) {
      categories[2].skills.push(skill)
    }
    // Software skills
    else if (skill.metadata.category === 'software' || skill.filePath.includes('03-SOFTWARE-SKILLS')) {
      categories[3].skills.push(skill)
    }
    // Collaboration skills
    else if (skill.metadata.category === 'collaboration' || skill.filePath.includes('04-COLLABORATION-WORKFLOW')) {
      categories[4].skills.push(skill)
    }
    // Meta skills
    else if (skill.metadata.category === 'meta' || skill.filePath.includes('02-META-SKILLS')) {
      categories[5].skills.push(skill)
    }
    // Default to core
    else {
      categories[1].skills.push(skill)
    }
  }

  // Filter out empty categories
  return categories.filter(cat => cat.skills.length > 0)
}
