"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardEditorPage from "@/components/card-editor/CardEditorPage";

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cards/${id}`)
      .then((r) => r.json())
      .then((card) => {
        setData({
          ...card,
          companyId: card.companyId || "",
          socialLinks: card.socialLinks || [],
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white/30 text-sm animate-pulse">
        Loading card…
      </div>
    );
  }

  return <CardEditorPage cardId={id} initialData={data!} />;
}
