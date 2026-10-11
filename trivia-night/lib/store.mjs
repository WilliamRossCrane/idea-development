import { neon } from '@neondatabase/serverless';
import { createHash, randomBytes } from 'node:crypto';
import { applyAction, project, readyToAdvance } from './game.mjs';
import { GAMES } from './public.mjs';
import { DEFAULT_WHEEL_OPTIONS } from './public.mjs';
let setup;
function db() {
  if(!process.env.DATABASE_URL) throw Error('DATABASE_URL is missing. Connect a Neon database in Vercel.');
  return neon(process.env.DATABASE_URL);
}
async function ready(sql){
  if(!setup) setup=sql`CREATE TABLE IF NOT EXISTS trivia_rooms (code VARCHAR(6) PRIMARY KEY, state JSONB NOT NULL, version INTEGER NOT NULL DEFAULT 0, expires_at TIMESTAMPTZ NOT NULL)` .catch(err=>{setup=null;throw err;});
  await setup;
}
export const hash=token=>createHash('sha256').update(token).digest('hex');
export const token=()=>randomBytes(32).toString('base64url');
const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code=()=>Array.from(randomBytes(6),b=>chars[b%chars.length]).join('');
// Local preview only. Production always uses Neon, including preview deployments.
const localRooms=globalThis.__gameNightLocalRooms??=new Map();
const localPreview=()=>process.env.NODE_ENV==='development'&&!process.env.DATABASE_URL;
export async function createRoom(name,icon,game='trivia'){
 const sql=localPreview()?null:db();if(sql)await ready(sql);
 const secret=token(), id=token().slice(0,12), recovery=randomBytes(8).toString('hex').toUpperCase();
 if(!GAMES[game]) throw Error('Choose a game.');
 const state={code:code(),hostHash:hash(secret),recoveryHash:hash(recovery),players:[],phase:'lobby',stage:null,game,deck:'general',tone:'mild',length:game==='trivia'?10:5,forfeits:DEFAULT_WHEEL_OPTIONS,pace:15,playlist:[],playlistIndex:0,custom:{},playerPrompts:false,writer:null,livePrompt:null,spinIndex:null,spinCount:0,paused:false,pausedRemaining:0,stageStartedAt:null,undo:null,undoAt:null,queue:[],used:{},index:0,deadline:null,roundOptions:null,spotlight:null,spotlightAnswer:null,spin:null};
 applyAction(state,{type:'join',name,icon,id},hash(secret));
 if(!sql){while(localRooms.has(state.code))state.code=code();localRooms.set(state.code,{state,expires:Date.now()+86400000});return {code:state.code,token:secret,recovery,state:project(state,hash(secret))};}
 for(let i=0;i<5;i++){
  try {await sql`INSERT INTO trivia_rooms (code,state,expires_at) VALUES (${state.code},${JSON.stringify(state)}::jsonb,NOW()+INTERVAL '24 hours')`;return {code:state.code,token:secret,recovery,state:project(state,hash(secret))};}
  catch(err){if(err.code!=='23505') throw err;state.code=code();}
 }
 throw Error('Could not create a unique room. Try again.');
}
export async function getRoom(roomCode,secret){
 if(localPreview()){
  const saved=localRooms.get(roomCode);if(!saved||saved.expires<Date.now())throw Error('Room not found or expired.');
  const state=saved.state;
  if(state.phase==='round'&&state.stage!=='reveal'&&!state.paused&&((state.deadline!==null&&state.deadline<=Date.now())||(Date.now()-(state.stageStartedAt??Date.now())>=1200&&readyToAdvance(state))))return updateRoom(roomCode,{type:'tick'},secret);
  return project(state,secret?hash(secret):null);
 }
 const sql=db();await ready(sql);
 const rows=await sql`SELECT state FROM trivia_rooms WHERE code=${roomCode} AND expires_at>NOW()`;
 if(!rows.length) throw Error('Room not found or expired.');
 const state=rows[0].state;
 if(state.phase==='round'&&state.stage!=='reveal'&&!state.paused&&((state.deadline!==null&&state.deadline<=Date.now())||(Date.now()-(state.stageStartedAt??Date.now())>=1200&&readyToAdvance(state)))) return updateRoom(roomCode,{type:'tick'},secret);
 return project(state,secret?hash(secret):null);
}
export async function updateRoom(roomCode,action,secret){
 if(localPreview()){
  const saved=localRooms.get(roomCode);if(!saved||saved.expires<Date.now())throw Error('Room not found or expired.');
  const next=applyAction(saved.state,action,secret?hash(secret):null);return project(next,secret?hash(secret):null);
 }
 const sql=db();await ready(sql);
 for(let i=0;i<6;i++){
  const rows=await sql`SELECT state,version FROM trivia_rooms WHERE code=${roomCode} AND expires_at>NOW()`;
  if(!rows.length) throw Error('Room not found or expired.');
  const state=rows[0].state, actorHash=secret?hash(secret):null;
  const next=applyAction(state,action,actorHash);
  const result=await sql`UPDATE trivia_rooms SET state=${JSON.stringify(next)}::jsonb,version=version+1 WHERE code=${roomCode} AND version=${rows[0].version} RETURNING code`;
  if(result.length) return project(next,actorHash);
 }
 throw Error('The room is busy. Try again.');
}
