// SPR Interactive Teaching Module — Demo 3
// Minimal complex arithmetic
function C(re,im=0){return {re,im}}
function add(a,b){return C(a.re+b.re,a.im+b.im)}
function sub(a,b){return C(a.re-b.re,a.im-b.im)}
function mul(a,b){return C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re)}
function div(a,b){const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)}
function scale(a,s){return C(a.re*s,a.im*s)}
function abs2(a){return a.re*a.re+a.im*a.im}
function csqrt(z){
  const r=Math.hypot(z.re,z.im);
  let re=Math.sqrt(Math.max(0,(r+z.re)/2));
  let im=(z.im<0?-1:1)*Math.sqrt(Math.max(0,(r-z.re)/2));
  // choose branch with non-negative imaginary part for passive decay where possible
  if(im<0){re=-re;im=-im}
  return C(re,im)
}
function cexp(z){const e=Math.exp(z.re);return C(e*Math.cos(z.im),e*Math.sin(z.im))}

const P={lambdaNm:800,np:1.51,epsM:C(-25,1.44),qNm:50};

// Local teaching approximation for Au dispersion around 800 nm.
// Anchored exactly at Homola's representative εAu(800 nm) = -25 + 1.44i.
// This spectral approximation is intentionally limited to the wavelength range below.
// Wavelength-dependent optical constants for spectral interrogation.
// Au: Rakić et al. (1998) n,k table supplied for this demo; linear interpolation.
// BK7: three-term Sellmeier equation supplied for this demo; lambda in micrometres.
const rakicAuLambdaUm=[0.60362,0.61346,0.62346,0.63363,0.64396,0.65446,0.66514,0.67598,0.68701,0.69821,0.70959,0.72117,0.73292,0.74488,0.75702,0.76937,0.78191,0.79466,0.80762,0.82079,0.83418,0.84778,0.86160,0.87565,0.88993,0.90445,0.91919,0.93418,0.94942,0.96490,0.98063,0.99662];
const rakicAuN=[0.35530,0.33893,0.32432,0.31127,0.29962,0.28922,0.27995,0.27170,0.26438,0.25791,0.25222,0.24725,0.24295,0.23927,0.23618,0.23364,0.23162,0.23010,0.22906,0.22848,0.22834,0.22863,0.22935,0.23049,0.23204,0.23401,0.23639,0.23919,0.24241,0.24606,0.25015,0.25469];
const rakicAuK=[2.8828,2.9728,3.0630,3.1534,3.2441,3.3350,3.4263,3.5180,3.6102,3.7028,3.7960,3.8898,3.9843,4.0794,4.1753,4.2720,4.3695,4.4679,4.5673,4.6676,4.7689,4.8713,4.9748,5.0795,5.1853,5.2923,5.4006,5.5102,5.6211,5.7334,5.8471,5.9622];

function linearInterp(x,xs,ys){
  if(x<=xs[0]) return ys[0];
  if(x>=xs[xs.length-1]) return ys[ys.length-1];
  let lo=0,hi=xs.length-1;
  while(hi-lo>1){
    const mid=(lo+hi)>>1;
    if(xs[mid]<=x)lo=mid; else hi=mid;
  }
  const f=(x-xs[lo])/(xs[hi]-xs[lo]);
  return ys[lo]+f*(ys[hi]-ys[lo]);
}

function goldEpsilon(lambdaNm){
  const um=lambdaNm/1000;
  const n=linearInterp(um,rakicAuLambdaUm,rakicAuN);
  const k=linearInterp(um,rakicAuLambdaUm,rakicAuK);
  return C(n*n-k*k,2*n*k);
}

function bk7Index(lambdaNm){
  const um=lambdaNm/1000;
  const l2=um*um;
  const n2=1
    +1.03961212*l2/(l2-0.00600069867)
    +0.231792344*l2/(l2-0.0200179144)
    +1.01046945*l2/(l2-103.560653);
  return Math.sqrt(n2);
}

function kx(eps,theta,np=P.np){
  const st=np*Math.sin(theta*Math.PI/180);
  return csqrt(sub(eps,C(st*st,0)));
}
function rij(ei,ej,kxi,kxj,pol){
  if(pol==="p"){
    return div(sub(mul(ej,kxi),mul(ei,kxj)),add(mul(ej,kxi),mul(ei,kxj)));
  }
  return div(sub(kxi,kxj),add(kxi,kxj));
}
function reflectionCoefficient(theta,nd,pol){
  const ep=C(P.np*P.np,0), em=P.epsM, ed=C(nd*nd,0);
  const kp=kx(ep,theta), km=kx(em,theta), kd=kx(ed,theta);
  const rpm=rij(ep,em,kp,km,pol), rmd=rij(em,ed,km,kd,pol);
  const k0=2*Math.PI/(P.lambdaNm*1e-9), q=P.qNm*1e-9;
  const phase=cexp(C(-2*k0*q*km.im,2*k0*q*km.re));
  return div(add(rpm,mul(rmd,phase)),add(C(1,0),mul(mul(rpm,rmd),phase)));
}
function reflectivity(theta,nd,pol){return abs2(reflectionCoefficient(theta,nd,pol))}

// Spectral reflectivity at a fixed angle.
// Uses the same three-layer Fresnel expression, with wavelength-dependent Au ε.
function spectralReflectionCoefficient(lambdaNm,theta,nd,pol="p"){
  const np=bk7Index(lambdaNm);
  const ep=C(np*np,0), em=goldEpsilon(lambdaNm), ed=C(nd*nd,0);
  const kp=kx(ep,theta,np), km=kx(em,theta,np), kd=kx(ed,theta,np);
  const rpm=rij(ep,em,kp,km,pol), rmd=rij(em,ed,km,kd,pol);
  const k0=2*Math.PI/(lambdaNm*1e-9), q=P.qNm*1e-9;
  const phase=cexp(C(-2*k0*q*km.im,2*k0*q*km.re));
  return div(add(rpm,mul(rmd,phase)),add(C(1,0),mul(mul(rpm,rmd),phase)));
}
function spectralReflectivity(lambdaNm,theta,nd){
  return abs2(spectralReflectionCoefficient(lambdaNm,theta,nd,"p"));
}
function phaseDeg(theta,nd){
  const r=reflectionCoefficient(theta,nd,"p");
  return Math.atan2(r.im,r.re)*180/Math.PI;
}
function wrap180(x){while(x>180)x-=360;while(x<=-180)x+=360;return x}
function unwrapSeries(values){
  if(!values.length)return [];
  const out=[values[0]];
  for(let i=1;i<values.length;i++){
    out.push(out[i-1]+wrap180(values[i]-values[i-1]));
  }
  return out;
}


const angle=document.getElementById("angle");
const ri=document.getElementById("ri");
const showTE=document.getElementById("showTE");
const angleValue=document.getElementById("angleValue");
const riValue=document.getElementById("riValue");
const schematicRI=document.getElementById("schematicRI");
const selectedAngle=document.getElementById("selectedAngle");
const selectedR=document.getElementById("selectedR");
const resAngle=document.getElementById("resAngle");
const beamIn=document.getElementById("beamIn");
const beamOut=document.getElementById("beamOut");
const angleLabel=document.getElementById("angleLabel");
const spWave=document.getElementById("spWave");

const referenceRI=1.328;
const thetaMin=60,thetaMax=75,N=1000;
const thetaAxis=Array.from({length:N},(_,i)=>thetaMin+i*(thetaMax-thetaMin)/(N-1));


const angRI=document.getElementById("angRI"), intRI=document.getElementById("intRI"), intOp=document.getElementById("intOp"), waveAngle=document.getElementById("waveAngle"), waveRI=document.getElementById("waveRI");
const riAxis=Array.from({length:89},(_,i)=>1.328+i*(1.350-1.328)/88);

