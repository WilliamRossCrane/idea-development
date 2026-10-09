'use client';
import {useEffect,useState} from 'react';
import QRCode from 'qrcode';
import {GAMES} from '@/lib/public.mjs';
import {revealCallout} from '@/lib/reveal.mjs';
import WheelDisplay,{WheelLegend} from '@/app/wheel.jsx';
import {RoomStandings,Outcome} from '@/app/standings.jsx';

function choiceText(choice){return typeof choice==='string'?choice:choice.text||choice.label;}
function answerHeadline(room){
 if(room.stage!=='reveal'||GAMES[room.game].kind!=='score')return null;
 const q=room.question;
 if(room.game==='hot_seat'&&q.correct===null)return 'The hot seat player passed this round';
 const answer=room.game==='bluff'?q.choices.find(o=>o.correct):q.choices[q.correct];
 return answer?`The answer: ${choiceText(answer)}`:null;
}
function TvOptions({room}){
 const q=room.question,done=room.stage==='reveal';
 const playersById=new Map(room.players.map(p=>[p.id,p]));
 return <div className="tv-options" key={`${room.game}:${room.round}:${room.stage}`}>
  {q.choices.map((option,i)=>{
   const text=choiceText(option),key=typeof option==='object'&&option.id?option.id:i;
   const correct=done&&(q.correct===i||option.correct);
   const count=q.counts?.[key];
   const voters=done?q.votes?.filter(v=>v.choice===key).map(v=>playersById.get(v.id)).filter(Boolean):null;
   return <div key={key} className={'tv-option '+(correct?'correct':'')}>
    <b>{'ABCD'[i]||'★'}</b><span>{text}</span>
    {done&&count!==undefined&&<strong>{count} {count===1?'vote':'votes'}</strong>}
    {done&&option.authorId&&<small>Bluff by {playersById.get(option.authorId)?.name}</small>}
    {voters?.length>0&&<div className="tv-voters" aria-label={`Picked by ${voters.map(p=>p.name).join(', ')}`}>{voters.map(p=><span key={p.id} title={p.name}>{p.icon} {p.name}</span>)}</div>}
   </div>;
  })}
 </div>;
}

