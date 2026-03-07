import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/images/[id] - Get single image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
}

// PUT /api/images/[id] - Update image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, tags } = body

    // Check if user owns the image or is admin
    const existingImage = await prisma.image.findUnique({
      where: { id: params.id },
    })

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (existingImage.userId !== session.user.id && user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const image = await prisma.image.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        tags,
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

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    )
  }
}

// DELETE /api/images/[id] - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user owns the image or is admin
    const existingImage = await prisma.image.findUnique({
      where: { id: params.id },
    })

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (existingImage.userId !== session.user.id && user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.image.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
