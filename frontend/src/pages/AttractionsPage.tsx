import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

type Row = { id:number; city_id:number; name:string; type:string; thumbnail_url?:string|null };

export default function AttractionsPage(){
  const [params,setParams] = useSearchParams();
  const city_id = params.get('city_id') ?? '';
  const type = params.get('type') ?? '';
  const q = params.get('q') ?? '';
  const qs = useMemo(()=>{
    const u = new URLSearchParams();
    if (city_id) u.set('city_id', city_id);
    if (type) u.set('type', type);
    if (q) u.set('q', q);
    return u.toString();
  },[city_id,type,q]);

  const { data,isLoading,isError } = useQuery<Row[]>({
    queryKey:['attractions', qs],
    queryFn:()=>fetch(`/api/attractions?${qs}`).then(r=>r.json())
  });

  return (
    <div style={{padding:16}}>
      <h2>Znamenitosti</h2>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
        <input placeholder="Išči…" defaultValue={q}
          onChange={e=>{ params.set('q', e.target.value); setParams(params,{replace:true}); }} />
        <select value={type} onChange={e=>{ params.set('type', e.target.value); setParams(params,{replace:true}); }}>
          <option value="">Vsi tipi</option>
          <option value="muzej">Muzej</option>
          <option value="spomenik">Spomenik</option>
          <option value="trg">Trg</option>
          <option value="narava">Narava</option>
        </select>
      </div>
      {isLoading && <div>Nalaganje…</div>}
      {isError && <div>Napaka pri nalaganju</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {data?.map(a=>(
          <Link key={a.id} to={`/attraction/${a.id}`} style={{textDecoration:'none',color:'inherit',border:'1px solid #ddd',borderRadius:8,overflow:'hidden'}}>
            <img src={a.thumbnail_url || '/placeholder.png'} alt="" style={{width:'100%',height:140,objectFit:'cover'}}/>
            <div style={{padding:8}}>
              <div style={{fontWeight:600}}>{a.name}</div>
              <div style={{opacity:.7,fontSize:12}}>{a.type}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
