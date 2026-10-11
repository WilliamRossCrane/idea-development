import { BANKS } from './questions.mjs';
import { MOST_LIKELY, WOULD_RATHER, BLUFF, HOT_SEAT, AFTER_DARK, TRUTH_PROMPTS } from './party-content.mjs';
import { WOULD_RATHER_NSFW } from './after-dark-would-rather.mjs';
import { ICONS, GAMES, PREFERENCES } from './public.mjs';
export const CONTENT={most_likely:MOST_LIKELY,would_rather:WOULD_RATHER,bluff:BLUFF,hot_seat:HOT_SEAT};
const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
export function chooseItems(key,size,count,used={}){
 if(size<count) throw Error('This game needs more prompts.');
 const previous=new Set(used[key]||[]),pool=shuffle(Array.from({length:size},(_,i)=>i).filter(i=>!previous.has(i))),out=[];
 while(out.length<count){if(!pool.length){previous.clear();pool.push(...shuffle(Array.from({length:size},(_,i)=>i).filter(i=>!out.includes(i))));}out.push(pool.shift());}
 used[key]=[...previous,...out];return out;
}
export function validateWheelOptions(options){
 if(!Array.isArray(options)||options.length<2||options.length>12)throw Error('Add 2–12 wheel options.');
 const clean=options.map(v=>String(v).trim().slice(0,90)).filter(Boolean);
 if(clean.length<2||new Set(clean.map(v=>v.toLowerCase())).size!==clean.length)throw Error('Add 2–12 different wheel options.');
 return clean;
}
export function contentKey(s){return s.game==='trivia'?`trivia:${s.deck}`:s.game==='after_dark'?`after_dark:${s.tone}`:s.game==='would_rather'&&s.tone==='unhinged'?'would_rather:unhinged':s.game;}
export function bank(s){const base=s.game==='trivia'?BANKS[s.deck]:s.game==='after_dark'?AFTER_DARK[s.tone]:s.game==='would_rather'&&s.tone==='unhinged'?WOULD_RATHER_NSFW:CONTENT[s.game];return [...base,...(s.custom?.[contentKey(s)]||[])];}
export function item(s){return bank(s)[s.queue[s.index]];}
export function requiresAdult(s){return !!GAMES[s.game]?.adult||(s.game==='would_rather'&&s.tone==='unhinged');}
export function eligible(s,p){return (p.joinAt===undefined||p.joinAt<=s.index)&&(!requiresAdult(s)||p.adultOk);}
export function readyToAdvance(s){if(s.phase!=='round'||!['question','submit','vote'].includes(s.stage)||s.paused)return false;const voters=s.players.filter(p=>eligible(s,p));if(s.stage==='submit'&&['hot_seat','most_likely'].includes(s.game)){const writer=voters.find(p=>p.id===(s.game==='hot_seat'?s.spotlight:s.writer));return !!writer&&(writer.entry!==null||writer.passed);} if(s.stage==='submit')return voters.length>0&&voters.every(p=>p.entry!==null||p.passed);const ballots=s.game==='hot_seat'?voters.filter(p=>p.id!==s.spotlight):voters;return ballots.length>0&&ballots.every(p=>p.answer!==null||p.passed);}
export const revealed=s=>s.phase==='round'&&s.stage==='reveal';
export const points=s=>(s.index+1)%5===0?2:1;
const emptyStats=()=>({games:0,wins:0,losses:0,points:0});
export function finishGame(s){
 if(s.finalized)return;
 s.finalized=true;
 if(s.game==='wheel'){s.gameOutcome=null;return;}
 const players=s.players.filter(p=>p.joinAt===undefined||p.joinAt<=s.index);
 const highest=Math.max(...players.map(p=>p.score)),lowest=Math.min(...players.map(p=>p.score));
 const draw=players.length<2||highest===lowest;
 const winners=draw?[]:players.filter(p=>p.score===highest).map(p=>p.id);
 const losers=draw?[]:players.filter(p=>p.score===lowest).map(p=>p.id);
 s.gameOutcome={draw,winners,losers};
 for(const p of players){p.stats??=emptyStats();p.stats.games++;p.stats.points+=p.score;if(winners.includes(p.id))p.stats.wins++;if(losers.includes(p.id))p.stats.losses++;}
}
export function roundScores(s){
 const score=Object.fromEntries(s.players.map(p=>[p.id,0]));if(!revealed(s))return score;
 if(s.game==='trivia'){for(const p of s.players)if(p.answer===item(s).answer)score[p.id]+=points(s);}
 if(s.game==='bluff'){
  for(const p of s.players){const choice=s.roundOptions?.[p.answer];if(!choice)continue;if(choice.correct)score[p.id]+=2;else if(choice.authorId&&choice.authorId!==p.id)score[choice.authorId]+=1;}
 }
 if(s.game==='hot_seat'){
  if(s.spotlightAnswer!==null){let correct=0;for(const p of s.players){if(p.id===s.spotlight)continue;if(p.answer===s.spotlightAnswer){score[p.id]++;correct++;}}if(correct>0)score[s.spotlight]++;}
 }
 if(['most_likely','after_dark'].includes(s.game))for(const p of s.players)if(p.answer!==null&&score[p.answer]!==undefined)score[p.answer]++;
 if(s.game==='would_rather'){
  const votes=[0,1].map(choice=>s.players.filter(p=>p.answer===choice).length);
  if(votes[0]!==votes[1])for(const p of s.players)if(p.answer===Number(votes[1]>votes[0]))score[p.id]++;
 }
 return score;
}
export function advance(s,now){
 if(s.phase!=='round'||s.stage==='reveal')throw Error('No round to reveal.');
 if(s.stage==='submit'&&s.game==='most_likely'){
  const writer=s.players.find(p=>p.id===s.writer);
  s.livePrompt=typeof writer?.entry==='string'?writer.entry:item(s);
  s.players.forEach(p=>{p.entry=null;p.passed=false;});
  s.stage='question';s.stageStartedAt=now;s.deadline=now+s.pace*1000;return;
 }
 if(s.stage==='submit'&&s.game==='bluff'){
  const real=item(s);const options=[{text:real.correct,correct:true}];const seen=new Set([real.correct.trim().toLowerCase()]);
  for(const p of shuffle(s.players)){const text=String(p.entry||'').trim();if(text&&!seen.has(text.toLowerCase())){options.push({text,authorId:p.id});seen.add(text.toLowerCase());}}
  for(const text of real.decoys)if(options.length<4&&!seen.has(text.toLowerCase())){options.push({text});seen.add(text.toLowerCase());}
  s.roundOptions=shuffle(options);s.stage='vote';s.stageStartedAt=now;s.deadline=now+s.pace*1000;return;
 }
 if(s.stage==='submit'&&s.game==='hot_seat'){
  const hot=s.players.find(p=>p.id===s.spotlight);
  s.spotlightAnswer=Number.isInteger(hot?.entry)?hot.entry:null;
  s.stage=s.spotlightAnswer===null?'reveal':'vote';s.stageStartedAt=now;s.deadline=s.stage==='vote'?now+s.pace*1000:null;return;
 }
 s.stage='reveal';s.stageStartedAt=now;s.deadline=null;
}
export function project(s,actorHash,now=Date.now()){
 const me=s.players.find(p=>p.secretHash===actorHash);
 const current=s.phase==='round'&&s.stage!=='intermission'&&s.game!=='wheel'&&(!me||!requiresAdult(s)||me.adultOk)?item(s):null;
 const bonus=roundScores(s);
 const players=s.players.map(p=>({id:p.id,name:p.name,icon:p.icon,score:p.score+bonus[p.id],stats:p.stats||emptyStats(),answered:!!p.passed||(s.stage==='submit'?p.entry!==null:p.answer!==null),adultOk:p.adultOk,waiting:s.phase==='round'&&!eligible(s,p)}));
 let prompt=null;
 if(current){
  if(s.game==='trivia')prompt={text:current.text,category:current.category,choices:current.options,correct:revealed(s)?current.answer:undefined,points:points(s)};
  if(s.game==='most_likely'||s.game==='after_dark')prompt={text:s.game==='most_likely'&&s.stage==='submit'?`${s.players.find(p=>p.id===s.writer)?.name||'A player'} is writing the prompt…`:s.game==='most_likely'?(s.livePrompt||current):current,writer:s.game==='most_likely'?s.writer:undefined,choices:s.players.map(p=>({id:p.id,label:`${p.icon} ${p.name}`})),counts:revealed(s)?Object.fromEntries(s.players.map(p=>[p.id,s.players.filter(v=>v.answer===p.id).length])):undefined};
  if(s.game==='would_rather')prompt={text:'Which would you rather?',choices:current,counts:revealed(s)?[0,1].map(i=>s.players.filter(p=>p.answer===i).length):undefined};
  if(s.game==='after_dark'&&revealed(s))prompt.truth=TRUTH_PROMPTS[s.tone][s.index%TRUTH_PROMPTS[s.tone].length];
  if(s.game==='bluff')prompt={text:current.prompt,choices:s.stage==='vote'||revealed(s)?s.roundOptions.map(o=>({text:o.text,authorId:revealed(s)?o.authorId:undefined,correct:revealed(s)?!!o.correct:undefined})):null};
  if(s.game==='hot_seat')prompt={text:current[0],choices:current.slice(1),spotlight:s.spotlight,correct:revealed(s)?s.spotlightAnswer:undefined};
  // The TV uses these votes only after reveal. Adult responses remain anonymous.
  if(revealed(s)&&!requiresAdult(s))prompt.votes=s.players.filter(p=>p.answer!==null).map(p=>({id:p.id,choice:p.answer}));
 }
 return {code:s.code,phase:s.phase,stage:s.stage,game:s.game,deck:s.deck,tone:s.tone,adult:requiresAdult(s),playerPrompts:!!s.playerPrompts,length:s.length,pace:s.pace||25,paused:!!s.paused,remaining:s.paused?s.pausedRemaining:null,playlist:s.playlist||[],playlistIndex:s.playlistIndex||0,canUndo:!!s.undo&&now-(s.undoAt||0)<8000,customs:s.phase==='lobby'&&actorHash===s.hostHash?(s.custom||{}):undefined,round:s.index+1,total:s.queue.length,deadline:s.deadline,question:s.game==='wheel'&&s.phase==='round'?{text:'Give it a spin',choices:s.forfeits}:prompt,players,me:me?{id:me.id,answer:me.answer,entry:me.entry,passed:!!me.passed,adultOk:me.adultOk,preference:me.preference,waiting:s.phase==='round'&&!eligible(s,me)}:null,isHost:!!actorHash&&actorHash===s.hostHash,forfeits:s.phase==='lobby'||s.game==='wheel'&&s.phase==='results'?s.forfeits:undefined,spin:s.spin,spinIndex:s.game==='wheel'?s.spinIndex:undefined,spinCount:s.game==='wheel'?s.spinCount:undefined,wheelCounts:s.wheelCounts||{},gameOutcome:s.phase==='results'?s.gameOutcome||null:null,deckCounts:Object.fromEntries(Object.entries(BANKS).map(([k,v])=>[k,v.length])),serverTime:now};
}
export function applyAction(s,a,actorHash,now=Date.now()){
 const host=!!actorHash&&actorHash===s.hostHash,player=s.players.find(p=>p.secretHash===actorHash);
 const requireHost=()=>{if(!host)throw Error('Only the host can do that.');};
 const requirePlayer=()=>{if(!player)throw Error('Join this room first.');};
 switch(a.type){
  case 'join':{
   if(s.players.length>=8)throw Error('Room full (8 players).');
   const name=String(a.name||'').trim().slice(0,24);
   if(!name)throw Error('Enter a name.');if(s.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))throw Error('That name is taken.');
   if(!ICONS.includes(a.icon))throw Error('Pick an icon.');if(!actorHash)throw Error('Session missing.');
   s.players.push({id:a.id,name,icon:a.icon,secretHash:actorHash,score:0,stats:emptyStats(),entry:null,answer:null,passed:false,adultOk:false,preference:'pass',joinAt:s.phase==='round'&&s.game!=='wheel'?s.index+1:0});break;
  }
  case 'preference':
   requirePlayer();if(!PREFERENCES[a.preference])throw Error('Choose a valid option.');player.preference=a.preference;player.adultOk=!!a.adultOk;break;
  case 'select_game':
   requireHost();if(s.phase!=='lobby')throw Error('Finish the current game first.');if(!GAMES[a.game])throw Error('Choose a game.');
   if(a.game!==s.game){s.length=a.game==='trivia'?10:5;if(a.game==='would_rather')s.tone='mild';if(GAMES[a.game].adult)s.players.forEach(p=>p.adultOk=false);}
   if(s.playlist?.[s.playlistIndex]!==a.game){s.playlist=[];s.quickParty=false;}s.game=a.game;break;
  case 'set_tone':
   requireHost();if(s.phase!=='lobby'||s.game!=='would_rather'||!['mild','unhinged'].includes(a.tone))throw Error('Choose a Would You Rather deck in the lobby.');
   if(a.tone==='unhinged'&&s.tone!=='unhinged')s.players.forEach(p=>p.adultOk=false);
   s.tone=a.tone;break;
  case 'quick_party':
   requireHost();if(s.phase!=='lobby')throw Error('Finish the current game first.');
   s.playlist=['trivia','most_likely','would_rather'];s.playlistIndex=0;s.quickParty=true;s.game='trivia';s.deck='general';s.tone='mild';s.length=5;s.pace=15;break;
  case 'quick_start':
   requireHost();if(s.phase!=='lobby')throw Error('Finish the current game first.');
   if(s.players.length<2)throw Error('Wait for another player.');
   applyAction(s,{type:'quick_party'},actorHash,now);
   applyAction(s,{type:'start',game:s.game,deck:s.deck,tone:s.tone,length:s.length,pace:s.pace,forfeits:s.forfeits},actorHash,now);break;
  case 'config':
   requireHost();if(s.phase!=='lobby')throw Error('Finish the current game first.');
   if(!GAMES[a.game]||!['general','one_piece','abbott','superstore'].includes(a.deck))throw Error('Choose a valid game and deck.');
   if(!['mild','messy','unhinged'].includes(a.tone))throw Error('Choose a valid tone.');
   if(![3,5,10,20,30].includes(a.length)||(a.game==='trivia'&&a.length===3)||(a.game!=='trivia'&&a.length>10))throw Error('Choose a valid game length.');
   if(![15,25,35].includes(a.pace))throw Error('Choose a timer speed.');
   const forfeits=validateWheelOptions(a.forfeits);
   if((a.game!==s.game&&GAMES[a.game].adult)||(a.game==='would_rather'&&a.tone==='unhinged'&&(s.game!=='would_rather'||s.tone!=='unhinged')))s.players.forEach(p=>p.adultOk=false);
   s.game=a.game;s.deck=a.deck;s.tone=a.tone;s.length=a.length;s.pace=a.pace;s.forfeits=forfeits;s.playerPrompts=a.game==='most_likely'&&!!a.playerPrompts;break;
  case 'start':{
   requireHost();applyAction(s,{...a,type:'config'},actorHash,now);
   if(s.players.length<2&&s.game!=='wheel')throw Error('Wait for another player.');
   if(requiresAdult(s)&&s.players.some(p=>!p.adultOk))throw Error('Every player must opt in as an adult before starting this deck.');
   s.finalized=false;s.gameOutcome=null;
   if(s.game==='wheel'){
    s.queue=[];s.index=0;s.phase='round';s.stage='wheel';s.deadline=null;s.spin=null;s.spinIndex=null;s.spinCount=0;s.undo=null;s.players.forEach(p=>{p.score=0;p.answer=null;p.entry=null;p.passed=false;});break;
   }
   const key=contentKey(s);
   s.queue=chooseItems(key,bank(s).length,s.length,s.used);s.index=0;s.phase='round';s.spin=null;s.undo=null;s.paused=false;s.players.forEach(p=>{p.score=0;p.answer=null;p.entry=null;p.passed=false;});startRound(s,now);break;
  }
  case 'submit':
   requirePlayer();if(!eligible(s,player))throw Error('You can join from the next round.');if(s.phase!=='round'||s.stage!=='submit'||s.paused||now>=s.deadline)throw Error('Submissions have closed.');
   if(s.game==='hot_seat') {if(player.id!==s.spotlight)throw Error('Only the hot seat player can answer.');if(![0,1].includes(a.choice))throw Error('Choose one option.');player.entry=a.choice;}
   else if(s.game==='most_likely'){if(player.id!==s.writer)throw Error('Wait for the prompt writer.');const prompt=String(a.entry||'').trim().slice(0,140);if(prompt.length<8)throw Error('Write a slightly longer prompt.');player.entry=prompt;}
   else if(s.game==='bluff'){const entry=String(a.entry||'').trim().slice(0,75);if(entry.length<2)throw Error('Write a fake answer.');player.entry=entry;}
   else throw Error('Invalid submission.');player.passed=false;break;
  case 'answer':
   requirePlayer();if(!eligible(s,player))throw Error('You can join from the next round.');if(s.phase!=='round'||!['question','vote'].includes(s.stage)||s.paused||now>=s.deadline)throw Error('Voting has closed.');
   if(s.game==='trivia'&&(!Number.isInteger(a.answer)||a.answer<0||a.answer>3))throw Error('Invalid answer.');
   if(s.game==='would_rather'&&![0,1].includes(a.answer))throw Error('Invalid answer.');
   if(['most_likely','after_dark'].includes(s.game)&&!s.players.some(p=>p.id===a.answer))throw Error('Choose a player.');
   if(s.game==='bluff'&&(!Number.isInteger(a.answer)||a.answer<0||a.answer>=s.roundOptions.length||s.roundOptions[a.answer].censored||s.roundOptions[a.answer].authorId===player.id))throw Error('Pick another answer.');
   if(s.game==='hot_seat'&&(![0,1].includes(a.answer)||player.id===s.spotlight))throw Error('Only other players can guess.');
   player.answer=a.answer;player.passed=false;break;
  case 'pass':
   requirePlayer();if(!eligible(s,player))throw Error('You can join from the next round.');
   if(s.phase!=='round'||!['question','submit','vote'].includes(s.stage)||s.paused||now>=s.deadline)throw Error('This round has closed.');
   if(s.stage==='submit'&&['hot_seat','most_likely'].includes(s.game)&&player.id!==(s.game==='hot_seat'?s.spotlight:s.writer))throw Error('Wait for your turn.');
   if(s.game==='hot_seat'&&s.stage==='vote'&&player.id===s.spotlight)throw Error('Wait for the others to guess.');
   player.passed=true;player.answer=null;player.entry=null;break;
  case 'reveal':
   requireHost();s.paused=false;advance(s,now);break;
  case 'pause':
   requireHost();if(s.phase!=='round'||!['question','submit','vote'].includes(s.stage))throw Error('No timer to pause.');
   if(s.paused){s.paused=false;s.deadline=now+s.pausedRemaining;s.stageStartedAt=now;}else{s.pausedRemaining=Math.max(0,s.deadline-now);s.paused=true;}break;
  case 'extend':
   requireHost();if(s.phase!=='round'||!['question','submit','vote'].includes(s.stage))throw Error('No timer to extend.');if(s.paused)s.pausedRemaining+=10000;else s.deadline+=10000;break;
  case 'censor':
   requireHost();if(s.game!=='bluff'||s.phase!=='round'||s.stage!=='vote'||!Number.isInteger(a.index)||!s.roundOptions?.[a.index])throw Error('Choose a bluff to hide.');
   if(s.roundOptions[a.index].correct)throw Error('Use Skip if the real answer needs hiding.');
   s.roundOptions[a.index]={text:'[Hidden by host]',censored:true};break;
  case 'skip':
   requireHost();if(s.phase!=='round'||s.stage==='intermission'||s.game==='wheel')throw Error('No round to skip.');saveUndo(s,now);s.players.forEach(p=>{p.answer=null;p.entry=null;p.passed=false;});
   if(s.index+1>=s.queue.length){s.phase='results';s.deadline=null;finishGame(s);}else{s.index++;startRound(s,now);}break;
  case 'undo':
   requireHost();if(!s.undo||now-s.undoAt>8000)throw Error('Undo is no longer available.');
   if(s.players.length!==s.undo.players.length||s.players.some((p,i)=>p.id!==s.undo.players[i].id))throw Error('A player joined since that round. Undo is unavailable.');
   if(s.phase==='round'&&s.players.some(p=>p.answer!==null||p.entry!==null||p.passed))throw Error('Someone has already answered this round.');
   {const snapshot=s.undo;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot,{undo:null,undoAt:null});if(s.phase==='round'&&s.stage!=='reveal'&&!s.paused){s.deadline=now+Math.max(10000,(s.pace||25)*1000);s.stageStartedAt=now;}}break;
  case 'tick':
   if(s.phase==='round'&&s.stage==='intermission'&&now>=s.deadline)startRound(s,now);
   else if(s.phase==='round'&&s.stage!=='reveal'&&!s.paused&&((s.deadline!==null&&now>=s.deadline)||(now-(s.stageStartedAt??now)>=1200&&readyToAdvance(s))))advance(s,now);break;
  case 'next':{
   requireHost();if(!revealed(s))throw Error('Reveal the result first.');saveUndo(s,now);const delta=roundScores(s);s.players.forEach(p=>{p.score+=delta[p.id];p.answer=null;p.entry=null;p.passed=false;});
   if(s.index+1>=s.queue.length){s.phase='results';s.deadline=null;finishGame(s);}
   else{s.index++;s.stage='intermission';s.stageStartedAt=now;s.deadline=now+3000;}break;
  }
  case 'end':
   requireHost();if(s.phase!=='round')throw Error('No game to end.');
   if(revealed(s)){const delta=roundScores(s);s.players.forEach(p=>p.score+=delta[p.id]);}
   s.phase='results';s.deadline=null;finishGame(s);break;
  case 'spin':
   requireHost();
   if(s.game==='wheel'&&s.phase==='round'&&s.stage==='wheel'){
    s.spinIndex=Math.floor(Math.random()*s.forfeits.length);s.spin=s.forfeits[s.spinIndex];s.spinCount=(s.spinCount||0)+1;s.wheelCounts??={};s.wheelCounts[s.spin]=(s.wheelCounts[s.spin]||0)+1;s.stage='reveal';break;
   }
   throw Error('Open the wheel game to spin.');
  case 'wheel_reset':
   requireHost();if(s.game!=='wheel'||s.phase!=='round'||s.stage!=='reveal')throw Error('Spin the wheel first.');s.stage='wheel';s.spin=null;s.spinIndex=null;break;
  case 'wheel_options':
   requireHost();if(s.game!=='wheel'||s.phase!=='round')throw Error('Open the wheel game first.');
   s.forfeits=validateWheelOptions(a.options);s.stage='wheel';s.spin=null;s.spinIndex=null;break;
  case 'rematch':
   requireHost();if(s.phase!=='results')throw Error('Finish this game first.');s.phase='lobby';s.stage=null;s.queue=[];s.index=0;s.spin=null;s.deadline=null;s.undo=null;s.players.forEach(p=>{p.score=0;p.answer=null;p.entry=null;p.passed=false;p.joinAt=0;});break;
  case 'playlist':
   requireHost();if(s.phase!=='lobby')throw Error('Choose the playlist in the lobby.');
   if(!Array.isArray(a.games)||a.games.length>3||a.games.some(g=>!GAMES[g]))throw Error('Choose up to three games.');
   s.playlist=a.games;s.playlistIndex=0;s.quickParty=false;if(a.games.length){s.game=a.games[0];s.length=s.game==='trivia'?5:3;if(GAMES[s.game].adult)s.players.forEach(p=>p.adultOk=false);}break;
  case 'next_game':
   requireHost();if(s.phase!=='results'||!s.playlist?.length||s.playlistIndex+1>=s.playlist.length)throw Error('No next game in the playlist.');
   s.playlistIndex++;s.game=s.playlist[s.playlistIndex];if(s.game==='would_rather')s.tone='mild';if(GAMES[s.game].adult)s.players.forEach(p=>p.adultOk=false);
   s.length=s.quickParty?5:s.game==='trivia'?5:3;s.phase='lobby';s.stage=null;s.queue=[];s.index=0;s.spin=null;s.undo=null;s.players.forEach(p=>{p.score=0;p.answer=null;p.entry=null;p.passed=false;p.joinAt=0;});
   if(s.quickParty)applyAction(s,{type:'start',game:s.game,deck:s.deck,tone:s.tone,length:s.length,pace:s.pace,forfeits:s.forfeits},actorHash,now);
   break;
  case 'add_prompt':{
   requireHost();if(s.phase!=='lobby')throw Error('Add prompts before the game.');const key=contentKey(a);
   if(!GAMES[a.game]||a.game==='wheel'||!key||!['general','one_piece','abbott','superstore'].includes(a.deck)||!['mild','messy','unhinged'].includes(a.tone))throw Error('Invalid prompt category.');
   s.custom??={};const list=s.custom[key]??=[];if(list.length>=20)throw Error('Maximum 20 friend prompts per game.');
   const prompt=validatePrompt(a.game,a.prompt);list.push(prompt);s.custom[key]=list;break;
  }
  case 'remove_prompt':{
   requireHost();if(s.phase!=='lobby')throw Error('Finish this game first.');const key=contentKey(a),list=s.custom?.[key]||[];
   if(!Number.isInteger(a.index)||a.index<0||a.index>=list.length)throw Error('Prompt not found.');list.splice(a.index,1);break;
  }
  case 'transfer_host':
   requireHost();if(!s.players.some(p=>p.id===a.target))throw Error('Choose a player in this room.');s.hostHash=s.players.find(p=>p.id===a.target).secretHash;break;
  case 'claim_host':
   requirePlayer();if(!a.recoveryHash||a.recoveryHash!==s.recoveryHash)throw Error('That recovery code did not work.');s.hostHash=actorHash;break;
  default:throw Error('Unknown action.');
 }
 return s;
}
export function startRound(s,now){
 s.players.forEach(p=>{p.answer=null;p.entry=null;p.passed=false;});s.roundOptions=null;s.spotlightAnswer=null;s.livePrompt=null;s.paused=false;s.stageStartedAt=now;
 const active=s.players.filter(p=>eligible(s,p));s.spotlight=s.game==='hot_seat'?(active[s.index%active.length]?.id||null):null;
 s.writer=s.game==='most_likely'&&s.playerPrompts?(active[s.index%active.length]?.id||null):null;
 s.stage=['bluff','hot_seat'].includes(s.game)||s.writer?'submit':'question';
 s.deadline=now+(((s.game==='bluff'&&!s.quickParty)||s.writer?s.pace+10:s.pace)||25)*1000;
}

