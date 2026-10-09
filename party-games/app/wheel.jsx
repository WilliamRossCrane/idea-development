const COLORS=['#fce446','#fd629f','#65e9cf','#ae9aff','#ffad67','#82b9ff'];

export default function WheelDisplay({options=[],spinIndex=null,spinCount=0}){
 const sector=360/Math.max(1,options.length);
 const gradient=`conic-gradient(${options.map((_,i)=>`${COLORS[i%COLORS.length]} ${i*sector}deg ${(i+1)*sector}deg`).join(',')})`;
 const turn=spinIndex===null?0:1800-(spinIndex+.5)*sector;
 return <div className="party-wheel" role="img" aria-label={spinIndex===null?'Custom wheel ready to spin':`Wheel landed on ${options[spinIndex]}`}>
  <div className="wheel-pointer" aria-hidden="true">▼</div>
  <div key={spinCount} className={'wheel-disc '+(spinIndex!==null?'rolling':'')} style={{background:gradient,'--wheel-turn':`${turn}deg`}}>
   {options.map((option,i)=><span className="wheel-slice-label" key={i} style={{transform:`rotate(${(i+.5)*sector}deg) translateY(-110px) rotate(-${(i+.5)*sector}deg)`}}>{options.length>8?i+1:option.slice(0,15)}</span>)}
   <span className="wheel-hub" aria-hidden="true">🎡</span>
  </div>
 </div>;
}
export function WheelLegend({options=[],counts={}}){
 return <div className="wheel-legend">{options.map((option,i)=><div key={i}><span style={{background:COLORS[i%COLORS.length]}}>{i+1}</span><strong>{option}</strong><small>{counts[option]||0} landed</small></div>)}</div>;
}
