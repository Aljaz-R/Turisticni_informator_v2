import { useQuery } from "@tanstack/react-query";
export function CountrySelect({ value, onChange }:{value?: number; onChange:(v:number)=>void}) {
  const { data, isLoading, error } = useQuery({
    queryKey:["countries"],
    queryFn:()=>fetch("/api/countries").then(r=>r.json())
  });
  if (isLoading) return <span>Nalaganje…</span>;
  if (error) return <span>Napaka pri nalaganju držav</span>;
  return (
    <select value={value ?? ""} onChange={e=>onChange(Number(e.target.value))}>
      <option value="" disabled>Izberi državo</option>
      {data?.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  );
}
