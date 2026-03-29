import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { company: true, socialLinks: { orderBy: { order: "asc" } } },
  });

  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(card);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { socialLinks, id: _id, company, createdAt, updatedAt, ...cardData } = body;

  if (cardData.companyId === "") {
    cardData.companyId = null;
  }

  await prisma.socialLink.deleteMany({ where: { cardId: id } });

  const card = await prisma.card.update({
    where: { id },
    data: {
      ...cardData,
      socialLinks: socialLinks?.length
        ? {
            create: socialLinks.map(
              ({ id: _id, cardId: _cid, ...link }: { id?: string; cardId?: string; [key: string]: unknown }) => link
            ),
          }
        : undefined,
    },
    include: { company: true, socialLinks: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(card);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if ((session.user as { role?: string }).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
