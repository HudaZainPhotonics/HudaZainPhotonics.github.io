---
layout: page
title: "Pipeline State Detection and Intelligent Decisions"
permalink: /demos/das-pipeline-decision/
---

<div class="das-decision-demo">
<p class="lead">Part 1 follows one mechanical disturbance from the pipeline environment into repeated distributed acoustic sensing measurements.</p>

<nav class="tabs" aria-label="Demo parts">
 <a class="tab active" href="#part1"><small>Part 1</small><strong>Event → Measurement</strong></a>
 <a class="tab" href="#part2"><small>Part 2</small><strong>Signal + Interference</strong></a>
 <a class="tab" href="#part3"><small>Part 3</small><strong>Detection → Alarm</strong></a>
 <a class="tab" href="#part4"><small>Part 4</small><strong>Detection → Interpretation</strong></a>
 <a class="tab" href="#part5"><small>Part 5</small><strong>How Much Intelligence?</strong></a>
</nav>

<section class="part" id="part1">
<div class="kicker">PART 1</div>
<h2> A Physical Event  Translates to a DAS Measurement</h2>
<p class="question">How does one mechanical disturbance become the distance × time data displayed by a DAS system?</p>

<div class="dashboard">
<div class="card">
    <h3>1. Physical environment</h3>
    <svg id="scene" class="scene" viewBox="0 0 390 430" aria-label="Buried steel pipeline with parallel sensing fiber">
  <defs>
    <linearGradient id="steel" x1="0" x2="1">
      <stop offset="0" stop-color="#555d62"/>
      <stop offset=".12" stop-color="#9da5aa"/>
      <stop offset=".32" stop-color="#e8ecee"/>
      <stop offset=".52" stop-color="#f8f9f9"/>
      <stop offset=".72" stop-color="#c6ccd0"/>
      <stop offset=".9" stop-color="#858d92"/>
      <stop offset="1" stop-color="#50585d"/>
    </linearGradient>
    <linearGradient id="joint" x1="0" x2="1">
      <stop offset="0" stop-color="#454c50"/><stop offset=".5" stop-color="#8e969b"/><stop offset="1" stop-color="#454c50"/>
    </linearGradient>
  </defs>
  <rect width="390" height="430" fill="#d9c7a6"/>

  <!-- Longitudinal buried steel pipe -->
  <rect x="151" y="28" width="94" height="374" rx="47" fill="#4e565b"/>
  <rect x="162" y="38" width="72" height="354" rx="36" fill="url(#steel)"/>
  <!-- weld / coupling bands -->
  <g>
    <rect x="148" y="112" width="100" height="13" rx="4" fill="url(#joint)"/>
    <rect x="148" y="211" width="100" height="13" rx="4" fill="url(#joint)"/>
    <rect x="148" y="310" width="100" height="13" rx="4" fill="url(#joint)"/>
    <line x1="157" y1="116" x2="239" y2="116" stroke="#d8dde0" stroke-width="2" opacity=".65"/>
    <line x1="157" y1="215" x2="239" y2="215" stroke="#d8dde0" stroke-width="2" opacity=".65"/>
    <line x1="157" y1="314" x2="239" y2="314" stroke="#d8dde0" stroke-width="2" opacity=".65"/>
  </g>
  <text x="198" y="419" text-anchor="middle" font-size="15" font-weight="600" fill="#3f464a">buried steel pipeline</text>

  <!-- parallel sensing cable -->
  <line x1="101" y1="35" x2="101" y2="395" stroke="#d59c35" stroke-width="7"/>
  <line x1="101" y1="35" x2="101" y2="395" stroke="#f1c363" stroke-width="2"/>
  <text x="101" y="21" text-anchor="middle" font-size="14" font-weight="600" fill="#6f5421">sensing fiber</text>

  <!-- event and coupling -->
  <g id="event">
    <circle cx="42" cy="180" r="10" fill="#c65d4b"/>
    <text x="42" y="151" text-anchor="middle" font-size="14" font-weight="600" fill="#25292d">disturbance</text>
    <path id="waveA" d="M55 168 Q69 180 55 192" fill="none" stroke="#c65d4b" stroke-width="2.5"/>
    <path id="waveB" d="M63 158 Q84 180 63 202" fill="none" stroke="#c65d4b" stroke-width="2.5"/>
    <path id="waveC" d="M72 148 Q101 180 72 212" fill="none" stroke="#c65d4b" stroke-width="2.5"/>
  </g>

  <!-- gauge interval -->
  <g id="gauge">
    <rect id="gaugeRect" x="91" y="168" width="20" height="24" rx="3" fill="#0076a8" opacity=".24"/>
    <line id="gaugeLine" x1="121" y1="168" x2="121" y2="192" stroke="#0076a8" stroke-width="4"/>
    <line id="capL" x1="115" y1="168" x2="127" y2="168" stroke="#0076a8" stroke-width="3"/>
    <line id="capR" x1="115" y1="192" x2="127" y2="192" stroke="#0076a8" stroke-width="3"/>
    <text id="gaugeText" x="132" y="185" font-size="14" font-weight="600" fill="#0076a8">Lg</text>
  </g>

  <!-- distance axis -->
  <line x1="316" y1="35" x2="316" y2="395" stroke="#555" stroke-width="1.5"/>
  <path d="M311 385 L316 397 L321 385" fill="#555"/>
  <text x="330" y="49" font-size="13" font-weight="600" fill="#444">0 m</text>
  <text x="330" y="397" font-size="13" font-weight="600" fill="#444">1000 m</text>
  <text x="345" y="215" transform="rotate(90 345 215)" text-anchor="middle" font-size="14" font-weight="600" fill="#444">Distance, x</text>
