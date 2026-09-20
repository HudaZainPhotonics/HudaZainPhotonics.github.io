(()=>{
const NS="http://www.w3.org/2000/svg";
const $=id=>document.getElementById(id);
const loc=$("loc"),couple=$("couple"),gaugeLen=$("gaugeLen"),traceCount=$("traceCount");
function E(tag,a,p){const e=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(p)p.appendChild(e);return e}
function txt(p,x,y,t,a={}){const e=E("text",{x,y,"font-size":a.size||11,fill:a.fill||"#666","text-anchor":a.anchor||"start",...a},p);e.textContent=t;return e}
function clear(p){while(p.firstChild)p.removeChild(p.firstChild)}
function strain(x,t,x0,C,Lg){
  const sigma=25, n=17;
  let sum=0;
  for(let j=0;j<n;j++){
    const xx=x-Lg/2+Lg*j/(n-1);
    const envelope=Math.exp(-0.5*((xx-x0)/sigma)**2);
    const phase=2*Math.PI*(0.72*t)+(xx-x0)/38;
    sum += C*envelope*Math.sin(phase);
  }
  return sum/n;
}
function data(){
  const x0=+loc.value,C=+couple.value/100,Lg=+gaugeLen.value;
  const traces=10,nx=181,A=[];
  for(let k=0;k<traces;k++){
    const t=k/(traces-1);
    const row=[];
    for(let i=0;i<nx;i++)row.push(strain(1000*i/(nx-1),t,x0,C,Lg));
    A.push(row);
  }
  return {A,x0,C,Lg,nx,traces};
}
function drawScene(d){
  const cy=35+360*d.x0/1000, shiftY=cy-180;
  $("event").setAttribute("transform",`translate(0 ${shiftY})`);
  ["waveA","waveB","waveC"].forEach((id,i)=>{
    $(id).setAttribute("opacity",(.18+.82*d.C).toFixed(2));
    $(id).setAttribute("stroke-width",(1.5+d.C*(1.3+i*.45)).toFixed(2));
  });
  const gh=Math.max(10,360*d.Lg/1000);
  $("gaugeRect").setAttribute("y",cy-gh/2);$("gaugeRect").setAttribute("height",gh);
  $("gaugeLine").setAttribute("y1",cy-gh/2);$("gaugeLine").setAttribute("y2",cy+gh/2);
  $("capL").setAttribute("y1",cy-gh/2);$("capL").setAttribute("y2",cy-gh/2);
  $("capR").setAttribute("y1",cy+gh/2);$("capR").setAttribute("y2",cy+gh/2);
  $("gaugeText").setAttribute("y",cy+5);$("gaugeText").textContent=`Lg = ${d.Lg} m`;
}
function drawStack(d){
  const s=$("traceStack");clear(s);
  const W=600,H=310,L=32,R=12,B=28,baseY=H-B,usable=470,dx=82,dy=185,shown=+traceCount.value;
  // pseudo-3D floor
  E("polygon",{points:`${L},${baseY} ${L+usable},${baseY} ${L+usable+dx},${baseY-dy} ${L+dx},${baseY-dy}`,fill:"#f7f8f9",stroke:"#dfe3e6"},s);
  [0,.25,.5,.75,1].forEach(fr=>E("line",{x1:L+usable*fr,y1:baseY,x2:L+usable*fr+dx,y2:baseY-dy,stroke:"#e1e5e8"},s));
  for(let k=0;k<10;k++){let f=k/9;E("line",{x1:L+dx*f,y1:baseY-dy*f,x2:L+usable+dx*f,y2:baseY-dy*f,stroke:"#e1e5e8"},s)}
  // gauge window projected through depth
  const gx1=L+usable*Math.max(0,d.x0-d.Lg/2)/1000, gx2=L+usable*Math.min(1000,d.x0+d.Lg/2)/1000;
  E("polygon",{points:`${gx1},${baseY} ${gx2},${baseY} ${gx2+dx},${baseY-dy} ${gx1+dx},${baseY-dy}`,fill:"#0076a8",opacity:".16"},s);
  txt(s,(gx1+gx2)/2+dx,baseY-dy-5,`Gauge window, Lg = ${d.Lg} m`,{anchor:"middle",fill:"#0076a8",size:10});
  // traces
  for(let k=0;k<shown;k++){
    const f=k/9,ox=dx*f,oy=-dy*f,row=d.A[k];let path="";
    row.forEach((v,i)=>{const px=L+ox+usable*i/(row.length-1),py=baseY+oy-v*30;path+=(i?"L":"M")+px.toFixed(1)+" "+py.toFixed(1)+" "});
    E("path",{d:path,fill:"none",stroke:"#c65d4b","stroke-width":1.5+f*.8,opacity:.48+f*.48},s);
  }
  // axes
  E("line",{x1:L,y1:baseY,x2:L+usable,y2:baseY,stroke:"#555","stroke-width":"1.4"},s);
  E("line",{x1:L,y1:baseY,x2:L+dx,y2:baseY-dy,stroke:"#555","stroke-width":"1.4"},s);
  txt(s,L+usable/2,H-5,"Fast time → distance, x",{anchor:"middle",fill:"#333",size:14});
  txt(s,L+dx+5,baseY-dy-5,"Slow time →",{fill:"#333",size:14});
  txt(s,L+dx+5,baseY-dy+10,"successive pulses",{fill:"#333",size:14});
  txt(s,L-7,baseY+4,"trace 1",{anchor:"end",size:12});
  txt(s,L+dx-7,baseY-dy+4,"trace 10",{anchor:"end",size:12});
}
function drawMap(d){
  const s=$("map");clear(s);const W=1080,H=330,L=48,R=12,T=8,B=30,nx=120,ny=10,cw=(W-L-R)/nx,ch=(H-T-B)/ny;
  const shown=+traceCount.value;
  for(let k=0;k<ny;k++)for(let i=0;i<nx;i++){
    const src=Math.round(i*(d.nx-1)/(nx-1)),v=d.A[k][src],a=Math.min(.95,Math.abs(v)/.75);
    const fill = k < shown ? (v>=0?`rgba(198,93,75,${.04+a})`:`rgba(52,111,158,${.04+a})`) : "#f3f5f6";
    E("rect",{x:L+i*cw,y:T+k*ch,width:cw+.5,height:ch+.5,fill},s);
  }
  E("line",{x1:L,y1:H-B,x2:W-R,y2:H-B,stroke:"#888"},s);E("line",{x1:L,y1:T,x2:L,y2:H-B,stroke:"#888"},s);
  [0,250,500,750,1000].forEach(v=>txt(s,L+(W-L-R)*v/1000,H-B+18,String(v),{anchor:"middle",size:12}));
  for(let k=0;k<10;k+=3)txt(s,L-8,T+(k+.5)*ch,String(k+1),{anchor:"end",size:12});
  txt(s,W/2,H-4,"SPACE  →  distance, x (m)",{anchor:"middle",size:14,fill:"#25292d","font-weight":"600"});
  const y=txt(s,12,H/2,"TIME  t  →  successive traces",{anchor:"middle",size:14,fill:"#25292d","font-weight":"600"});y.setAttribute("transform",`rotate(-90 12 ${H/2})`);
  const ex=L+(W-L-R)*d.x0/1000;E("line",{x1:ex,y1:T,x2:ex,y2:H-B,stroke:"#0076a8","stroke-width":"1.2","stroke-dasharray":"5 4"},s);
}


const p3th=$("p3th"),p3inst=$("p3inst");
function drawP3(){
 const threshold=+p3th.value/100,nInst=+p3inst.value;
 $("p3thOut").textContent=threshold.toFixed(2);
 $("p3instOut").textContent=nInst+" per event type";

 const svg=$("p3plot");clear(svg);
 const W=1060,H=440;
 // Oblique plotting plane: x = event class, y = metric, depth = repeated instance.
 const OX=180, OY=350, plotW=690, plotH=250, DX=105, DY=-66;
 const events=[
   {name:"Mechanical excavation",base:.76,spread:.09,target:true,color:"#c65d4b"},
   {name:"Manual digging",base:.45,spread:.13,target:true,color:"#d98a7d"},
   {name:"Passing vehicle",base:.60,spread:.13,target:false,color:"#a47b2e"},
   {name:"Noise excursion",base:.28,spread:.08,target:false,color:"#858b90"}
 ];
 function value(e,j,idx){
   const q=.62*Math.sin((j+1)*(idx+2)*1.31)+.26*Math.cos((j+2)*(idx+1)*2.17)+.12*Math.sin((j+4)*.73);
   return Math.max(.05,Math.min(.95,e.base+e.spread*q));
 }
 // floor / oblique frame
 E("polygon",{points:`${OX},${OY} ${OX+plotW},${OY} ${OX+plotW+DX},${OY+DY} ${OX+DX},${OY+DY}`,fill:"#fafafa",stroke:"#d7dce0"},svg);
 [0,.25,.5,.75,1].forEach(fr=>{
   const x=OX+plotW*fr;
   E("line",{x1:x,y1:OY,x2:x+DX,y2:OY+DY,stroke:"#e2e5e7"},svg);
 });
 // metric axis and grid
 E("line",{x1:OX,y1:OY,x2:OX,y2:OY-plotH,stroke:"#666","stroke-width":"1.4"},svg);
 [0,.25,.5,.75,1].forEach(v=>{
   const y=OY-plotH*v;
   E("line",{x1:OX-5,y1:y,x2:OX,y2:y,stroke:"#666"},svg);
   txt(svg,OX-10,y+4,v.toFixed(2),{anchor:"end",size:16,fill:"#555"});
 });
 const ylab=txt(svg,38,OY-plotH/2,"Processed detection metric",{anchor:"middle",size:21,fill:"#25292d","font-weight":"600"});
 ylab.setAttribute("transform",`rotate(-90 38 ${OY-plotH/2})`);
 txt(svg,48,76,"Metric examples",{size:16,fill:"#444","font-weight":"600"});
 txt(svg,48,98,"RMS amplitude",{size:15,fill:"#555"});
 txt(svg,48,119,"windowed energy",{size:15,fill:"#555"});
 txt(svg,48,140,"SNR / detector score",{size:15,fill:"#555"});

 const bw=plotW/events.length,barW=92;
 let TP=0,FN=0,FP=0,TN=0;
 // Draw oldest/back instances first. Each instance advances along a diagonal depth vector.
 for(let j=nInst-1;j>=0;j--){
   const depth=(nInst===1?0:j/(nInst-1));
   const ox=DX*depth,oy=DY*depth;
   events.forEach((e,idx)=>{
     const m=value(e,j,idx),det=m>=threshold;
     if(e.target){det?TP++:FN++;}else{det?FP++:TN++;}
     const cx=OX+bw*(idx+.5)+ox;
     const base=OY+oy;
     const top=base-plotH*m;
     E("rect",{x:cx-barW/2,y:top,width:barW,height:base-top,rx:3,fill:e.color,
       opacity:String(.28+.62*(1-depth)),stroke:"#fff","stroke-width":".7"},svg);
     // short top cap tilted in depth direction
     E("line",{x1:cx-barW/2,y1:top,x2:cx+barW/2,y2:top,stroke:e.color,"stroke-width":"1.1",opacity:".9"},svg);
   });
 }
 // Threshold plane/line across the front and back edges.
 const ty=OY-plotH*threshold;
 E("line",{x1:OX,y1:ty,x2:OX+plotW,y2:ty,stroke:"#0076a8","stroke-width":"2.5","stroke-dasharray":"8 5"},svg);
 E("line",{x1:OX+DX,y1:ty+DY,x2:OX+plotW+DX,y2:ty+DY,stroke:"#0076a8","stroke-width":"1.5","stroke-dasharray":"6 5",opacity:".65"},svg);
 E("line",{x1:OX+plotW,y1:ty,x2:OX+plotW+DX,y2:ty+DY,stroke:"#0076a8","stroke-width":"1.5","stroke-dasharray":"6 5",opacity:".65"},svg);
 txt(svg,OX+plotW-5,ty-8,`threshold = ${threshold.toFixed(2)}`,{anchor:"end",size:17,fill:"#0076a8","font-weight":"600"});
 txt(svg,OX+plotW-5,ty+18,"above threshold → DETECTED",{anchor:"end",size:15,fill:"#0076a8","font-weight":"600"});

 // Event labels on front x axis.
 events.forEach((e,idx)=>{
   const cx=OX+bw*(idx+.5);
   txt(svg,cx,OY+22,e.name,{anchor:"middle",size:16,fill:"#25292d","font-weight":"600"});
   txt(svg,cx,OY+39,e.target?"TARGET":"NON-TARGET",{anchor:"middle",size:14,fill:e.target?"#b44e40":"#7d672f","font-weight":"600"});
 });
 txt(svg,OX+plotW/2,OY+58,"Event type",{anchor:"middle",size:18,fill:"#333","font-weight":"600"});

 // Explicit depth axis.
 E("line",{x1:OX+plotW+15,y1:OY-8,x2:OX+plotW+DX+15,y2:OY+DY-8,stroke:"#555","stroke-width":"1.5"},svg);
 E("path",{d:`M ${OX+plotW+DX+5} ${OY+DY-6} L ${OX+plotW+DX+15} ${OY+DY-8} L ${OX+plotW+DX+11} ${OY+DY+2}`,fill:"none",stroke:"#555","stroke-width":"1.5"},svg);
 txt(svg,OX+plotW+DX+20,OY+DY-11,"Repeated instances",{size:16,fill:"#444","font-weight":"600"});
 txt(svg,OX+plotW+DX+20,OY+DY+6,"not time",{size:14,fill:"#666"});

 const targetTotal=2*nInst,nonTotal=2*nInst;
 $("p3TP").textContent=`${TP} / ${targetTotal}`;
 $("p3FN").textContent=`${FN} / ${targetTotal}`;
 $("p3FP").textContent=`${FP} / ${nonTotal}`;
 $("p3TN").textContent=`${TN} / ${nonTotal}`;
 const total=TP+TN+FP+FN;
 const fnp=targetTotal?FN/targetTotal:0, fpp=nonTotal?FP/nonTotal:0;
 const accuracy=total?(TP+TN)/total:0;
 const precision=(TP+FP)?TP/(TP+FP):0;
 const recall=(TP+FN)?TP/(TP+FN):0;
 const specificity=(TN+FP)?TN/(TN+FP):0;
 const f1=(precision+recall)?2*precision*recall/(precision+recall):0;
 const pct=v=>(100*v).toFixed(0)+"%";

 $("p3TPcopy").textContent=TP;$("p3FNcopy").textContent=FN;$("p3FPcopy").textContent=FP;$("p3TNcopy").textContent=TN;

 $("p3FNPsub").textContent=`${FN} / (${TP} + ${FN}) = ${FN}/${targetTotal}`;
 $("p3FPPsub").textContent=`${FP} / (${FP} + ${TN}) = ${FP}/${nonTotal}`;
 $("p3ACCsub").textContent=`(${TP} + ${TN}) / ${total} = ${TP+TN}/${total}`;
 $("p3PRECsub").textContent=`${TP} / (${TP} + ${FP}) = ${TP}/${TP+FP}`;
 $("p3RECsub").textContent=`${TP} / (${TP} + ${FN}) = ${TP}/${TP+FN}`;
 $("p3SPECsub").textContent=`${TN} / (${TN} + ${FP}) = ${TN}/${TN+FP}`;
 $("p3F1sub").textContent=`2 × (${pct(precision)} × ${pct(recall)}) / (${pct(precision)} + ${pct(recall)})`;

 $("p3FNPbig").textContent=pct(fnp);$("p3FPPbig").textContent=pct(fpp);
 $("p3ACC").textContent=pct(accuracy);$("p3PREC").textContent=pct(precision);
 $("p3REC").textContent=pct(recall);$("p3SPEC").textContent=pct(specificity);$("p3F1").textContent=pct(f1);

 $("p3cards").innerHTML=events.map((e,idx)=>{
   let detected=0;
   for(let j=0;j<nInst;j++)if(value(e,j,idx)>=threshold)detected++;
   const other=nInst-detected;
   const result=e.target?`${detected}/${nInst} detected · ${other}/${nInst} missed`:`${detected}/${nInst} detected · ${other}/${nInst} rejected`;
   return `<div class="p3-eventcard"><strong>${e.name}</strong><small>${e.target?"TARGET":"NON-TARGET"}</small><div class="state">${result}</div></div>`;
 }).join("");
}
[p3th,p3inst].forEach(el=>el.addEventListener("input",drawP3));

const p2target=$("p2target"),p2vehicle=$("p2vehicle"),p2noiseLevel=$("p2noiseLevel"),p2sep=$("p2sep");
function p2signals(){
 const A=+p2target.value/100,V=+p2vehicle.value/100,N=+p2noiseLevel.value/100,O=+p2sep.value/100,n=360;
 const target=[],vehicle=[],noise=[],raw=[],filtered=[];
 // overlap=0 => vehicle frequency far from target; overlap=1 => nearly same.
 const ft=8.0, fv=18-9.0*O;
 const targetKeep=.96-.18*O;
 const vehiclePass=.08+.72*O;
 for(let i=0;i<n;i++){
   const t=2.0*i/(n-1);
   const envT=Math.exp(-Math.pow((t-.86)/.38,2));
   const envV=Math.exp(-Math.pow((t-1.18)/.52,2));
   const st=A*envT*(Math.sin(2*Math.PI*ft*t)+.28*Math.sin(2*Math.PI*(ft*1.7)*t));
   const sv=V*envV*(Math.sin(2*Math.PI*fv*t+.55)+.22*Math.sin(2*Math.PI*(fv*.55)*t));
   const sn=N*(.52*Math.sin(2*Math.PI*23*t+1.1)+.31*Math.sin(2*Math.PI*3.2*t+.4)+.22*Math.sin(2*Math.PI*31*t));
   target.push(st);vehicle.push(sv);noise.push(sn);raw.push(st+sv+sn);
   filtered.push(targetKeep*st+vehiclePass*sv+.20*sn);
 }
 return {A,V,N,O,target,vehicle,noise,raw,filtered,targetKeep,vehiclePass};
}
function p2axes(s,x0,y0,w,h,label){
 E("line",{x1:x0,y1:y0+h/2,x2:x0+w,y2:y0+h/2,stroke:"#d7dce0"},s);
 txt(s,x0-8,y0+h/2+4,label,{anchor:"end",size:11,fill:"#555"});
}
function p2line(s,arr,x0,y0,w,h,color,scale=1){
 let d="";
 arr.forEach((v,i)=>{const x=x0+w*i/(arr.length-1),y=y0+h/2-v*scale*h*.42;d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" "});
 E("path",{d,fill:"none",stroke:color,"stroke-width":"2"},s);
}
function drawP2Components(q){
 const s=$("p2components");clear(s);const W=650,L=90,R=18,w=W-L-R,rowH=74;
 const rows=[
  ["Target",q.target,"#c65d4b"],
  ["Passing vehicle",q.vehicle,"#a47b2e"],
  ["Noise",q.noise,"#858b90"],
  ["Measured",q.raw,"#25292d"]
 ];
 rows.forEach((r,j)=>{const y=8+j*84;p2axes(s,L,y,w,rowH,r[0]);p2line(s,r[1],L,y,w,rowH,r[2],.75)});
 txt(s,L+w/2,350,"Time",{anchor:"middle",size:12,fill:"#444"});
}
function power(a){return a.reduce((z,v)=>z+v*v,0)/a.length}
function drawP2Filter(q){
 // TIME DOMAIN
 const s=$("p2filter");clear(s);const W=720,H=300,L=55,R=12,T=18,B=30,w=W-L-R;
 const half=(H-T-B-26)/2;
 p2axes(s,L,T,w,half,"Raw");p2line(s,q.raw,L,T,w,half,"#656b70",.62);
 const y2=T+half+26;
 p2axes(s,L,y2,w,half,"Filtered");p2line(s,q.filtered,L,y2,w,half,"#0076a8",.62);
 txt(s,L+w/2,H-5,"Time",{anchor:"middle",size:12,fill:"#444"});
 txt(s,L+5,T+13,"target + vehicle + noise",{size:10,fill:"#666"});
 txt(s,L+5,y2+13,"after simple band-pass filtering",{size:10,fill:"#0076a8"});

 // APPROXIMATE FREQUENCY-DOMAIN VIEW
 const sp=$("p2spectrum");clear(sp);const SW=430,SH=300,SL=48,SR=10,ST=18,SB=35,sw=SW-SL-SR,sh=SH-ST-SB;
 E("line",{x1:SL,y1:SH-SB,x2:SW-SR,y2:SH-SB,stroke:"#999"},sp);
 E("line",{x1:SL,y1:ST,x2:SL,y2:SH-SB,stroke:"#999"},sp);
 txt(sp,SW/2,SH-6,"Frequency (illustrative)",{anchor:"middle",size:12,fill:"#444"});
 const yy=txt(sp,13,SH/2,"Relative spectral energy",{anchor:"middle",size:11,fill:"#444"});yy.setAttribute("transform",`rotate(-90 13 ${SH/2})`);
 // normalized frequency positions; overlap shifts vehicle peak toward target.
 const targetF=.34, vehicleF=.72-.34*q.O;
 function gauss(f,mu,sig,amp){return amp*Math.exp(-.5*((f-mu)/sig)**2)}
 let dt="",dv="",dn="";
 for(let i=0;i<=160;i++){
   const f=i/160;
   const at=gauss(f,targetF,.075,.92*q.A)+gauss(f,targetF+.12,.055,.20*q.A);
   const av=gauss(f,vehicleF,.085,.82*q.V);
   const an=.11*q.N+.12*q.N*Math.exp(-2.5*f)+gauss(f,.84,.12,.20*q.N);
   const x=SL+sw*f, yt=SH-SB-sh*Math.min(1,at), yv=SH-SB-sh*Math.min(1,av), yn=SH-SB-sh*Math.min(1,an);
   dt+=(i?"L":"M")+x.toFixed(1)+" "+yt.toFixed(1)+" ";
   dv+=(i?"L":"M")+x.toFixed(1)+" "+yv.toFixed(1)+" ";
   dn+=(i?"L":"M")+x.toFixed(1)+" "+yn.toFixed(1)+" ";
 }
 E("path",{d:dt,fill:"none",stroke:"#c65d4b","stroke-width":"2.4"},sp);
 E("path",{d:dv,fill:"none",stroke:"#a47b2e","stroke-width":"2.4"},sp);
 E("path",{d:dn,fill:"none",stroke:"#858b90","stroke-width":"1.8"},sp);
 // approximate passband around target
 const bx1=SL+sw*.22,bx2=SL+sw*.49;
 E("rect",{x:bx1,y:ST,width:bx2-bx1,height:sh,fill:"#0076a8",opacity:".07"},sp);
 E("line",{x1:bx1,y1:ST,x2:bx1,y2:SH-SB,stroke:"#0076a8","stroke-dasharray":"4 4"},sp);
 E("line",{x1:bx2,y1:ST,x2:bx2,y2:SH-SB,stroke:"#0076a8","stroke-dasharray":"4 4"},sp);
 txt(sp,(bx1+bx2)/2,ST+13,"illustrative passband",{anchor:"middle",size:10,fill:"#0076a8"});
 txt(sp,SW-105,ST+18,"target",{size:10,fill:"#c65d4b"});
 txt(sp,SW-105,ST+34,"vehicle",{size:10,fill:"#a47b2e"});
 txt(sp,SW-105,ST+50,"noise",{size:10,fill:"#858b90"});

 // METRICS
 const pi=power(q.target),ni=power(q.vehicle.map((v,i)=>v+q.noise[i]));
 const po=power(q.target.map(v=>q.targetKeep*v)),no=power(q.vehicle.map((v,i)=>q.vehiclePass*v+.2*q.noise[i]));
 const inS=10*Math.log10((pi+1e-9)/(ni+1e-9)), outS=10*Math.log10((po+1e-9)/(no+1e-9));
 $("p2retained").textContent=Math.round(q.targetKeep*100)+"%";
 $("p2filterState").textContent=q.O<.3?"effective":q.O<.68?"trade-off":"limited";

 // HORIZONTAL SNR BARS
 const bs=$("p2snrBars");clear(bs);const BW=520,BH=105,BL=105,BR=42,maxDB=15,minDB=-15,barW=BW-BL-BR;
 function xpos(v){return BL+barW*(Math.max(minDB,Math.min(maxDB,v))-minDB)/(maxDB-minDB)}
 const zero=xpos(0);
 E("line",{x1:zero,y1:8,x2:zero,y2:96,stroke:"#aeb4b8","stroke-dasharray":"3 3"},bs);
 [["Input",inS,34,"#777"],["Output",outS,75,"#0076a8"]].forEach(r=>{
   txt(bs,BL-10,r[2]+5,r[0],{anchor:"end",size:12,fill:"#444"});
   const x=xpos(r[1]), left=Math.min(zero,x), width=Math.max(2,Math.abs(x-zero));
   E("rect",{x:left,y:r[2]-10,width,height:20,rx:4,fill:r[3],opacity:".9"},bs);
   txt(bs,x+(r[1]>=0?7:-7),r[2]+5,r[1].toFixed(1)+" dB",{anchor:r[1]>=0?"start":"end",size:12,fill:r[3],"font-weight":"600"});
 });
 txt(bs,BL,102,"−15",{anchor:"middle",size:9});txt(bs,zero,102,"0",{anchor:"middle",size:9});txt(bs,BW-BR,102,"+15 dB",{anchor:"middle",size:9});
}
function updateP2(){
 const q=p2signals();
 $("p2targetOut").textContent=q.A.toFixed(2);$("p2vehicleOut").textContent=q.V.toFixed(2);$("p2noiseOut").textContent=q.N.toFixed(2);
 $("p2sepOut").textContent=q.O<.3?"low":q.O<.68?"moderate":"high";
 $("p2noise").setAttribute("opacity",(.25+.7*q.N).toFixed(2));
 drawP2Components(q);drawP2Filter(q);
}
[p2target,p2vehicle,p2noiseLevel,p2sep].forEach(x=>x.addEventListener("input",updateP2));


let p4type="excavation";
const p4overlap=$("p4overlap");
const p4defs={
 excavation:{label:"Mechanical excavation",freq1:9,freq2:17,env:.42,space:.11,motion:.04},
 manual:{label:"Manual digging",freq1:6,freq2:10.2,env:.34,space:.07,motion:0},
 vehicle:{label:"Passing vehicle",freq1:3.4,freq2:6.8,env:.62,space:.10,motion:.64}
};
function p4Axes(svg,x0,y0,w,h,xlab,ylab){
 E("line",{x1:x0,y1:y0+h,x2:x0+w,y2:y0+h,stroke:"#999"},svg);E("line",{x1:x0,y1:y0,x2:x0,y2:y0+h,stroke:"#999"},svg);
 txt(svg,x0+w/2,y0+h+22,xlab,{anchor:"middle",size:11,fill:"#555"});
 if(ylab){const y=txt(svg,12,y0+h/2,ylab,{anchor:"middle",size:10,fill:"#555"});y.setAttribute("transform",`rotate(-90 12 ${y0+h/2})`)}
}
let p4yaw=-0.36,p4pitch=0.23,p4drag=null;

function drawP4Decision(currentEnergy,currentPeak,currentExtent,currentVector){
 const svg=$("p4decision");clear(svg);
 const overlap=+p4overlap.value/100;
 $("p4overlapOut").textContent=overlap<.34?"low":overlap<.68?"moderate":"high";

 const W=900,H=610,cx=430,cy=345,scale=330;
 function project(p){
   let x=p[0]-.5,y=p[1]-.5,z=p[2]-.5;
   const ca=Math.cos(p4yaw),sa=Math.sin(p4yaw);
   const x1=ca*x+sa*z,z1=-sa*x+ca*z;
   const cp=Math.cos(p4pitch),sp=Math.sin(p4pitch);
   const y1=cp*y-sp*z1,z2=sp*y+cp*z1;
   return [cx+scale*x1,cy-scale*y1,z2];
 }
 function line3(a,b,attrs={}){const A=project(a),B=project(b);E("line",{x1:A[0],y1:A[1],x2:B[0],y2:B[1],...attrs},svg)}
 function poly3(face,attrs={}){const pts=face.map(project).map(P=>`${P[0]},${P[1]}`).join(" ");E("polygon",{points:pts,...attrs},svg)}

 // Full dashed 3D grid, intentionally similar to textbook feature-space plots.
 const grid="#aeb5b9";
 for(let q=0;q<=1.001;q+=.2){
   line3([q,0,0],[q,1,0],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
   line3([q,0,0],[q,0,1],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
   line3([0,q,0],[1,q,0],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
   line3([0,q,0],[0,q,1],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
   line3([0,0,q],[1,0,q],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
   line3([0,0,q],[0,1,q],{stroke:grid,"stroke-width":"1","stroke-dasharray":"5 5",opacity:".7"});
 }
 // back edges
 [[0,1,0],[0,1,1],[1,1,0],[1,1,1]].forEach(()=>{});
 const corners=[];for(let x of [0,1])for(let y of [0,1])for(let z of [0,1])corners.push([x,y,z]);
 corners.forEach((a,ia)=>corners.forEach((b,ib)=>{if(ia<ib&&a.reduce((n,v,i)=>n+(v!==b[i]),0)===1)line3(a,b,{stroke:"#879096","stroke-width":"1.15","stroke-dasharray":"5 4"})}));

 // Main axes
 line3([0,0,0],[1.12,0,0],{stroke:"#333","stroke-width":"2"});
 line3([0,0,0],[0,1.12,0],{stroke:"#333","stroke-width":"2"});
 line3([0,0,0],[0,0,1.12],{stroke:"#333","stroke-width":"2"});
 const labels=[
  ["Energy, E",[1.18,0,0]],
  ["Peak frequency, fpeak",[0,1.18,0]],
  ["Spatial extent, L",[0,0,1.18]]
 ];
 labels.forEach(([lab,p])=>{const P=project(p);txt(svg,P[0],P[1],lab,{anchor:"middle",size:16,fill:"#222","font-weight":"600"})});

 // Widely separated base class centers.
 const centers={
  excavation:{p:[.78,.70,.58],color:"#c65d4b",label:"Mechanical excavation",shape:"square"},
  manual:{p:[.28,.46,.22],color:"#d98a7d",label:"Manual digging",shape:"triangle"},
  vehicle:{p:[.70,.18,.82],color:"#a47b2e",label:"Passing vehicle",shape:"circle"}
 };
 const common=[.57,.43,.52];
 Object.values(centers).forEach(c=>c.p=c.p.map((v,i)=>v*(1-.70*overlap)+common[i]*.70*overlap));

 // Decision surfaces. Low overlap: simple axis-aligned planes.
 if(overlap<.34){
   const plane1=[ [.49,0,0],[.49,1,0],[.49,1,1],[.49,0,1] ];
   const plane2=[ [0,.31,0],[1,.31,0],[1,.31,1],[0,.31,1] ];
   [plane1,plane2].forEach(face=>poly3(face,{fill:"#6f91b5",opacity:".16",stroke:"#4f7197","stroke-width":"2"}));
 } else if(overlap<.68){
   // Oblique illustrative linear SVM planes.
   const svm1=[[.12,.16,.18],[.90,.54,.14],[.88,.76,.88],[.10,.38,.92]];
   const svm2=[[.15,.72,.12],[.82,.30,.16],[.86,.40,.92],[.18,.82,.88]];
   [svm1,svm2].forEach(face=>poly3(face,{fill:"#4f7197",opacity:".16",stroke:"#315b87","stroke-width":"2.2"}));
 }

 // Deterministic class points, with distinct shapes.
 function drawPoint(P,c,shape,selected=false){
   const x=P[0],y=P[1],r=selected?10:6;
   if(shape==="square") E("rect",{x:x-r,y:y-r,width:2*r,height:2*r,rx:1.5,fill:selected?"#fff":c,stroke:selected?"#0076a8":"#8c382d","stroke-width":selected?3:1.1},svg);
   else if(shape==="triangle") E("polygon",{points:`${x},${y-r-1} ${x-r-1},${y+r} ${x+r+1},${y+r}`,fill:selected?"#fff":c,stroke:selected?"#0076a8":"#a65e54","stroke-width":selected?3:1.1},svg);
   else E("circle",{cx:x,cy:y,r,fill:selected?"#fff":c,stroke:selected?"#0076a8":"#795b20","stroke-width":selected?3:1.1},svg);
 }
 const cloud=[];
 Object.entries(centers).forEach(([key,c],idx)=>{
   const spread=.025+.12*overlap;
   for(let j=0;j<17;j++){
     const p=c.p.map((v,k)=>Math.max(.03,Math.min(.97,v+spread*(.64*Math.sin((j+1)*(idx+2)*(k+1)*1.31)+.36*Math.cos((j+3)*(k+2)*.83)))));
     cloud.push({p,P:project(p),c,shape:c.shape});
   }
 });
 cloud.sort((a,b)=>a.P[2]-b.P[2]).forEach(o=>drawPoint(o.P,o.c.color,o.shape));

 // Class labels offset away from point clouds.
 const offsets={excavation:[42,-26],manual:[-58,28],vehicle:[44,24]};
 Object.entries(centers).forEach(([key,c])=>{
   const P=project(c.p),o=offsets[key];
   txt(svg,P[0]+o[0],P[1]+o[1],c.label,{anchor:"middle",size:14,fill:c.color,"font-weight":"700"});
 });

 // Selected event uses actual extracted 3-feature vector.
 const current=[Math.max(.03,Math.min(.97,currentEnergy)),Math.max(.03,Math.min(.97,currentPeak)),Math.max(.03,Math.min(.97,currentExtent/100))];
 const CP=project(current);
 E("circle",{cx:CP[0],cy:CP[1],r:11,fill:"#fff",stroke:"#0076a8","stroke-width":"3.5"},svg);
 E("circle",{cx:CP[0],cy:CP[1],r:4,fill:"#0076a8"},svg);
 txt(svg,CP[0]+14,CP[1]-13,"selected event",{size:13,fill:"#0076a8","font-weight":"700"});

 // nearest center illustrative classification
 let best=null,bd=1e9;
 Object.entries(centers).forEach(([key,c])=>{const d=current.reduce((q,v,i)=>q+(v-c.p[i])**2,0);if(d<bd){bd=d;best=key}});
 $("p4classOut").textContent=p4defs[best].label;
 $("p4vectorCopy").textContent=currentVector;

 const stages=[["p4stageRules",overlap<.34],["p4stageSVM",overlap>=.34&&overlap<.68],["p4stageRich",overlap>=.68]];
 stages.forEach(x=>$(x[0]).classList.toggle("active-method",x[1]));
 if(overlap<.34){
   $("p4modelCue").textContent="Simple boundaries";
   $("p4methodHint").textContent="The class clouds are clearly separated. Axis-aligned feature thresholds are enough in this synthetic example.";
   $("p4boundaryText").textContent="The blue planes show simple feature thresholds aligned with the feature axes.";
 }else if(overlap<.68){
   $("p4modelCue").textContent="Linear SVM";
   $("p4methodHint").textContent="The class clouds are closer. A weighted combination of the three features provides a clearer separation than independent thresholds.";
   $("p4boundaryText").textContent="The angled blue planes illustrate linear SVM decision surfaces in the 3D feature space.";
 }else{
   $("p4modelCue").textContent="Current features insufficient?";
   $("p4methodHint").textContent="The clouds now strongly overlap. A more complicated boundary may fit the examples, but the three features themselves may no longer contain enough discriminating information.";
   $("p4boundaryText").textContent="Before escalating model complexity, consider better features or richer waveform / spatiotemporal information.";
 }
}
function drawP4(){
 const d=p4defs[p4type];

 // Panel 1: all selected examples intentionally exceed the same detection threshold.
 let s=$("p4detect");clear(s);p4Axes(s,52,15,330,145,"Selected detected event","Detection metric");
 const threshold=.52,metric=.73,y0=160,yT=y0-125*threshold,yM=y0-125*metric;
 E("rect",{x:154,y:yM,width:126,height:y0-yM,rx:6,fill:"#c65d4b",opacity:".85"},s);
 E("line",{x1:52,y1:yT,x2:382,y2:yT,stroke:"#0076a8","stroke-width":"2","stroke-dasharray":"6 4"},s);
 txt(s,377,yT-7,"threshold",{anchor:"end",size:12,fill:"#0076a8","font-weight":"600"});
 txt(s,217,yM-8,"similar detection level",{anchor:"middle",size:11,fill:"#c65d4b","font-weight":"600"});
 txt(s,217,198,d.label,{anchor:"middle",size:12,fill:"#333","font-weight":"600"});

 // Generate one synthetic time-domain event. Features below are calculated from this same array.
 const N=181,timeVals=[];
 s=$("p4time");clear(s);p4Axes(s,38,15,275,165,"Time","Amplitude");
 let path="";
 for(let i=0;i<N;i++){
   const t=i/(N-1)*2,env=Math.exp(-Math.pow((t-1)/d.env,2));let v;
   if(p4type==="excavation") v=env*(.62*Math.sin(2*Math.PI*d.freq1*t)+.28*Math.sin(2*Math.PI*d.freq2*t));
   else if(p4type==="manual") v=env*(.65*Math.sin(2*Math.PI*d.freq1*t))*(.55+.45*Math.sin(2*Math.PI*1.7*t)**2);
   else v=env*(.68*Math.sin(2*Math.PI*d.freq1*t)+.18*Math.sin(2*Math.PI*d.freq2*t));
   timeVals.push(v);
   const x=38+275*i/(N-1),y=97-v*70;path+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" ";
 }
 E("path",{d:path,fill:"none",stroke:"#c65d4b","stroke-width":"2"},s);

 // Numerical time feature: normalized mean-square energy.
 const rawEnergy=timeVals.reduce((a,v)=>a+v*v,0)/N;
 const energy=Math.min(1,rawEnergy/.18);

 // Frequency representation from illustrative analytic spectrum; calculate its actual peak.
 s=$("p4freq");clear(s);p4Axes(s,38,15,275,165,"Normalized frequency","Spectral energy");
 function g(x,m,sd,a){return a*Math.exp(-.5*((x-m)/sd)**2)}
 const spec=[];path="";
 for(let i=0;i<N;i++){
   const f=i/(N-1);let v;
   if(p4type==="excavation")v=g(f,.48,.14,.85)+g(f,.72,.10,.35);
   else if(p4type==="manual")v=g(f,.39,.11,.75)+g(f,.61,.08,.18);
   else v=g(f,.22,.10,.88)+g(f,.38,.10,.30);
   spec.push(v);
   const x=38+275*f,y=180-v*150;path+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" ";
 }
 E("path",{d:path,fill:"none",stroke:"#a47b2e","stroke-width":"2.2"},s);
 let peakIdx=0;for(let i=1;i<spec.length;i++)if(spec[i]>spec[peakIdx])peakIdx=i;
 const peakF=peakIdx/(N-1);
 const px=38+275*peakF,py=180-spec[peakIdx]*150;
 E("circle",{cx:px,cy:py,r:4,fill:"#a47b2e"},s);
 txt(s,px,py-9,"peak",{anchor:"middle",size:10,fill:"#8b6928","font-weight":"600"});

 // Spatiotemporal pattern and numerical spatial extent.
 s=$("p4space");clear(s);const L=38,T=15,W=275,H=165,nx=50,ny=32,cw=W/nx,ch=H/ny;
 const occupied=new Array(nx).fill(false);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
   const x=i/(nx-1),t=j/(ny-1);let z;
   if(p4type==="excavation")z=Math.exp(-Math.pow((x-.52-d.motion*Math.sin(t*8))/d.space,2))*Math.abs(Math.sin(t*20));
   else if(p4type==="manual")z=Math.exp(-Math.pow((x-.50)/d.space,2))*Math.max(0,Math.sin(t*13));
   else z=Math.exp(-Math.pow((x-(.18+d.motion*t))/d.space,2))*.85;
   if(z>.30)occupied[i]=true;
   E("rect",{x:L+i*cw,y:T+j*ch,width:cw+.4,height:ch+.4,fill:`rgba(0,118,168,${.03+.78*z})`},s);
 }
 E("line",{x1:L,y1:T+H,x2:L+W,y2:T+H,stroke:"#999"},s);E("line",{x1:L,y1:T,x2:L,y2:T+H,stroke:"#999"},s);
 txt(s,L+W/2,205,"Distance",{anchor:"middle",size:11,fill:"#555"});
 const yy=txt(s,12,T+H/2,"Slow time",{anchor:"middle",size:10,fill:"#555"});yy.setAttribute("transform",`rotate(-90 12 ${T+H/2})`);
 let first=occupied.findIndex(Boolean),last=-1;for(let i=occupied.length-1;i>=0;i--)if(occupied[i]){last=i;break}
 const extentNorm=(first>=0&&last>=first)?(last-first)/(nx-1):0;
 // Give the normalized synthetic route a 100 m teaching scale.
 const extentM=Math.round(extentNorm*100);

 // Populate feature extraction boxes and vector from calculated values.
 $("p4energy").textContent=energy.toFixed(2)+" a.u.";
 $("p4peak").textContent=peakF.toFixed(2)+" normalized f";
 $("p4extent").textContent=extentM+" m";
 const vectorText=`[ ${energy.toFixed(2)}, ${peakF.toFixed(2)}, ${extentM} ]`;
 $("p4vector").textContent=vectorText;
 drawP4Decision(energy,peakF,extentM,vectorText);
}
document.querySelectorAll(".p4-eventbuttons button").forEach(b=>b.addEventListener("click",()=>{p4type=b.dataset.p4;document.querySelectorAll(".p4-eventbuttons button").forEach(x=>x.classList.toggle("active",x===b));drawP4()}));
p4overlap.addEventListener("input",drawP4);
$("p4decision").addEventListener("pointerdown",e=>{p4drag=[e.clientX,e.clientY,p4yaw,p4pitch];$("p4decision").setPointerCapture(e.pointerId)});
$("p4decision").addEventListener("pointermove",e=>{if(!p4drag)return;p4yaw=p4drag[2]+(e.clientX-p4drag[0])*.008;p4pitch=Math.max(-1.05,Math.min(1.05,p4drag[3]-(e.clientY-p4drag[1])*.008));drawP4()});
$("p4decision").addEventListener("pointerup",()=>p4drag=null);
$("p4decision").addEventListener("pointercancel",()=>p4drag=null);
$("p4resetView").addEventListener("click",()=>{p4yaw=-0.36;p4pitch=0.23;drawP4()});


const p5raw=$("p5raw"),p5labels=$("p5labels"),p5flops=$("p5flops"),p5compute=$("p5compute"),p5latency=$("p5latency");
function drawP5(){
 const raw=+p5raw.value,labels=+p5labels.value,model=+p5flops.value,compute=+p5compute.value,lat=+p5latency.value;
 const levels=["Limited","Moderate","Substantial","Extensive"];
 $("p5rawOut").textContent=levels[raw];$("p5labelsOut").textContent=labels===0?"Sparse / expensive":levels[labels];
 const modelInfo=[
  {flops:.15,mem:8,name:"0.15 GFLOPs / inference"},
  {flops:2.0,mem:80,name:"2.0 GFLOPs / inference"},
  {flops:12,mem:320,name:"12 GFLOPs / inference"},
  {flops:55,mem:900,name:"55 GFLOPs / inference"}
 ][model];
 const compNames=["Constrained CPU","Moderate edge compute","Edge accelerator","High compute"];
 const capacity=[.18,.42,.72,1.0][compute];
 const demand=[.10,.34,.66,.94][model];
 const latencyNames=["10 ms","100 ms","1 s","Latency tolerant"];
 $("p5flopsOut").textContent=modelInfo.name;$("p5computeOut").textContent=compNames[compute];$("p5latencyOut").textContent=latencyNames[lat];

 // training strategy
 let mode,why,active;
 if(raw===0){mode="Acquire representative data first";why="A learned model cannot be established credibly without enough representative examples of the operating conditions and event variability.";active="p5dataFirst"}
 else if(labels>=2){mode="Supervised learning is feasible";why="Representative data and reliable labels are available to train and validate an event classifier directly.";active="p5supervised"}
 else if(raw>=2 && labels<=1){mode="Label scarcity is the bottleneck";why="Raw DAS data are relatively abundant but event labels are limited. Self-supervised representation learning followed by a smaller labeled downstream stage may be worth considering.";active="p5self"}
 else {mode="Supervised learning, but data-limited";why="A supervised classifier is possible, but the labeled dataset may constrain model complexity and confidence in generalization.";active="p5supervised"}
 $("p5trainingMode").textContent=mode;$("p5trainingWhy").textContent=why;
 ["p5supervised","p5self","p5dataFirst"].forEach(id=>$(id).classList.toggle("active",id===active));

 // compute visualization
 $("p5demandBar").style.width=(demand*100)+"%";$("p5capacityMarker").style.left=(capacity*100)+"%";
 const computeFit=demand<=capacity;
 // illustrative latency feasibility: harder model + weaker compute makes strict latency difficult
 const speedMargin=capacity/(demand+.05);
 const required=[4.0,1.35,.55,.15][lat]; // higher means stricter
 const latencyFit=speedMargin>=required;
 $("p5computeFit").textContent=computeFit?"Compatible":"Constrained";
 $("p5latencyFit").textContent=latencyFit?"Compatible":"Too demanding";
 $("p5memory").textContent=modelInfo.mem+" MB";

 // placement
 const edgePreferred=lat<=1;
 const edgeFeasible=computeFit&&latencyFit;
 $("p5edgeNode").classList.toggle("active",edgePreferred&&edgeFeasible);
 $("p5centralNode").classList.toggle("active",!edgePreferred||!edgeFeasible);
 let place,placeWhy;
 if(edgePreferred&&edgeFeasible){place="Local / edge inference is feasible";placeWhy="The response-time requirement favors local processing, and the assumed model fits the available compute in this teaching case."}
 else if(edgePreferred&&!edgeFeasible){place="Edge requirement conflicts with the current model";placeWhy="The alarm must be issued quickly, but the assumed model workload exceeds the available edge resources or latency budget."}
 else {place="Centralized or hybrid processing is feasible";placeWhy="The response-time requirement is more tolerant, allowing heavier processing to occur centrally or in a hybrid edge-central architecture."}
 $("p5placement").textContent=place;$("p5placementWhy").textContent=placeWhy;
 $("p5optimize").classList.toggle("show",edgePreferred&&!edgeFeasible);
}
[p5raw,p5labels,p5flops,p5compute,p5latency].forEach(x=>x.addEventListener("input",drawP5));

function update(){
 const d=data(),n=+traceCount.value;
 $("locOut").textContent=d.x0+" m";$("coupleOut").textContent=d.C.toFixed(2);$("gaugeOut").textContent=d.Lg+" m";$("traceOut").textContent=n+" of 10";
 
 drawScene(d);drawStack(d);drawMap(d);
}
[loc,couple,gaugeLen,traceCount].forEach(x=>x.addEventListener("input",update));
update();updateP2();drawP3();drawP4();drawP5();
})();
