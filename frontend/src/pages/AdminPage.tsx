import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const auth = { 
  headers: { 
    Authorization: "Basic " + btoa("admin:admin123"),
    "Content-Type": "application/json"
  }
};

export default function AdminPage() {
  const qc = useQueryClient();
  const countries = useQuery({
    queryKey: ["admin-countries"],
    queryFn: () => fetch("/api/admin/countries", { headers: auth.headers }).then(r => r.json())
  });
  const cities = useQuery({
    queryKey: ["admin-cities"],
    queryFn: () => fetch("/api/admin/cities", { headers: auth.headers }).then(r => r.json())
  });

  const [country, setCountry] = useState({ code: "", name: "" });
  const [city, setCity] = useState({ country_id: "", name: "", thumbnail_url: "" });

  const addCountry = useMutation({
    mutationFn: (body: any) =>
      fetch("/api/admin/countries", {
        method: "POST",
        headers: auth.headers,
        body: JSON.stringify(body)
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-countries"] })
  });

  const addCity = useMutation({
    mutationFn: (body: any) =>
      fetch("/api/admin/cities", {
        method: "POST",
        headers: auth.headers,
        body: JSON.stringify(body)
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-cities"] })
  });

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Dodaj državo</h3>
        <input
          placeholder="Koda (2 črki)"
          value={country.code}
          onChange={e => setCountry({ ...country, code: e.target.value })}
        />
        <input
          placeholder="Ime"
          value={country.name}
          onChange={e => setCountry({ ...country, name: e.target.value })}
        />
        <button onClick={() => addCountry.mutate(country)}>Shrani</button>

        <div style={{ marginTop: 8 }}>
          <strong>Države</strong>
          <ul>
            {countries.data?.map((c: any) => (
              <li key={c.id}>
                {c.code} — {c.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h3>Dodaj mesto</h3>
        <input
          placeholder="country_id"
          value={city.country_id}
          onChange={e => setCity({ ...city, country_id: e.target.value })}
        />
        <input
          placeholder="Ime"
          value={city.name}
          onChange={e => setCity({ ...city, name: e.target.value })}
        />
        <input
          placeholder="thumbnail_url"
          value={city.thumbnail_url}
          onChange={e => setCity({ ...city, thumbnail_url: e.target.value })}
        />
        <button
          onClick={() =>
            addCity.mutate({
              ...city,
              country_id: Number(city.country_id) || undefined
            })
          }
        >
          Shrani
        </button>

        <div style={{ marginTop: 8 }}>
          <strong>Mesta</strong>
          <ul>
            {cities.data?.map((c: any) => (
              <li key={c.id}>
                #{c.id} ({c.country_id}) {c.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
