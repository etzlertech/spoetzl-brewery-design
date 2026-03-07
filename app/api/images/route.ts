import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/images - Get all images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")

    const where: any = {}
    if (category) where.category = category
    if (tag) where.tags = { has: tag }

    const images = await prisma.image.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    )
  }
}

// POST /api/images - Create new image
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, url, category, tags } = body

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const image = await prisma.image.create({
      data: {
        title,
        description,
        url,
        category,
        tags: tags || [],
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error("Error creating image:", error)
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    )
  }
}
