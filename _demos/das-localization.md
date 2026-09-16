---
layout: page
title: "Distributed Acoustic Sensing (DAS)"
permalink: /demos/das-localization/
---

<div class="das-demo">

  <p class="das-intro">
  Explore how distributed acoustic sensing uses repeated optical interrogations
  to locate disturbances along an optical fiber, then investigate how system
  design choices affect the spatial and temporal information that can be recovered.
</p>

<div class="das-module-nav">

  <a href="#das-part-1">
    <span>Part 1</span>
    <strong>How DAS Measures</strong>
  </a>

  <a href="#das-part-2">
    <span>Part 2</span>
    <strong>Designing the Measurement</strong>
  </a>

  <a href="#das-part-3">
    <span>Part 3</span>
    <strong>Designing for an Application</strong>
  </a>

</div>

<section id="das-part-1" class="das-module-part">

  <div class="das-part-heading">
    <span class="das-part-number">Part 1</span>

    <h2>How DAS Measures</h2>

    <h3>Disturbance Localization</h3>

    <p>
      How can repeated optical interrogations reveal where a disturbance occurs
      along a sensing fiber and how that disturbance varies with time?
    </p>
  </div>

  <div class="das-demo-grid">

    <!-- Controls and physical view -->
    <div class="das-panel das-controls">

      <label for="das-location-slider">
        <strong>Disturbance location</strong>
      </label>

      <input
        id="das-location-slider"
        type="range"
        min="50"
        max="950"
        step="10"
        value="500"
      >

      <div class="das-main-value">
        <span id="das-location-value">500</span>
        <span class="das-unit">m</span>
      </div>


      <label for="das-frequency-slider">
        <strong>Disturbance frequency</strong>
      </label>

      <input
        id="das-frequency-slider"
        type="range"
        min="2"
        max="25"
        step="1"
        value="10"
      >

      <div class="das-main-value">
        <span id="das-frequency-value">10</span>
        <span class="das-unit">Hz</span>
      </div>


      <div class="das-readouts">

        <div class="das-readout">
          <span>Fiber position</span>
          <strong id="das-position">500 m</strong>
        </div>

        <div class="das-readout">
          <span>Optical fast time</span>
          <strong id="das-fast-time">4.903 µs</strong>
        </div>

        <div class="das-readout">
          <span>Disturbance frequency</span>
          <strong id="das-frequency-output">10 Hz</strong>
        </div>

        <div class="das-readout">
          <span>Oscillation period</span>
          <strong id="das-period">0.100 s</strong>
        </div>

      </div>


      <div class="das-fiber-section">

        <h3>Where is the disturbance?</h3>

        <div class="das-fiber">

          <div class="das-fiber-line"></div>

          
          <div
  class="das-interrogator"
  title="DAS interrogator">
  <span>DAS</span>
</div>

          <div
  id="das-disturbance-marker"
  class="das-disturbance-marker">
  <span>disturbance</span>
</div>

        </div>

        <div class="das-fiber-labels">
          <span>0 m</span>
          <span>1000 m</span>
        </div>

        <p class="das-small-note">
          The interrogator is at the launch end. Optical round-trip time maps
          the disturbance to a position along the fiber.
        </p>

      </div>

    </div>


    <!-- Space-time response -->
    <div class="das-panel das-map-panel">

      <p class="das-observation">
        <strong>
          Fast time identifies location; slow time tracks the vibration.
        </strong>
      </p>

      <div id="das-heatmap"></div>

    <p class="das-caption">
  <strong>How to read this map:</strong>
  white indicates zero modeled dynamic response. The colored vertical band
  marks the fiber region experiencing the localized disturbance; blue and red
  indicate opposite signs of the oscillating response.
      </p>

      <p class="das-caption">
        This is an idealized DAS space-time response, not simulated raw
        coherent-Rayleigh backscatter.
      </p>

    </div>

  </div>


  <!-- Slow-time signal -->
  <div class="das-panel das-trace-panel">

    <p class="das-observation">
      <strong>Response at the disturbance location</strong>
    </p>

    <div id="das-time-trace"></div>

  </div>

</section>
  <!-- Model -->
  <details class="das-model">

    <summary>Model &amp; assumptions</summary>

    <h4>Fast time: locating the disturbance</h4>

    <p>
      Position along the fiber is obtained from optical round-trip time:
    </p>

    <p style="text-align:center;">
      <strong>
        z = ct<sub>f</sub> / (2N<sub>g</sub>)
      </strong>
    </p>

    <p>
      Here t<sub>f</sub> is optical fast time and N<sub>g</sub> is the
      group refractive index. The factor of two accounts for propagation
      from the interrogator to the scattering location and back.
    </p>


    <h4>Slow time: tracking the disturbance</h4>

    <p>
      The idealized space-time response uses a localized Gaussian spatial
      envelope with sinusoidal variation in slow time:
    </p>

    <p style="text-align:center;">
      <strong>
        ε(z,t<sub>s</sub>) =
        A exp[−(z−z<sub>0</sub>)²/(2σ<sub>z</sub>²)]
        sin(2πft<sub>s</sub>)
      </strong>
    </p>

    <p>
      This expression is a pedagogical disturbance model used to demonstrate
      localization and temporal variation. It is not a model of the raw
      coherent-Rayleigh backscatter signal.
    </p>


    <h4>Representative model parameters</h4>

    <table>
      <tbody>
        <tr>
          <td>Fiber length</td>
          <td>1000 m</td>
        </tr>
        <tr>
          <td>Group refractive index, N<sub>g</sub></td>
          <td>1.47</td>
        </tr>
        <tr>
          <td>Disturbance location</td>
          <td>User controlled: 50–950 m</td>
        </tr>
        <tr>
          <td>Disturbance frequency</td>
          <td>User controlled: 2–25 Hz</td>
        </tr>
        <tr>
          <td>Spatial envelope, σ<sub>z</sub></td>
          <td>15 m</td>
        </tr>
        <tr>
          <td>Slow-time window</td>
          <td>1 s</td>
        </tr>
        <tr>
          <td>Visualization sampling rate</td>
          <td>500 Hz</td>
        </tr>
      </tbody>
    </table>


    <h4>Assumptions</h4>

    <p>
      The demonstration represents an idealized localized axial dynamic
      disturbance. It does not model random Rayleigh scatterers, coherent
      fading, optical phase recovery, gauge-length response, pulse-width
      effects, receiver noise, cable-to-fiber coupling, or the transfer
      function of a specific DAS interrogator. The selectable frequency
      range is chosen for teaching visualization and does not represent the
      bandwidth limit of a DAS system.
    </p>


    <h4>Reference</h4>

    <p>
      A. H. Hartog,
      <em>An Introduction to Distributed Optical Fibre Sensors</em>,
      CRC Press, 2017. See the chapters on optical time-domain
      reflectometry and Rayleigh-backscatter distributed vibration sensing.
    </p>

  </details>

</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/demos/das-localization.js' | relative_url }}"></script>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/das-localization.css' | relative_url }}"
>
