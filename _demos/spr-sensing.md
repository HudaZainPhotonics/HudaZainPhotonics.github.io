---
layout: page
title: Surface Plasmon Resonance (SPR) Sensor
permalink: /demos/spr-sensing/
---

<div class="spr-demo">
<div id="spr-physics"></div>
<p class="intro">
Explore a Kretschmann SPR configuration. Change the incidence angle to scan the optical response;
change the analyte refractive index to move the resonance condition itself.
</p>


<nav class="section-nav" aria-label="Demo sections">
  <a href="#spr-physics"><strong>1. SPR Physics</strong><span>Excitation and the Kretschmann response</span></a>
  <a href="#interrogation"><strong>2. Interrogation</strong><span>Angle, wavelength, and intensity</span></a>
  <a href="#sensor-design"><strong>3. Sensor Design</strong><span>Range, sensitivity, and resolution</span></a>
  <a href="#application"><strong>4. Application</strong><span>Affinity biosensing and binding kinetics</span></a>
</nav>
<div class="grid">
  <div class="panel">
    <h3>Kretschmann setup</h3>
    <p class="caption">TM-polarized monochromatic light · BK7 / Au / analyte</p>
    <div class="setup">
      <div class="prism"></div>
      <div class="prism-label">BK7 prism<br><span style="font-weight:400">n = 1.51</span></div>
      <div class="gold"></div><div class="gold-label">Au film · 50 nm</div>
      <div class="analyte"></div><div class="analyte-label">analyte · <span id="schematicRI">n = 1.328</span></div>
      <div class="interface"></div>
      <div id="beamIn" class="beam in"></div>
      <div id="beamOut" class="beam out"></div>
      <div class="beam-dot"></div>
      <div id="angleLabel" class="angle-label">θ = 66.0°</div>
      <div id="spWave" class="sp-wave">
        <svg viewBox="0 0 120 22" preserveAspectRatio="none">
          <path d="M0 11 C8 0 16 22 24 11 S40 0 48 11 S64 22 72 11 S88 0 96 11 S112 22 120 11"
                fill="none" stroke="#49799b" stroke-width="3"/>
        </svg>
      </div>
      <div class="sp-label">surface-plasmon coupling (schematic)</div>
      <div class="setup-note">
        The coupling indicator is qualitative. Reflectivity on the right is calculated from the
        multilayer Fresnel model.
      </div>
    </div>
  </div>

  <div class="panel plot-wrap">
    <h3>Angular reflectivity</h3>
    <p class="caption"><strong>Optical observable:</strong> reflected power, R &nbsp;·&nbsp; Faint dashed: reference at n = 1.328 RIU</p>
    <div id="sprPlot"></div>
    <div class="readouts">
      <div class="readout"><span>Selected angle</span><strong id="selectedAngle">66.000°</strong></div>
      <div class="readout"><span>Reflectivity at selected angle</span><strong id="selectedR">—</strong></div>
      <div class="readout"><span>Resonance angle</span><strong id="resAngle">—</strong></div>
    </div>
  </div>
</div>

<div class="controls">
  <div class="control">
    <strong>Incident angle, θ</strong>
    <input id="angle" type="range" min="60" max="75" step="0.02" value="66">
    <div class="value"><span id="angleValue">66.00</span>°</div>
  </div>
  <div class="control">
    <strong>Analyte refractive index</strong>
    <input id="ri" type="range" min="1.328" max="1.350" step="0.001" value="1.328">
    <div class="value"><span id="riValue">1.328</span> <small>RIU</small></div>
  </div>
  <label class="check"><input id="showTE" type="checkbox"> Show TE comparison</label>
</div>

<div class="lesson">
  <strong>Changing angle scans the resonance. Changing refractive index moves the resonance.</strong>
  <p>The faint reference curve remains fixed at n = 1.328 RIU so the resonance-angle shift can be seen directly. The reflectivity minimum of the selected curve is used as the numerical resonance-angle marker.</p>
</div>


