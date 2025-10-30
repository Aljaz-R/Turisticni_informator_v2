import { useState } from "react";
import { CountrySelect } from "./components/CountrySelect";
import { CityList } from "./components/CityList";
export default function App() {
  const [countryId, setCountryId] = useState<number|undefined>();
  const [err, setErr] = useState<string>("");
  const onCountryChange = (id:number) => {
    if (!Number.isFinite(id)) { setErr("Neveljavna izbira"); setCountryId(undefined); return; }
    setErr(""); setCountryId(id);
  };
  return (
    <div style={{padding:16}}>
      <h1>Turistični informator</h1>
      <label>Država: </label>
      <CountrySelect value={countryId} onChange={onCountryChange}/>
      {err && <div style={{color:"red"}}>{err}</div>}
      <CityList countryId={countryId}/>
    </div>
  );
}