function parabolicMinimum(x,y,j){
  if(j<=0||j>=y.length-1) return {x:x[j],y:y[j]};
  const h=x[j+1]-x[j];
  const ym=y[j-1], y0=y[j], yp=y[j+1];
  const denom=ym-2*y0+yp;
  if(!isFinite(denom)||Math.abs(denom)<1e-15) return {x:x[j],y:y[j]};
  const offset=0.5*(ym-yp)/denom;
  if(Math.abs(offset)>1) return {x:x[j],y:y[j]};
  const xv=x[j]+offset*h;
  const yv=y0-0.25*(ym-yp)*offset;
  return {x:xv,y:yv};
}
function resonance(nd){
  const yy=thetaAxis.map(t=>reflectivity(t,nd,"p")); let j=0;
  for(let i=1;i<yy.length;i++)if(yy[i]<yy[j])j=i;
  const fit=parabolicMinimum(thetaAxis,yy,j);
  return {theta:fit.x,R:fit.y,curve:yy};
}
function derivative(fn,x,h=0.00005){return (fn(x+h)-fn(x-h))/(2*h)}

function updateInterrogation(nd){
  // ANGULAR INTERROGATION — rebuilt to mirror wavelength interrogation
  const angularStates=[1.328,1.332,1.336,1.340,1.344];
  const angN=Number(angRI.value);

  let selectedAngularIndex=0;
  for(let i=1;i<angularStates.length;i++){
    if(Math.abs(angularStates[i]-angN) <
       Math.abs(angularStates[selectedAngularIndex]-angN)){
      selectedAngularIndex=i;
    }
  }

  const angularSpectra=angularStates.map(n=>resonance(n));
  const angRef=angularSpectra[0];
  const angCur=angularSpectra[selectedAngularIndex];

  // Left: progressively reveal the angular resonance family.
  const angularResponseTraces=[];

  angularStates.forEach((n,i)=>{
    if(i>selectedAngularIndex) return;

    const isReference=(i===0);
    const isSelected=(i===selectedAngularIndex);
    const isIntermediate=(!isReference && !isSelected);

    let traceOpacity=0.18;
    let traceWidth=1.6;
    let traceDash="solid";

    if(isReference){
      traceOpacity=0.52;
      traceWidth=2.5;
      traceDash="dash";
    }

    if(isSelected){
      traceOpacity=1.00;
      traceWidth=3.2;
      traceDash=isReference ? "dash" : "solid";
    }

    angularResponseTraces.push({
      x:thetaAxis,
      y:angularSpectra[i].curve,
      mode:"lines",
      name:isReference ? "reference · n = "+n.toFixed(3) :
           (isSelected ? "selected · n = "+n.toFixed(3) : "n = "+n.toFixed(3)),
      line:{width:traceWidth,dash:traceDash},
      opacity:traceOpacity,
      showlegend:!isIntermediate
    });

    angularResponseTraces.push({
      x:[angularSpectra[i].theta],
      y:[angularSpectra[i].R],
      mode:"markers",
      marker:{
        size:isSelected?11:(isReference?9:7),
        symbol:isReference&&!isSelected ? "circle-open" : "circle"
      },
      opacity:isSelected?1:(isReference?0.55:0.20),
      showlegend:false,
      hovertemplate:"n = "+n.toFixed(3)+
        "<br>θSPR = %{x:.3f}°<extra></extra>"
    });
  });

  Plotly.react("angResponse",angularResponseTraces,{
    margin:{l:50,r:10,t:44,b:48},
    xaxis:{title:"Incident angle, θ (deg)",range:[thetaMin,thetaMax]},
    yaxis:{title:"Reflectivity, R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.14,font:{size:8}}
  },{responsive:true,displaylogo:false});

  // Right: use exactly the revealed dip minima to build the calibration.
  const thetaStates=angularSpectra.map(x=>x.theta);
  const visibleAngularStates=angularStates.slice(0,selectedAngularIndex+1);
  const visibleThetaStates=thetaStates.slice(0,selectedAngularIndex+1);

  const angularCalibrationTraces=[];

  if(visibleAngularStates.length>1){
    angularCalibrationTraces.push({
      x:visibleAngularStates,
      y:visibleThetaStates,
      mode:"lines",
      line:{width:2.4},
      opacity:0.55,
      showlegend:false,
      hoverinfo:"skip"
    });
  }

  if(selectedAngularIndex>1){
    angularCalibrationTraces.push({
      x:visibleAngularStates.slice(1,-1),
      y:visibleThetaStates.slice(1,-1),
      mode:"markers",
      marker:{size:7},
      opacity:0.22,
      showlegend:false,
      hovertemplate:"n = %{x:.3f}<br>θSPR = %{y:.3f}°<extra></extra>"
    });
  }

  angularCalibrationTraces.push({
    x:[angularStates[0]],
    y:[thetaStates[0]],
    mode:"markers",
    marker:{size:10,symbol:"circle-open"},
    opacity:selectedAngularIndex===0?1:0.55,
    showlegend:false,
    hovertemplate:"reference<br>n = %{x:.3f}<br>θSPR = %{y:.3f}°<extra></extra>"
  });

  if(selectedAngularIndex>0){
    angularCalibrationTraces.push({
      x:[angN],
      y:[angCur.theta],
      mode:"markers",
      marker:{size:12},
      opacity:1,
      showlegend:false,
      hovertemplate:"selected<br>n = %{x:.3f}<br>θSPR = %{y:.3f}°<extra></extra>"
    });
  }

  Plotly.react("angCalibration",angularCalibrationTraces,{
    margin:{l:58,r:10,t:25,b:50},
    xaxis:{title:"Analyte refractive index (RIU)",range:[1.327,1.345]},
    yaxis:{title:"θSPR (deg)"}
  },{responsive:true,displaylogo:false});

  const angularDn=angN-referenceRI;
  const angularDtheta=angCur.theta-angRef.theta;
  const angularSensitivity=
    Math.abs(angularDn)>1e-12 ? angularDtheta/angularDn : null;

  document.getElementById("angRIValue").textContent=angN.toFixed(3)+" RIU";
  document.getElementById("angDn").textContent=
    angularDn.toFixed(3)+" RIU";
  document.getElementById("angDtheta").textContent=
    (angularDtheta>=0?"+":"")+angularDtheta.toFixed(3)+"°";
  document.getElementById("angSens").textContent=
    angularSensitivity===null ? "—" : angularSensitivity.toFixed(1)+" °/RIU";

  // INTENSITY INTERROGATION — progressively build the five-state calibration
  const riStates=[1.328,1.332,1.336,1.340,1.344];
  const intN=Number(intRI.value);
  let selectedIntensityIndex=0;
  for(let i=1;i<riStates.length;i++){
    if(Math.abs(riStates[i]-intN)<Math.abs(riStates[selectedIntensityIndex]-intN)){
      selectedIntensityIndex=i;
    }
  }
  const ti=Number(intOp.value);
  const stateCurves=riStates.map(n=>resonance(n));
  const sampledR=riStates.map(n=>reflectivity(ti,n,"p"));

  const responseTraces=[];
  riStates.forEach((n,i)=>{
    if(i>selectedIntensityIndex) return;

    const isReference=(i===0);
    const isSelected=(i===selectedIntensityIndex);
    const isIntermediate=(!isReference && !isSelected);

    let opacity=0.18, width=1.6, dash="solid";
    if(isReference){
      opacity=0.52; width=2.5; dash="dash";
    }
    if(isSelected){
      opacity=1.0; width=3.2;
      dash=isReference ? "dash" : "solid";
    }

    responseTraces.push({
      x:thetaAxis,y:stateCurves[i].curve,
      mode:"lines",
      name:isReference ? "reference · n = "+n.toFixed(3) :
           (isSelected ? "selected · n = "+n.toFixed(3) : "n = "+n.toFixed(3)),
      line:{width:width,dash:dash},
      opacity:opacity,
      showlegend:!isIntermediate
    });

    // These intersections are the measurements used on the calibration plot.
    responseTraces.push({
      x:[ti],y:[sampledR[i]],
      mode:"markers",
      marker:{
        size:isSelected?12:(isReference?10:7),
        symbol:isReference&&!isSelected ? "circle-open" : "circle"
      },
      opacity:isSelected?1:(isReference?0.62:0.18),
      showlegend:false,
      hovertemplate:"n = "+n.toFixed(3)+"<br>R(θop) = %{y:.3f}<extra></extra>"
    });
  });

  Plotly.react("intResponse",responseTraces,{
    margin:{l:50,r:10,t:44,b:48},
    xaxis:{title:"Angle (deg)",range:[thetaMin,thetaMax]},
    yaxis:{title:"Reflectivity, R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.14,font:{size:8}},
    shapes:[
      {type:"line",x0:ti,x1:ti,y0:0,y1:1,line:{width:1.3,dash:"dot"}}
    ],
    annotations:[
      {x:ti,y:0.97,text:"θop",showarrow:false,xshift:16,font:{size:10}}
    ]
  },{responsive:true,displaylogo:false});

  const visibleRI=riStates.slice(0,selectedIntensityIndex+1);
  const visibleR=sampledR.slice(0,selectedIntensityIndex+1);
  const calibrationTraces=[];

  if(visibleRI.length>1){
    calibrationTraces.push({
      x:visibleRI,y:visibleR,
      mode:"lines",
      line:{width:2.5},
      opacity:0.62,
      showlegend:false,
      hoverinfo:"skip"
    });
  }

  if(selectedIntensityIndex>1){
    calibrationTraces.push({
      x:visibleRI.slice(1,-1),
      y:visibleR.slice(1,-1),
      mode:"markers",
      marker:{size:7},
      opacity:0.22,
      showlegend:false,
      hovertemplate:"n = %{x:.3f}<br>R = %{y:.3f}<extra></extra>"
    });
  }

  calibrationTraces.push({
    x:[riStates[0]],y:[sampledR[0]],
    mode:"markers",
    marker:{size:11,symbol:"circle-open"},
    opacity:selectedIntensityIndex===0?1:0.62,
    showlegend:false,
    hovertemplate:"reference<br>n = %{x:.3f}<br>R = %{y:.3f}<extra></extra>"
  });

  if(selectedIntensityIndex>0){
    calibrationTraces.push({
      x:[riStates[selectedIntensityIndex]],
      y:[sampledR[selectedIntensityIndex]],
      mode:"markers",
      marker:{size:13},
      opacity:1,
      showlegend:false,
      hovertemplate:"selected<br>n = %{x:.3f}<br>R = %{y:.3f}<extra></extra>"
    });
  }

  Plotly.react("intCalibration",calibrationTraces,{
    margin:{l:58,r:10,t:25,b:50},
    xaxis:{title:"Analyte refractive index (RIU)",range:[1.327,1.345]},
    yaxis:{title:"Reflectivity, R",range:[0,1.03]}
  },{responsive:true,displaylogo:false});

  const selectedIntensityRI=riStates[selectedIntensityIndex];
  const span=sampledR[selectedIntensityIndex]-sampledR[0];

  // Local slope is calculated only from displayed calibration states.
  // Lower boundary: forward difference.
  // Upper boundary: backward difference.
  // Interior states: centered difference using the adjacent displayed RI states.
  let intSensitivity=null;
  let sensitivityLabel="—";

  if(selectedIntensityIndex===0){
    // Only the reference state is revealed, so there is not yet a visible
    // neighboring calibration point from which to calculate sensitivity.
    intSensitivity=null;
    sensitivityLabel="reveal another RI state";
  }else if(selectedIntensityIndex===1){
    intSensitivity=
      (sampledR[1]-sampledR[0])/(riStates[1]-riStates[0]);
    sensitivityLabel="forward slope at n = "+riStates[0].toFixed(3)+" RIU";
  }else if(selectedIntensityIndex<riStates.length-1){
    const i=selectedIntensityIndex;
    intSensitivity=
      (sampledR[i]-sampledR[i-2])/(riStates[i]-riStates[i-2]);
    sensitivityLabel=
      "centered visible slope about n = "+riStates[i-1].toFixed(3)+" RIU";
  }else{
    const i=selectedIntensityIndex;
    intSensitivity=
      (sampledR[i]-sampledR[i-1])/(riStates[i]-riStates[i-1]);
    sensitivityLabel="backward slope at n = "+riStates[i].toFixed(3)+" RIU";
  }

  // Check monotonicity of the revealed R(n) calibration.
  let behavior="insufficient points";
  if(visibleR.length>=2){
    const diffs=[];
    for(let i=1;i<visibleR.length;i++) diffs.push(visibleR[i]-visibleR[i-1]);
    const tol=1e-9;
    const hasPositive=diffs.some(d=>d>tol);
    const hasNegative=diffs.some(d=>d<-tol);
    behavior=(hasPositive && hasNegative) ? "non-monotonic" : "monotonic";
  }

  const selectedRes=stateCurves[selectedIntensityIndex];
  const angleOffset=Math.abs(ti-selectedRes.theta);
  const localAngularSlope=Math.abs(
    (reflectivity(ti+0.02,selectedIntensityRI,"p")-
     reflectivity(ti-0.02,selectedIntensityRI,"p"))/0.04
  );
  let region;
  if(angleOffset<0.12 || Math.abs(sampledR[selectedIntensityIndex]-selectedRes.R)<0.015){
    region="near resonance minimum";
  }else if(localAngularSlope>0.35){
    region="steep resonance flank";
  }else{
    region="far / shallow-slope region";
  }

  document.getElementById("intRIValue").textContent=selectedIntensityRI.toFixed(3)+" RIU";
  document.getElementById("intOpValue").textContent=ti.toFixed(2)+"°";
  document.getElementById("intRegion").textContent=region;
  document.getElementById("intDr").textContent=(span>=0?"+":"")+span.toFixed(3);
  document.getElementById("intSens").textContent=
    intSensitivity===null ? "—" : intSensitivity.toFixed(1)+" RIU⁻¹";
  document.getElementById("intSensAt").textContent=sensitivityLabel;
  document.getElementById("intBehavior").textContent=behavior;

  // WAVELENGTH INTERROGATION — five RI states at a fixed incidence angle
  const waveStates=[1.328,1.332,1.336,1.340,1.344];
  const wAngle=Number(waveAngle.value);
  const wN=Number(waveRI.value);
  const waveMin=650, waveMax=950, waveNpts=900;
  const waveAxis=Array.from({length:waveNpts},(_,i)=>waveMin+i*(waveMax-waveMin)/(waveNpts-1));
  const waveOpacities=[0.48,0.62,0.74,0.86,1.00];

  function spectralResonance(nd){
    const curve=waveAxis.map(l=>spectralReflectivity(l,wAngle,nd));
    let j=0;
    for(let i=1;i<curve.length;i++) if(curve[i]<curve[j]) j=i;
    return {lambda:waveAxis[j],R:curve[j],curve};
  }

  const stateSpectra=waveStates.map(n=>spectralResonance(n));
  let selectedIndex=0;
  for(let i=1;i<waveStates.length;i++){
    if(Math.abs(waveStates[i]-wN)<Math.abs(waveStates[selectedIndex]-wN)) selectedIndex=i;
  }
  const wRef=stateSpectra[0];
  const wCur=stateSpectra[selectedIndex];

  const waveTraces=[];
  waveStates.forEach((n,i)=>{
    // Progressive reveal: do not show RI states beyond the selected value.
    if(i>selectedIndex) return;

    const isReference=(i===0);
    const isSelected=(i===selectedIndex);
    const isIntermediate=(!isReference && !isSelected);

    let traceOpacity=0.18;
    let traceWidth=1.6;
    let traceDash="solid";

    if(isReference){
      traceOpacity=0.52;
      traceWidth=2.5;
      traceDash="dash";
    }
    if(isSelected){
      traceOpacity=1.00;
      traceWidth=3.2;
      traceDash=isReference ? "dash" : "solid";
    }

    waveTraces.push({
      x:waveAxis,
      y:stateSpectra[i].curve,
      mode:"lines",
      name:isReference ? "reference · n = "+n.toFixed(3) :
           (isSelected ? "selected · n = "+n.toFixed(3) : "n = "+n.toFixed(3)),
      line:{width:traceWidth,dash:traceDash},
      opacity:traceOpacity,
      showlegend:!isIntermediate
    });

    waveTraces.push({
      x:[stateSpectra[i].lambda],
      y:[stateSpectra[i].R],
      mode:"markers",
      marker:{
        size:isSelected?11:(isReference?9:7),
        symbol:isReference&&!isSelected ? "circle-open" : "circle"
      },
      opacity:isSelected?1:(isReference?0.55:0.20),
      showlegend:false,
      hovertemplate:"n = "+n.toFixed(3)+"<br>λSPR = %{x:.1f} nm<extra></extra>"
    });
  });

  Plotly.react("waveResponse",waveTraces,{
    margin:{l:52,r:10,t:44,b:50},
    xaxis:{title:"Wavelength (nm)",range:[waveMin,waveMax]},
    yaxis:{title:"Reflectivity, R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.14,font:{size:8}}
  },{responsive:true,displaylogo:false});

  // The calibration points are the resonance wavelengths extracted from
  // exactly the five spectral dips displayed on the left.
  const lambdaStates=stateSpectra.map(x=>x.lambda);
  const visibleWaveStates=waveStates.slice(0,selectedIndex+1);
  const visibleLambdaStates=lambdaStates.slice(0,selectedIndex+1);

  const waveCalibrationTraces=[];

  // A faint connecting calibration line only over the RI range revealed so far.
  if(visibleWaveStates.length>1){
    waveCalibrationTraces.push({
      x:visibleWaveStates,y:visibleLambdaStates,
      mode:"lines",
      line:{width:2.4},
      opacity:0.55,
      showlegend:false,
      hoverinfo:"skip"
    });
  }

  // Intermediate calibration points are deliberately quiet.
  if(selectedIndex>1){
    waveCalibrationTraces.push({
      x:visibleWaveStates.slice(1,-1),
      y:visibleLambdaStates.slice(1,-1),
      mode:"markers",
      marker:{size:7},
      opacity:0.22,
      showlegend:false,
      hovertemplate:"n = %{x:.3f}<br>λSPR = %{y:.1f} nm<extra></extra>"
    });
  }

  // Reference point: visible but restrained/open.
  waveCalibrationTraces.push({
    x:[referenceRI],y:[wRef.lambda],
    mode:"markers",
    marker:{size:10,symbol:"circle-open"},
    opacity:selectedIndex===0?1:0.55,
    showlegend:false,
    hovertemplate:"reference<br>n = %{x:.3f}<br>λSPR = %{y:.1f} nm<extra></extra>"
  });

  // Selected point: strongest visual weight.
  if(selectedIndex>0){
    waveCalibrationTraces.push({
      x:[wN],y:[wCur.lambda],
      mode:"markers",
      marker:{size:12},
      opacity:1,
      showlegend:false,
      hovertemplate:"selected<br>n = %{x:.3f}<br>λSPR = %{y:.1f} nm<extra></extra>"
    });
  }

  Plotly.react("waveCalibration",waveCalibrationTraces,{
    margin:{l:62,r:10,t:25,b:50},
    xaxis:{title:"Analyte refractive index (RIU)",range:[1.327,1.345]},
    yaxis:{title:"λSPR (nm)"}
  },{responsive:true,displaylogo:false});

  // Wavelength sensitivity is the visible reference-to-selected calibration slope.
  // This avoids differentiating a resonance location extracted from a discrete wavelength grid.
  const waveDn=wN-referenceRI;
  const waveDlambda=wCur.lambda-wRef.lambda;
  const waveSensitivity=
    Math.abs(waveDn)>1e-12 ? waveDlambda/waveDn : null;

  document.getElementById("waveAngleValue").textContent=wAngle.toFixed(2)+"°";
  document.getElementById("waveRIValue").textContent=wN.toFixed(3)+" RIU";
  document.getElementById("waveDn").textContent=waveDn.toFixed(3)+" RIU";
  document.getElementById("waveDlambda").textContent=
    (waveDlambda>=0?"+":"")+waveDlambda.toFixed(2)+" nm";
  document.getElementById("waveSens").textContent=
    waveSensitivity===null ? "—" : waveSensitivity.toFixed(0)+" nm/RIU";
}


const designRI=document.getElementById("designRI");
const angularDeltaN=document.getElementById("angularDeltaN");
const angularRes=document.getElementById("angularRes");
const waveDeltaN=document.getElementById("waveDeltaN");
const waveRes=document.getElementById("waveRes");

function spectralResAt(theta,nd){
  const waveMin=650,waveMax=950,N=900;
  const x=Array.from({length:N},(_,i)=>waveMin+i*(waveMax-waveMin)/(N-1));
  const y=x.map(l=>spectralReflectivity(l,theta,nd));
  let j=0; for(let i=1;i<y.length;i++)if(y[i]<y[j])j=i;
  const fit=parabolicMinimum(x,y,j);
  return {x,y,lambda:fit.x,R:fit.y};
}

// Choose one fixed wavelength-interrogation angle so the reference RI
// resonance starts near 750 nm under the corrected dispersive model.
function chooseWavelengthOperatingAngle(targetLambda=750,nd=1.328){
  let best={theta:60,error:Infinity,lambda:NaN};
  for(let th=60;th<=75;th+=0.05){
    const rr=spectralResAt(th,nd);
    const err=Math.abs(rr.lambda-targetLambda);
    if(err<best.error) best={theta:th,error:err,lambda:rr.lambda};
  }
  return best;
}
const wavelengthOperatingPoint=chooseWavelengthOperatingAngle(750,1.328);
const wavelengthOperatingAngle=wavelengthOperatingPoint.theta;

if(typeof waveAngle!=="undefined" && waveAngle){
  waveAngle.value=wavelengthOperatingAngle.toFixed(2);
}


function updateSensorDesign(){
  // ---------------- sensing range ----------------
  const nSel=Number(designRI.value);
  const rangeStates=[1.328,1.332,1.336,1.340,1.344,1.348,1.352,1.356,1.360];
  let sel=0;
  for(let i=1;i<rangeStates.length;i++){
    if(Math.abs(rangeStates[i]-nSel)<Math.abs(rangeStates[sel]-nSel))sel=i;
  }

  const angularRangeTraces=[];
  rangeStates.forEach((n,i)=>{
    if(i>sel)return;
    const rr=resonance(n);
    const ref=i===0, selected=i===sel, intermediate=!ref&&!selected;
    angularRangeTraces.push({
      x:thetaAxis,y:rr.curve,mode:"lines",
      name:ref?"reference · n="+n.toFixed(3):(selected?"selected · n="+n.toFixed(3):"n="+n.toFixed(3)),
      line:{width:selected?3.2:(ref?2.5:1.5),dash:ref?"dash":"solid"},
      opacity:selected?1:(ref?.52:.16),
      showlegend:!intermediate
    });
  });
  const aSel=resonance(rangeStates[sel]);
  Plotly.react("designAngularRange",angularRangeTraces,{
    margin:{l:50,r:10,t:38,b:45},
    xaxis:{title:"Incident angle (deg)",range:[60,75]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:8}},
    shapes:[{type:"rect",x0:64,x1:70,y0:0,y1:1.03,fillcolor:"rgba(120,120,120,.10)",line:{width:0},layer:"below"}]
  },{responsive:true,displaylogo:false});

  const waveRangeTraces=[];
  let wSel=null;
  rangeStates.forEach((n,i)=>{
    if(i>sel)return;
    const rr=spectralResAt(wavelengthOperatingAngle,n);
    if(i===sel)wSel=rr;
    const ref=i===0, selected=i===sel, intermediate=!ref&&!selected;
    waveRangeTraces.push({
      x:rr.x,y:rr.y,mode:"lines",
      name:ref?"reference · n="+n.toFixed(3):(selected?"selected · n="+n.toFixed(3):"n="+n.toFixed(3)),
      line:{width:selected?3.2:(ref?2.5:1.5),dash:ref?"dash":"solid"},
      opacity:selected?1:(ref?.52:.16),
      showlegend:!intermediate
    });
  });
  Plotly.react("designWaveRange",waveRangeTraces,{
    margin:{l:50,r:10,t:38,b:45},
    xaxis:{title:"Wavelength (nm)",range:[650,950]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:8}},
    shapes:[{type:"rect",x0:700,x1:900,y0:0,y1:1.03,fillcolor:"rgba(120,120,120,.10)",line:{width:0},layer:"below"}]
  },{responsive:true,displaylogo:false});

  designRIValue.textContent=rangeStates[sel].toFixed(3)+" RIU";
  designTheta.textContent=aSel.theta.toFixed(3)+"°";
  designThetaStatus.textContent=(aSel.theta>=64&&aSel.theta<=70)?"inside scan window":"outside scan window";
  designLambda.textContent=wSel.lambda.toFixed(1)+" nm";
  designLambdaStatus.textContent=(wSel.lambda>=700&&wSel.lambda<=900)?"inside spectral window":"outside spectral window";

  // ---------------- angular resolution ----------------
  const n0=1.328, nA=n0+Number(angularDeltaN.value);
  const a0=resonance(n0), a1=resonance(nA);
  const dth=Number(angularRes.value);
  const actualThetaShift=a1.theta-a0.theta;

  // Auto-zoom tightly around the two physical resonance positions.
  const aCenter=(a0.theta+a1.theta)/2;
  const aHalf=Math.max(0.55,Math.abs(actualThetaShift)*2.6,3*dth);
  const aZoomMin=aCenter-aHalf, aZoomMax=aCenter+aHalf;

  Plotly.react("angularIdealPlot",[
    {x:thetaAxis,y:a0.curve,mode:"lines",name:"reference",line:{width:2.2,dash:"dash"},opacity:.48},
    {x:thetaAxis,y:a1.curve,mode:"lines",name:"shifted",line:{width:2.8}}
  ],{
    margin:{l:46,r:8,t:34,b:42},
    xaxis:{title:"Angle (deg)",range:[aZoomMin,aZoomMax]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:8}}
  },{responsive:true,displaylogo:false});

  // Finite-resolution capture on the instrument's angular sampling grid.
  const angSamples=[];
  const sampleStart=Math.floor(aZoomMin/dth)*dth;
  for(let x=sampleStart;x<=aZoomMax+dth;x+=dth) angSamples.push(x);
  const angRefCaptured=angSamples.map(x=>reflectivity(x,n0,"p"));
  const angShiftCaptured=angSamples.map(x=>reflectivity(x,nA,"p"));
  let ar0=0,ar1=0;
  for(let i=1;i<angSamples.length;i++){
    if(angRefCaptured[i]<angRefCaptured[ar0])ar0=i;
    if(angShiftCaptured[i]<angShiftCaptured[ar1])ar1=i;
  }
  const reportedTheta0=angSamples[ar0], reportedTheta1=angSamples[ar1];
  const reportedThetaShift=reportedTheta1-reportedTheta0;
  const angularResolved=Math.abs(reportedThetaShift)>1e-12;

  Plotly.react("angularResolvedPlot",[
    {x:thetaAxis,y:a0.curve,mode:"lines",name:"physical ref.",line:{width:1.2,dash:"dash"},opacity:.12},
    {x:thetaAxis,y:a1.curve,mode:"lines",name:"physical shifted",line:{width:1.2},opacity:.12},
    {x:angSamples,y:angRefCaptured,mode:"lines+markers",name:"captured ref.",
     line:{width:1.8,dash:"dash"},marker:{size:4},opacity:.62},
    {x:angSamples,y:angShiftCaptured,mode:"lines+markers",name:"captured shifted",
     line:{width:2.2},marker:{size:4},opacity:.92}
  ],{
    margin:{l:46,r:8,t:34,b:42},
    xaxis:{title:"Angle (deg)",range:[aZoomMin,aZoomMax]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:7}}
  },{responsive:true,displaylogo:false});

  // Consequence: show the measurement trajectory from reference to selected RI.
  // Each point is: true RI -> finite-grid angular readout -> inferred RI.
  const calNmin=1.328, calNmax=1.3325, calNpts=241;
  const calNAxis=Array.from({length:calNpts},(_,i)=>
    calNmin+i*(calNmax-calNmin)/(calNpts-1)
  );
  const calTheta=calNAxis.map(n=>resonance(n).theta);

  function inferNFromTheta(thetaMeasured){
    let j=0;
    for(let i=1;i<calTheta.length;i++){
      if(Math.abs(calTheta[i]-thetaMeasured)<Math.abs(calTheta[j]-thetaMeasured)) j=i;
    }
    return calNAxis[j];
  }

  // Use the same fixed finite angular grid as the instrument panel.
  const consequenceAngGrid=[];
  const consequenceAngStart=Math.floor(63/dth)*dth;
  for(let x=consequenceAngStart;x<=69+dth;x+=dth) consequenceAngGrid.push(x);

  function sampledThetaForN(n){
    const yy=consequenceAngGrid.map(x=>reflectivity(x,n,"p"));
    let j=0;
    for(let i=1;i<yy.length;i++) if(yy[i]<yy[j]) j=i;
    return consequenceAngGrid[j];
  }

  const nTrue=nA;
  const trajectoryCount=3;
  const trajectoryTrue=Array.from({length:trajectoryCount},(_,i)=>
    n0+i*(nTrue-n0)/(trajectoryCount-1)
  );
  const trajectoryMeasured=trajectoryTrue.map(n=>
    inferNFromTheta(sampledThetaForN(n))
  );

  const nMeasured=trajectoryMeasured[trajectoryMeasured.length-1];
  const nError=nMeasured-nTrue;

  // Faint vertical connectors show the RI error for each measured state.
  const errorConnectors=trajectoryTrue.map((n,i)=>({
    type:"line",
    x0:n,x1:n,
    y0:Math.min(n,trajectoryMeasured[i]),
    y1:Math.max(n,trajectoryMeasured[i]),
    line:{width:i===trajectoryTrue.length-1?1.8:1.1,dash:"dot"},
    opacity:i===trajectoryTrue.length-1?.65:.28
  }));

  Plotly.react("angularConsequencePlot",[
    {
      x:[calNmin,calNmax],y:[calNmin,calNmax],
      mode:"lines",
      name:"ideal measurement",
      line:{width:2,dash:"dash"},
      opacity:.28
    },
    {
      x:trajectoryTrue,
      y:trajectoryMeasured,
      mode:"lines+markers",
      name:"finite-grid measurements",
      line:{width:.8},
      marker:{size:9},
      opacity:.52
    },
    {
      x:[n0],y:[trajectoryMeasured[0]],
      mode:"markers",
      marker:{size:13,symbol:"circle-open",line:{width:2}},
      name:"reference",
      showlegend:false
    },
    {
      x:[nTrue],y:[nTrue],
      mode:"markers",
      marker:{size:16,symbol:"circle-open",line:{width:2}},
      name:"true / ideal selected",
      showlegend:false
    },
    {
      x:[nTrue],y:[nMeasured],
      mode:"markers",
      marker:{size:16,symbol:"diamond"},
      name:"measured selected",
      showlegend:false
    }
  ],{
    margin:{l:70,r:28,t:58,b:58},
    xaxis:{
      title:"True refractive index (RIU)",
      range:[calNmin-0.00015,calNmax+0.00035],
      automargin:true,
      nticks:5
    },
    yaxis:{
      title:"Measured / inferred RI (RIU)",
      range:[calNmin-0.00015,calNmax+0.00035],
      automargin:true,
      nticks:5
    },
    legend:{
      orientation:"h",
      x:.5,xanchor:"center",
      y:1.16,
      font:{size:8}
    },
    shapes:errorConnectors,
    annotations:[
      {
        x:nTrue,y:nTrue,
        text:"true / ideal",
        showarrow:true,ax:-38,ay:-22,font:{size:9}
      },
      {
        x:nTrue,y:nMeasured,
        text:"measured",
        showarrow:true,ax:38,ay:22,font:{size:9}
      },
      {
        x:nTrue,y:(nTrue+nMeasured)/2,
        text:"RI error",
        showarrow:false,xshift:24,font:{size:9}
      }
    ]
  },{responsive:true,displaylogo:false});

  angularDeltaNValue.textContent="+"+Number(angularDeltaN.value).toFixed(4)+" RIU";
  angularResValue.textContent=dth.toFixed(2)+"°";
  const trueRIChange=nTrue-n0;
  const measuredRIChange=nMeasured-n0;
  actualDTheta.textContent=(trueRIChange>=0?"+":"")+trueRIChange.toFixed(4)+" RIU";
  reportedDTheta.textContent=(measuredRIChange>=0?"+":"")+measuredRIChange.toFixed(4)+" RIU";
  angularResolvedStatus.textContent=(nError>=0?"+":"")+nError.toFixed(4)+" RIU";

  // ---------------- wavelength resolution ----------------
  const nW=n0+Number(waveDeltaN.value);
  const w0=spectralResAt(wavelengthOperatingAngle,n0), w1=spectralResAt(wavelengthOperatingAngle,nW);
  const dl=Number(waveRes.value);
  const actualLambdaShift=w1.lambda-w0.lambda;

  const wCenter=(w0.lambda+w1.lambda)/2;
  const wHalf=Math.max(25,Math.abs(actualLambdaShift)*2.6,3*dl);
  const wZoomMin=wCenter-wHalf, wZoomMax=wCenter+wHalf;

  Plotly.react("waveIdealPlot",[
    {x:w0.x,y:w0.y,mode:"lines",name:"reference",line:{width:2.2,dash:"dash"},opacity:.48},
    {x:w1.x,y:w1.y,mode:"lines",name:"shifted",line:{width:2.8}}
  ],{
    margin:{l:46,r:8,t:34,b:42},
    xaxis:{title:"Wavelength (nm)",range:[wZoomMin,wZoomMax]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:8}}
  },{responsive:true,displaylogo:false});

  const waveSamples=[];
  const waveStart=Math.floor(wZoomMin/dl)*dl;
  for(let x=waveStart;x<=wZoomMax+dl;x+=dl)waveSamples.push(x);
  const waveRefCaptured=waveSamples.map(x=>spectralReflectivity(x,wavelengthOperatingAngle,n0));
  const waveShiftCaptured=waveSamples.map(x=>spectralReflectivity(x,wavelengthOperatingAngle,nW));
  let wr0=0,wr1=0;
  for(let i=1;i<waveSamples.length;i++){
    if(waveRefCaptured[i]<waveRefCaptured[wr0])wr0=i;
    if(waveShiftCaptured[i]<waveShiftCaptured[wr1])wr1=i;
  }
  const reportedLambda0=waveSamples[wr0], reportedLambda1=waveSamples[wr1];
  const reportedLambdaShift=reportedLambda1-reportedLambda0;
  const wavelengthResolved=Math.abs(reportedLambdaShift)>1e-12;

  Plotly.react("waveResolvedPlot",[
    {x:w0.x,y:w0.y,mode:"lines",name:"physical ref.",line:{width:1.2,dash:"dash"},opacity:.12},
    {x:w1.x,y:w1.y,mode:"lines",name:"physical shifted",line:{width:1.2},opacity:.12},
    {x:waveSamples,y:waveRefCaptured,mode:"lines+markers",name:"captured ref.",
     line:{width:1.8,dash:"dash"},marker:{size:4},opacity:.62},
    {x:waveSamples,y:waveShiftCaptured,mode:"lines+markers",name:"captured shifted",
     line:{width:2.2},marker:{size:4},opacity:.92}
  ],{
    margin:{l:46,r:8,t:34,b:42},
    xaxis:{title:"Wavelength (nm)",range:[wZoomMin,wZoomMax]},
    yaxis:{title:"R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.12,font:{size:7}}
  },{responsive:true,displaylogo:false});

  // Consequence: use the same three-state RI-error story approved for Angular.
  const wCalNmin=1.328, wCalNmax=1.3325, wCalNpts=181;
  const wCalNAxis=Array.from({length:wCalNpts},(_,i)=>
    wCalNmin+i*(wCalNmax-wCalNmin)/(wCalNpts-1)
  );
  const wCalLambda=wCalNAxis.map(n=>spectralResAt(wavelengthOperatingAngle,n).lambda);

  function inferNFromLambda(lambdaMeasured){
    let j=0;
    for(let i=1;i<wCalLambda.length;i++){
      if(Math.abs(wCalLambda[i]-lambdaMeasured) <
         Math.abs(wCalLambda[j]-lambdaMeasured)) j=i;
    }
    return wCalNAxis[j];
  }

  // Fixed finite spectral grid, matching the instrument-capture mechanism.
  const consequenceWaveGrid=[];
  const consequenceWaveStart=Math.floor(700/dl)*dl;
  for(let x=consequenceWaveStart;x<=900+dl;x+=dl) consequenceWaveGrid.push(x);

  function sampledLambdaForN(n){
    const yy=consequenceWaveGrid.map(x=>spectralReflectivity(x,wavelengthOperatingAngle,n));
    let j=0;
    for(let i=1;i<yy.length;i++) if(yy[i]<yy[j]) j=i;
    return consequenceWaveGrid[j];
  }

  const wTrue=nW;
  const wTrajectoryCount=3;
  const wTrajectoryTrue=Array.from({length:wTrajectoryCount},(_,i)=>
    n0+i*(wTrue-n0)/(wTrajectoryCount-1)
  );
  const wTrajectoryMeasured=wTrajectoryTrue.map(n=>
    inferNFromLambda(sampledLambdaForN(n))
  );

  const wMeasured=wTrajectoryMeasured[wTrajectoryMeasured.length-1];
  const wError=wMeasured-wTrue;

  const wErrorConnectors=wTrajectoryTrue.map((n,i)=>({
    type:"line",
    x0:n,x1:n,
    y0:Math.min(n,wTrajectoryMeasured[i]),
    y1:Math.max(n,wTrajectoryMeasured[i]),
    line:{width:i===wTrajectoryTrue.length-1?1.8:1.1,dash:"dot"},
    opacity:i===wTrajectoryTrue.length-1?.65:.28
  }));

  Plotly.react("waveConsequencePlot",[
    {
      x:[wCalNmin,wCalNmax],y:[wCalNmin,wCalNmax],
      mode:"lines",
      name:"ideal measurement",
      line:{width:2,dash:"dash"},
      opacity:.28
    },
    {
      x:wTrajectoryTrue,
      y:wTrajectoryMeasured,
      mode:"lines+markers",
      name:"finite-grid measurements",
      line:{width:.8},
      marker:{size:9},
      opacity:.46
    },
    {
      x:[n0],y:[wTrajectoryMeasured[0]],
      mode:"markers",
      marker:{size:13,symbol:"circle-open",line:{width:2}},
      name:"reference",
      showlegend:false
    },
    {
      x:[wTrue],y:[wTrue],
      mode:"markers",
      marker:{size:16,symbol:"circle-open",line:{width:2}},
      name:"true / ideal selected",
      showlegend:false
    },
    {
      x:[wTrue],y:[wMeasured],
      mode:"markers",
      marker:{size:16,symbol:"diamond"},
      name:"measured selected",
      showlegend:false
    }
  ],{
    margin:{l:70,r:28,t:58,b:58},
    xaxis:{
      title:"True refractive index (RIU)",
      range:[wCalNmin-0.00015,wCalNmax+0.00035],
      automargin:true,
      nticks:5
    },
    yaxis:{
      title:"Measured / inferred RI (RIU)",
      range:[wCalNmin-0.00015,wCalNmax+0.00035],
      automargin:true,
      nticks:5
    },
    legend:{
      orientation:"h",
      x:.5,xanchor:"center",
      y:1.16,
      font:{size:8}
    },
    shapes:wErrorConnectors,
    annotations:[
      {
        x:wTrue,y:wTrue,
        text:"true / ideal",
        showarrow:true,ax:-38,ay:-22,font:{size:9}
      },
      {
        x:wTrue,y:wMeasured,
        text:"measured",
        showarrow:true,ax:38,ay:22,font:{size:9}
      },
      {
        x:wTrue,y:(wTrue+wMeasured)/2,
        text:"RI error",
        showarrow:false,xshift:24,font:{size:9}
      }
    ]
  },{responsive:true,displaylogo:false});

  waveDeltaNValue.textContent="+"+Number(waveDeltaN.value).toFixed(4)+" RIU";
  waveResValue.textContent=dl.toFixed(1)+" nm";
  const wTrueRIChange=wTrue-n0;
  const wMeasuredRIChange=wMeasured-n0;
  actualDLambda.textContent=(wTrueRIChange>=0?"+":"")+wTrueRIChange.toFixed(4)+" RIU";
  reportedDLambda.textContent=(wMeasuredRIChange>=0?"+":"")+wMeasuredRIChange.toFixed(4)+" RIU";
  waveResolvedStatus.textContent=(wError>=0?"+":"")+wError.toFixed(4)+" RIU";
}


