import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type City = {
  id: number;
  name: string;
  thumbnail_url: string | null;
};

export function CityList({ countryId }: { countryId?: number }) {
  const { data, isLoading, isError } = useQuery<City[]>({
    queryKey: ["cities", countryId],
    queryFn: async () => {
      const r = await fetch(`/api/countries/${countryId}/cities`);
      if (!r.ok) throw new Error("fetch_failed");
      return r.json();
    },
    enabled: !!countryId,
  });

  if (!countryId) return null;
  if (isLoading) return <div>Nalaganje…</div>;
  if (isError) return <div>Napaka pri nalaganju mest</div>;
  if (!data || data.length === 0) return <div>Ni mest</div>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {data.map((c) => (
        <li
          key={c.id}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}
        >
          <img
            src={c.thumbnail_url || "/placeholder.png"}
            alt=""
            width={48}
            height={48}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
          <Link to={`/city/${c.id}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default CityList;
