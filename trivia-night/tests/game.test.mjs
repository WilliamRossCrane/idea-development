import test from 'node:test';
import assert from 'node:assert/strict';
import { BANKS } from '../lib/questions.mjs';
import { AFTER_DARK, BLUFF, HOT_SEAT, MOST_LIKELY, WOULD_RATHER } from '../lib/party-content.mjs';
import { WOULD_RATHER_NSFW } from '../lib/after-dark-would-rather.mjs';
import {chooseItems,applyAction,project,item} from '../lib/game.mjs';
import {revealCallout} from '../lib/reveal.mjs';
const host='host-hash',other='other-hash',third='third-hash';
const defaults=['Dance','Sing'];
function room(game='trivia'){
 return {code:'ABC234',hostHash:host,recoveryHash:'secret-code-hash',players:[{id:'a',name:'Will',icon:'🦊',secretHash:host,score:0,entry:null,answer:null,adultOk:false,preference:'pass'},{id:'b',name:'Sam',icon:'🐼',secretHash:other,score:0,entry:null,answer:null,adultOk:false,preference:'pass'}],phase:'lobby',stage:null,game,deck:'general',tone:'mild',length:game==='trivia'?10:5,pace:15,forfeits:defaults,used:{},queue:[],index:0,deadline:null,roundOptions:null,spotlight:null,spotlightAnswer:null,spin:null};
}
const settings=(game,length=game==='trivia'?10:5)=>({type:'start',game,length,deck:'general',tone:'mild',pace:15,forfeits:defaults});
test('question content is large, valid, and party collections cover ten rounds',()=>{
 let count=0;for(const bank of Object.values(BANKS)){const seen=new Set();for(const q of bank){count++;assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(!seen.has(q.text.toLowerCase()));seen.add(q.text.toLowerCase());}}assert.equal(count,502);
 for(const collection of [MOST_LIKELY,WOULD_RATHER,WOULD_RATHER_NSFW,BLUFF,HOT_SEAT,...Object.values(AFTER_DARK)])assert.ok(collection.length>=10);
});
test('rotation finishes unused prompts before a fresh cycle',()=>{
 const used={},seen=new Set();for(let j=0;j<3;j++)for(const i of chooseItems('social',MOST_LIKELY.length,10,used)){assert.ok(!seen.has(i));seen.add(i);}assert.equal(seen.size,30);const next=chooseItems('social',MOST_LIKELY.length,10,used);assert.equal(new Set(next).size,10);
});
test('trivia hides answers, scores once, and room returns to game selection',()=>{
 const s=room();applyAction(s,settings('trivia'),host,1000);const correct=item(s).answer;
 assert.equal(project(s,other,1001).question.correct,undefined);
 assert.throws(()=>applyAction(s,{type:'reveal'},other,1100),/host/);
 applyAction(s,{type:'answer',answer:correct},other,1500);
 assert.equal(project(s,host,1500).players[1].answered,true);
 applyAction(s,{type:'tick'},null,26000);assert.equal(s.stage,'reveal');
 assert.equal(project(s,other,26000).question.correct,correct);assert.equal(project(s,other,26000).players[1].score,1);
 applyAction(s,{type:'next'},host,26001);assert.equal(s.players[1].score,1);
 applyAction(s,{type:'end'},host,26002);assert.equal(s.phase,'results');
 assert.throws(()=>applyAction(s,{type:'spin'},host,26003),/wheel game/);
 applyAction(s,{type:'rematch'},host,26004);assert.equal(s.phase,'lobby');assert.equal(s.players.length,2);assert.equal(s.players[1].score,0);
 applyAction(s,{type:'select_game',game:'would_rather'},host,26005);assert.equal(s.game,'would_rather');
});
test('social votes remain private until reveal and players carry over',()=>{
 const s=room('most_likely');applyAction(s,settings('most_likely'),host,0);
 applyAction(s,{type:'answer',answer:'a'},other,100);
 assert.equal(project(s,host,100).question.counts,undefined);
 applyAction(s,{type:'reveal'},host,200);
 assert.equal(project(s,host,200).question.counts.a,1);
 applyAction(s,{type:'next'},host,300);assert.equal(s.players.length,2);
});
test('bluffs are anonymous before reveal and score fake votes',()=>{
 const s=room('bluff');applyAction(s,settings('bluff'),host,0);
 applyAction(s,{type:'submit',entry:'Plumfish'},host,100);
 applyAction(s,{type:'submit',entry:'Moonberry'},other,150);
 assert.equal(project(s,other,150).question.choices,null);
 applyAction(s,{type:'reveal'},host,200);assert.equal(s.stage,'vote');
 const fake=s.roundOptions.findIndex(o=>o.authorId==='a');
 assert.ok(fake>=0);assert.equal(project(s,other,201).question.choices[fake].authorId,undefined);
 assert.throws(()=>applyAction(s,{type:'answer',answer:fake},host,202),/another answer/);
 applyAction(s,{type:'answer',answer:fake},other,210);
 applyAction(s,{type:'reveal'},host,300);assert.equal(project(s,other,300).question.choices[fake].authorId,'a');
 assert.equal(project(s,host,300).players[0].score,1);
 applyAction(s,{type:'next'},host,310);assert.equal(s.players[0].score,1);
});
test('Hot Seat hides the player choice until other players guess',()=>{
 const s=room('hot_seat');applyAction(s,settings('hot_seat'),host,0);
 assert.equal(s.spotlight,'a');applyAction(s,{type:'submit',choice:1},host,100);
 assert.equal(project(s,other,101).question.correct,undefined);
 applyAction(s,{type:'reveal'},host,200);assert.equal(s.stage,'vote');
 assert.throws(()=>applyAction(s,{type:'answer',answer:1},host,250),/other players/);
 applyAction(s,{type:'answer',answer:1},other,250);
 applyAction(s,{type:'tick'},null,25200);assert.equal(project(s,other,25200).question.correct,1);
 assert.equal(project(s,host,25200).players[0].score,1);assert.equal(project(s,host,25200).players[1].score,1);
});
test('After Dark needs all players to opt in; host can be transferred or recovered',()=>{
 const s=room('after_dark');assert.throws(()=>applyAction(s,settings('after_dark'),host,0),/opt in/);
 applyAction(s,{type:'preference',adultOk:true,preference:'sip'},host,10);
 applyAction(s,{type:'preference',adultOk:true,preference:'pass'},other,10);
 applyAction(s,settings('after_dark'),host,20);assert.equal(s.phase,'round');
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,25);
 assert.equal(project(s,third,26).me.waiting,true);
 assert.throws(()=>applyAction(s,{type:'answer',answer:'a'},third,27),/next round/);
 applyAction(s,{type:'transfer_host',target:'b'},host,40);
 assert.equal(project(s,other,41).isHost,true);
 assert.throws(()=>applyAction(s,{type:'reveal'},host,41),/host/);
 applyAction(s,{type:'claim_host',recoveryHash:'secret-code-hash'},host,50);
 assert.equal(project(s,host,51).isHost,true);
});