const bioTime=document.getElementById("bioTime");
const bioSurface=document.getElementById("bioSurface");

for(let i=0;i<7;i++){
  const r=document.createElement("span");
  r.className="receptor";
  r.style.left=(16+i*11.5)+"%";
  bioSurface.appendChild(r);
}
const bioDots=[];
for(let i=0;i<7;i++){
  const d=document.createElement("span");
  d.className="analyte-dot";
  bioSurface.appendChild(d);
  bioDots.push(d);
}

function updateApplication(){
  // 4.1 is intentionally a process demonstration, not a kinetics experiment.
  // Kinetic parameters are fixed here; 4.2 exposes them as controls.
  const selectedTime=Number(bioTime.value);
  const cNm=50;
  const ka=2.0e5;       // M^-1 s^-1
  const kd=2.0e-3;      // s^-1
  const cM=cNm*1e-9;
  const KD=kd/ka;
  const thetaEq=cM/(cM+KD);

  const tAssocStart=30,tAssocEnd=210,tEnd=360;
  const kobs=ka*cM+kd;
  const assocDuration=tAssocEnd-tAssocStart;
  const occEnd=thetaEq*(1-Math.exp(-kobs*assocDuration));

  function appOccupancyAt(time){
    if(time<tAssocStart) return 0;
    if(time<=tAssocEnd)
      return thetaEq*(1-Math.exp(-kobs*(time-tAssocStart)));
    return occEnd*Math.exp(-kd*(time-tAssocEnd));
  }

  const qNow=appOccupancyAt(selectedTime);
  let phaseText;
  if(selectedTime<tAssocStart) phaseText="Baseline — buffer flowing";
  else if(selectedTime<=tAssocEnd) phaseText="Association — analyte flowing";
  else phaseText="Dissociation — buffer flowing";

  const maxSurfaceDn=0.004;
  const dnNow=maxSurfaceDn*qNow;
  const nRef=1.328;
  const nCurrent=nRef+dnNow;
  const refRes=resonance(nRef);
  const currentRes=resonance(nCurrent);
  const dtheta=currentRes.theta-refRes.theta;

  // Panel 2: current resonance state versus baseline.
  Plotly.react("bioAnglePlot",[
    {
      x:thetaAxis,y:refRes.curve,mode:"lines",
      name:"baseline",
      line:{width:2.2,dash:"dash"},opacity:.42
    },
    {
      x:thetaAxis,y:currentRes.curve,mode:"lines",
      name:"current state",
      line:{width:2.8}
    },
    {
      x:[refRes.theta,currentRes.theta],
      y:[refRes.R,currentRes.R],
      mode:"markers",
      marker:{size:[9,11]},
      showlegend:false
    }
  ],{
    margin:{l:48,r:10,t:38,b:46},
    xaxis:{title:"Incident angle (deg)",range:[64.5,68.5]},
    yaxis:{title:"Reflectivity, R",range:[0,1.03]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.13,font:{size:8}},
    annotations:[{
      x:(refRes.theta+currentRes.theta)/2,y:.10,
      text:"ΔθSPR = "+dtheta.toFixed(3)+"°",
      showarrow:false,font:{size:10}
    }]
  },{responsive:true,displaylogo:false});

  // Panel 3: full sensorgram with selected-time marker and explicit flow sequence.
  const t=[],response=[];
  for(let time=0;time<=tEnd;time+=2){
    const q=appOccupancyAt(time);
    const thetaNow=resonance(nRef+maxSurfaceDn*q).theta;
    t.push(time);
    response.push(thetaNow-refRes.theta);
  }

  Plotly.react("sensorgramPlot",[
    {
      x:t,y:response,mode:"lines",
      name:"SPR angular shift",
      line:{width:2.7},showlegend:false
    },
    {
      x:[selectedTime],y:[dtheta],mode:"markers",
      marker:{size:13},showlegend:false,
      hovertemplate:"%{x:.0f} s<br>ΔθSPR = %{y:.3f}°<extra></extra>"
    }
  ],{
    margin:{l:54,r:10,t:46,b:46},
    xaxis:{title:"Time (s)",range:[0,tEnd]},
    yaxis:{title:"ΔθSPR (deg)",rangemode:"tozero"},
    shapes:[
      {type:"rect",x0:0,x1:tAssocStart,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.04)",line:{width:0},layer:"below"},
      {type:"rect",x0:tAssocStart,x1:tAssocEnd,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.09)",line:{width:0},layer:"below"},
      {type:"rect",x0:tAssocEnd,x1:tEnd,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.04)",line:{width:0},layer:"below"},
      {type:"line",x0:tAssocStart,x1:tAssocStart,y0:0,y1:1,yref:"paper",line:{width:1,dash:"dot"}},
      {type:"line",x0:tAssocEnd,x1:tAssocEnd,y0:0,y1:1,yref:"paper",line:{width:1,dash:"dot"}}
    ],
    annotations:[
      {x:15,y:1.09,yref:"paper",text:"BUFFER",showarrow:false,font:{size:9}},
      {x:120,y:1.09,yref:"paper",text:"ANALYTE",showarrow:false,font:{size:9}},
      {x:285,y:1.09,yref:"paper",text:"BUFFER",showarrow:false,font:{size:9}}
    ]
  },{responsive:true,displaylogo:false});

  // Panel 1: surface state follows selected time.
  bioDots.forEach((d,i)=>{
    const bound=(i+0.5)/bioDots.length<=qNow;
    if(bound){
      d.style.left=(15.5+i*11.5)+"%";
      d.style.top="192px";
      d.style.opacity="1";
    }else{
      d.style.left=(12+i*11.5)+"%";
      d.style.top=(48+(i%3)*35)+"px";
      d.style.opacity=(selectedTime>tAssocEnd)?".18":".42";
    }
  });

  bioTimeValue.textContent=selectedTime.toFixed(0)+" s";
  bioPhaseValue.textContent=phaseText;
  bioOccupancy.textContent=(100*qNow).toFixed(1)+"%";
  bioDn.textContent="+"+dnNow.toFixed(4)+" RIU";
  bioDtheta.textContent=(dtheta>=0?"+":"")+dtheta.toFixed(3)+"°";
}

