export function orderedPlayers(players){return [...players].sort((a,b)=>b.stats.wins-a.stats.wins||b.stats.points-a.stats.points||a.name.localeCompare(b.name));}

export function RoomStandings({players}){
 return <div className="room-standings"><h2>🏆 Room leaderboard</h2><p>Wins and losses carry across games in this room.</p><div className="standings-list">{orderedPlayers(players).map((p,i)=><div className="standings-row" key={p.id}><span className="standings-place">{i+1}.</span><strong>{p.icon} {p.name}</strong><span>{p.stats.wins} W · {p.stats.losses} L</span><small>{p.stats.points} pts</small></div>)}</div></div>;
}

export function Outcome({players,outcome}){
 if(!outcome)return null;
 const names=ids=>players.filter(p=>ids.includes(p.id)).map(p=>`${p.icon} ${p.name}`).join(' & ');
 return <div className="game-outcome" role="status"><strong>{outcome.draw?'🤝 It’s a draw!':`🏆 Winner${outcome.winners.length>1?'s':''}: ${names(outcome.winners)}`}</strong>{!outcome.draw&&<span>Last place: {names(outcome.losers)}</span>}</div>;
}