</svg>

    <div class="control"><label>Event location <strong id="locOut">420 m</strong></label><input id="loc" type="range" min="80" max="920" step="10" value="420"></div>
    <div class="control"><label>Fiber-environment coupling <strong id="coupleOut">0.75</strong></label><input id="couple" type="range" min="15" max="100" value="75"></div>
    <div class="control"><label>Gauge length <strong id="gaugeOut">20 m</strong></label><input id="gaugeLen" type="range" min="4" max="80" step="2" value="20"></div>
  </div>

  
<div class="rightstack">
<div class="card" style="padding:9px 14px">
  <div class="control" style="margin:0"><label>Number of traces acquired <strong id="traceOut">10 of 10</strong></label><input id="traceCount" type="range" min="1" max="10" step="1" value="10"></div>
  
</div>
<div class="card">
    <h3>2. Successive DAS traces</h3>
    <p class="muted" style="font-size:.82rem;margin-top:-3px"><strong>Fast time → distance.</strong> Trace-to-trace progression → <strong>slow time.</strong></p>
    <svg id="traceStack" class="trace-svg" viewBox="0 0 600 310" aria-label="Pseudo-3D stack of DAS traces"></svg>
  </div>

<div class="card">
  <h3>3. Why DAS data are spatiotemporal</h3>
  <p class="muted" style="font-size:.82rem">Each trace measures the fiber in <strong>space</strong>. Repeating the measurement through <strong>slow time</strong> produces the spatiotemporal DAS dataset <em>S</em>(<em>x</em>,<em>t</em>).</p>
  <svg id="map" class="map-svg" viewBox="0 0 1080 330" aria-label="DAS distance versus slow time map"></svg>
  
</div>
</div>
</div>

<div class="model"><strong>Teaching model.</strong> A localized dynamic strain field is generated around the event position. Coupling scales how strongly the disturbance reaches the fiber. The finite gauge length spatially averages that field. Ten successive synthetic interrogations form one distance × slow-time dataset. This is not a pipeline-soil acoustic propagation model.</div>
<div class="note"><strong>Core idea:</strong> one probe pulse gives a distributed trace along the fiber. Repeating the interrogation produces slow-time evolution. The familiar DAS distance-time image is another view of that same stack of traces.</div>
</section>

<section class="part" id="part2" style="margin-top:34px">
<div class="kicker">PART 2</div>
<h2>Signal, Noise, and Non-Target Disturbances</h2>
<p class="question">A DAS system records vibration. How much of that measurement actually belongs to the event we care about?</p>

