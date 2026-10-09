// Small, deterministic TV copy derived from the public reveal. No extra room state or request.
export function revealCallout(room){
 if(room?.stage!=='reveal'||!room.question||room.game==='after_dark')return null;
 const q=room.question,votes=q.votes||[];
 if(room.game==='trivia'){
  if(!votes.length)return 'Everyone took a pass. Fair enough.';
  const right=votes.filter(v=>v.choice===q.correct).length;
  if(right===votes.length&&votes.length>1)return 'Everyone knew that one!';
  if(right===0)return 'That one fooled the whole room.';
  return 'A few people had it. Nice work.';
 }
 if(room.game==='would_rather'){
  const [a,b]=q.counts||[0,0],total=a+b;
  if(total<2)return null;
  if(a===b)return 'The room is split right down the middle.';
  if(Math.max(a,b)>=total-1&&total>=3)return 'The room has spoken!';
  return 'Some strong opinions in here.';
 }
 if(room.game==='most_likely'){
  const counts=Object.values(q.counts||{}),top=Math.max(0,...counts);
  if(top<2)return null;
  if(counts.filter(n=>n===top).length>1)return 'Even the room couldn’t decide.';
  return 'The room has reached a verdict.';
 }
 if(room.game==='bluff'){
  if(votes.some(v=>q.choices?.[v.choice]?.authorId))return 'Someone fell for a bluff!';
  if(votes.length>1)return 'Nobody fell for it this time.';
 }
 if(room.game==='hot_seat'&&q.correct!==null&&votes.length>0){
  const right=votes.filter(v=>v.choice===q.correct).length;
  return right===votes.length?'They know you too well.':right===0?'You’re a mystery to them.':'Some friends know you better than others.';
 }
 return null;
}
