---
layout: page
title: Fiber Bragg Grating Strain Sensor
permalink: /demos/fbg-strain/
---

<div class="fbg-demo">

  <p class="fbg-intro">
    Explore how a fiber Bragg grating converts strain into a wavelength-encoded
    optical measurement, then investigate how sensitivity, wavelength-readout
    resolution, temperature cross-sensitivity, and application requirements
    shape the resulting measurement.
  </p>


  <!-- =====================================================
       1. WAVELENGTH-ENCODED SENSING
       ===================================================== -->

  <section class="fbg-module-section">

    <div class="fbg-section-heading">
      <span class="fbg-section-number">1</span>
      <div>
        <h2>Wavelength-Encoded Sensing</h2>
        <p>
          Follow the measurement chain from applied axial strain to a shift in
          the Bragg reflection wavelength.
        </p>
      </div>
    </div>


    <div class="fbg-demo-grid">

      <!-- Controls and physical FBG -->
      <div class="fbg-panel fbg-controls">

        <h3>Applied axial strain</h3>

        <input
          id="fbg-strain-slider"
          type="range"
          min="0"
          max="2000"
          step="10"
          value="800"
        >

        <div class="fbg-strain-value">
          <span id="fbg-strain-value">800</span>
          <span class="fbg-unit">µε</span>
        </div>


        <div class="fbg-design-compare">

          <strong>Compare FBG reference wavelength</strong>

          <div class="fbg-wavelength-buttons">

            <button
              type="button"
              class="fbg-wl-button"
              data-lambda="1310">
              1310 nm
            </button>

            <button
              type="button"
              class="fbg-wl-button"
              data-lambda="1450">
              1450 nm
            </button>

            <button
              type="button"
              class="fbg-wl-button active"
              data-lambda="1550">
              1550 nm
            </button>

          </div>

          <p class="fbg-small-note">
            This compares representative FBG reference wavelengths. The
            effective strain-optic coefficient is held constant to isolate
            wavelength dependence in the simplified sensitivity model.
          </p>

        </div>


        <div class="fbg-readouts">

          <div class="fbg-readout">
            <span>Bragg wavelength</span>
            <strong id="fbg-bragg-wavelength">1550.989 nm</strong>
          </div>

          <div class="fbg-readout">
            <span>Wavelength shift</span>
            <strong id="fbg-wavelength-shift">+0.989 nm</strong>
          </div>

          <div class="fbg-readout">
            <span>Grating period, Λ</span>
            <strong id="fbg-grating-period">536.020 nm</strong>
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

            <small>
              Schematic deformation exaggerated for visibility.
            </small>

          </div>

        </div>

      </div>


      <!-- Spectrum + calibration inset -->
      <div class="fbg-panel fbg-spectrum-panel">

        <h3>What does the optical readout show?</h3>

        <p class="fbg-caption">
          <strong>Optical observable:</strong>
          Bragg wavelength, λ<sub>B</sub>
        </p>

        <div class="fbg-spectrum-wrap">

          <div id="fbg-spectrum"></div>

          <div class="fbg-calibration-inset">

            <strong>Calibration: optical response vs. strain</strong>

            <div id="fbg-calibration"></div>

            <div class="fbg-calibration-value">
              Sensitivity = slope:
              <strong id="fbg-sensitivity">1.236 pm/µε</strong>
            </div>

          </div>

        </div>

        <p class="fbg-caption">
          Dashed: unstrained FBG. Solid: strained FBG. The inset uses the same
          wavelength-shift model to show how sensitivity emerges as the
          calibration slope.
        </p>

      </div>

    </div>


    <div class="fbg-measurement-chain">
      <strong>
        Applied strain ε
        &nbsp;→&nbsp;
        Bragg-wavelength shift Δλ<sub>B</sub>
        &nbsp;→&nbsp;
        sensitivity = calibration slope
      </strong>

      <p>
        The physical measurand is encoded as a change in an optical observable.
      </p>
    </div>

  </section>


  <!-- =====================================================
       2. MEASUREMENT ERROR
       ===================================================== -->

  <section class="fbg-module-section">

    <div class="fbg-section-heading">
      <span class="fbg-section-number">2</span>
      <div>
        <h2>Measurement Error</h2>
        <p>
          A wavelength shift can contain contributions from more than one
          physical effect.
        </p>
      </div>
    </div>


    <div class="fbg-panel fbg-error-module">

      <p class="fbg-observation">
        <strong>
          How far can the reported strain be displaced from the reference strain?
        </strong>
      </p>


      <div class="fbg-error-control-row">

        <div class="fbg-question-control">

          <strong>Temperature change</strong>

          <input
            id="fbg-temperature-change"
            type="range"
            min="-10"
            max="10"
            step="1"
            value="5"
          >

          <div class="fbg-strain-value">
            <span id="fbg-temperature-change-value">5</span>
            <span class="fbg-unit">°C</span>
          </div>

        </div>


        <div class="fbg-error-summary">

          <div class="fbg-error-box">
            Reference strain
            <strong id="fbg-error-reference-strain"></strong>
          </div>

          <div class="fbg-error-box">
            Strain-induced shift
            <strong id="fbg-error-strain-shift"></strong>
          </div>

          <div class="fbg-error-box">
            Temperature-induced shift
            <strong id="fbg-error-temperature-shift"></strong>
          </div>

          <div class="fbg-error-box">
            Reported strain
            <strong id="fbg-error-reported-strain"></strong>
          </div>

          <div class="fbg-error-result">
            <span>Apparent strain error</span>
            <strong id="fbg-apparent-strain-error"></strong>
          </div>

        </div>

      </div>


      <div id="fbg-error-plot"></div>


      <p class="fbg-caption">
        Orange shows the response expected from strain alone. Green shows the
        measured wavelength shift after temperature adds an optical contribution.
        The red diamond is the strain that would be reported if that temperature
        contribution were interpreted using the strain-only calibration.
      </p>

    </div>

  </section>


  <!-- =====================================================
       3. MEASUREMENT RESOLUTION
       ===================================================== -->

  <section class="fbg-module-section">

    <div class="fbg-section-heading">
      <span class="fbg-section-number">3</span>
      <div>
        <h2>Measurement Resolution</h2>
        <p>
          The FBG can physically respond even when the wavelength readout
          cannot yet distinguish the resulting shift.
        </p>
      </div>
    </div>


    <div class="fbg-panel fbg-resolution-module">

      <div class="fbg-resolution-controls">

        <div class="fbg-question-control">

          <strong>Small additional strain change, Δε</strong>

          <input
            id="fbg-resolution-strain"
            type="range"
            min="0"
            max="30"
            step="0.5"
            value="8"
          >

          <div class="fbg-strain-value">
            <span id="fbg-resolution-strain-value">8.0</span>
            <span class="fbg-unit">µε</span>
          </div>

        </div>


        <div class="fbg-question-control">

          <strong>Wavelength readout resolution</strong>

          <input
            id="fbg-resolution-readout"
            type="range"
            min="1"
            max="30"
            step="1"
            value="20"
          >

          <div class="fbg-strain-value">
            <span id="fbg-resolution-readout-value">20</span>
            <span class="fbg-unit">pm</span>
          </div>

          <p class="fbg-small-note">
            Smallest wavelength change represented as distinguishable in this
            teaching view.
          </p>

        </div>

      </div>


      <div class="fbg-resolution-monitors">

        <div class="fbg-pseudo-monitor">

          <strong>High-resolution reference</strong>
          <span>Underlying FBG response</span>

          <div id="fbg-resolution-reference"></div>

          <p>
            Physical shift:
            <strong id="fbg-resolution-physical-shift"></strong>
          </p>

        </div>


        <div class="fbg-pseudo-monitor">

          <strong>Selected wavelength readout</strong>
          <span>Schematic finite-resolution capture</span>

          <div id="fbg-resolution-capture"></div>

          <p>
            Selected resolution:
            <strong id="fbg-resolution-selected"></strong>
          </p>

        </div>

      </div>


      <div class="fbg-resolution-decision">

        <div>
          <span>Physical wavelength shift</span>
          <strong id="fbg-resolution-shift"></strong>
        </div>

        <strong id="fbg-resolution-comparison">&lt;</strong>

        <div>
          <span>Selected readout resolution</span>
          <strong id="fbg-resolution-threshold"></strong>
        </div>

        <strong>→</strong>

        <div>
          <span>Teaching interpretation</span>
          <strong id="fbg-resolution-status"></strong>
        </div>

      </div>


      <div class="fbg-resolution-equation">

        <span>Selected readout resolution</span>
        <strong id="fbg-resolution-equation-readout"></strong>

        <span>÷</span>

        <span>FBG strain sensitivity</span>
        <strong id="fbg-resolution-equation-sensitivity"></strong>

        <span>=</span>

        <span>Equivalent strain resolution</span>
        <strong id="fbg-resolution-equivalent-strain"></strong>

      </div>


      <p class="fbg-caption">
        This is a teaching representation of wavelength readout resolution,
        not a simulation of a specific optical spectrum analyzer or FBG
        interrogator.
      </p>

    </div>

  </section>


  <!-- =====================================================
       4. APPLICATION
       ===================================================== -->

  <section class="fbg-module-section">

    <div class="fbg-section-heading">
      <span class="fbg-section-number">4</span>
      <div>
        <h2>Designing for an Application</h2>
        <h3>Railway Bridge Strain Monitoring</h3>

        <p>
          Work backward from a hypothetical monitoring requirement. Can the
          candidate FBG measurement configuration resolve the strain information
          of interest, and what happens when temperature also shifts the Bragg
          wavelength?
        </p>
      </div>
    </div>


    <div class="fbg-panel fbg-application-module">

      <!-- Bridge schematic -->
      <div class="fbg-bridge-schematic">

        <div class="fbg-bridge-train-label">
          passing train load
        </div>

        <div class="fbg-bridge-train">

          <div class="fbg-train-car">
            <span class="fbg-train-window w1"></span>
            <span class="fbg-train-window w2"></span>
            <span class="fbg-train-window w3"></span>
            <span class="fbg-train-wheel a"></span>
            <span class="fbg-train-wheel b"></span>
            <span class="fbg-train-coupler"></span>
          </div>

          <div class="fbg-train-car">
            <span class="fbg-train-window w1"></span>
            <span class="fbg-train-window w2"></span>
            <span class="fbg-train-window w3"></span>
            <span class="fbg-train-wheel a"></span>
            <span class="fbg-train-wheel b"></span>
            <span class="fbg-train-coupler"></span>
          </div>

          <div class="fbg-train-car fbg-train-loco">
            <span class="fbg-train-window w1"></span>
            <span class="fbg-train-window w2"></span>
            <span class="fbg-train-window w3"></span>
            <span class="fbg-train-wheel a"></span>
            <span class="fbg-train-wheel b"></span>
          </div>

        </div>


        <div class="fbg-bridge-rail"></div>
        <div class="fbg-bridge-deck"></div>

        <div class="fbg-bridge-pier one"></div>
        <div class="fbg-bridge-pier two"></div>


        <div class="fbg-bridge-sensor-topology">

          <div class="fbg-bridge-bond-patch">
            <div class="fbg-mini-grating"></div>
          </div>

          <div class="fbg-bridge-bond-label">
            Bonded FBG — strain + temperature
          </div>


          <div class="fbg-bridge-temp-housing">
            <div class="fbg-mini-grating"></div>
          </div>

          <div class="fbg-bridge-temp-label">
            Strain-isolated reference FBG — temperature monitoring
          </div>


          <div class="fbg-bridge-optical-path"></div>
          <div class="fbg-bridge-optical-drop"></div>
          <div class="fbg-bridge-optical-return"></div>

          <div class="fbg-bridge-path-label">
            optical fiber to readout
          </div>

        </div>


        <div class="fbg-bridge-interrogator">
          FBG<br>READOUT
        </div>

      </div>


      <!-- Application controls -->
      <div class="fbg-application-control-strip">

        <div class="fbg-question-control">

          <strong>Smallest bridge strain change of interest</strong>

          <input
            id="fbg-bridge-required-strain"
            type="range"
            min="1"
            max="30"
            step="1"
            value="5"
          >

          <div class="fbg-strain-value">
            <span id="fbg-bridge-required-strain-value">5</span>
            <span class="fbg-unit">µε</span>
          </div>

        </div>


        <div class="fbg-question-control">

          <strong>Wavelength readout resolution</strong>

          <input
            id="fbg-bridge-readout-resolution"
            type="range"
            min="1"
            max="30"
            step="1"
            value="5"
          >

          <div class="fbg-strain-value">
            <span id="fbg-bridge-readout-resolution-value">5</span>
            <span class="fbg-unit">pm</span>
          </div>

        </div>


        <div class="fbg-question-control">

          <strong>Possible temperature change</strong>

          <input
            id="fbg-bridge-temperature-change"
            type="range"
            min="0"
            max="20"
            step="1"
            value="10"
          >

          <div class="fbg-strain-value">
            <span id="fbg-bridge-temperature-change-value">10</span>
            <span class="fbg-unit">°C</span>
          </div>

        </div>

      </div>


      <!-- Application figures -->
      <div class="fbg-application-main-panels">

        <div class="fbg-application-figure">

          <strong>1. What the FBG physically produces</strong>

          <p class="fbg-caption">
            The main view separates strain and temperature contributions; the
            inset shows the combined captured response.
          </p>


          <div class="fbg-bridge-spectrum-wrap">

            <div id="fbg-bridge-spectrum"></div>


            <div class="fbg-bridge-readout-inset">

              <strong>Selected wavelength readout</strong>

              <span id="fbg-bridge-readout-status"></span>

              <div id="fbg-bridge-readout-plot"></div>

            </div>

          </div>

        </div>


        <div class="fbg-application-figure">

          <strong>2. How the wavelength reading is interpreted</strong>

          <p class="fbg-caption">
            Auto-zoomed strain calibration with temperature cross-sensitivity.
          </p>

          <div id="fbg-bridge-error-plot"></div>

        </div>

      </div>


      <!-- Dynamic design feedback -->
      <div class="fbg-application-feedback">

        <strong id="fbg-bridge-feedback-heading"></strong>

        <p
          id="fbg-bridge-feedback-text"
          class="fbg-caption">
        </p>


        <div class="fbg-application-flow">

          <div>Bridge monitoring problem</div>
          <span>→</span>

          <div>Required strain information</div>
          <span>→</span>

          <div>FBG sensitivity + readout</div>
          <span>→</span>

          <div>Temperature compensation</div>
          <span>→</span>

          <div>Validate installation</div>

        </div>

      </div>


      <!-- Application conclusion -->
      <div class="fbg-application-conclusion">

        <strong>
          Start with the monitoring requirement, then design the measurement
          around it.
        </strong>

        <p class="fbg-caption">
          This exercise does not determine whether a bridge is safe. It asks
          whether the proposed FBG measurement can resolve the required
          structural strain information under the simplified assumptions shown
          here. A real deployment also requires structural analysis, sensor
          placement, installation and strain-transfer assessment, environmental
          compensation, calibration, redundancy, and field validation.
        </p>

      </div>


      <!-- Temperature compensation -->
      <div class="fbg-temperature-compensation-note">

        <h4>How can the reference FBG help compensate temperature?</h4>

        <p>
          The FBG bonded to the bridge responds to both structural strain and
          temperature, so its measured Bragg-wavelength shift cannot
          automatically be attributed to strain alone. A nearby reference FBG
          can help separate these effects.
        </p>

        <p>
          The reference FBG is mounted or packaged so that it experiences a
          representative local temperature while being mechanically isolated
          from the bridge strain as much as practical. Its calibrated
          temperature response can then be used to estimate the temperature
          change and the corresponding temperature contribution to the bonded
          FBG measurement. The remaining wavelength shift can be interpreted as
          the strain-related response.
        </p>

        <p class="fbg-equation">
          <strong>
            Δλ<sub>bonded</sub>
            =
            S<sub>ε</sub>Δε
            +
            S<sub>T</sub>ΔT
          </strong>
        </p>

        <p>
          This is not necessarily a direct subtraction of the two measured
          wavelength shifts. The bonded and reference FBGs may have different
          temperature sensitivities, so their responses must be appropriately
          calibrated. In field installations, compensation accuracy can also
          depend on sensor packaging, mounting, thermal contact, strain
          transfer, and whether both sensors experience sufficiently similar
          temperatures.
        </p>

      </div>

    </div>

  </section>


  <!-- =====================================================
       FINAL TAKEAWAY
       ===================================================== -->

  <div class="fbg-final-takeaway">

    <strong>
      A sensor can resolve very small changes and still have significant
      measurement error.
    </strong>

    <p>
      <strong>Teaching scope:</strong>
      resolution describes distinguishability, while measurement error describes
      displacement of a reported value from its reference value. The examples
      above illustrate these ideas using simplified measurement models rather
      than a complete uncertainty budget.
    </p>

  </div>


  <!-- =====================================================
       MODEL, ASSUMPTIONS & REFERENCES — LAST SECTION
       ===================================================== -->

  <details class="fbg-model">

    <summary>Model, assumptions &amp; references</summary>


    <h4>Governing FBG physics</h4>

    <p>
      A fiber Bragg grating reflects light near the Bragg wavelength
    </p>

    <p class="fbg-equation">
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

    <p class="fbg-equation">
      <strong>
        Δλ<sub>B</sub>
        =
        λ<sub>B,0</sub>(1 − p<sub>e</sub>)ε
      </strong>
    </p>

    <p>
      where ε is applied axial strain and p<sub>e</sub> is the effective
      strain-optic coefficient.
    </p>


    <h4>Reflection spectrum</h4>

    <p>
      The displayed spectra are calculated using the coupled-mode model for an
      ideal uniform fiber Bragg grating. They are not imposed Gaussian peaks.
      The visible sidelobes arise from the ideal uniform, unapodized grating
      model.
    </p>


    <h4>Representative FBG parameters</h4>

    <table>
      <tbody>

        <tr>
          <td>Default reference Bragg wavelength</td>
          <td>1550 nm</td>
        </tr>

        <tr>
          <td>Effective strain-optic coefficient, p<sub>e</sub></td>
          <td>0.2027</td>
        </tr>

        <tr>
          <td>Strain sensitivity at 1550 nm</td>
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


    <h4>Sensitivity comparison</h4>

    <p>
      The reference-wavelength comparison uses
      S<sub>ε</sub> = λ<sub>B,0</sub>(1 − p<sub>e</sub>), with
      p<sub>e</sub> held constant. This isolates the wavelength dependence of
      the simplified strain-sensitivity model.
    </p>


    <h4>Wavelength-readout resolution</h4>

    <p>
      The resolution panels use a threshold teaching model. The selected
      wavelength resolution represents the smallest wavelength change treated
      as distinguishable. These panels are not simulations of a particular
      optical spectrum analyzer or commercial FBG interrogator and do not model
      instrument linewidth, sampling, peak-fitting algorithms, noise, or
      wavelength accuracy.
    </p>


    <h4>Temperature cross-sensitivity</h4>

    <p>
      Temperature is represented as an additional contribution to the
      Bragg-wavelength shift. The teaching model uses a representative
      temperature sensitivity of 10 pm/°C. This is an explicit model assumption,
      not a universal FBG coefficient; actual temperature response depends on
      the fiber, grating, packaging, mounting, and calibration.
    </p>


    <h4>Railway-bridge teaching exercise</h4>

    <p>
      The bridge strain requirement, wavelength-readout resolution, and
      temperature range are hypothetical user-selectable teaching inputs. They
      are not railway-bridge safety limits, structural acceptance criteria, or
      recommended monitoring specifications.
    </p>

    <p>
      The reference-FBG concept assumes that the reference experiences a
      representative local temperature while being mechanically isolated from
      structural strain as far as practical. Field compensation requires
      calibration of the sensing and reference responses.
    </p>


    <h4>Additional limitations</h4>

    <p>
      The extended model is not a complete measurement uncertainty budget or a
      structural-health-monitoring design. It does not model nonuniform strain
      or temperature, transverse strain, birefringence, adhesive and substrate
      mechanics, imperfect strain transfer, thermal lag, spatial temperature
      gradients, spectral-peak fitting error, source and detector noise,
      interrogator wavelength accuracy, multiplexing constraints, structural
      load paths, sensor-placement optimization, redundancy, fatigue, or
      bridge-specific structural limits.
    </p>


    <h4>References</h4>

    <p>
      F. T. S. Yu and S. Yin, eds.,
      <em>Fiber Optic Sensors</em>,
      Marcel Dekker, 2002.
    </p>

    <p>
      A. Othonos and K. Kalli,
      <em>Fiber Bragg Gratings: Fundamentals and Applications in
      Telecommunications and Sensing</em>,
      Artech House, 1999.
    </p>

    <p>
      E. Udd and W. B. Spillman Jr., eds.,
      <em>Fiber Optic Sensors: An Introduction for Engineers and Scientists</em>,
      2nd ed., Wiley, 2011.
    </p>

    <p>
      C. Campanella et al.,
      “Fibre Bragg Grating Based Strain Sensors: Review of Technology and
      Applications,”
      <em>Sensors</em>,
      vol. 18, no. 9, 3115, 2018.
    </p>

  </details>

</div>


<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script
  src="{{ '/assets/js/demos/fbg-strain.js' | relative_url }}">
</script>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/fbg-strain.css' | relative_url }}"
>