<div class="p2-grid">
  <div class="card">
    <h3>1. What is happening around the pipeline?</h3>
    <svg id="p2scene" class="p2-scene" viewBox="0 0 500 270" aria-label="Pipeline environment with digging, vehicle, and background noise">
  <defs>
    <linearGradient id="p2steel" x1="0" x2="1">
      <stop offset="0" stop-color="#555d62"/><stop offset=".18" stop-color="#aeb5b9"/>
      <stop offset=".48" stop-color="#edf0f1"/><stop offset=".78" stop-color="#a9b0b4"/><stop offset="1" stop-color="#535b60"/>
    </linearGradient>
  </defs>
  <rect width="500" height="270" fill="#eef4f6"/>
  <rect y="88" width="500" height="182" fill="#d9c7a6"/>
  <line x1="0" y1="88" x2="500" y2="88" stroke="#aa9676" stroke-width="2"/>

  <!-- excavator / digging target -->
  <g transform="translate(78 22)">
    <rect x="0" y="34" width="42" height="20" rx="4" fill="#d8a338"/>
    <circle cx="9" cy="58" r="7" fill="#4f565a"/><circle cx="34" cy="58" r="7" fill="#4f565a"/>
    <rect x="8" y="18" width="24" height="20" rx="3" fill="#e1b24b"/>
    <line x1="28" y1="21" x2="50" y2="2" stroke="#c65d4b" stroke-width="5"/>
    <line x1="50" y1="2" x2="61" y2="32" stroke="#c65d4b" stroke-width="5"/>
    <path d="M56 31 l13 0 l-6 9 z" fill="#c65d4b"/>
    <text x="28" y="-7" text-anchor="middle" font-size="14" font-weight="600">digging</text>
    <text x="28" y="77" text-anchor="middle" font-size="11" font-weight="600" fill="#b04d3e">TARGET</text>
  </g>

  <!-- vehicle non-target -->
  <g transform="translate(335 34)">
    <rect x="0" y="18" width="88" height="30" rx="7" fill="#7f888d"/>
    <path d="M18 18 l13 -18 h35 l15 18" fill="#aeb5b9"/>
    <rect x="35" y="4" width="26" height="13" rx="2" fill="#dce3e6"/>
    <circle cx="18" cy="52" r="10" fill="#444b4f"/><circle cx="70" cy="52" r="10" fill="#444b4f"/>
    <circle cx="18" cy="52" r="4" fill="#b9c0c4"/><circle cx="70" cy="52" r="4" fill="#b9c0c4"/>
    <text x="44" y="-9" text-anchor="middle" font-size="14" font-weight="600">passing vehicle</text>
    <text x="44" y="76" text-anchor="middle" font-size="11" font-weight="600" fill="#8b6928">NON-TARGET</text>
  </g>

  <!-- sensing fiber -->
  <line x1="55" y1="151" x2="445" y2="151" stroke="#d59c35" stroke-width="6"/>
  <line x1="55" y1="151" x2="445" y2="151" stroke="#f1c363" stroke-width="2"/>
  <text x="60" y="140" font-size="13" font-weight="600" fill="#6f5421">sensing fiber</text>

  <!-- realistic longitudinal pipe -->
  <rect x="70" y="191" width="360" height="52" rx="26" fill="#525a5f"/>
  <rect x="80" y="201" width="340" height="32" rx="16" fill="url(#p2steel)"/>
  <g stroke="#4c5458" stroke-width="6">
    <line x1="170" y1="193" x2="170" y2="241"/><line x1="285" y1="193" x2="285" y2="241"/>
  </g>
  <g stroke="#dce0e2" stroke-width="2" opacity=".65">
    <line x1="174" y1="199" x2="174" y2="235"/><line x1="289" y1="199" x2="289" y2="235"/>
  </g>
  <text x="250" y="262" text-anchor="middle" font-size="13" font-weight="600" fill="#41484c">buried steel pipeline</text>

  <!-- background/system noise -->
  <g id="p2noise" opacity=".65">
    <path d="M18 128 q10 -12 20 0 t20 0 t20 0" fill="none" stroke="#858b90" stroke-width="2"/>
    <path d="M420 128 q10 -12 20 0 t20 0 t20 0" fill="none" stroke="#858b90" stroke-width="2"/>
  </g>
