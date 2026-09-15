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

  <h4>Governing physics</h4>

  <p>
    A fiber Bragg grating reflects light near the Bragg wavelength
  </p>

  <p style="text-align:center;">
    <strong>
      λ<sub>B</sub> = 2n<sub>eff</sub>Λ
    </strong>
  </p>

  <p>
    where n<sub>eff</sub> is the effective refractive index of the guided mode
    and Λ is the grating period.
  </p>

  <p>
    For uniform axial strain at constant temperature, the Bragg-wavelength
    shift is modeled as
  </p>

  <p style="text-align:center;">
    <strong>
      Δλ<sub>B</sub> =
      λ<sub>B,0</sub>(1 − p<sub>e</sub>)ε
    </strong>
  </p>

  <p>
    where ε is the applied axial strain and p<sub>e</sub> is the effective
    strain-optic coefficient. The wavelength shift therefore contains both
    the geometrical change in grating period and the strain-induced change in
    effective refractive index through the photoelastic effect.
  </p>


  <h4>Reflection spectrum</h4>

  <p>
    The displayed spectrum is calculated using the coupled-mode model for an
    ideal uniform fiber Bragg grating. It is not an imposed Gaussian peak.
    The sidelobes visible in the spectrum arise from the ideal uniform,
    unapodized grating model.
  </p>


  <h4>Representative model parameters</h4>

  <table>
    <tbody>
      <tr>
        <td>Reference Bragg wavelength</td>
        <td>1550 nm</td>
      </tr>
      <tr>
        <td>Effective strain-optic coefficient, p<sub>e</sub></td>
        <td>0.2027</td>
      </tr>
      <tr>
        <td>Strain sensitivity</td>
        <td>1.236 pm/µε</td>
      </tr>
      <tr>
        <td>Grating length</td>
        <td>4 mm</td>
      </tr>
      <tr>
        <td>Refractive-index modulation, Δn</td>
        <td>1.5 × 10<sup>−4</sup></td>
      </tr>
      <tr>
        <td>Modal-power factor, M<sub>p</sub></td>
        <td>0.7372</td>
      </tr>
    </tbody>
  </table>


  <h4>Assumptions</h4>

  <p>
    The demonstration represents an ideal uniform FBG subjected to uniform
    axial tensile strain at constant temperature. The model assumes a linear
    strain response and does not include temperature cross-sensitivity,
    nonuniform strain, chirp, packaging or bonding effects, birefringence,
    source noise, or interrogator limitations.
  </p>


  <h4>References</h4>

  <p>
    F. T. S. Yu and S. Yin, eds.,
    <em>Fiber Optic Sensors</em>,
    Marcel Dekker, 2002.
    See the sections on uniform fiber Bragg gratings, coupled-mode
    reflectivity, and FBG strain sensing.
  </p>

  <p>
    E. Udd and W. B. Spillman Jr., eds.,
    <em>Fiber Optic Sensors: An Introduction for Engineers and Scientists</em>,
    2nd ed., Wiley, 2011.
  </p>

</details>

</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/demos/fbg-strain.js' | relative_url }}"></script>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/fbg-strain.css' | relative_url }}"
>