export function saveUndo(s,now){const snapshot=JSON.parse(JSON.stringify({...s,undo:null,undoAt:null}));s.undo=snapshot;s.undoAt=now;}
export function validatePrompt(game,value){
 const clean=v=>String(v||'').trim().slice(0,140);
 if(game==='trivia'){const text=clean(value?.text),choices=value?.choices?.map(clean),correct=Number(value?.correct);if(text.length<8||choices?.length!==4||choices.some(v=>v.length<2)||new Set(choices.map(v=>v.toLowerCase())).size!==4||!Number.isInteger(correct)||correct<0||correct>3)throw Error('Trivia needs a question, four different answers, and the correct answer.');return {text,category:'Friends',options:choices,answer:correct};}
 if(game==='bluff'){const prompt=clean(value?.text),correct=clean(value?.correct),decoys=value?.decoys?.map(clean);if(prompt.length<8||correct.length<2||decoys?.length!==2||decoys.some(v=>v.length<2))throw Error('Bluff It needs a prompt, a real answer, and two decoys.');return {prompt,correct,decoys};}
 if(game==='would_rather'||game==='hot_seat'){const text=clean(value?.text),choices=value?.choices?.map(clean);if((game==='hot_seat'&&text.length<6)||choices?.length!==2||choices.some(v=>v.length<2))throw Error('Add a prompt and two choices.');return game==='hot_seat'?[text,...choices]:choices;}
 const text=clean(value?.text);if(text.length<8)throw Error('Write a longer prompt.');return text;
}