</svg>
    <div class="control"><label>Target strength <strong id="p2targetOut">0.75</strong></label><input id="p2target" type="range" min="10" max="100" value="75"></div>
    <div class="control"><label>Passing vehicle strength <strong id="p2vehicleOut">0.60</strong></label><input id="p2vehicle" type="range" min="0" max="100" value="60"></div>
    <div class="control"><label>Noise level <strong id="p2noiseOut">0.25</strong></label><input id="p2noiseLevel" type="range" min="0" max="80" value="25"></div>
  </div>

  <div class="card">
    <h3>2. What does one DAS channel contain?</h3>
    <p class="muted" style="font-size:.82rem">The recorded signal is a superposition. A passing vehicle is a genuine physical disturbance, not simply “noise.”</p>
    <svg id="p2components" class="p2-plot" viewBox="0 0 650 355"></svg>
    <div class="p2-equation"><span>Measured DAS</span><b>=</b><span class="target-txt">target</span><b>+</b><span class="vehicle-txt">non-target</span><b>+</b><span>noise</span></div>
  </div>
</div>

<div class="card" style="margin-top:14px">
  <div class="p2-filter-head">
    <div>
      <h3>3. When is simple filtering enough?</h3>
      <p class="muted" style="font-size:.82rem;margin:.2rem 0">Move the overlap control from spectrally separated to overlapping. The same simple band-pass filter becomes less able to reject the unwanted disturbance without affecting the target.</p>
    </div>
    <div class="p2-overlap">
      <label>Spectral overlap <strong id="p2sepOut">moderate</strong></label>
      <input id="p2sep" type="range" min="0" max="100" value="55">
      <div><span>separated</span><span>overlapping</span></div>
    </div>
  </div>
  <div class="p2-filter-grid">
    <div>
      <h4>Time domain</h4>
      <svg id="p2filter" class="p2-filterplot" viewBox="0 0 720 300"></svg>
    </div>
    <div>
      <h4>Approximate frequency-domain view</h4>
      <svg id="p2spectrum" class="p2-spectrum" viewBox="0 0 430 300"></svg>
    </div>
  </div>
  <div class="p2-metrics">
    <div class="p2-snrbox">
      <div class="p2-snrtitle">SNR improvement</div>
      <svg id="p2snrBars" viewBox="0 0 520 105"></svg>
    </div>
    <div class="readout"><span>Target retained</span><strong id="p2retained">—</strong></div>
    <div class="readout"><span>Simple filter</span><strong id="p2filterState">—</strong></div>
  </div>
</div>

<div class="model"><strong>Why focus on spectral overlap?</strong> It is one clear example of a fixed filter reaching its limit. Real DAS measurements can also contain time-varying or structured interference, changing coupling conditions, and weak target signals. Those cases are important, but are not simulated in this section.</div>
<div class="note"><strong>Core idea:</strong> simple filtering can work well when target and unwanted components occupy distinguishable frequency regions. As their spectra overlap, rejecting the unwanted component without also attenuating or distorting useful target information becomes harder.</div>
</section>
<section class="part" id="part3" style="margin-top:34px">
<div class="kicker">PART 3</div>
<h2> Detection Translates to Alarms</h2>
<p class="question">A processed signal is available. Where should the system place the detection threshold?</p>