<section class="interrogation" id="interrogation">
<h2>2. How Should We Interrogate the Resonance?</h2>
<p class="caption">For each method, compare the optical SPR response with the corresponding refractive-index calibration. Sensitivity is the local slope of that calibration.</p>
<nav class="jumpbar">
<a href="#angular-method">Angular</a>
<a href="#wavelength-method">Wavelength</a>
<a href="#intensity-method">Intensity</a>
</nav>

<section class="method" id="angular-method">
<h3>Angular interrogation</h3>
<p class="caption">Sensor output: resonance angle, θ<sub>SPR</sub>, at a fixed wavelength.</p>

<div class="method-grid">
  <div class="figurebox">
    <strong>Five RI states: angular SPR response, R versus angle</strong>
    <div id="angResponse" class="methodplot"></div>
  </div>

  <div class="figurebox">
    <strong>Extract each dip minimum: θ<sub>SPR</sub> versus refractive index</strong>
    <div id="angCalibration" class="methodplot"></div>
  </div>
</div>

<div class="method-control">
  <strong>Analyte refractive index</strong>
  <input id="angRI" type="range" min="1.328" max="1.344" step="0.004" value="1.344">
  <strong id="angRIValue">1.344 RIU</strong>
</div>

<div class="method-values">
  <div><span>Δn from reference</span><strong id="angDn">—</strong></div>
  <div><span>ΔθSPR</span><strong id="angDtheta">—</strong></div>
  <div><span>Angular sensitivity, Sθ = ΔθSPR / Δn</span><strong id="angSens">—</strong></div>
</div>

<p class="method-note">
The n = 1.328 RIU response remains the dashed reference. As the selected RI increases,
only intermediate states up to that value are revealed. The minimum of each revealed
angular dip becomes the corresponding θSPR calibration point on the right. The displayed
angular sensitivity is the slope between the reference and selected calibration points,
Sθ = ΔθSPR / Δn.
</p>
</section>

<section class="method" id="wavelength-method">
<h3>Wavelength interrogation</h3>
<p class="caption">Sensor output: resonance wavelength, λ<sub>SPR</sub>, at a fixed incidence angle.</p>
<div class="method-grid">
<div class="figurebox"><strong>Five RI states: spectral SPR response, R versus wavelength</strong><div id="waveResponse" class="methodplot"></div></div>
<div class="figurebox"><strong>Extract each dip minimum: λ<sub>SPR</sub> versus refractive index</strong><div id="waveCalibration" class="methodplot"></div></div>
</div>
<div class="method-control">
  <strong>Analyte refractive index</strong>
  <input id="waveRI" type="range" min="1.328" max="1.344" step="0.004" value="1.344">
  <strong id="waveRIValue">1.344 RIU</strong>
</div>
<div class="method-control">
  <strong>Fixed incidence angle</strong>
  <input id="waveAngle" type="range" min="62" max="72" step="0.02" value="66">
  <strong id="waveAngleValue">66.00°</strong>
</div>
<div class="method-values">
<div><span>Δn from reference</span><strong id="waveDn">—</strong></div>
<div><span>ΔλSPR</span><strong id="waveDlambda">—</strong></div>
<div><span>Wavelength sensitivity, Sλ = ΔλSPR / Δn</span><strong id="waveSens">—</strong></div>
</div>
<p class="method-note">
At fixed incidence angle, wavelength interrogation scans the optical spectrum and tracks the wavelength of strongest SPR coupling.
The n = 1.328 RIU spectrum remains the dashed reference. As the selected RI increases, only the intermediate states up to that value are revealed; the same revealed states build the calibration on the right. The displayed wavelength sensitivity is the slope between the reference and selected calibration points, Sλ = ΔλSPR / Δn.
</p>
</section>

