---
layout: page
title: Fiber Bragg Grating Strain Sensor
permalink: /demos/fbg-strain/
---
<div class="fbg-demo">

  <p class="fbg-intro">
    Explore how uniform axial tensile strain changes the grating period and
    effective refractive index of a fiber Bragg grating, producing a measurable
    shift in its Bragg reflection wavelength.
  </p>

  <div class="fbg-demo-grid">

    <!-- Controls and outputs -->
    <div class="fbg-panel fbg-controls">

      <h3>Applied axial strain</h3>

      <input
        id="fbg-strain-slider"
        type="range"
        min="0"
        max="2000"
        step="10"
        value="0"
      >

      <div class="fbg-strain-value">
        <span id="fbg-strain-value">0</span>
        <span class="fbg-unit">µε</span>
      </div>

      <div class="fbg-readouts">

        <div class="fbg-readout">
          <span>Bragg wavelength</span>
          <strong id="fbg-bragg-wavelength">1550.000 nm</strong>
        </div>

        <div class="fbg-readout">
          <span>Wavelength shift</span>
          <strong id="fbg-wavelength-shift">+0.000 nm</strong>
        </div>

        <div class="fbg-readout">
          <span>Strain sensitivity</span>
          <strong id="fbg-sensitivity">1.236 pm/µε</strong>
        </div>

        <div class="fbg-readout">
          <span>Grating period, Λ</span>
          <strong id="fbg-grating-period">535.591 nm</strong>
        </div>

      </div>

      <div class="fbg-grating-section">

        <h3>What changes inside the FBG?</h3>

        <div class="fbg-fiber">
          <div class="fbg-core"></div>
          <div id="fbg-grating" class="fbg-grating"></div>
        </div>

        <div class="fbg-grating-explanation">
          <strong>↔ Λ</strong> &nbsp; grating period
          <p>
            Axial strain increases Λ and also changes
            n<sub>eff</sub> through the photoelastic effect.
          </p>
          <small>Schematic deformation exaggerated for visibility.</small>
        </div>

      </div>

    </div>


    <!-- Spectrum -->
    <div class="fbg-panel fbg-spectrum-panel">

      <p class="fbg-observation">
        <strong>
          Increasing tensile strain shifts the Bragg reflection toward longer wavelengths.
        </strong>
      </p>

      <div id="fbg-spectrum"></div>

      <p class="fbg-caption">
        Dashed: unstrained FBG. Solid: strained FBG.
        Sidelobes arise from the ideal uniform-grating model.
      </p>

    </div>

  </div>


  <!-- Model information -->
  <details class="fbg-model">

    <summary>Model &amp; assumptions</summary>

    <p>
      The Bragg condition is
      <strong>λ<sub>B</sub> = 2n<sub>eff</sub>Λ</strong>.
      For uniform axial strain at constant temperature,
      <strong>
        Δλ<sub>B</sub> =
        λ<sub>B,0</sub>(1 − p<sub>e</sub>)ε
      </strong>.
    </p>

    <p>
      The displayed grating period tracks the physical elongation of the
      periodic structure. The Bragg-wavelength shift is not caused by this
      geometrical change alone: axial strain also changes the effective
      refractive index through the photoelastic effect.
    </p>

    <p>
      <strong>Model assumptions:</strong>
      representative ideal uniform FBG; uniform axial tensile strain;
      constant temperature; linear strain response; no chirp, strain gradient,
      packaging effects, birefringence, or interrogator noise.
    </p>

  </details>

</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/demos/fbg-strain.js' | relative_url }}"></script>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/fbg-strain.css' | relative_url }}"
>