<div class="p3-layout">
  <!-- LEFT: controls + tilted repeated-instance figure -->
  <div class="card p3-left">
    <h3>One threshold, four physically different cases</h3>
    <p class="muted" style="font-size:.82rem;margin:.2rem 0">Each event window is reduced to a scalar <strong>detection metric</strong>. Repeated instances vary, so some instances can cross the threshold while others do not.</p>

    <div class="p3-controlgrid">
      <div class="p3-threshold">
        <label>Detection threshold <strong id="p3thOut">0.52</strong></label>
        <input id="p3th" type="range" min="15" max="90" value="52">
        <div><span>more sensitive</span><span>more selective</span></div>
      </div>
      <div class="p3-threshold">
        <label>Repeated instances <strong id="p3instOut">10 per event type</strong></label>
        <input id="p3inst" type="range" min="1" max="20" value="10">
        <div><span>1 instance</span><span>20 instances</span></div>
      </div>
    </div>

    <svg id="p3plot" class="p3-plot" viewBox="0 0 1060 440" aria-label="Tilted pseudo-3D repeated event detection metrics and threshold"></svg>
    <div id="p3cards" class="p3-cards"></div>
    <p class="muted" style="font-size:.76rem;margin:.7rem 0 0"><strong>Teaching model:</strong> repeated instances are deterministic synthetic examples. The oblique depth direction represents repeated trials, not time.</p>
  </div>

  <!-- RIGHT: matrix and threshold consequences in one vertical stack -->
  <div class="p3-rightstack">
    <div class="card">
      <h3>Detection decision matrix</h3>
      <p class="muted" style="font-size:.8rem;margin:.2rem 0 .7rem">The threshold creates a binary decision. Whether that decision is correct depends on whether the event is actually a target.</p>
      <div class="p3-decisionmatrix">
        <div class="p3-corner"></div>
        <div class="p3-colhead">NOT DETECTED</div>
        <div class="p3-colhead">DETECTED</div>
        <div class="p3-rowhead">TARGET</div>
        <div class="p3-cell p3-bad"><strong>False negative</strong><span>Target response falls below threshold</span><b id="p3FN">—</b></div>
        <div class="p3-cell p3-good"><strong>Target detected</strong><span>Target response crosses threshold</span><b id="p3TP">—</b></div>
        <div class="p3-rowhead">NON-TARGET</div>
        <div class="p3-cell p3-good"><strong>Non-target rejected</strong><span>Response stays below threshold</span><b id="p3TN">—</b></div>
        <div class="p3-cell p3-bad"><strong>False positive</strong><span>Non-target response crosses threshold</span><b id="p3FP">—</b></div>
      </div>
      <p class="muted" style="font-size:.75rem;margin:.7rem 0 0">Counts come from the repeated synthetic instances shown at left.</p>
    </div>

    <div class="card p3-problem">
      <h3>Move the threshold: what changes?</h3>
      <div class="p3-tradeoff">
        <div><span>Lower threshold</span><strong>FNP ↓</strong><strong>FPP ↑</strong></div>
        <div><span>Higher threshold</span><strong>FNP ↑</strong><strong>FPP ↓</strong></div>
      </div>
      <div class="p3-harder">
        <strong>Threshold tuning does not identify the event.</strong>
        <p>A passing vehicle can produce a genuine DAS response above threshold. Detection answers whether a response is large enough; interpretation must determine what produced it.</p>
        <div class="p3-transition">Detection: <b>Did something happen?</b><span>→</span> Interpretation: <b>What happened?</b></div>
      </div>
    </div>
  </div>
</div>
<div class="card p3-metrics-full">
<div class="p3-metrics-teaching">
  <h4>From the decision matrix to performance metrics</h4>
  <p class="muted" style="font-size:.76rem;margin:.2rem 0 .65rem">The values below use the <strong>same TP, TN, FP and FN counts shown in the decision matrix above</strong>. Move the threshold or change the number of repeated instances and every calculation updates.</p>

  <div class="p3-livecounts">
    <div><span>TP</span><strong id="p3TPcopy">—</strong><small>target detected</small></div>
    <div><span>FN</span><strong id="p3FNcopy">—</strong><small>target missed</small></div>
    <div><span>FP</span><strong id="p3FPcopy">—</strong><small>non-target detected</small></div>
    <div><span>TN</span><strong id="p3TNcopy">—</strong><small>non-target rejected</small></div>
  </div>

  <div class="p3-metric-list">
    <div class="p3-metricrow">
      <div class="p3-metricname">False-negative probability <b>FNP</b></div>
      <div class="p3-eq"><span class="frac"><span>FN</span><span>TP + FN</span></span></div>
      <div class="p3-sub" id="p3FNPsub">—</div>
      <div class="p3-answer" id="p3FNPbig">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">False-positive probability <b>FPP</b></div>
      <div class="p3-eq"><span class="frac"><span>FP</span><span>FP + TN</span></span></div>
      <div class="p3-sub" id="p3FPPsub">—</div>
      <div class="p3-answer" id="p3FPPbig">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">Accuracy</div>
      <div class="p3-eq"><span class="frac"><span>TP + TN</span><span>TP + TN + FP + FN</span></span></div>
      <div class="p3-sub" id="p3ACCsub">—</div>
      <div class="p3-answer" id="p3ACC">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">Precision</div>
      <div class="p3-eq"><span class="frac"><span>TP</span><span>TP + FP</span></span></div>
      <div class="p3-sub" id="p3PRECsub">—</div>
      <div class="p3-answer" id="p3PREC">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">Recall <b>(TPR)</b></div>
      <div class="p3-eq"><span class="frac"><span>TP</span><span>TP + FN</span></span></div>
      <div class="p3-sub" id="p3RECsub">—</div>
      <div class="p3-answer" id="p3REC">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">Specificity <b>(TNR)</b></div>
      <div class="p3-eq"><span class="frac"><span>TN</span><span>TN + FP</span></span></div>
      <div class="p3-sub" id="p3SPECsub">—</div>
      <div class="p3-answer" id="p3SPEC">—</div>
    </div>
    <div class="p3-metricrow">
      <div class="p3-metricname">F1 score</div>
      <div class="p3-eq p3-f1eq">2 × <span class="frac"><span>Precision × Recall</span><span>Precision + Recall</span></span></div>
      <div class="p3-sub" id="p3F1sub">—</div>
      <div class="p3-answer" id="p3F1">—</div>
    </div>
  </div>