<section class="method" id="intensity-method">
<h3>Intensity interrogation</h3>
<p class="caption">Sensor output: reflectivity at one fixed operating angle, R(θ<sub>op</sub>).</p>
<div class="method-grid">
<div class="figurebox"><strong>Five RI states: angular SPR response, R versus angle</strong><div id="intResponse" class="methodplot"></div></div>
<div class="figurebox"><strong>Sample each revealed curve at fixed θ<sub>op</sub>: R versus refractive index</strong><div id="intCalibration" class="methodplot"></div></div>
</div>
<div class="method-control">
  <strong>Analyte refractive index</strong>
  <input id="intRI" type="range" min="1.328" max="1.344" step="0.004" value="1.344">
  <strong id="intRIValue">1.344 RIU</strong>
</div>
<div class="method-control">
  <strong>Operating angle</strong>
  <input id="intOp" type="range" min="60" max="75" step="0.02" value="66">
  <strong id="intOpValue">66.00°</strong>
  <div style="margin-top:5px;font-size:12px;color:var(--muted)">
    Operating region: <strong id="intRegion" style="color:var(--text)">—</strong>
  </div>
</div>
<div class="method-values">
<div><span>Intensity span, ΔR</span><strong id="intDr">—</strong></div>
<div>
  <span>Local intensity sensitivity, SI</span>
  <strong id="intSens">—</strong>
  <small id="intSensAt" style="display:block;margin-top:4px;color:var(--muted);font-size:10px">—</small>
</div>
<div>
  <span>Calibration behavior</span>
  <strong id="intBehavior">—</strong>
  <small style="display:block;margin-top:4px;color:var(--muted);font-size:10px">over revealed RI states</small>
</div>
</div>
<p class="method-note">The n = 1.328 RIU curve remains the dashed reference. As the selected RI increases, only intermediate states up to that value are revealed. The dots where θop intersects those curves are the same points used to build the R-versus-n calibration on the right. Intensity sensitivity is calculated from neighboring visible calibration points; the readout also flags whether the revealed calibration is monotonic or non-monotonic.</p>
</section>

<div class="compare-strip">Same SPR interaction → angular, intensity, or wavelength readout → different calibration and sensitivity.</div>
</section>


