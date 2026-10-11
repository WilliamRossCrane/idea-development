import { createRoom } from '@/lib/store.mjs';
import { ICONS } from '@/lib/public.mjs';
export const runtime='nodejs';
export async function POST(request){
 try{
  const body=await request.json();
  if(!ICONS.includes(body.icon)) return Response.json({error:'Pick an icon.'},{status:400});
  const name=String(body.name||'').trim().slice(0,24);
  if(!name) return Response.json({error:'Enter your name.'},{status:400});
  return Response.json(await createRoom(name,body.icon,body.game));
 }catch(err){console.error('Create room:',err);return Response.json({error:err.message||'Could not create room.'},{status:500});}
}