</div>


</div>

<div class="note"><strong>Core idea:</strong> lowering the threshold tends to reduce missed targets but increases non-target detections; raising it tends to do the opposite. Thresholding does not determine event identity.</div>
</section>
<section class="part" id="part4" style="margin-top:34px">
<div class="kicker">PART 4</div>
<h2> Detection Translates to Interpretation</h2>
<p class="question">The threshold says that something happened. What information can help us decide what happened?</p>

<div class="p4-top">
  <div class="card">
    <h3>1. Same detection level, different events</h3>
    <p class="muted" style="font-size:.82rem">All three examples have already crossed the detection threshold. Their overall detection level is intentionally similar, so amplitude alone is not enough to identify the event.</p>
    <div class="p4-eventbuttons">
      <button data-p4="excavation" class="active">Mechanical excavation</button>
      <button data-p4="manual">Manual digging</button>
      <button data-p4="vehicle">Passing vehicle</button>
    </div>
    <svg id="p4detect" class="p4-detect" viewBox="0 0 430 220"></svg>
    <div class="p4-callout">Detected? <strong>YES</strong><span>Identity? <strong>still unknown</strong></span></div>
  </div>

  <div class="card">
    <h3>2. Look beyond one scalar metric</h3>
    <p class="muted" style="font-size:.82rem">The selected event is shown in three linked representations. These are illustrative signatures, not universal fingerprints of a particular machine, shovel, or vehicle.</p>
    <div class="p4-reps">
      <div><h4>Time domain</h4><svg id="p4time" viewBox="0 0 330 220"></svg></div>
      <div><h4>Frequency domain</h4><svg id="p4freq" viewBox="0 0 330 220"></svg></div>
      <div><h4>Spatiotemporal pattern</h4><svg id="p4space" viewBox="0 0 330 220"></svg></div>
    </div>
    <div class="p4-featureflow">
      <div class="p4-featurebox">
        <span>TIME DOMAIN → numerical feature</span>
        <strong>Normalized signal energy</strong>
        <div class="p4-featurevalue" id="p4energy">—</div>
        <code>E = mean[x(t)²]</code>
      </div>
      <div class="p4-featurebox">
        <span>FREQUENCY DOMAIN → numerical feature</span>
        <strong>Peak frequency</strong>
        <div class="p4-featurevalue" id="p4peak">—</div>
        <code>fpeak = arg max P(f)</code>
      </div>
      <div class="p4-featurebox">
        <span>SPATIOTEMPORAL → numerical feature</span>
        <strong>Spatial extent</strong>
        <div class="p4-featurevalue" id="p4extent">—</div>
        <code>L = xmax − xmin</code>
      </div>
    </div>
    <div class="p4-vector">
      <span>FEATURE VECTOR</span>
      <strong id="p4vector">[ — , — , — ]</strong>
      <small>[ normalized energy, peak frequency, spatial extent ]</small>
    </div>
  </div>
</div>