<section class="sensor-design" id="sensor-design">
  <div class="design-banner">
    <h2>3. Sensor Design and Trade-offs</h2>
    <p class="caption">
      Sensitivity is only part of sensor performance. The resonance must remain within the
      interrogation window, and the measurement system must be able to distinguish its movement.
    </p>
  </div>

  <div class="design-subsection">
    <h3>Sensing range</h3>
    <p class="caption">
      Follow the same progressive RI states used above. The dashed reference and faint intermediate
      resonances show how the dip moves relative to a finite instrument window.
    </p>

    <div class="design-controls">
      <strong>Analyte refractive index</strong>
      <input id="designRI" type="range" min="1.328" max="1.360" step="0.004" value="1.360">
      <strong id="designRIValue">1.360 RIU</strong>
    </div>

    <div class="design-grid">
      <div class="design-card">
        <h3>Angular interrogation</h3>
        <p class="caption">Finite angular scan window: 64–70°.</p>
        <div id="designAngularRange" class="designplot"></div>
        <div class="design-values">
          <div><span>Selected θSPR</span><strong id="designTheta">—</strong></div>
          <div><span>Scan window</span><strong>64–70°</strong></div>
          <div><span>Status</span><strong id="designThetaStatus">—</strong></div>
        </div>
      </div>

      <div class="design-card">
        <h3>Wavelength interrogation</h3>
        <p class="caption">Finite spectral window: 700–900 nm.</p>
        <div id="designWaveRange" class="designplot"></div>
        <div class="design-values">
          <div><span>Selected λSPR</span><strong id="designLambda">—</strong></div>
          <div><span>Spectral window</span><strong>700–900 nm</strong></div>
          <div><span>Status</span><strong id="designLambdaStatus">—</strong></div>
        </div>
      </div>
    </div>
  </div>

  <div class="design-subsection">
    <h3>Measurement resolution</h3>
    <p class="caption">
      The first plot shows the continuous physical response. The second samples that response on a finite
      angular or spectral grid and identifies the sampled minimum. The third shows how those finite-grid
      resonance estimates affect the calibration. Noise and instrumental broadening are not included.
    </p>

    <div class="resolution-stack">
      <h3>Angular resolution</h3>
      <p class="caption">Can an angular interrogator distinguish the RI-induced resonance shift?</p>
      <div class="resolution-grid">
        <div class="resolution-figure">
          <strong>Ideal angular response</strong>
          <div id="angularIdealPlot" class="resolution-plot"></div>
        </div>
        <div class="resolution-figure">
          <strong>Resolved by the instrument</strong>
          <div id="angularResolvedPlot" class="resolution-plot"></div>
        </div>
        <div class="resolution-figure">
          <strong>Consequence: RI measurement error</strong>
          <div id="angularConsequencePlot" class="resolution-plot"></div>
        </div>
      </div>
      <div class="design-controls">
        <strong>RI change from 1.328 RIU</strong>
        <input id="angularDeltaN" type="range" min="0" max="0.004" step="0.0001" value="0.0040">
        <strong id="angularDeltaNValue">+0.0005 RIU</strong>
        <br><br>
        <strong>Angular sampling resolution, δθ</strong>
        <input id="angularRes" type="range" min="0.01" max="1.00" step="0.01" value="0.20">
        <strong id="angularResValue">0.20°</strong>
      </div>
      <div class="design-values">
        <div><span>True RI change</span><strong id="actualDTheta">—</strong></div>
        <div><span>Measured RI change</span><strong id="reportedDTheta">—</strong></div>
        <div><span>RI measurement error</span><strong id="angularResolvedStatus">—</strong></div>
      </div>
    </div>

    <div class="resolution-stack">
      <h3>Wavelength resolution</h3>
      <p class="caption">Can a spectral interrogator distinguish the RI-induced resonance shift?</p>
      <div class="resolution-grid">
        <div class="resolution-figure">
          <strong>Ideal spectral response</strong>
          <div id="waveIdealPlot" class="resolution-plot"></div>
        </div>
        <div class="resolution-figure">
          <strong>Resolved by the instrument</strong>
          <div id="waveResolvedPlot" class="resolution-plot"></div>
        </div>
        <div class="resolution-figure">
          <strong>Consequence: RI measurement error</strong>
          <div id="waveConsequencePlot" class="resolution-plot"></div>
        </div>
      </div>
      <div class="design-controls">
        <strong>RI change from 1.328 RIU</strong>
        <input id="waveDeltaN" type="range" min="0" max="0.004" step="0.0001" value="0.0040">
        <strong id="waveDeltaNValue">+0.0005 RIU</strong>
        <br><br>
        <strong>Spectral sampling resolution, δλ</strong>
        <input id="waveRes" type="range" min="0.1" max="20.0" step="0.1" value="5.0">
        <strong id="waveResValue">5.0 nm</strong>
      </div>
      <div class="design-values">
        <div><span>True RI change</span><strong id="actualDLambda">—</strong></div>
        <div><span>Measured RI change</span><strong id="reportedDLambda">—</strong></div>
        <div><span>RI measurement error</span><strong id="waveResolvedStatus">—</strong></div>
      </div>
    </div>
  </div>

  <div class="design-takeaway">
    <strong>Sensitivity determines how far the resonance moves. Range determines whether it remains measurable. Resolution determines whether nearby resonance positions can be distinguished.</strong>
  </div>
</section>