export default function Screen({code}){
 const [room,setRoom]=useState(null),[qr,setQr]=useState(''),[time,setTime]=useState(Date.now()),[error,setError]=useState('');
 useEffect(()=>{
  QRCode.toDataURL(`${location.origin}/room/${code}`,{width:250,margin:2}).then(setQr).catch(()=>{});
  let active=true;
  async function refresh(){try{
   const response=await fetch(`/api/rooms/${code}`,{cache:'no-store'}),data=await response.json();
   if(!response.ok)throw Error(data.error);
   if(active){setRoom({...data,receivedAt:Date.now()});setError('');}
  }catch(e){if(active)setError(e.message);}}
  refresh();const poll=setInterval(refresh,1200),timer=setInterval(()=>setTime(Date.now()),250);
  return()=>{active=false;clearInterval(poll);clearInterval(timer);};
 },[code]);
 const left=room?.phase==='round'?(room.paused?Math.ceil(room.remaining/1000):Math.max(0,Math.ceil((room.deadline-(time+room.serverTime-room.receivedAt))/1000))):0;
 if(!room)return <main className="tv-screen"><h1>{error||'Joining room…'}</h1></main>;
 const game=GAMES[room.game],q=room.question,done=room.stage==='reveal',ranked=[...room.players].sort((a,b)=>b.score-a.score),headline=answerHeadline(room),callout=revealCallout(room);
 return <main className="tv-screen">
  <header className="tv-header"><div className="wordmark">GAME<span>NIGHT!</span></div><div className="tv-game">{game.emoji} {game.title}</div><div className="tv-room">JOIN <strong>{code}</strong></div></header>
  {room.phase==='lobby'&&<div className="tv-lobby"><div><div className="tag">NEXT UP</div><h1>{game.emoji} {game.title}</h1><p>Scan the code. Pick your player. Let’s get this started.</p><div className="tv-join-code">{code}</div><div className="tv-people">{room.players.map(p=><span key={p.id}>{p.icon} {p.name} {room.adult&&!p.adultOk?'· waiting':''}</span>)}</div><RoomStandings players={room.players}/>{room.playlist.length>0&&<div className="tv-playlist">TONIGHT: {room.playlist.map(k=>GAMES[k].title).join('  →  ')}</div>}</div>{qr&&<div className="tv-qr"><img src={qr} alt="Scan to join the room"/><strong>SCAN TO JOIN</strong></div>}</div>}
  {room.phase==='round'&&room.game==='wheel'&&<div className="tv-wheel-screen"><span className="tag">🎡 THE WHEEL</span><h1>{room.spin?'The wheel picked…':'Ready for a spin?'}</h1><WheelDisplay options={q.choices} spinIndex={room.spinIndex} spinCount={room.spinCount}/>{room.spin&&<p className="wheel-result" role="status">{room.spin}</p>}<WheelLegend options={q.choices} counts={room.wheelCounts}/><p>The host spins from their phone.</p></div>}
  {room.phase==='round'&&room.stage==='intermission'&&<div className="tv-intermission" role="status" aria-live="polite"><span className="tag">ROUND {room.round} / {room.total}</span><h1>Next question in {left}…</h1><p>Phones ready. Look up at the screen.</p></div>}
  {room.phase==='round'&&room.game!=='wheel'&&room.stage!=='intermission'&&<>
   <div className="tv-score">{ranked.map(p=><div key={p.id}><span>{p.icon} {p.name}</span><strong>{p.score}</strong>{p.waiting&&<small>NEXT ROUND</small>}</div>)}</div>
   <div className="tv-board"><div className="tv-board-head"><div className="tag">ROUND {room.round} / {room.total} · {room.stage==='submit'?'WRITE':room.stage==='vote'?'VOTE':done?'REVEAL':'PICK'}</div><div className={'tv-clock '+(left<=5&&!done?'urgent':'')}>{room.paused?'PAUSED':done?'✓':left}</div></div>
    {room.game==='hot_seat'&&<div className="tv-spotlight">🎤 IN THE HOT SEAT: {room.players.find(p=>p.id===q.spotlight)?.name}</div>}
    {headline&&<div className="tv-answer-headline" role="status">{headline}</div>}
    {room.stage==='submit'&&room.game==='hot_seat'?<h1>{room.players.find(p=>p.id===q.spotlight)?.name} is choosing…</h1>:room.stage==='submit'&&room.game==='bluff'?<h1>Write a believable bluff on your phone.</h1>:<h1>{q.text}</h1>}
    {room.game==='after_dark'&&<div className="tv-note">Sip, smoke break, story, or pass. Always your choice.</div>}
    {room.stage!=='submit'&&q.choices&&<TvOptions room={room}/>}
    {callout&&<p className="tv-callout" role="status">{callout}</p>}
    {done&&room.game==='after_dark'&&q.truth&&<div className="tv-note">Truth prompt: {q.truth}</div>}
    <div className="tv-bottom">{done?'Take a look at the room’s picks':`${room.players.filter(p=>p.answered&&!p.waiting).length} answered · Play from your own phone`}</div>
   </div>
  </>}
  {room.phase==='results'&&room.game==='wheel'&&<div className="tv-results"><div className="tag">🎡 THE WHEEL</div><h1>That's a wrap!</h1>{room.spin&&<h2>LAST PICK: {room.spin}</h2>}<p>Wheel picks are chance; no player wins or loses.</p><WheelLegend options={room.forfeits||[]} counts={room.wheelCounts}/><RoomStandings players={room.players}/>{room.playlistIndex+1<room.playlist.length&&<p>UP NEXT: {GAMES[room.playlist[room.playlistIndex+1]].title}</p>}</div>}
  {room.phase==='results'&&room.game!=='wheel'&&<div className="tv-results"><div className="tag">THAT'S A WRAP</div><h1>FINAL SCORES</h1><Outcome players={room.players} outcome={room.gameOutcome}/><div className="tv-podium">{ranked.map((p,i)=><div key={p.id}><span>{['🥇','🥈','🥉'][i]||'✦'}</span><strong>{p.icon} {p.name}</strong><b>{p.score} PTS</b></div>)}</div><RoomStandings players={room.players}/>{room.playlistIndex+1<room.playlist.length&&<p>UP NEXT: {GAMES[room.playlist[room.playlistIndex+1]].title}</p>}</div>}
  <footer className="tv-footer">PUBLIC GAME SCREEN · ANSWER ON YOUR PHONE · ROOM {code}</footer>
 </main>;
}