<div class="card" style="margin-top:14px">
  <div class="p4-decision-head">
    <div>
      <h3>3. From a feature vector to a decision</h3>
      <p class="muted" style="font-size:.82rem;margin:.2rem 0">Each event is now a point in a three-feature space: normalized energy <em>E</em>, peak frequency <em>f</em><sub>peak</sub>, and spatial extent <em>L</em>. Drag the plot to rotate it.</p>
    </div>
    <div class="p4-overlap-control">
      <label>Class overlap <strong id="p4overlapOut">low</strong></label>
      <input id="p4overlap" type="range" min="0" max="100" value="20">
      <div><span>well separated</span><span>strong overlap</span></div>
    </div>
  </div>

  <div class="p4-decision-grid">
    <div class="p4-space-card">
      <svg id="p4decision" viewBox="0 0 900 610" aria-label="Rotatable 3D feature space"></svg>
      <div class="p4-rotatebar"><span>Drag to rotate · three axes correspond to the three extracted features</span><button type="button" id="p4resetView">Reset view</button></div>
    </div>
    <div class="p4-decision-story">
      <div class="p4-modelcue">
        <span>WHAT WORKS IN THIS SYNTHETIC EXAMPLE?</span>
        <strong id="p4modelCue">Simple boundaries</strong>
        <p id="p4methodHint">The classes are separated enough for simple interpretable boundaries.</p>
      </div>
      <div class="p4-flowstep"><span>1</span><div><strong>Feature vector</strong><p id="p4vectorCopy">[E, fpeak, L]</p></div></div>
      <div class="p4-flowarrow">↓</div>
      <div class="p4-flowstep"><span>2</span><div><strong>Place it in 3D feature space</strong><p>The selected event is compared with repeated examples of known classes.</p></div></div>
      <div class="p4-flowarrow">↓</div>
      <div class="p4-flowstep"><span>3</span><div><strong>Apply the simplest adequate boundary</strong><p id="p4boundaryText">Axis-aligned regions are enough here.</p></div></div>
      <div class="p4-flowarrow">↓</div>
      <div class="p4-classout"><span>INTERPRETED EVENT</span><strong id="p4classOut">—</strong></div>
    </div>
  </div>

  <div class="p4-method-strip p4-three">
    <div id="p4stageRules"><strong>Simple boundaries</strong><span>Interpretable thresholds separate the feature clouds</span></div>
    <div class="p4-strip-arrow">→</div>
    <div id="p4stageSVM"><strong>Linear SVM</strong><span>A weighted combination of features provides a useful separating plane</span></div>
    <div class="p4-strip-arrow">→</div>
    <div id="p4stageRich"><strong>Features insufficient?</strong><span>Strong overlap remains; improve features or consider richer signal models</span></div>
  </div>
  <div class="note" style="margin-top:12px"><strong>Core idea:</strong> model complexity should earn its place. If simple feature boundaries work, use them. If a linear combination of features is needed, a linear classifier can be useful. If the classes remain strongly mixed in this feature space, increasing classifier complexity is not automatically the right answer.</div>
</div>
</section>
<section class="part" id="part5" style="margin-top:34px">
<div class="kicker">PART 5</div>
<h2>How Much Intelligence Do We Need?</h2>
<p class="question">Part 4 showed when a learned decision boundary may add value. Now suppose we want to deploy one: do we have the data, compute, and response time to make it practical?</p>

<div class="p5-train card">
  <h3>1. Can we train it?</h3>
  <div class="p5-train-grid">
    <div class="p5-sliders">
      <div>
        <label>Representative DAS data <strong id="p5rawOut">Substantial</strong></label>
        <input id="p5raw" type="range" min="0" max="3" step="1" value="2">
        <small>Limited <span>→</span> Moderate <span>→</span> Substantial <span>→</span> Extensive</small>
      </div>
      <div>
        <label>Reliable event labels <strong id="p5labelsOut">Moderate</strong></label>
        <input id="p5labels" type="range" min="0" max="3" step="1" value="1">
        <small>Sparse / expensive <span>→</span> Abundant / reliable</small>
      </div>
    </div>
    <div class="p5-training-result">
      <span>WHAT DOES THE DATA SITUATION SUPPORT?</span>
      <strong id="p5trainingMode">—</strong>
      <p id="p5trainingWhy">—</p>
    </div>
  </div>
  <div class="p5-learning-options">
    <div id="p5supervised"><strong>Supervised learning</strong><span>Needs representative labeled examples.</span></div>
    <div id="p5self"><strong>Self-supervised + downstream labels</strong><span>Useful to consider when raw DAS is abundant but labels are scarce.</span></div>
    <div id="p5dataFirst"><strong>Acquire better evidence first</strong><span>Little representative data limits what a learned model can establish.</span></div>
  </div>
</div>