<section class="application-section" id="application">
  <div class="application-banner">
    <h2>4. Designing for an Application</h2>
    <h3 style="margin:8px 0 4px">4.1 Analyte Binding Effect on SPR in a Protein Affinity Biosensor</h3>
    <p class="caption">
      Example: an SPR affinity biosensor for a protein target. Follow the measurement chain
      from molecular recognition to an optical resonance shift and finally to a time-dependent sensor response.
    </p>
  </div>

  <div class="application-grid">
    <div class="application-card">
      <h3>1. Molecular binding</h3>
      <p class="caption">A functionalized Au surface uses immobilized biorecognition elements to selectively bind the target analyte.</p>
      <div id="bioSurface" class="bio-surface">
        <div class="bio-liquid"></div>
        <div class="bio-gold"></div>
        <div class="bio-label" style="left:9%;top:34px">sample / analyte</div>
        <div class="bio-label" style="left:9%;bottom:42px">Au sensing surface</div>
      </div>
      <p class="caption" style="margin-top:8px"><strong>Binding → local surface Δn</strong></p>
    </div>

    <div class="application-card">
      <h3>2. Optical resonance shift</h3>
      <p class="caption">The local refractive-index change shifts the angular SPR resonance.</p>
      <div id="bioAnglePlot" class="application-plot"></div>
      <p class="caption" style="margin-top:8px"><strong>Δn → Δθ<sub>SPR</sub></strong></p>
    </div>

    <div class="application-card">
      <h3>3. Binding response</h3>
      <p class="caption">The measured resonance shift evolves during association and dissociation.</p>
      <div id="sensorgramPlot" class="application-plot"></div>
      <p class="caption" style="margin-top:8px"><strong>Δθ<sub>SPR</sub>(t) → sensorgram</strong></p>
    </div>
  </div>

  <div class="application-controls">
    <strong>Process / time</strong>
    <input id="bioTime" type="range" min="0" max="360" step="2" value="250">
    <strong id="bioTimeValue">250 s</strong>
    <div style="margin-top:6px;font-size:11px;color:var(--muted)">
      <strong id="bioPhaseValue" style="color:var(--text)">Dissociation — buffer flowing</strong>
    </div>
  </div>

  <div class="application-values">
    <div><span>Current surface occupancy</span><strong id="bioOccupancy">—</strong></div>
    <div><span>Current surface Δn</span><strong id="bioDn">—</strong></div>
    <div><span>Current angular shift</span><strong id="bioDtheta">—</strong></div>
  </div>

  <p class="application-note">
    Teaching model: idealized 1:1 binding kinetics with an illustrative linear mapping from surface occupancy
    to local refractive-index change. The model does not include mass transport, nonspecific adsorption,
    matrix effects, temperature drift, regeneration, or assay-specific surface chemistry.
  </p>

  <div class="kinetics-section" id="binding-kinetics">
    <h2 style="margin-top:0">4.2 Binding Kinetics</h2>
    <p class="caption">
      Explore how analyte concentration, association rate, and dissociation rate shape receptor occupancy and the SPR sensorgram.
    </p>

    <div class="kinetics-grid">
      <div class="kinetics-card">
        <h3>1. Molecular binding state</h3>
        <p class="caption">The surface view follows the selected time on the sensorgram.</p>
        <div id="kineticsSurface" class="kinetics-surface">
          <div class="kinetics-liquid"></div>
          <div class="kinetics-gold"></div>
        </div>
        <div class="kinetics-phase" id="kineticsPhase">baseline</div>
      </div>

      <div class="kinetics-card">
        <h3>2. 1:1 binding model</h3>
        <p class="caption">Association forms AR; dissociation returns the complex to free analyte and receptor.</p>
        <div class="kinetics-mechanism">
          A + R ⇌ AR
        </div>
        <div style="text-align:center;font-size:12px;line-height:1.7">
          <strong>Association:</strong> k<sub>a</sub>[A](R − AR)<br>
          <strong>Dissociation:</strong> k<sub>d</sub>AR<br><br>
          <strong>K<sub>D</sub> = k<sub>d</sub> / k<sub>a</sub></strong>
        </div>
        <div style="margin-top:22px;font-size:12px;color:var(--muted);text-align:center">
          BUFFER → ANALYTE → BUFFER
        </div>
      </div>

      <div class="kinetics-card">
        <h3>3. Sensorgram</h3>
        <p class="caption">The marker and molecular surface move together through baseline, association, and dissociation.</p>
        <div id="kineticsPlot" class="kinetics-plot"></div>
      </div>
    </div>

    <div class="kinetics-controls">
      <strong>Selected time</strong>
      <input id="kineticsTime" type="range" min="0" max="360" step="2" value="250">
      <strong id="kineticsTimeValue">250 s</strong>

      <br><br><strong>Analyte concentration, [A]</strong>
      <input id="kineticsConcentration" type="range" min="5" max="100" step="5" value="50">
      <strong id="kineticsConcentrationValue">50 nM</strong>

      <br><br><strong>Association rate constant, k<sub>a</sub></strong>
      <input id="kineticsKa" type="range" min="0.5" max="5.0" step="0.1" value="2.0">
      <strong id="kineticsKaValue">2.0 × 10⁵ M⁻¹ s⁻¹</strong>

      <br><br><strong>Dissociation rate constant, k<sub>d</sub></strong>
      <input id="kineticsKd" type="range" min="0.5" max="10.0" step="0.1" value="2.0">
      <strong id="kineticsKdValue">2.0 × 10⁻³ s⁻¹</strong>
    </div>

    <div class="kinetics-values">
      <div><span>Current phase</span><strong id="kineticsPhaseReadout">—</strong></div>
      <div><span>Current occupancy</span><strong id="kineticsOccupancy">—</strong></div>
      <div><span>Equilibrium K<sub>D</sub></span><strong id="kineticsKD">—</strong></div>
      <div><span>Current Δθ<sub>SPR</sub></span><strong id="kineticsResponse">—</strong></div>
    </div>

    <p class="application-note">
      Teaching model: idealized 1:1 kinetics with constant analyte concentration during association and zero analyte concentration during dissociation.
      Mass transport and rebinding are not included.
    </p>
  </div>