const kineticsSurface=document.getElementById("kineticsSurface");
const kineticsTime=document.getElementById("kineticsTime");
const kineticsConcentration=document.getElementById("kineticsConcentration");
const kineticsKa=document.getElementById("kineticsKa");
const kineticsKd=document.getElementById("kineticsKd");

for(let i=0;i<7;i++){
  const r=document.createElement("span");
  r.className="kinetics-receptor";
  r.style.left=(16+i*11.5)+"%";
  kineticsSurface.appendChild(r);
}
const kineticsDots=[];
for(let i=0;i<7;i++){
  const d=document.createElement("span");
  d.className="kinetics-dot";
  kineticsSurface.appendChild(d);
  kineticsDots.push(d);
}

function updateKinetics(){
  const selectedTime=Number(kineticsTime.value);
  const cNm=Number(kineticsConcentration.value);
  const ka=Number(kineticsKa.value)*1e5;
  const kd=Number(kineticsKd.value)*1e-3;
  const cM=cNm*1e-9;
  const KD=kd/ka;

  const tAssocStart=30,tAssocEnd=210,tEnd=360;
  const thetaEq=cM/(cM+KD);
  const kobs=ka*cM+kd;
  const occEnd=thetaEq*(1-Math.exp(-kobs*(tAssocEnd-tAssocStart)));

  function occupancyAt(time){
    if(time<tAssocStart) return 0;
    if(time<=tAssocEnd)
      return thetaEq*(1-Math.exp(-kobs*(time-tAssocStart)));
    return occEnd*Math.exp(-kd*(time-tAssocEnd));
  }

  const t=[],occ=[],resp=[];
  const nRef=1.328,maxSurfaceDn=0.004;
  const theta0=resonance(nRef).theta;
  for(let time=0;time<=tEnd;time+=2){
    const q=occupancyAt(time);
    t.push(time);occ.push(q);
    resp.push(resonance(nRef+maxSurfaceDn*q).theta-theta0);
  }

  const qNow=occupancyAt(selectedTime);
  const responseNow=resonance(nRef+maxSurfaceDn*qNow).theta-theta0;
  let phase;
  if(selectedTime<tAssocStart) phase="baseline";
  else if(selectedTime<=tAssocEnd) phase="association";
  else phase="dissociation";

  Plotly.react("kineticsPlot",[
    {x:t,y:resp,mode:"lines",line:{width:2.6},name:"sensorgram",showlegend:false},
    {x:[selectedTime],y:[responseNow],mode:"markers",marker:{size:13},name:"selected time",showlegend:false}
  ],{
    margin:{l:55,r:10,t:42,b:46},
    xaxis:{title:"Time (s)",range:[0,tEnd]},
    yaxis:{title:"ΔθSPR (deg)",rangemode:"tozero"},
    shapes:[
      {type:"rect",x0:0,x1:tAssocStart,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.05)",line:{width:0},layer:"below"},
      {type:"rect",x0:tAssocStart,x1:tAssocEnd,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.09)",line:{width:0},layer:"below"},
      {type:"rect",x0:tAssocEnd,x1:tEnd,y0:0,y1:1,yref:"paper",fillcolor:"rgba(120,120,120,.04)",line:{width:0},layer:"below"},
      {type:"line",x0:tAssocStart,x1:tAssocStart,y0:0,y1:1,yref:"paper",line:{width:1,dash:"dot"}},
      {type:"line",x0:tAssocEnd,x1:tAssocEnd,y0:0,y1:1,yref:"paper",line:{width:1,dash:"dot"}}
    ],
    annotations:[
      {x:15,y:1.08,yref:"paper",text:"BUFFER",showarrow:false,font:{size:9}},
      {x:120,y:1.08,yref:"paper",text:"ANALYTE",showarrow:false,font:{size:9}},
      {x:285,y:1.08,yref:"paper",text:"BUFFER",showarrow:false,font:{size:9}}
    ]
  },{responsive:true,displaylogo:false});

  kineticsDots.forEach((d,i)=>{
    const bound=(i+0.5)/kineticsDots.length<=qNow;
    if(bound){
      d.style.left=(15.5+i*11.5)+"%";
      d.style.top="181px";
      d.style.opacity="1";
    }else{
      d.style.left=(12+i*11.5)+"%";
      d.style.top=(42+(i%3)*34)+"px";
      d.style.opacity=phase==="dissociation"?".20":".42";
    }
  });

  kineticsPhase.textContent=phase;
  kineticsTimeValue.textContent=selectedTime.toFixed(0)+" s";
  kineticsConcentrationValue.textContent=cNm.toFixed(0)+" nM";
  kineticsKaValue.textContent=(ka/1e5).toFixed(1)+" × 10⁵ M⁻¹ s⁻¹";
  kineticsKdValue.textContent=(kd/1e-3).toFixed(1)+" × 10⁻³ s⁻¹";
  kineticsPhaseReadout.textContent=phase;
  kineticsOccupancy.textContent=(100*qNow).toFixed(1)+"%";
  kineticsKD.textContent=(KD*1e9).toFixed(1)+" nM";
  kineticsResponse.textContent=(responseNow>=0?"+":"")+responseNow.toFixed(3)+"°";
}

