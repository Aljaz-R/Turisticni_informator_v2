import { useState } from "react";
import { CountrySelect } from "./components/CountrySelect";
import { CityList } from "./components/CityList";
import { Link } from "react-router-dom";

export default function App() {
  const [countryId, setCountryId] = useState<number | undefined>();
  const [err, setErr] = useState<string>("");

  const onCountryChange = (id: number) => {
    if (!Number.isFinite(id)) {
      setErr("Neveljavna izbira");
      setCountryId(undefined);
      return;
    }
    setErr("");
    setCountryId(id);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* GLOBALNA NAVIGACIJA */}
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <Link to="/">Domov</Link>
        <Link
          to="/attractions"
          style={{ border: "1px solid #ddd", padding: "6px 10px", borderRadius: 6 }}
        >
          Znamenitosti
        </Link>
        <Link to="/admin">Admin</Link>
      </header>

      <h1>Turistični informator</h1>

      <div style={{ marginBottom: 8 }}>
        <label>Država: </label>
        <CountrySelect value={countryId} onChange={onCountryChange} />
      </div>

      {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}

      <CityList countryId={countryId} />
    </div>
  );
}