</section>

<details class="model">
<summary>Model &amp; assumptions</summary>
<p>
The prototype uses a three-layer prism–metal–dielectric Fresnel calculation for the Kretschmann
configuration. For each polarization the complex multilayer reflection coefficient is calculated and
the displayed reflectivity is R = |r|².
</p>
<p class="eq"><strong>
r<sub>pmd</sub> =
(r<sub>pm</sub> + r<sub>md</sub>e<sup>2ik<sub>mx</sub>q</sup>) /
(1 + r<sub>pm</sub>r<sub>md</sub>e<sup>2ik<sub>mx</sub>q</sup>)
</strong></p>
<ul>
<li>Wavelength: 800 nm.</li>
<li>Prism refractive index: 1.51.</li>
<li>Gold permittivity at 800 nm: −25 + 1.44i, following the representative Homola configuration.</li>
<li>Gold thickness: 50 nm.</li>
<li>Analyte is modeled as a lossless semi-infinite dielectric.</li>
<li>Plane-wave illumination and ideal planar layers are assumed.</li>
<li>The surface-plasmon animation is qualitative; it is not a field-amplitude calculation.</li>

      <li><strong>Wavelength interrogation:</strong> BK7 prism dispersion is calculated with the supplied Sellmeier equation. Gold optical constants are obtained by linear interpolation of the supplied Rakić et al. (1998) <em>n,k</em> table and converted using ε=(n+ik)². The analyte refractive index is treated as nondispersive over the simulated spectral window.</li>
</ul>
<p>
References: J. Homola, ed., <em>Surface Plasmon Resonance Based Sensors</em>, Springer, 2006, especially the chapters on electromagnetic theory and SPR sensors; and A. D. Rakić, A. B. Djurišić, J. M. Elazar, and M. L. Majewski, “Optical properties of metallic films for vertical-cavity optoelectronic devices,” <em>Applied Optics</em>, 37, 5271–5283 (1998), for the Au optical-constant model/data. The BK7 wavelength dependence uses the Sellmeier coefficients specified for this teaching demo.
</p>
</details>
</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script src="{{ '/assets/js/demos/spr-sensing.js' | relative_url }}"></script>

<link rel="stylesheet" href="{{ '/assets/css/demos/spr-sensing.css' | relative_url }}">