function update(){
  const th=Number(angle.value), nd=Number(ri.value);
  const Rp=thetaAxis.map(t=>reflectivity(t,nd,"p"));
  const RpReference=thetaAxis.map(t=>reflectivity(t,referenceRI,"p"));
  let minI=0;
  for(let i=1;i<Rp.length;i++) if(Rp[i]<Rp[minI]) minI=i;
  const thetaRes=thetaAxis[minI];
  const rSel=reflectivity(th,nd,"p");

  const traces=[];

  // Fixed visual memory of the baseline resonance.
  // Hide it at the exact baseline to avoid drawing two identical curves.
  if(Math.abs(nd-referenceRI)>1e-9){
    traces.push({
      x:thetaAxis,
      y:RpReference,
      mode:"lines",
      name:"TM reference · n = 1.328",
      line:{width:2,dash:"dash"},
      opacity:0.22
    });
  }

  traces.push({
    x:thetaAxis,
    y:Rp,
    mode:"lines",
    name:"TM / p · selected n",
    line:{width:3}
  });
  if(showTE.checked){
    traces.push({x:thetaAxis,y:thetaAxis.map(t=>reflectivity(t,nd,"s")),
      mode:"lines",name:"TE / s",line:{width:2,dash:"dash"}});
  }
  traces.push({
    x:[th],y:[rSel],mode:"markers",name:"selected angle",
    marker:{size:11},showlegend:false
  });

  Plotly.react("sprPlot",traces,{
    margin:{l:62,r:18,t:38,b:58},
    xaxis:{title:"Incident angle, θ (deg)",range:[thetaMin,thetaMax]},
    yaxis:{title:"Reflectivity, R",range:[0,1.05]},
    legend:{orientation:"h",x:.5,xanchor:"center",y:1.09},
    shapes:[{
      type:"line",x0:thetaRes,x1:thetaRes,y0:0,y1:1,
      line:{width:1.3,dash:"dot"}
    }],
    annotations:[{
      x:thetaRes,y:.98,text:"θSPR",showarrow:false,xshift:16,font:{size:11}
    }]
  },{responsive:true,displaylogo:false});

  angleValue.textContent=th.toFixed(2);
  riValue.textContent=nd.toFixed(3);
  schematicRI.textContent="n = "+nd.toFixed(3);
  selectedAngle.textContent=th.toFixed(3)+"°";
  selectedR.textContent=rSel.toFixed(3);
  resAngle.textContent=thetaRes.toFixed(3)+"°";
  angleLabel.textContent="θ = "+th.toFixed(2)+"°";

  // Schematic ray rotation around the interface point.
  // Visual mapping only; the numerical angle remains the physical incidence angle.
  const visual=25+(th-thetaMin)/(thetaMax-thetaMin)*24;
  beamIn.style.transform="rotate("+(180+visual)+"deg)";
  beamOut.style.transform="rotate("+(-visual)+"deg)";

  // Qualitative coupling strength based on depth relative to off-resonant reflection.
  const coupling=Math.max(0,Math.min(1,1-rSel));
  spWave.style.opacity=(0.12+0.88*coupling).toFixed(2);
  updateInterrogation(nd);
  updateSensorDesign();
  updateApplication();
  updateKinetics();
}

