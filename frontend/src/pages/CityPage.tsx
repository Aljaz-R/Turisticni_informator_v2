import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Gallery } from "../components/Gallery";

type City = { id: number; name: string; description?: string | null; hero_url?: string | null };

export function CityPage() {
  const { id } = useParams<{ id: string }>();
  const cityId = Number(id);

  const cityQ = useQuery<City>({
    queryKey: ["city", cityId],
    queryFn: async () => {
      const r = await fetch(`/api/cities/${cityId}`);
      if (!r.ok) throw new Error("fetch_failed");
      return r.json();
    },
    enabled: Number.isFinite(cityId),
  });

  const imagesQ = useQuery<string[]>({
    queryKey: ["cityImages", cityId],
    queryFn: async () => {
      const r = await fetch(`/api/cities/${cityId}/images`);
      if (!r.ok) throw new Error("fetch_failed");
      return r.json();
    },
    enabled: Number.isFinite(cityId),
  });

  if (!Number.isFinite(cityId)) return <div>Neveljaven ID</div>;
  if (cityQ.isLoading || imagesQ.isLoading) return <div>Nalaganje…</div>;
  if (cityQ.isError || !cityQ.data?.id) return <div>Napaka ali mesto ne obstaja</div>;

  const gallery = imagesQ.data?.length
    ? imagesQ.data
    : cityQ.data.hero_url
    ? [cityQ.data.hero_url]
    : [];

  return (
    <div style={{ padding: 16 }}>
      <h2>{cityQ.data.name}</h2>

      <div style={{ margin: "8px 0 12px" }}>
        <Link
          to={`/attractions?city_id=${cityId}`}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 6,
            border: "2px solid #333",
            textDecoration: "none",
            fontWeight: 700,
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Prikaži znamenitosti tega mesta
        </Link>
      </div>

      <Gallery images={gallery} />
      <p style={{ marginTop: 12 }}>{cityQ.data.description || "Opis ni na voljo."}</p>
    </div>
  );
}
