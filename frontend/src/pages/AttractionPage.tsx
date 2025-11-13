import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type Attr = { id:number; city_id:number; name:string; type:string; description?:string|null; hero_url?:string|null; lat?:number; lng?:number };

export default function AttractionPage(){
  const { id } = useParams<{id:string}>();
  const aid = Number(id);
  const { data,isLoading,isError } = useQuery<Attr>({
    queryKey:['attraction', aid],
    queryFn:()=>fetch(`/api/attractions/${aid}`).then(r=>r.json()),
    enabled: Number.isFinite(aid)
  });
  if(!Number.isFinite(aid)) return <div>Neveljaven ID</div>;
  if(isLoading) return <div>Nalaganje…</div>;
  if(isError || !data?.id) return <div>Napaka ali ne obstaja</div>;
  return (
    <div style={{padding:16}}>
      {data.hero_url && <img src={data.hero_url} alt="" style={{width:'100%',maxHeight:420,objectFit:'cover',borderRadius:8}}/>}
      <h2>{data.name}</h2>
      <div style={{opacity:.7,marginBottom:8}}>{data.type}</div>
      <p>{data.description || 'Opis ni na voljo.'}</p>
    </div>
  );
}