angle.addEventListener("input",update);
ri.addEventListener("input",update);
showTE.addEventListener("change",update);
angRI.addEventListener("input",()=>updateInterrogation(Number(ri.value)));
intRI.addEventListener("input",()=>updateInterrogation(Number(ri.value)));
intOp.addEventListener("input",()=>updateInterrogation(Number(ri.value)));
waveAngle.addEventListener("input",()=>updateInterrogation(Number(ri.value)));
waveRI.addEventListener("input",()=>updateInterrogation(Number(ri.value)));
designRI.addEventListener("input",updateSensorDesign);
angularDeltaN.addEventListener("input",updateSensorDesign);
angularRes.addEventListener("input",updateSensorDesign);
waveDeltaN.addEventListener("input",updateSensorDesign);
waveRes.addEventListener("input",updateSensorDesign);
bioTime.addEventListener("input",updateApplication);
kineticsTime.addEventListener("input",updateKinetics);
kineticsConcentration.addEventListener("input",updateKinetics);
kineticsKa.addEventListener("input",updateKinetics);
kineticsKd.addEventListener("input",updateKinetics);
update();
/* =========================================================
   SPR — POST-LAYOUT PLOTLY REFLOW
   al-folio may finalize the demo width after Plotly's
   initial render. Re-measure plots once layout has settled.
   ========================================================= */

(function () {
  function resizeSprPlots() {
    if (typeof Plotly === "undefined") return;

    document
      .querySelectorAll(".spr-demo .js-plotly-plot")
      .forEach(function (plot) {
        try {
          Plotly.Plots.resize(plot);
        } catch (e) {
          console.warn("SPR plot resize skipped:", e);
        }
      });
  }

  function stagedResize() {
    // First: after the browser completes the current layout.
    requestAnimationFrame(function () {
      requestAnimationFrame(resizeSprPlots);
    });

    // Then catch fonts / Bootstrap / al-folio layout settling.
    setTimeout(resizeSprPlots, 100);
    setTimeout(resizeSprPlots, 300);
    setTimeout(resizeSprPlots, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stagedResize);
  } else {
    stagedResize();
  }

  window.addEventListener("load", stagedResize);
  window.addEventListener("resize", resizeSprPlots);
})();