<div class="p5-deploy-grid">
  <div class="card">
    <h3>2. Can we run it within the deployment constraints?</h3>
    <div class="p5-deploy-controls">
      <div>
        <label>Candidate model inference cost <strong id="p5flopsOut">2.0 GFLOPs / inference</strong></label>
        <input id="p5flops" type="range" min="0" max="3" step="1" value="1">
        <small>Lightweight <span>→</span> Moderate <span>→</span> Heavy <span>→</span> Very heavy</small>
      </div>
      <div>
        <label>Available processing capability <strong id="p5computeOut">Moderate edge compute</strong></label>
        <input id="p5compute" type="range" min="0" max="3" step="1" value="1">
        <small>Constrained CPU <span>→</span> Moderate edge <span>→</span> Accelerator <span>→</span> High compute</small>
      </div>
      <div>
        <label>Required alarm-response time <strong id="p5latencyOut">100 ms</strong></label>
        <input id="p5latency" type="range" min="0" max="3" step="1" value="1">
        <small>10 ms <span>→</span> 100 ms <span>→</span> 1 s <span>→</span> latency tolerant</small>
      </div>
    </div>

    <div class="p5-compute-figure">
      <div class="p5-compute-head"><span>Illustrative compute demand</span><span>Illustrative available capability</span></div>
      <div class="p5-compute-track">
        <i id="p5demandBar"></i>
        <b id="p5capacityMarker"></b>
      </div>
      <div class="p5-compute-scale"><span>low</span><span>higher</span></div>
    </div>

    <div class="p5-feasibility">
      <div><span>Compute fit</span><strong id="p5computeFit">—</strong></div>
      <div><span>Latency fit</span><strong id="p5latencyFit">—</strong></div>
      <div><span>Model memory</span><strong id="p5memory">—</strong></div>
    </div>
    <p class="muted" style="font-size:.72rem"><strong>Teaching note:</strong> FLOPs approximate arithmetic workload; hardware FLOPS alone do not determine real inference latency. Memory movement, precision, implementation, preprocessing, batching, and accelerator support also matter.</p>
  </div>

  <div class="card">
    <h3>3. Where should inference happen?</h3>
    <div class="p5-edge-diagram">
      <div class="p5-node"><strong>DAS interrogator</strong><span>continuous sensing</span></div>
      <div class="p5-down">↓</div>
      <div class="p5-node p5-edge" id="p5edgeNode"><strong>EDGE</strong><span>local inference / alarm</span></div>
      <div class="p5-link">⇅</div>
      <div class="p5-node p5-central" id="p5centralNode"><strong>CENTRAL</strong><span>heavier analysis / aggregation / retraining</span></div>
    </div>
    <div class="p5-placement">
      <span>DEPLOYMENT IMPLICATION</span>
      <strong id="p5placement">—</strong>
      <p id="p5placementWhy">—</p>
    </div>
    <div id="p5optimize" class="p5-optimize">
      <strong>If a useful model is too expensive at the edge</strong>
      <span>Consider a smaller architecture, hardware acceleration, model compression, pruning, or lower-precision inference such as quantization. Any performance and latency gains must be validated on the actual model and hardware.</span>
    </div>
  </div>
</div>

<div class="card" style="margin-top:14px">
  <h3>4. Deployment logic</h3>
  <div class="p5-decision-path">
    <div><strong>Is learned intelligence justified?</strong><span>Answered in Part 4 by the classification problem.</span></div>
    <b>→</b>
    <div><strong>Can we train it credibly?</strong><span>Representative data and labels determine the learning strategy.</span></div>
    <b>→</b>
    <div><strong>Can we run it?</strong><span>Inference workload, memory and available processing constrain deployment.</span></div>
    <b>→</b>
    <div><strong>Can it respond in time?</strong><span>Operational latency influences edge versus centralized processing.</span></div>
    <b>→</b>
    <div class="p5-end"><strong>Validate the deployed system</strong><span>Measure accuracy, latency and robustness under realistic conditions.</span></div>
  </div>
</div>

<div class="note"><strong>Take-home message:</strong> once intelligence is justified, deployment becomes a systems problem. Data and labels constrain how the model can be learned; compute, memory and latency constrain how and where it can run.</div>
</section>
</div>

<script src="{{ '/assets/js/demos/das-pipeline-decision.js' | relative_url }}"></script>

<link rel="stylesheet" href="{{ '/assets/css/demos/das-pipeline-decision.css' | relative_url }}">
