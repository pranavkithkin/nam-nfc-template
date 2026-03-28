import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const companyId = searchParams.get("companyId") || "";

  const cards = await prisma.card.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status: status as "DRAFT" | "ACTIVE" | "INACTIVE" }),
      ...(companyId && { companyId }),
    },
    include: {
      company: { select: { id: true, name: true, logoUrl: true } },
      socialLinks: { orderBy: { order: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(cards);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { socialLinks, ...cardData } = body;

  const existing = await prisma.card.findUnique({ where: { slug: cardData.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
  }

  const card = await prisma.card.create({
    data: {
      ...cardData,
      socialLinks: socialLinks?.length ? { create: socialLinks } : undefined,
    },
    include: {
      company: true,
      socialLinks: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(card, { status: 201 });
}