test('Crazy NSFW Would You Rather requires adult opt in and keeps names off the public vote',()=>{
 const s=room('would_rather');applyAction(s,{type:'set_tone',tone:'unhinged'},host,1);
 assert.equal(project(s,other,2).adult,true);
 assert.throws(()=>applyAction(s,{...settings('would_rather'),tone:'unhinged'},host,3),/opt in/);
 for(const actor of [host,other])applyAction(s,{type:'preference',adultOk:true,preference:'pass'},actor,4);
 applyAction(s,{...settings('would_rather'),tone:'unhinged'},host,5);
 assert.ok(WOULD_RATHER_NSFW.some(pair=>pair[0]===item(s)[0]));
 applyAction(s,{type:'answer',answer:0},host,6);assert.equal(project(s,null,7).question.counts,undefined);
 applyAction(s,{type:'reveal'},host,8);assert.equal(project(s,null,9).question.votes,undefined);
 assert.deepEqual(project(s,null,9).question.counts,[1,0]);
});
test('one room can complete every game in sequence without a new join',()=>{
 const s=room();let clock=1000;
 for(const game of ['trivia','most_likely','bluff','hot_seat','would_rather','after_dark']){
  if(game==='after_dark'){
   applyAction(s,{type:'select_game',game},host,clock++);
   for(const actor of [host,other])applyAction(s,{type:'preference',adultOk:true,preference:'pass'},actor,clock++);
  }
  applyAction(s,settings(game),host,clock++);
  for(let i=0;i<s.queue.length;i++){
   if(s.stage==='intermission'){const begins=s.deadline;applyAction(s,{type:'tick'},null,begins);clock=Math.max(clock,begins+1);}
   if(s.stage==='submit'){
    if(game==='bluff')applyAction(s,{type:'submit',entry:`Fake ${i}`},host,clock++);
    if(game==='hot_seat')applyAction(s,{type:'submit',choice:i%2},s.players.find(p=>p.id===s.spotlight).secretHash,clock++);
    applyAction(s,{type:'reveal'},host,clock++);
   }
   if(s.stage==='question'||s.stage==='vote')applyAction(s,{type:'reveal'},host,clock++);
   assert.equal(s.stage,'reveal');applyAction(s,{type:'next'},host,clock++);
  }
  assert.equal(s.phase,'results');applyAction(s,{type:'rematch'},host,clock++);
  assert.equal(s.phase,'lobby');assert.deepEqual(s.players.map(p=>p.name),['Will','Sam']);
 }
});
test('changing between adult games requires a new opt in',()=>{
 const s=room('would_rather');applyAction(s,{type:'set_tone',tone:'unhinged'},host,1);
 for(const actor of [host,other])applyAction(s,{type:'preference',adultOk:true,preference:'pass'},actor,10);
 applyAction(s,{type:'select_game',game:'after_dark'},host,11);
 assert.ok(s.players.every(p=>!p.adultOk));
 assert.throws(()=>applyAction(s,settings('after_dark'),host,12),/opt in/);
});
test('fast rounds advance when eligible players answer, and pause really stops the clock',()=>{
 const s=room('trivia');applyAction(s,{...settings('trivia',5),pace:15},host,1000);
 assert.equal(s.deadline,16000);
 const correct=item(s).answer;
 applyAction(s,{type:'answer',answer:correct},host,2000);
 applyAction(s,{type:'answer',answer:correct},other,2100);
 applyAction(s,{type:'tick'},null,2200);assert.equal(s.stage,'reveal');
 applyAction(s,{type:'next'},host,2300);
 assert.equal(s.stage,'intermission');assert.equal(project(s,null,2400).question,null);
 applyAction(s,{type:'tick'},null,5300);assert.equal(s.stage,'question');
 applyAction(s,{type:'pause'},host,5400);const frozen=s.pausedRemaining;
 applyAction(s,{type:'tick'},null,90000);assert.equal(s.stage,'question');
 applyAction(s,{type:'extend'},host,90100);assert.equal(s.pausedRemaining,frozen+10000);
 applyAction(s,{type:'pause'},host,90200);assert.equal(s.deadline,90200+frozen+10000);
});
test('late players can join now and vote starting on the next round',()=>{
 const s=room('most_likely');applyAction(s,{...settings('most_likely',3),pace:15},host,0);
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,100);
 assert.equal(project(s,third,101).me.waiting,true);
 assert.throws(()=>applyAction(s,{type:'answer',answer:'a'},third,102),/next round/);
 applyAction(s,{type:'answer',answer:'a'},host,200);
 applyAction(s,{type:'answer',answer:'a'},other,300);
 applyAction(s,{type:'tick'},null,1500);assert.equal(s.stage,'reveal');
 applyAction(s,{type:'next'},host,1600);assert.equal(project(s,third,1601).me.waiting,false);
 applyAction(s,{type:'tick'},null,4600);
 applyAction(s,{type:'answer',answer:'b'},third,4700);assert.equal(s.players[2].answer,'b');
});
test('a playlist advances to the next game while retaining everyone, and adult consent resets',()=>{
 const s=room();applyAction(s,{type:'playlist',games:['trivia','bluff','after_dark']},host,0);
 assert.equal(s.length,5);applyAction(s,{...settings('trivia',5),pace:15},host,1);
 applyAction(s,{type:'end'},host,2);applyAction(s,{type:'next_game'},host,3);
 assert.equal(s.game,'bluff');assert.equal(s.phase,'lobby');assert.equal(s.players.length,2);
 applyAction(s,{type:'preference',adultOk:true,preference:'pass'},host,4);
 applyAction(s,{type:'preference',adultOk:true,preference:'pass'},other,4);
 applyAction(s,{...settings('bluff',3),pace:15},host,5);applyAction(s,{type:'end'},host,6);
 applyAction(s,{type:'next_game'},host,7);assert.equal(s.game,'after_dark');assert.ok(s.players.every(p=>!p.adultOk));
});
test('host can skip, undo before votes, and hide a submitted fake',()=>{
 const s=room('bluff');applyAction(s,{...settings('bluff',3),pace:15},host,0);
 const original=item(s).prompt;applyAction(s,{type:'skip'},host,100);
 assert.notEqual(item(s).prompt,original);applyAction(s,{type:'undo'},host,200);
 assert.equal(item(s).prompt,original);
 applyAction(s,{type:'submit',entry:'Plumfish'},host,300);
 applyAction(s,{type:'reveal'},host,400);
 const ix=s.roundOptions.findIndex(o=>o.authorId==='a');
 assert.ok(ix>=0);applyAction(s,{type:'censor',index:ix},host,500);
 assert.equal(s.roundOptions[ix].text,'[Hidden by host]');
 assert.throws(()=>applyAction(s,{type:'answer',answer:ix},host,501),/another answer|Voting has closed/);
});
test('friend prompts validate and stay only in their selected game',()=>{
 const s=room();const trivia={text:'Who lost their keys on the group holiday?',choices:['Alex','Jamie','Sam','Will'],correct:2};
 applyAction(s,{type:'add_prompt',game:'trivia',deck:'general',tone:'mild',prompt:trivia},host,0);
 assert.equal(s.custom['trivia:general'].length,1);
 assert.equal(project(s,other,1).customs,undefined);
 assert.equal(project(s,host,1).customs['trivia:general'].length,1);
 assert.throws(()=>applyAction(s,{type:'add_prompt',game:'trivia',deck:'general',tone:'mild',prompt:{...trivia,choices:['Same','Same','No','Yes']}},host,2),/four different/);
 applyAction(s,{type:'remove_prompt',game:'trivia',deck:'general',tone:'mild',index:0},host,3);
 assert.equal(s.custom['trivia:general'].length,0);
});
test('public TV projection exposes no phone session, host recovery code or unrevealed answer',()=>{
 const s=room();s.recoveryHash='private-recovery-hash';applyAction(s,{...settings('trivia',5),pace:15},host,0);
 const publicView=project(s,null,1);assert.equal(publicView.me,null);assert.equal(publicView.isHost,false);
 assert.equal(publicView.question.correct,undefined);assert.ok(!JSON.stringify(publicView).includes('private-recovery-hash'));
});
test('undo cannot erase a friend who joined after a skipped question',()=>{
 const s=room();applyAction(s,{...settings('trivia',5),pace:15},host,0);
 applyAction(s,{type:'skip'},host,100);
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,200);
 assert.throws(()=>applyAction(s,{type:'undo'},host,300),/player joined/);
 assert.equal(s.players.length,3);
});
test('passing locks in a round, can be changed, and never awards points',()=>{
 const s=room();applyAction(s,{...settings('trivia',5),pace:15},host,0);
 const correct=item(s).answer;
 applyAction(s,{type:'pass'},host,100);assert.equal(project(s,host,101).me.passed,true);
 applyAction(s,{type:'answer',answer:correct},host,200);assert.equal(project(s,host,201).me.passed,false);
 applyAction(s,{type:'pass'},other,300);assert.equal(project(s,other,301).players[1].answered,true);
 applyAction(s,{type:'tick'},null,1500);assert.equal(s.stage,'reveal');
 assert.equal(project(s,other,1501).players[1].score,0);assert.equal(project(s,host,1501).players[0].score,1);
});
test('passing a Hot Seat choice reveals without guessing the choice',()=>{
 const s=room('hot_seat');applyAction(s,{...settings('hot_seat',3),pace:15},host,0);
 applyAction(s,{type:'pass'},host,100);applyAction(s,{type:'tick'},null,1500);
 assert.equal(s.stage,'reveal');assert.equal(project(s,other,1501).question.correct,null);
});
test('Quick Party configures all three short games in one action and carries five rounds forward',()=>{
 const s=room('after_dark');
 assert.throws(()=>applyAction(s,{type:'quick_party'},other,0),/host/);
 applyAction(s,{type:'quick_party'},host,1);
 assert.deepEqual(s.playlist,['trivia','most_likely','would_rather']);
 assert.equal(s.game,'trivia');assert.equal(s.length,5);assert.equal(s.pace,15);assert.equal(s.deck,'general');
 applyAction(s,settings('trivia',5),host,2);
 applyAction(s,{type:'end'},host,3);
 applyAction(s,{type:'next_game'},host,4);assert.equal(s.game,'most_likely');assert.equal(s.length,5);assert.equal(s.pace,15);assert.equal(s.phase,'round');
 assert.equal(s.deadline,15004);
 applyAction(s,{type:'end'},host,6);applyAction(s,{type:'next_game'},host,7);
 assert.equal(s.game,'would_rather');assert.equal(s.length,5);assert.equal(s.phase,'round');assert.equal(s.deadline,15007);
});
test('Quick Party starts in one host action only when two people are in the room',()=>{
 const s=room();assert.throws(()=>applyAction(s,{type:'quick_start'},other,0),/host/);
 s.players.pop();assert.throws(()=>applyAction(s,{type:'quick_start'},host,1),/another player/);
 assert.equal(s.phase,'lobby');assert.equal(s.playlist,undefined);
 s.players.push({id:'b',name:'Sam',icon:'🐼',secretHash:other,score:0,entry:null,answer:null,adultOk:false,preference:'pass'});
 applyAction(s,{type:'quick_start'},host,2);
 assert.equal(s.phase,'round');assert.equal(s.stage,'question');assert.equal(s.queue.length,5);
 assert.deepEqual(s.playlist,['trivia','most_likely','would_rather']);assert.equal(s.deadline,15002);
});
test('TV callouts use revealed results without naming adult voters',()=>{
 assert.equal(revealCallout({game:'would_rather',stage:'question',question:{counts:[2,2]}}),null);
 assert.match(revealCallout({game:'would_rather',stage:'reveal',question:{counts:[2,2]}}),/split/);
 assert.match(revealCallout({game:'trivia',stage:'reveal',question:{correct:0,votes:[{choice:1},{choice:2}]}}),/fooled/);
 assert.equal(revealCallout({game:'after_dark',stage:'reveal',question:{counts:[2,2]}}),null);
});
test('TV receives named picks only after reveal, while adult choices stay anonymous',()=>{
 const s=room('trivia');applyAction(s,{...settings('trivia',5),pace:15},host,0);
 const answer=item(s).answer;applyAction(s,{type:'answer',answer},host,100);
 assert.equal(project(s,null,101).question.votes,undefined);
 applyAction(s,{type:'reveal'},host,200);
 assert.deepEqual(project(s,null,201).question.votes,[{id:'a',choice:answer}]);
 const adult=room('would_rather');applyAction(adult,{type:'set_tone',tone:'unhinged'},host,0);
 for(const actor of [host,other])applyAction(adult,{type:'preference',adultOk:true,preference:'pass'},actor,0);
 applyAction(adult,{...settings('would_rather'),tone:'unhinged'},host,10);
 applyAction(adult,{type:'answer',answer:0},host,20);
 applyAction(adult,{type:'reveal'},host,30);
 assert.equal(project(adult,null,31).question.votes,undefined);
});
test('removed Sip or Skip and standalone wheel spins custom options for the whole room',()=>{
 const s=room('wheel');s.players.pop();
 assert.throws(()=>applyAction(s,settings('sip_or_skip'),host,0),/valid game/);
 applyAction(s,{...settings('wheel'),forfeits:['A dance','Tell a story','Choose the song']},host,10);
 assert.equal(s.stage,'wheel');assert.equal(s.deadline,null);assert.deepEqual(project(s,null,11).question.choices,['A dance','Tell a story','Choose the song']);
 assert.throws(()=>applyAction(s,{type:'spin'},other,12),/host/);
 applyAction(s,{type:'spin'},host,13);assert.ok(s.forfeits.includes(s.spin));
 assert.equal(project(s,null,14).spin,project(s,host,14).spin);assert.equal(s.spinCount,1);
 applyAction(s,{type:'wheel_reset'},host,15);assert.equal(s.stage,'wheel');
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,16);assert.equal(project(s,third,17).me.waiting,false);
 applyAction(s,{type:'spin'},host,18);assert.equal(s.spinCount,2);
 assert.throws(()=>applyAction(s,{type:'wheel_options',options:['Same','same']},host,19),/different/);
 applyAction(s,{type:'wheel_options',options:['Sing','Dance']},host,20);
 assert.equal(s.stage,'wheel');assert.deepEqual(project(s,third,21).question.choices,['Sing','Dance']);
 applyAction(s,{type:'spin'},host,22);assert.ok(['Sing','Dance'].includes(s.spin));
 applyAction(s,{type:'end'},host,23);assert.equal(s.phase,'results');
});
test('player-written Who’s Most Likely prompts rotate and stay hidden until submitted',()=>{
 const s=room('most_likely');applyAction(s,{...settings('most_likely',3),playerPrompts:true},host,0);
 assert.equal(s.stage,'submit');assert.equal(s.writer,'a');
 assert.match(project(s,null,1).question.text,/writing/);
 assert.throws(()=>applyAction(s,{type:'submit',entry:'Who will eat all the snacks?'},other,2),/writer/);
 applyAction(s,{type:'submit',entry:'Who will eat all the snacks?'},host,3);
 assert.ok(!JSON.stringify(project(s,null,4)).includes('Who will eat all the snacks?'));
 applyAction(s,{type:'tick'},null,1300);assert.equal(s.stage,'question');assert.equal(project(s,null,1301).question.text,'Who will eat all the snacks?');
 assert.equal(project(s,host,1301).me.entry,null);
 applyAction(s,{type:'answer',answer:'b'},host,1400);applyAction(s,{type:'answer',answer:'a'},other,1500);
 applyAction(s,{type:'tick'},null,2600);assert.equal(s.stage,'reveal');
 applyAction(s,{type:'next'},host,2700);applyAction(s,{type:'tick'},null,5700);
 assert.equal(s.stage,'submit');assert.equal(s.writer,'b');
 applyAction(s,{type:'pass'},other,5800);applyAction(s,{type:'tick'},null,7000);
 assert.equal(s.stage,'question');assert.equal(project(s,null,7001).question.text,item(s));
});
test('wheel can sit in a playlist and return to the same players for the next game',()=>{
 const s=room();applyAction(s,{type:'playlist',games:['wheel','trivia']},host,0);
 applyAction(s,{...settings('wheel',3),forfeits:['A','B']},host,1);
 applyAction(s,{type:'spin'},host,2);applyAction(s,{type:'end'},host,3);
 applyAction(s,{type:'next_game'},host,4);
 assert.equal(s.phase,'lobby');assert.equal(s.game,'trivia');assert.deepEqual(s.players.map(p=>p.name),['Will','Sam']);
});
test('a late adult opt-out hides the NSFW prompt on that phone',()=>{
 const s=room('would_rather');applyAction(s,{type:'set_tone',tone:'unhinged'},host,0);
 for(const actor of [host,other])applyAction(s,{type:'preference',adultOk:true,preference:'pass'},actor,1);
 applyAction(s,{...settings('would_rather'),tone:'unhinged'},host,2);
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,3);
 assert.equal(project(s,third,4).question,null);
 assert.ok(project(s,null,4).question.choices.length===2);
});
test('Most Likely nominations award points and room wins survive game switches',()=>{
 const s=room('most_likely');applyAction(s,settings('most_likely',3),host,0);
 applyAction(s,{type:'answer',answer:'b'},host,10);applyAction(s,{type:'answer',answer:'b'},other,11);
 applyAction(s,{type:'reveal'},host,20);
 assert.equal(project(s,host,21).players[1].score,2);
 applyAction(s,{type:'end'},host,22);
 assert.deepEqual(project(s,null,23).gameOutcome,{draw:false,winners:['b'],losers:['a']});
 assert.deepEqual(s.players.map(p=>p.stats.wins),[0,1]);assert.deepEqual(s.players.map(p=>p.stats.losses),[1,0]);
 applyAction(s,{type:'rematch'},host,24);assert.deepEqual(s.players.map(p=>p.stats.points),[0,2]);
 applyAction(s,settings('trivia',5),host,25);applyAction(s,{type:'end'},host,26);
 assert.equal(project(s,null,27).gameOutcome.draw,true);
 assert.deepEqual(s.players.map(p=>p.stats.games),[2,2]);assert.deepEqual(s.players.map(p=>p.stats.wins),[0,1]);
});
test('Would You Rather awards the majority, ties draw, and finalization happens once',()=>{
 const s=room('would_rather');applyAction(s,settings('would_rather',3),host,0);
 applyAction(s,{type:'answer',answer:0},host,10);applyAction(s,{type:'answer',answer:0},other,11);
 applyAction(s,{type:'reveal'},host,20);assert.deepEqual(project(s,null,21).players.map(p=>p.score),[1,1]);
 applyAction(s,{type:'end'},host,22);assert.equal(s.gameOutcome.draw,true);
 assert.deepEqual(s.players.map(p=>p.stats.points),[1,1]);
 assert.throws(()=>applyAction(s,{type:'end'},host,23),/No game/);
 assert.deepEqual(s.players.map(p=>p.stats.games),[1,1]);
});
test('late joiners do not receive a result for a game they missed',()=>{
 const s=room();applyAction(s,settings('trivia',5),host,0);
 applyAction(s,{type:'join',id:'c',name:'Lee',icon:'🐙'},third,10);
 applyAction(s,{type:'answer',answer:item(s).answer},host,11);
 applyAction(s,{type:'reveal'},host,20);applyAction(s,{type:'end'},host,21);
 assert.equal(s.players[2].stats.games,0);assert.equal(s.players[2].stats.losses,0);
 assert.deepEqual(s.gameOutcome,{draw:false,winners:['a'],losers:['b']});
});
test('wheel counts are retained across repeat spins and games without assigning losses',()=>{
 const s=room('wheel');applyAction(s,settings('wheel'),host,0);
 applyAction(s,{type:'spin'},host,10);const picked=s.spin;
 applyAction(s,{type:'wheel_reset'},host,11);applyAction(s,{type:'spin'},host,12);
 assert.equal(Object.values(project(s,null,13).wheelCounts).reduce((a,b)=>a+b,0),2);
 applyAction(s,{type:'end'},host,14);assert.equal(s.gameOutcome,null);
 assert.equal(project(s,null,14).players[0].stats.games,0);
 applyAction(s,{type:'rematch'},host,15);assert.ok(project(s,null,16).wheelCounts[picked]>=1);
});
