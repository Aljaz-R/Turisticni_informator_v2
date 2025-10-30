import { useQuery } from "@tanstack/react-query";
export function CityList({ countryId }:{countryId?:number}) {
  const {data,isLoading,isError} = useQuery({
    queryKey:["cities",countryId],
    queryFn:()=>fetch(`/api/countries/${countryId}/cities`).then(r=>r.json()),
    enabled: !!countryId
  });
  if (!countryId) return null;
  if (isLoading) return <div>Nalaganje…</div>;
  if (isError) return <div>Napaka pri nalaganju mest</div>;
  if (!data?.length) return <div>Ni mest</div>;
  return (
    <ul>
      {data.map((c:any)=>(<li key={c.id}>{c.name}</li>))}
    </ul>
  );
}
