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


  <!-- =====================================================
       PART 1 — HOW DAS MEASURES
       ===================================================== -->

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


    <div class="das-part-transition">

      <strong>What comes next?</strong>

      <p>
        DAS can use optical return time to locate a disturbance along the sensing
        fiber, while repeated interrogations reveal how the disturbance varies with
        time. But the spatial and temporal information that can be recovered also
        depends on how the measurement system is designed.
      </p>

    </div>

  </section>


  <!-- =====================================================
       PART 2 — DESIGNING THE MEASUREMENT
       ===================================================== -->

  <section id="das-part-2" class="das-module-part">

    <div class="das-part-heading">

      <span class="das-part-number">Part 2</span>

      <h2>Designing the Measurement</h2>

      <h3>DAS System Design Trade-offs</h3>

      <p>
        Explore first-order relationships between spatial resolution, probe
        duration and energy, sensing range, interrogation rate, and temporal
        bandwidth.
      </p>

      <p>
        Each section intentionally isolates one relationship so that its effect is
        easier to see. Practical DAS performance couples these parameters through
        additional optical, electronic, and signal-processing constraints.
      </p>

    </div>


    <!-- ===================================================
         A. SPATIAL RESOLUTION
         =================================================== -->

    <div class="das-tradeoff-section">

      <div class="das-subdemo-heading">
        <span class="das-subdemo-letter">A</span>
        <div>
          <h3>Spatial Resolution</h3>
          <p>Can two nearby disturbances still be distinguished?</p>
        </div>
      </div>


      <div class="das-tradeoff-grid">

        <div class="das-panel das-tradeoff-controls">

          <label for="das-resolution-slider">
            <strong>Spatial resolution</strong>
          </label>

          <input
            id="das-resolution-slider"
            type="range"
            min="1"
            max="30"
            step="1"
            value="10"
          >

          <div class="das-main-value">
            <span id="das-resolution-value">10</span>
            <span class="das-unit">m</span>
          </div>


          <div class="das-readouts">

            <div class="das-readout">
              <span>Approx. pulse duration</span>
              <strong id="das-resolution-pulse-duration">98.1 ns</strong>
            </div>

            <div class="das-readout">
              <span>Fixed event separation</span>
              <strong>20 m</strong>
            </div>

          </div>


          <p class="das-small-note">
            The two physical disturbances remain fixed. Only the idealized
            measurement-system spatial response changes.
          </p>

        </div>


        <div class="das-panel">

          <div id="das-resolution-plot"></div>

          <p class="das-caption">
            The measured curve uses an idealized Gaussian spatial-response
            function whose FWHM equals the selected spatial resolution. Real DAS
            spatial response also depends on the probe, receiver/acquisition,
            fiber response, and—in differential-phase DAS—gauge length.
          </p>

        </div>

      </div>

    </div>


    <!-- ===================================================
         B. COST OF FINER SPATIAL RESOLUTION
         =================================================== -->

    <div class="das-tradeoff-section">

      <div class="das-subdemo-heading">
        <span class="das-subdemo-letter">B</span>
        <div>
          <h3>Why Finer Spatial Resolution Has a Cost</h3>
          <p>
            If finer spatial resolution is useful, why not keep making the probe
            pulse shorter?
          </p>
        </div>
      </div>


      <div class="das-tradeoff-grid">

        <div class="das-panel das-tradeoff-controls">

          <label for="das-cost-resolution-slider">
            <strong>Spatial resolution</strong>
          </label>

          <input
            id="das-cost-resolution-slider"
            type="range"
            min="1"
            max="30"
            step="1"
            value="10"
          >

          <div class="das-main-value">
            <span id="das-cost-resolution-value">10</span>
            <span class="das-unit">m</span>
          </div>


          <div class="das-readouts">

            <div class="das-readout">
              <span>Approx. pulse duration</span>
              <strong id="das-cost-pulse-duration">98.1 ns</strong>
            </div>

            <div class="das-readout">
              <span>Relative pulse energy*</span>
              <strong id="das-cost-relative-energy">33%</strong>
            </div>

          </div>

          <p class="das-small-note">
            *Relative to the 30 m case, assuming fixed peak probe power.
          </p>

        </div>


        <div class="das-panel das-cost-figure">

          <h4>1. Forward trip — launched probe</h4>

          <div class="das-cost-forward-trip">

            <div class="das-cost-fiber"></div>

            <div class="das-cost-interrogator">
              DAS
            </div>

            <div
              id="das-cost-launch-pulse"
              class="das-cost-launch-pulse">
            </div>

            <div
              id="das-cost-pulse-interval"
              class="das-cost-pulse-interval">
              pulse-limited fiber interval
            </div>

            <div class="das-cost-forward-direction">
              probe propagation →
            </div>

          </div>

          <p class="das-caption">
            Finer spatial resolution requires a shorter pulse in the simple
            pulse-limited approximation. At fixed peak power, the shorter pulse
            also carries less energy.
          </p>


          <div class="das-cost-divider"></div>


          <h4>
            2. Return trip — Rayleigh backscatter arriving at the DAS receiver
          </h4>

          <div class="das-cost-return-composite">

            <div class="das-cost-return-fiber"></div>

            <div
              id="das-cost-return-signal"
              class="das-cost-return-signal">
            </div>

            <div class="das-cost-return-direction">
              ← return toward DAS
            </div>

            <div
              id="das-cost-return-label"
              class="das-cost-return-label">
              qualitative returned backscatter signal
            </div>


            <div class="das-cost-receiver">

              <div class="das-cost-receiver-name">
                DAS receiver
              </div>

              <div
                id="das-cost-receiver-screen"
                class="das-cost-receiver-screen">

                <div class="das-cost-screen-note">
                  schematic captured signal — not to scale
                </div>

                <div
                  id="das-cost-bandwidth-window"
                  class="das-cost-bandwidth-window">

                  <div class="das-cost-bandwidth-label">
                    required receiver bandwidth
                  </div>

                </div>

                <div class="das-cost-screen-baseline"></div>

                <div
                  id="das-cost-captured-pulse"
                  class="das-cost-captured-pulse">

                  <svg
                    viewBox="0 0 82 50"
                    preserveAspectRatio="none">

                    <path
                      id="das-cost-captured-pulse-path"
                      d="M0 38 C18 38 24 38 30 30 C36 16 46 16 52 30 C58 38 64 38 82 38"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    />

                  </svg>

                </div>

              </div>

            </div>

          </div>


          <p class="das-caption">
            The returned backscatter signal is always drawn weaker than the
            launched probe. Its changing prominence is a qualitative teaching cue
            for the reduced returned signal energy available at lower pulse energy.
            As finer spatial resolution requires a shorter temporal response, the
            illustrated required bandwidth widens and more schematic noise
            components fall inside the same receiver window.
          </p>


          <p class="das-small-note">
            Pulse duration and relative launched pulse energy are calculated.
            Returned-signal prominence, receiver-bandwidth window, admitted-noise
            dots, and the captured-signal inset are qualitative only—not
            quantitative backscatter, bandwidth, noise, or SNR simulations.
          </p>

        </div>

      </div>

    </div>


    <!-- ===================================================
         C. SENSING RANGE
         =================================================== -->

    <div class="das-tradeoff-section">

      <div class="das-subdemo-heading">
        <span class="das-subdemo-letter">C</span>
        <div>
          <h3>Sensing Range</h3>
          <p>
            How long must a conventional single-pulse system wait before
            repeating the same probe condition?
          </p>
        </div>
      </div>


      <div class="das-tradeoff-grid">

        <div class="das-panel das-tradeoff-controls">

          <label for="das-range-slider">
            <strong>Sensing range</strong>
          </label>

          <input
            id="das-range-slider"
            type="range"
            min="1"
            max="20"
            step="1"
            value="10"
          >

          <div class="das-main-value">
            <span id="das-range-value">10</span>
            <span class="das-unit">km</span>
          </div>


          <div class="das-readouts">

            <div class="das-readout">
              <span>Round-trip time</span>
              <strong id="das-range-round-trip">98.1 µs</strong>
            </div>

            <div class="das-readout">
              <span>Max single-pulse PRF</span>
              <strong id="das-range-prf">10.2 kHz</strong>
            </div>

          </div>

        </div>


        <div class="das-panel">

          <div class="das-range-fiber">

            <div class="das-range-interrogator">
              DAS
            </div>

            <div class="das-range-fiber-background"></div>

            <div
              id="das-range-fiber-active"
              class="das-range-fiber-active">
            </div>

            <div
              id="das-range-end"
              class="das-range-end">
            </div>

            <div
              id="das-range-label"
              class="das-range-label">
              10 km
            </div>

          </div>


          <p class="das-caption" style="text-align:center;">
            probe travels outward → &nbsp;&nbsp; returning backscatter ←
          </p>


          <h4>Required round-trip waiting window</h4>

          <div class="das-range-wait-track">

            <div
              id="das-range-wait-fill"
              class="das-range-wait-fill">
            </div>

            <div
              id="das-range-wait-marker"
              class="das-range-wait-marker">
            </div>

          </div>


          <div class="das-range-axis">

            <div class="das-range-axis-line"></div>

            <div class="das-range-tick" style="left:0%;">
              <span>0</span>
            </div>

            <div class="das-range-tick" style="left:25%;">
              <span>50</span>
            </div>

            <div class="das-range-tick" style="left:50%;">
              <span>100</span>
            </div>

            <div class="das-range-tick" style="left:75%;">
              <span>150</span>
            </div>

            <div class="das-range-tick" style="left:100%;">
              <span>200</span>
            </div>

            <div class="das-range-axis-unit">
              Round-trip time (µs)
            </div>

          </div>


          <p class="das-caption">
            The time axis remains fixed at 0–200 µs. Increasing the range
            therefore visibly lengthens the required optical round-trip window
            instead of rescaling the axis.
          </p>

          <p class="das-caption">
            This illustrates the simplified conventional single-pulse
            constraint; distinguishable-probe schemes can relax it.
          </p>

        </div>

      </div>

    </div>


    <!-- ===================================================
         D. TEMPORAL BANDWIDTH
         =================================================== -->

    <div class="das-tradeoff-section">

      <div class="das-subdemo-heading">
        <span class="das-subdemo-letter">D</span>
        <div>
          <h3>Temporal Bandwidth</h3>
          <p>
            What happens when the slow-time sampling rate is too low for the
            vibration?
          </p>
        </div>
      </div>


      <div class="das-tradeoff-grid">

        <div class="das-panel das-tradeoff-controls">

          <label for="das-temporal-prf-slider">
            <strong>Probe repetition frequency (PRF)</strong>
          </label>

          <input
            id="das-temporal-prf-slider"
            type="range"
            min="200"
            max="2000"
            step="100"
            value="1000"
          >

          <div class="das-main-value">
            <span id="das-temporal-prf-value">1000</span>
            <span class="das-unit">Hz</span>
          </div>


          <label for="das-temporal-frequency-slider">
            <strong>Vibration frequency</strong>
          </label>

          <input
            id="das-temporal-frequency-slider"
            type="range"
            min="50"
            max="900"
            step="25"
            value="700"
          >

          <div class="das-main-value">
            <span id="das-temporal-frequency-value">700</span>
            <span class="das-unit">Hz</span>
          </div>


          <div class="das-readouts">

            <div class="das-readout">
              <span>Probe interval</span>
              <strong id="das-temporal-probe-interval">1.00 ms</strong>
            </div>

            <div class="das-readout">
              <span>Nyquist limit</span>
              <strong id="das-temporal-nyquist">500 Hz</strong>
            </div>

            <div class="das-readout">
              <span>Sampling status</span>
              <strong id="das-temporal-status">
                Above Nyquist — aliased
              </strong>
            </div>

            <div class="das-readout">
              <span>Apparent sampled frequency</span>
              <strong id="das-temporal-apparent-frequency">300 Hz</strong>
            </div>

          </div>

        </div>


        <div class="das-panel">

          <p class="das-observation">
            <strong>
              Actual vibration, DAS samples, and apparent sampled vibration
            </strong>
          </p>

          <div id="das-temporal-plot"></div>

          <p
            id="das-temporal-explanation"
            class="das-caption">
            700 Hz actual vibration sampled at 1000 Hz is above the 500 Hz
            Nyquist limit. The acquired samples are consistent with an apparent
            vibration of 300 Hz in the first Nyquist zone.
          </p>

        </div>

      </div>

    </div>


    <div class="das-part-transition">

      <strong>From relationships to engineering design.</strong>

      <p>
        These experiments isolate individual effects so that their physical
        consequences are easier to see. In practice, a DAS system must satisfy
        several requirements at once. The appropriate combination depends on
        the problem the system is intended to solve.
      </p>

    </div>

  </section>


  <!-- =====================================================
       PART 3 — DESIGNING FOR AN APPLICATION
       ===================================================== -->

  <section id="das-part-3" class="das-module-part">

    <div class="das-part-heading">

      <span class="das-part-number">Part 3</span>

      <h2>Designing for an Application</h2>

      <h3>Pipeline Monitoring Exercise</h3>

      <p>
        Explore how the requirements of a hypothetical pipeline-monitoring
        application translate into initial DAS design parameters.
      </p>

    </div>


    <div class="das-panel das-application-panel">

      <p class="das-observation">
        <strong>From application requirements to an initial DAS design</strong>
      </p>

      <p class="das-caption">
        This exercise uses the first-order relationships introduced above to
        make an initial design assessment. It illustrates the design process
        rather than predicting the performance of a complete DAS system.
      </p>


      <!-- Pipeline teaching schematic -->
      <div class="das-application-pipeline">

        <div class="das-application-pipe"></div>

        <div
          class="das-application-flange"
          style="left:24%;">
        </div>

        <div
          class="das-application-flange"
          style="left:51%;">
        </div>

        <div
          class="das-application-flange"
          style="left:78%;">
        </div>

        <div class="das-application-pipe-label">
          pipeline
        </div>

        <div class="das-application-fiber-background"></div>

        <div
          id="das-application-fiber-active"
          class="das-application-fiber-active">
        </div>

        <div class="das-application-interrogator">
          DAS
        </div>

        <div
          id="das-application-range-end"
          class="das-application-range-end">
        </div>

        <div
          id="das-application-range-label"
          class="das-application-range-label">
          10 km monitored section
        </div>

        <div class="das-application-event">
          ≈
        </div>

        <div
          id="das-application-frequency-label"
          class="das-application-frequency-label">
          frequency content up to 1.0 kHz
        </div>

      </div>


      <div class="das-application-grid">

        <!-- Application requirements -->
        <div class="das-panel das-application-controls">

          <label for="das-application-range-slider">
            <strong>Pipeline section to monitor</strong>
          </label>

          <input
            id="das-application-range-slider"
            type="range"
            min="1"
            max="20"
            step="1"
            value="10"
          >

          <div class="das-main-value">
            <span id="das-application-range-value">10</span>
            <span class="das-unit">km</span>
          </div>


          <label for="das-application-resolution-slider">
            <strong>Required spatial detail</strong>
          </label>

          <input
            id="das-application-resolution-slider"
            type="range"
            min="1"
            max="30"
            step="1"
            value="10"
          >

          <div class="das-main-value">
            <span id="das-application-resolution-value">10</span>
            <span class="das-unit">m</span>
          </div>


          <label for="das-application-frequency-slider">
            <strong>Highest vibration frequency of interest</strong>
          </label>

          <input
            id="das-application-frequency-slider"
            type="range"
            min="100"
            max="5000"
            step="100"
            value="1000"
          >

          <div class="das-main-value">
            <span id="das-application-frequency-value">1.0</span>
            <span class="das-unit">kHz</span>
          </div>


          <p class="das-small-note">
            These sliders describe the hypothetical
            <strong>application requirements</strong>, not settings on a DAS
            interrogator.
          </p>

        </div>


        <!-- Initial calculations -->
        <div class="das-panel">

          <h4>Initial DAS design calculations</h4>

          <div class="das-readouts">

            <div class="das-readout">
              <span>Round-trip time</span>
              <strong id="das-application-round-trip">98.1 µs</strong>
            </div>

            <div class="das-readout">
              <span>Max conventional single-pulse PRF</span>
              <strong id="das-application-prf">10.2 kHz</strong>
            </div>

            <div class="das-readout">
              <span>Slow-time Nyquist ceiling</span>
              <strong id="das-application-nyquist">5.10 kHz</strong>
            </div>

            <div class="das-readout">
              <span>Approx. pulse duration</span>
              <strong id="das-application-pulse-duration">98.1 ns</strong>
            </div>

          </div>


          <div class="das-application-feedback-grid">

            <div class="das-application-feedback">

              <span>Range consequence</span>

              <strong id="das-application-range-consequence">
                10 km → 98.1 µs round trip
              </strong>

              <p id="das-application-range-detail">
                This limits the conventional single-pulse PRF to about
                10.2 kHz.
              </p>

            </div>


            <div class="das-application-feedback">

              <span>Spatial consequence</span>

              <strong id="das-application-spatial-consequence">
                10 m → 98.1 ns pulse
              </strong>

              <p id="das-application-spatial-detail">
                This maps to a moderate pulse duration in the first-order
                model. Signal-energy and receiver-bandwidth consequences still
                require validation.
              </p>

            </div>


            <div class="das-application-feedback">

              <span>Temporal consequence</span>

              <strong id="das-application-temporal-consequence">
                1.0 kHz is below 5.10 kHz
              </strong>

              <p id="das-application-temporal-detail">
                The requested vibration content is within the conventional
                first-order temporal sampling limit for this selected range.
              </p>

            </div>

          </div>


          <div class="das-application-iteration">

            <strong id="das-application-iteration-heading">
              Current first-order requirements are not obviously incompatible.
            </strong>

            <p
              id="das-application-iteration-text"
              class="das-caption">
              This is only a candidate starting point. The next question is
              whether the measurement quality is adequate under representative
              conditions.
            </p>

          </div>

        </div>

      </div>


      <div class="das-application-validation">

        <h4>When the first-order requirements look workable: validate</h4>

        <p>
          These calculations provide a starting point for selecting system
          parameters. They do not establish whether the resulting DAS system
          can reliably solve the monitoring problem.
        </p>


        <div class="das-validation-flow">

          <div class="das-validation-box">
            <strong>Candidate DAS design</strong>
          </div>

          <div class="das-validation-arrow">↓</div>

          <div class="das-validation-box">
            Representative fiber / pipeline environment
          </div>

          <div class="das-validation-arrow">↓</div>

          <div class="das-validation-box">
            Target events + realistic background activity
          </div>

          <div class="das-validation-arrow">↓</div>

          <div class="das-validation-box">
            Check detection, spatial separation, retained frequency content,
            far-end performance, and nuisance alarms
          </div>

          <div class="das-validation-arrow">↓</div>

          <div class="das-validation-box">
            <strong>
              Does the measurement support the required real-world decision?
            </strong>
          </div>

        </div>

      </div>


      <div class="das-application-conclusion">

        <strong>Start with the problem, not the specification sheet.</strong>

        <p>
          There is no universally optimal DAS configuration. A well-designed
          DAS system is one whose measurement capabilities are matched to a
          clearly defined application and then validated against that
          application's requirements.
        </p>

      </div>


      <p class="das-caption">
        Pipeline monitoring is used here only as a teaching example. The
        selected values are hypothetical application requirements, not
        recommended pipeline-monitoring specifications.
      </p>

    </div>

  </section>


  <!-- =====================================================
       MODEL & ASSUMPTIONS
       ===================================================== -->

  <details class="das-model">

    <summary>Model &amp; assumptions</summary>


    <h4>Scope of the module</h4>

    <p>
      This module intentionally isolates first-order relationships for teaching.
      It is not a complete coupled simulation of a DAS interrogator. Practical
      performance also depends on optical power, pulse shape, fiber attenuation,
      Rayleigh backscatter, coherent fading, receiver characteristics,
      interrogation architecture, averaging, cable-to-fiber coupling, and
      signal processing.
    </p>


    <h4>Part 1 — Fast time: locating the disturbance</h4>

    <p>
      Position along the fiber is obtained from optical round-trip time:
    </p>

    <p style="text-align:center;">
      <strong>
        z = ct<sub>f</sub> / (2N<sub>g</sub>)
      </strong>
    </p>

    <p>
      Here t<sub>f</sub> is optical fast time and N<sub>g</sub> is the group
      refractive index. The factor of two accounts for propagation from the
      interrogator to the scattering location and back.
    </p>


    <h4>Part 1 — Slow time: tracking the disturbance</h4>

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


    <h4>Part 2 — Spatial resolution</h4>

    <p>
      In the simplified pulse-limited approximation:
    </p>

    <p style="text-align:center;">
      <strong>
        δz ≈ cτ<sub>p</sub> / (2N<sub>g</sub>)
      </strong>
    </p>

    <p>
      The two-disturbance visualization uses an idealized Gaussian spatial
      response whose FWHM equals the selected spatial resolution. Actual DAS
      spatial response also depends on the probe, receiver/acquisition response,
      fiber response, and—in differential-phase DAS—gauge length.
    </p>


    <h4>Part 2 — Pulse energy and receiver bandwidth</h4>

    <p>
      For the teaching model, peak probe power is held fixed. For a rectangular
      pulse:
    </p>

    <p style="text-align:center;">
      <strong>
        E<sub>p</sub> = P<sub>p</sub>τ<sub>p</sub>
      </strong>
    </p>

    <p>
      Shorter pulses therefore contain less energy at fixed peak power.
      Preserving a shorter temporal response also requires sufficient
      receiver/acquisition bandwidth. The returned-backscatter prominence,
      receiver-bandwidth window, admitted-noise dots, and captured-signal inset
      in Part 2B are qualitative teaching cues only. They are not quantitative
      simulations of backscatter power, receiver noise, or SNR.
    </p>


    <h4>Part 2 — Sensing range</h4>

    <p>
      The optical round-trip time is:
    </p>

    <p style="text-align:center;">
      <strong>
        t<sub>RT</sub> = 2N<sub>g</sub>L / c
      </strong>
    </p>

    <p>
      For the simplified conventional single-pulse case:
    </p>

    <p style="text-align:center;">
      <strong>
        f<sub>R,max</sub> ≈ 1 / t<sub>RT</sub>
      </strong>
    </p>

    <p>
      Advanced distinguishable-probe interrogation schemes can relax this
      simple fiber-length repetition constraint.
    </p>


    <h4>Part 2 — Temporal sampling</h4>

    <p>
      The conventional slow-time Nyquist frequency is:
    </p>

    <p style="text-align:center;">
      <strong>
        f<sub>N</sub> = f<sub>R</sub> / 2
      </strong>
    </p>

    <p>
      The aliasing visualization uses a zero-phase sinusoidal teaching signal.
      The exact-Nyquist case is treated separately because sampling exactly at
      the Nyquist frequency is a phase-sensitive boundary rather than a robust
      sampling condition.
    </p>


    <h4>Part 3 — Application design exercise</h4>

    <p>
      The pipeline exercise uses the same first-order range, spatial-resolution,
      pulse-duration, PRF, and Nyquist relationships to translate hypothetical
      application requirements into an initial DAS design assessment.
    </p>

    <p>
      It does not predict detection probability, received signal strength, SNR,
      false-alarm performance, nuisance-alarm performance, or overall pipeline
      monitoring suitability. Those questions require representative
      experimental validation.
    </p>


    <h4>Representative parameters</h4>

    <table>
      <tbody>

        <tr>
          <td>Group refractive index, N<sub>g</sub></td>
          <td>1.47</td>
        </tr>

        <tr>
          <td>Part 1 fiber length</td>
          <td>1000 m</td>
        </tr>

        <tr>
          <td>Part 1 disturbance location</td>
          <td>User controlled: 50–950 m</td>
        </tr>

        <tr>
          <td>Part 1 disturbance frequency</td>
          <td>User controlled: 2–25 Hz</td>
        </tr>

        <tr>
          <td>Part 1 spatial envelope, σ<sub>z</sub></td>
          <td>15 m</td>
        </tr>

        <tr>
          <td>Part 1 slow-time window</td>
          <td>1 s</td>
        </tr>

        <tr>
          <td>Part 1 visualization sampling rate</td>
          <td>500 Hz</td>
        </tr>

        <tr>
          <td>Part 2 spatial resolution</td>
          <td>User controlled: 1–30 m</td>
        </tr>

        <tr>
          <td>Part 2 fixed event separation</td>
          <td>20 m</td>
        </tr>

        <tr>
          <td>Part 2 sensing range</td>
          <td>User controlled: 1–20 km</td>
        </tr>

        <tr>
          <td>Part 2 PRF</td>
          <td>User controlled: 200–2000 Hz</td>
        </tr>

        <tr>
          <td>Part 2 vibration frequency</td>
          <td>User controlled: 50–900 Hz</td>
        </tr>

        <tr>
          <td>Part 3 monitored pipeline range</td>
          <td>User controlled: 1–20 km</td>
        </tr>

        <tr>
          <td>Part 3 required spatial detail</td>
          <td>User controlled: 1–30 m</td>
        </tr>

        <tr>
          <td>Part 3 highest vibration frequency of interest</td>
          <td>User controlled: 0.1–5 kHz</td>
        </tr>

      </tbody>
    </table>


    <h4>Reference</h4>

    <p>
      A. H. Hartog,
      <em>An Introduction to Distributed Optical Fibre Sensors</em>,
      CRC Press, 2017. See the chapters on optical time-domain reflectometry
      and Rayleigh-backscatter distributed vibration sensing.
    </p>

  </details>

</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script
  src="{{ '/assets/js/demos/das-localization.js' | relative_url }}">
</script>

<link
  rel="stylesheet"
  href="{{ '/assets/css/demos/das-localization.css' | relative_url }}"
>
