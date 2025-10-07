const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function apiUpload(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${API}/api/upload`, { method:'POST', body: fd })
  if(!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiMappingPreview(payload: any){
  const res = await fetch(`${API}/api/mapping/preview`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  })
  return res.json()
}

export async function apiImport(payload:any){
  const res = await fetch(`${API}/api/import`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  })
  return res.json()
}

export async function apiCleaningPreview(payload:any){
  const res = await fetch(`${API}/api/cleaning/preview`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  })
  return res.json()
}

export async function apiHistory(){
  const res = await fetch(`${API}/api/history`)
  return res.json()
}

export async function apiExport(payload:any){
  const res = await fetch(`${API}/api/export`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  })
  return res.json()
}

export async function apiAIPropose(headers:string[], samples:any[]){
  const res = await fetch(`${API}/api/ai/propose-mapping`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({headers, samples})
  })
  return res.json()
}
