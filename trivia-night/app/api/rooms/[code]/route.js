import { getRoom, updateRoom, token, hash } from '@/lib/store.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const validCode=code=>/^[A-HJ-NP-Z2-9]{6}$/.test(code);
const errorResponse=err=>Response.json({error:err.message},{status:/not found|expired/i.test(err.message)?404:400,headers:{'Cache-Control':'no-store'}});
export async function GET(request,{params}){
 try {const {code}=await params;if(!validCode(code)) throw Error('Invalid room code.');return Response.json(await getRoom(code,request.headers.get('x-room-token')),{headers:{'Cache-Control':'no-store'}});}
 catch(err){return errorResponse(err);}
}
export async function POST(request,{params}){
 try {
  const {code}=await params;if(!validCode(code)) throw Error('Invalid room code.');
  const action=await request.json();
  if(action.type==='claim_host') action.recoveryHash=hash(String(action.recovery||'').trim().toUpperCase());
  let secret=request.headers.get('x-room-token');
  if(action.type==='join') {secret=token();action.id=token().slice(0,12);}
  const state=await updateRoom(code,action,secret);
  return Response.json(action.type==='join'?{state,token:secret}:{state},{headers:{'Cache-Control':'no-store'}});
 }catch(err){if(/DATABASE_URL|connection|fetch failed/i.test(err.message)) console.error('Room update:',err);return errorResponse(err);}
}
