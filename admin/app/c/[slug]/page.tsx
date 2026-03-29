import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicCardPage from "@/components/public/PublicCardPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    include: { company: true },
  });

  if (!card) return { title: "Card Not Found | NAM" };

  // Favicon: ALWAYS use NAM logo globally without fallback

  return {
    title: `${card.name} — Digital Business Card | Powered by NAM`,
    description: card.bio || `${card.name} · ${card.title || ""} · Powered by NAM UAE`,
    icons: {
      icon: "/nam-logo.png",
      apple: "/nam-logo.png",
    },
    openGraph: {
      title: `${card.name} — Digital Business Card`,
      description: `${card.title || ""} ${card.company ? `at ${card.company.name}` : ""}`,
      images: card.avatarUrl ? [{ url: card.avatarUrl }] : [],
    },
  };
}

export default async function CardPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "1";

  const card = await prisma.card.findUnique({
    where: { slug },
    include: {
      company: true,
      socialLinks: { orderBy: { order: "asc" } },
    },
  });

  if (!card) return notFound();

  // Draft/inactive blocked unless ?preview=1
  if ((card.status === "DRAFT" || card.status === "INACTIVE") && !isPreview) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: "#0a1628", color: "#fff" }}
      >
        <p
          className="font-heading text-5xl font-black tracking-[6px] mb-2"
          style={{
            background: "linear-gradient(135deg, #d4a853, #f5cf8a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NAM
        </p>
        <p className="text-lg font-medium mt-6 mb-2">This card is not available yet.</p>
        <p className="text-sm text-white/40">Please check back later.</p>
        <a
          href="https://www.namuae.com"
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #d4a853, #f5cf8a)", color: "#0a1628" }}
        >
          Get Your NFC Card →
        </a>
      </div>
    );
  }

  return <PublicCardPage card={card} isPreview={isPreview} />;
}
