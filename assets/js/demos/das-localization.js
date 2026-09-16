// =============================================================================
// Distributed Acoustic Sensing (DAS)
// Interactive teaching module
// =============================================================================

const DAS = {
  c: 299792458,       // speed of light in vacuum, m/s
  Ng: 1.47,           // representative group refractive index

  // Part 1
  fiberLength: 1000,  // m
  sigmaZ: 15,         // m
  slowFs: 500,        // Hz
  slowDuration: 1.0   // s
};


// =============================================================================
// Shared first-order relationships
// =============================================================================

function dasFastTimeMicroseconds(positionM) {
  return (2 * DAS.Ng * positionM / DAS.c) * 1e6;
}


function dasPulseDurationNs(spatialResolutionM) {
  return (
    2 * DAS.Ng * spatialResolutionM / DAS.c
  ) * 1e9;
}


function dasRoundTripSeconds(rangeM) {
  return 2 * DAS.Ng * rangeM / DAS.c;
}


function dasMaxSinglePulsePRF(rangeM) {
  return 1 / dasRoundTripSeconds(rangeM);
}


// =============================================================================
// PART 1 — Disturbance localization
// =============================================================================

function dasSpatialEnvelope(positionM, disturbanceLocationM) {

  const dz =
    positionM - disturbanceLocationM;

  return Math.exp(
    -0.5 * Math.pow(dz / DAS.sigmaZ, 2)
  );
}


function dasTemporalResponse(slowTimeS, frequencyHz) {

  return Math.sin(
    2 * Math.PI * frequencyHz * slowTimeS
  );
}


function dasResponse(
  positionM,
  slowTimeS,
  disturbanceLocationM,
  frequencyHz
) {

  return (
    dasSpatialEnvelope(
      positionM,
      disturbanceLocationM
    ) *
    dasTemporalResponse(
      slowTimeS,
      frequencyHz
    )
  );
}


function initDasPart1() {

  const locationSlider =
    document.getElementById("das-location-slider");

  const frequencySlider =
    document.getElementById("das-frequency-slider");

  const heatmap =
    document.getElementById("das-heatmap");

  const timeTrace =
    document.getElementById("das-time-trace");


  if (
    !locationSlider ||
    !frequencySlider ||
    !heatmap ||
    !timeTrace
  ) {
    return;
  }


  // ---------------------------------------------------------------------------
  // Build axes
  // ---------------------------------------------------------------------------

  const zAxis = [];

  const numberOfSpatialPoints = 401;

  for (
    let i = 0;
    i < numberOfSpatialPoints;
    i++
  ) {

    zAxis.push(
      i *
      DAS.fiberLength /
      (numberOfSpatialPoints - 1)
    );
  }


  const slowTime = [];

  const numberOfSlowTimePoints =
    Math.round(
      DAS.slowDuration * DAS.slowFs
    ) + 1;


  for (
    let i = 0;
    i < numberOfSlowTimePoints;
    i++
  ) {

    slowTime.push(
      i / DAS.slowFs
    );
  }


  // ---------------------------------------------------------------------------
  // Generate space-time response
  // ---------------------------------------------------------------------------

  function buildSpaceTimeResponse(
    locationM,
    frequencyHz
  ) {

    return slowTime.map(
      function (timeS) {

        return zAxis.map(
          function (positionM) {

            return dasResponse(
              positionM,
              timeS,
              locationM,
              frequencyHz
            );

          }
        );

      }
    );
  }


  // ---------------------------------------------------------------------------
  // Update Part 1
  // ---------------------------------------------------------------------------

  function updatePart1() {

    const locationM =
      Number(locationSlider.value);

    const frequencyHz =
      Number(frequencySlider.value);

    const fastTimeUs =
      dasFastTimeMicroseconds(
        locationM
      );

    const periodS =
      1 / frequencyHz;


    // Numerical outputs

    document.getElementById(
      "das-location-value"
    ).textContent =
      locationM.toLocaleString();

    document.getElementById(
      "das-frequency-value"
    ).textContent =
      frequencyHz;

    document.getElementById(
      "das-position"
    ).textContent =
      locationM + " m";

    document.getElementById(
      "das-fast-time"
    ).textContent =
      fastTimeUs.toFixed(3) + " µs";

    document.getElementById(
      "das-frequency-output"
    ).textContent =
      frequencyHz + " Hz";

    document.getElementById(
      "das-period"
    ).textContent =
      periodS.toFixed(3) + " s";


    // -------------------------------------------------------------------------
    // Move disturbance marker
    // -------------------------------------------------------------------------

    const markerPosition =
      7 +
      (locationM / DAS.fiberLength) *
      89;

    document.getElementById(
      "das-disturbance-marker"
    ).style.left =
      markerPosition + "%";


    // -------------------------------------------------------------------------
    // Space-time heatmap
    // -------------------------------------------------------------------------

    const response =
      buildSpaceTimeResponse(
        locationM,
        frequencyHz
      );


    Plotly.react(
      heatmap,

      [{
        x: zAxis,
        y: slowTime,
        z: response,

        type: "heatmap",

        zmin: -1,
        zmax: 1,
        zmid: 0,

        colorscale: [
          [0.00, "#2166ac"],
          [0.25, "#67a9cf"],
          [0.50, "#ffffff"],
          [0.75, "#ef8a62"],
          [1.00, "#b2182b"]
        ],

        colorbar: {
          title:
            "Normalized<br>dynamic response",

          thickness: 14
        },

        hovertemplate:
          "Distance: %{x:.0f} m" +
          "<br>Slow time: %{y:.3f} s" +
          "<br>Response: %{z:.2f}" +
          "<extra></extra>"
      }],

      {
        margin: {
          l: 65,
          r: 80,
          t: 30,
          b: 55
        },

        xaxis: {
          title:
            "Distance along fiber (m)",

          range: [
            0,
            DAS.fiberLength
          ]
        },

        yaxis: {
          title:
            "Slow time (s)",

          autorange:
            "reversed"
        }
      },

      {
        responsive: true,
        displaylogo: false
      }
    );


    // -------------------------------------------------------------------------
    // Slow-time signal
    // -------------------------------------------------------------------------

    const temporalResponse =
      slowTime.map(
        function (timeS) {

          return dasTemporalResponse(
            timeS,
            frequencyHz
          );

        }
      );


    Plotly.react(
      timeTrace,

      [{
        x: slowTime,
        y: temporalResponse,

        mode: "lines",

        line: {
          width: 2.5
        },

        name: "Response"
      }],

      {
        margin: {
          l: 65,
          r: 25,
          t: 20,
          b: 55
        },

        xaxis: {
          title:
            "Slow time (s)",

          range: [
            0,
            DAS.slowDuration
          ]
        },

        yaxis: {
          title:
            "Normalized response",

          range: [
            -1.1,
            1.1
          ]
        },

        showlegend: false
      },

      {
        responsive: true,
        displaylogo: false
      }
    );

  }


  locationSlider.addEventListener(
    "input",
    updatePart1
  );

  frequencySlider.addEventListener(
    "input",
    updatePart1
  );


  updatePart1();
}


// =============================================================================
// PART 2A — Spatial resolution
// =============================================================================

function initDasSpatialResolution() {

  const slider =
    document.getElementById(
      "das-resolution-slider"
    );

  const plot =
    document.getElementById(
      "das-resolution-plot"
    );


  if (!slider || !plot) {
    return;
  }


  const resolutionValue =
    document.getElementById(
      "das-resolution-value"
    );

  const pulseDuration =
    document.getElementById(
      "das-resolution-pulse-duration"
    );


  function updateSpatialResolution() {

    const resolutionM =
      Number(slider.value);

    const pulseNs =
      dasPulseDurationNs(
        resolutionM
      );


    resolutionValue.textContent =
      resolutionM;

    pulseDuration.textContent =
      pulseNs.toFixed(1) + " ns";


    // Two fixed disturbances 20 m apart

    const event1 =
      490;

    const event2 =
      510;


    const x = [];

    const trueResponse = [];

    const measuredResponse = [];


    // Narrow visual representation
    // of the physical disturbances.

    const trueSigma =
      0.45;


    // Convert selected FWHM spatial
    // resolution to Gaussian sigma.

    const measuredSigma =
      resolutionM /
      (
        2 *
        Math.sqrt(
          2 *
          Math.log(2)
        )
      );


    const numberOfPoints =
      1201;


    for (
      let i = 0;
      i < numberOfPoints;
      i++
    ) {

      const position =
        460 +
        i *
        80 /
        (numberOfPoints - 1);


      x.push(position);


      const trueValue =
        Math.exp(
          -0.5 *
          Math.pow(
            (position - event1) /
            trueSigma,
            2
          )
        ) +
        Math.exp(
          -0.5 *
          Math.pow(
            (position - event2) /
            trueSigma,
            2
          )
        );


      const measuredValue =
        Math.exp(
          -0.5 *
          Math.pow(
            (position - event1) /
            measuredSigma,
            2
          )
        ) +
        Math.exp(
          -0.5 *
          Math.pow(
            (position - event2) /
            measuredSigma,
            2
          )
        );


      trueResponse.push(
        trueValue
      );

      measuredResponse.push(
        measuredValue
      );
    }


    // Normalize both curves.

    const trueMax =
      Math.max(
        ...trueResponse
      );

    const measuredMax =
      Math.max(
        ...measuredResponse
      );


    for (
      let i = 0;
      i < x.length;
      i++
    ) {

      trueResponse[i] /=
        trueMax;

      measuredResponse[i] /=
        measuredMax;
    }


    Plotly.react(
      plot,

      [
        {
          x: x,
          y: trueResponse,

          mode: "lines",

          name:
            "True disturbances",

          line: {
            dash: "dash",
            width: 1.5
          }
        },

        {
          x: x,
          y: measuredResponse,

          mode: "lines",

          name:
            "Idealized measured response",

          line: {
            width: 2.5
          }
        }
      ],

      {
        margin: {
          l: 55,
          r: 15,
          t: 38,
          b: 50
        },

        xaxis: {
          title:
            "Distance along fiber (m)",

          range: [
            460,
            540
          ]
        },

        yaxis: {
          title:
            "Normalized response",

          range: [
            0,
            1.08
          ]
        },

        legend: {
          orientation: "h",

          x: 0.5,
          xanchor: "center",

          y: 1.05,
          yanchor: "bottom"
        }
      },

      {
        responsive: true,
        displaylogo: false
      }
    );

  }


  slider.addEventListener(
    "input",
    updateSpatialResolution
  );


  updateSpatialResolution();
}


// =============================================================================
// PART 2B — Cost of finer spatial resolution
// =============================================================================

function initDasResolutionCost() {

  const slider =
    document.getElementById(
      "das-cost-resolution-slider"
    );

  const receiverScreen =
    document.getElementById(
      "das-cost-receiver-screen"
    );


  if (!slider || !receiverScreen) {
    return;
  }


  const resolutionValue =
    document.getElementById(
      "das-cost-resolution-value"
    );

  const pulseDuration =
    document.getElementById(
      "das-cost-pulse-duration"
    );

  const relativeEnergy =
    document.getElementById(
      "das-cost-relative-energy"
    );

  const launchPulse =
    document.getElementById(
      "das-cost-launch-pulse"
    );

  const pulseInterval =
    document.getElementById(
      "das-cost-pulse-interval"
    );

  const returnSignal =
    document.getElementById(
      "das-cost-return-signal"
    );

  const returnLabel =
    document.getElementById(
      "das-cost-return-label"
    );

  const bandwidthWindow =
    document.getElementById(
      "das-cost-bandwidth-window"
    );

  const capturedPulse =
    document.getElementById(
      "das-cost-captured-pulse"
    );

  const capturedPulsePath =
    document.getElementById(
      "das-cost-captured-pulse-path"
    );


  // ---------------------------------------------------------------------------
  // Fixed schematic noise field
  // ---------------------------------------------------------------------------

  const noiseDots = [];


  for (
    let i = 0;
    i < 34;
    i++
  ) {

    const dot =
      document.createElement(
        "span"
      );

    dot.className =
      "das-cost-noise-dot";


    const x =
      5 +
      ((i * 31) % 90);

    const y =
      23 +
      ((i * 19) % 72);


    dot.style.left =
      x + "%";

    dot.style.top =
      y + "px";


    receiverScreen.appendChild(
      dot
    );


    noiseDots.push({
      element: dot,
      x: x
    });
  }


  function updateResolutionCost() {

    const resolutionM =
      Number(slider.value);

    const relative =
      resolutionM / 30;

    const pulseNs =
      dasPulseDurationNs(
        resolutionM
      );


    resolutionValue.textContent =
      resolutionM;

    pulseDuration.textContent =
      pulseNs.toFixed(1) + " ns";

    relativeEnergy.textContent =
      Math.round(
        relative * 100
      ) + "%";


    // -------------------------------------------------------------------------
    // Forward launched pulse
    // -------------------------------------------------------------------------

    const forwardWidth =
      5 +
      relative * 58;

    const forwardLeft =
      27;


    launchPulse.style.left =
      forwardLeft + "%";

    launchPulse.style.width =
      forwardWidth + "%";


    pulseInterval.style.left =
      forwardLeft + "%";

    pulseInterval.style.width =
      forwardWidth + "%";


    // -------------------------------------------------------------------------
    // Returned Rayleigh backscatter cue
    // -------------------------------------------------------------------------

    // Always visually weaker than
    // the launched probe.

    const returnWidth =
      14 +
      relative * 42;

    const returnHeight =
      18 +
      relative * 15;


    returnSignal.style.left =
      "253px";

    returnSignal.style.width =
      returnWidth + "px";

    returnSignal.style.height =
      returnHeight + "px";

    returnSignal.style.top =
      (
        82 -
        returnHeight / 2
      ) + "px";


    returnSignal.style.opacity =
      (
        0.18 +
        0.36 * relative
      ).toFixed(2);


    returnLabel.style.left =
      (
        270 +
        returnWidth
      ) + "px";


    // -------------------------------------------------------------------------
    // Qualitative receiver bandwidth
    // -------------------------------------------------------------------------

    // Finer spatial resolution
    // -> shorter temporal response
    // -> wider required receiver bandwidth.

    const bandwidthPercent =
      30 +
      (1 - relative) * 58;


    bandwidthWindow.style.width =
      bandwidthPercent + "%";


    const lowerBoundary =
      50 -
      bandwidthPercent / 2;

    const upperBoundary =
      50 +
      bandwidthPercent / 2;


    // Dots within the required
    // bandwidth become prominent.

    noiseDots.forEach(
      function (item) {

        const admitted =
          item.x >= lowerBoundary &&
          item.x <= upperBoundary;


        item.element.style.opacity =
          admitted
            ? "0.82"
            : "0.12";

      }
    );


    // -------------------------------------------------------------------------
    // Captured schematic pulse
    // -------------------------------------------------------------------------

    // Keep the pulse entirely inside
    // the receiver-bandwidth window.

    const capturedWidthPercent =
      Math.min(
        30,
        bandwidthPercent * 0.58
      );


    capturedPulse.style.width =
      capturedWidthPercent + "%";

    capturedPulse.style.left =
      (
        50 -
        capturedWidthPercent / 2
      ) + "%";


    capturedPulsePath.style.opacity =
      (
        0.25 +
        0.40 * relative
      ).toFixed(2);

  }


  slider.addEventListener(
    "input",
    updateResolutionCost
  );


  updateResolutionCost();
}


// =============================================================================
// PART 2C — Sensing range
// =============================================================================

function initDasRange() {

  const slider =
    document.getElementById(
      "das-range-slider"
    );


  if (!slider) {
    return;
  }


  const rangeValue =
    document.getElementById(
      "das-range-value"
    );

  const roundTrip =
    document.getElementById(
      "das-range-round-trip"
    );

  const prfOutput =
    document.getElementById(
      "das-range-prf"
    );

  const activeFiber =
    document.getElementById(
      "das-range-fiber-active"
    );

  const rangeEnd =
    document.getElementById(
      "das-range-end"
    );

  const rangeLabel =
    document.getElementById(
      "das-range-label"
    );

  const waitFill =
    document.getElementById(
      "das-range-wait-fill"
    );

  const waitMarker =
    document.getElementById(
      "das-range-wait-marker"
    );


  function updateRange() {

    const rangeKm =
      Number(slider.value);

    const rangeM =
      rangeKm * 1000;


    const roundTripS =
      dasRoundTripSeconds(
        rangeM
      );

    const roundTripUs =
      roundTripS * 1e6;


    const maxPRF =
      1 / roundTripS;


    rangeValue.textContent =
      rangeKm;

    roundTrip.textContent =
      roundTripUs.toFixed(1) +
      " µs";

    prfOutput.textContent =
      (
        maxPRF / 1000
      ).toFixed(1) +
      " kHz";


    // Fiber graphic uses fixed
    // 0–20 km scale.

    const rangeFraction =
      rangeKm / 20;


    activeFiber.style.width =
      (
        rangeFraction * 100
      ) + "%";

    rangeEnd.style.left =
      (
        rangeFraction * 100
      ) + "%";

    rangeLabel.style.left =
      (
        rangeFraction * 100
      ) + "%";

    rangeLabel.textContent =
      rangeKm + " km";


    // Waiting-window graphic uses
    // fixed 0–200 µs scale.

    const waitFraction =
      roundTripUs / 200;


    waitFill.style.width =
      (
        waitFraction * 100
      ) + "%";

    waitMarker.style.left =
      (
        waitFraction * 100
      ) + "%";

  }


  slider.addEventListener(
    "input",
    updateRange
  );


  updateRange();
}


// =============================================================================
// PART 2D — Temporal bandwidth and aliasing
// =============================================================================

function initDasTemporalBandwidth() {

  const prfSlider =
    document.getElementById(
      "das-temporal-prf-slider"
    );

  const frequencySlider =
    document.getElementById(
      "das-temporal-frequency-slider"
    );

  const plot =
    document.getElementById(
      "das-temporal-plot"
    );


  if (
    !prfSlider ||
    !frequencySlider ||
    !plot
  ) {
    return;
  }


  const prfValue =
    document.getElementById(
      "das-temporal-prf-value"
    );

  const frequencyValue =
    document.getElementById(
      "das-temporal-frequency-value"
    );

  const probeInterval =
    document.getElementById(
      "das-temporal-probe-interval"
    );

  const nyquistOutput =
    document.getElementById(
      "das-temporal-nyquist"
    );

  const statusOutput =
    document.getElementById(
      "das-temporal-status"
    );

  const apparentOutput =
    document.getElementById(
      "das-temporal-apparent-frequency"
    );

  const explanation =
    document.getElementById(
      "das-temporal-explanation"
    );


  function updateTemporalBandwidth() {

    const prf =
      Number(prfSlider.value);

    const frequency =
      Number(
        frequencySlider.value
      );


    const nyquist =
      prf / 2;

    const sampleInterval =
      1 / prf;


    // Fold into first Nyquist zone.

    let remainder =
      (
        (
          frequency % prf
        ) +
        prf
      ) % prf;


    const aliasFrequency =
      remainder <= nyquist
        ? remainder
        : prf - remainder;


    const atNyquist =
      Math.abs(
        frequency - nyquist
      ) < 1e-9;


    prfValue.textContent =
      prf;

    frequencyValue.textContent =
      frequency;

    probeInterval.textContent =
      (
        1000 / prf
      ).toFixed(2) +
      " ms";

    nyquistOutput.textContent =
      nyquist.toFixed(0) +
      " Hz";


    if (frequency < nyquist) {

      statusOutput.textContent =
        "Below Nyquist";

      apparentOutput.textContent =
        aliasFrequency.toFixed(0) +
        " Hz";

    }
    else if (atNyquist) {

      statusOutput.textContent =
        "At Nyquist — boundary case";

      apparentOutput.textContent =
        "Ambiguous";

    }
    else {

      statusOutput.textContent =
        "Above Nyquist — aliased";

      apparentOutput.textContent =
        aliasFrequency.toFixed(0) +
        " Hz";

    }


    // -------------------------------------------------------------------------
    // Continuous actual vibration
    // -------------------------------------------------------------------------

    const duration =
      0.025;

    const continuousX = [];

    const actualY = [];


    const numberOfPoints =
      1600;


    for (
      let i = 0;
      i < numberOfPoints;
      i++
    ) {

      const timeS =
        i *
        duration /
        (numberOfPoints - 1);


      continuousX.push(
        timeS * 1000
      );


      actualY.push(
        Math.sin(
          2 *
          Math.PI *
          frequency *
          timeS
        )
      );
    }


    // -------------------------------------------------------------------------
    // DAS slow-time samples
    // -------------------------------------------------------------------------

    const sampleX = [];

    const sampleY = [];


    for (
      let timeS = 0;
      timeS <=
        duration + 1e-12;
      timeS += sampleInterval
    ) {

      sampleX.push(
        timeS * 1000
      );

      sampleY.push(
        Math.sin(
          2 *
          Math.PI *
          frequency *
          timeS
        )
      );
    }


    // -------------------------------------------------------------------------
    // Apparent first-zone sinusoid
    // -------------------------------------------------------------------------

    const candidatePositive =
      continuousX.map(
        function (timeMs) {

          return Math.sin(
            2 *
            Math.PI *
            aliasFrequency *
            (
              timeMs /
              1000
            )
          );

        }
      );


    const candidateNegative =
      candidatePositive.map(
        function (value) {
          return -value;
        }
      );


    // Choose the sign that best
    // passes through the acquired
    // sample points.

    let errorPositive =
      0;

    let errorNegative =
      0;


    for (
      let i = 0;
      i < sampleX.length;
      i++
    ) {

      const timeS =
        sampleX[i] / 1000;

      const measured =
        sampleY[i];


      const positive =
        Math.sin(
          2 *
          Math.PI *
          aliasFrequency *
          timeS
        );

      const negative =
        -positive;


      errorPositive +=
        Math.pow(
          measured - positive,
          2
        );

      errorNegative +=
        Math.pow(
          measured - negative,
          2
        );
    }


    const apparentY =
      errorPositive <=
      errorNegative
        ? candidatePositive
        : candidateNegative;


    // -------------------------------------------------------------------------
    // Plot
    // -------------------------------------------------------------------------

    Plotly.react(
      plot,

      [
        {
          x: continuousX,
          y: actualY,

          mode: "lines",

          name:
            "Actual vibration",

          line: {
            width: 1.7
          }
        },

        {
          x: continuousX,
          y: apparentY,

          mode: "lines",

          name:
            "Apparent sampled vibration",

          line: {
            width: 2.8,
            dash: "dash"
          },

          opacity: 0.85
        },

        {
          x: sampleX,
          y: sampleY,

          mode: "markers",

          name:
            "DAS slow-time samples",

          marker: {
            size: 8
          }
        }
      ],

      {
        margin: {
          l: 58,
          r: 18,
          t: 52,
          b: 55
        },

        xaxis: {
          title:
            "Slow time (ms)",

          range: [
            0,
            25
          ]
        },

        yaxis: {
          title:
            "Normalized amplitude",

          range: [
            -1.15,
            1.15
          ]
        },

        legend: {
          orientation: "h",

          x: 0.5,
          xanchor: "center",

          y: 1.08,
          yanchor: "bottom"
        }
      },

      {
        responsive: true,
        displaylogo: false
      }
    );


    // -------------------------------------------------------------------------
    // Teaching explanation
    // -------------------------------------------------------------------------

    if (frequency < nyquist) {

      explanation.innerHTML =
        "<strong>" +
        frequency +
        " Hz</strong> is below the " +
        nyquist.toFixed(0) +
        " Hz Nyquist limit, so the sampled record represents the original vibration frequency.";

    }
    else if (atNyquist) {

      explanation.innerHTML =
        "<strong>" +
        frequency +
        " Hz</strong> is exactly at the " +
        nyquist.toFixed(0) +
        " Hz Nyquist limit. In this zero-phase example, the samples fall on the signal's zero crossings. This illustrates that the Nyquist frequency is a phase-sensitive boundary rather than a robust sampling condition.";

    }
    else {

      explanation.innerHTML =
        "<strong>" +
        frequency +
        " Hz</strong> actual vibration sampled at <strong>" +
        prf +
        " Hz</strong> is above the " +
        nyquist.toFixed(0) +
        " Hz Nyquist limit. The acquired samples are consistent with an apparent vibration of <strong>" +
        aliasFrequency.toFixed(0) +
        " Hz</strong> in the first Nyquist zone.";

    }

  }


  prfSlider.addEventListener(
    "input",
    updateTemporalBandwidth
  );

  frequencySlider.addEventListener(
    "input",
    updateTemporalBandwidth
  );


  updateTemporalBandwidth();
}


// =============================================================================
// PART 3 — Pipeline application design exercise
// =============================================================================

function initDasApplicationExercise() {

  const rangeSlider =
    document.getElementById(
      "das-application-range-slider"
    );

  const resolutionSlider =
    document.getElementById(
      "das-application-resolution-slider"
    );

  const frequencySlider =
    document.getElementById(
      "das-application-frequency-slider"
    );


  if (
    !rangeSlider ||
    !resolutionSlider ||
    !frequencySlider
  ) {
    return;
  }


  const rangeValue =
    document.getElementById(
      "das-application-range-value"
    );

  const resolutionValue =
    document.getElementById(
      "das-application-resolution-value"
    );

  const frequencyValue =
    document.getElementById(
      "das-application-frequency-value"
    );


  const roundTripOutput =
    document.getElementById(
      "das-application-round-trip"
    );

  const prfOutput =
    document.getElementById(
      "das-application-prf"
    );

  const nyquistOutput =
    document.getElementById(
      "das-application-nyquist"
    );

  const pulseOutput =
    document.getElementById(
      "das-application-pulse-duration"
    );


  const activeFiber =
    document.getElementById(
      "das-application-fiber-active"
    );

  const rangeEnd =
    document.getElementById(
      "das-application-range-end"
    );

  const rangeLabel =
    document.getElementById(
      "das-application-range-label"
    );

  const frequencyLabel =
    document.getElementById(
      "das-application-frequency-label"
    );


  const rangeConsequence =
    document.getElementById(
      "das-application-range-consequence"
    );

  const rangeDetail =
    document.getElementById(
      "das-application-range-detail"
    );

  const spatialConsequence =
    document.getElementById(
      "das-application-spatial-consequence"
    );

  const spatialDetail =
    document.getElementById(
      "das-application-spatial-detail"
    );

  const temporalConsequence =
    document.getElementById(
      "das-application-temporal-consequence"
    );

  const temporalDetail =
    document.getElementById(
      "das-application-temporal-detail"
    );

  const iterationHeading =
    document.getElementById(
      "das-application-iteration-heading"
    );

  const iterationText =
    document.getElementById(
      "das-application-iteration-text"
    );


  function updateApplicationExercise() {

    const rangeKm =
      Number(
        rangeSlider.value
      );

    const spatialResolutionM =
      Number(
        resolutionSlider.value
      );

    const requiredFrequencyHz =
      Number(
        frequencySlider.value
      );


    const rangeM =
      rangeKm * 1000;


    const roundTripS =
      dasRoundTripSeconds(
        rangeM
      );

    const roundTripUs =
      roundTripS * 1e6;


    const maxPRF =
      1 / roundTripS;


    const nyquist =
      maxPRF / 2;


    const pulseNs =
      dasPulseDurationNs(
        spatialResolutionM
      );


    // -------------------------------------------------------------------------
    // Application requirement values
    // -------------------------------------------------------------------------

    rangeValue.textContent =
      rangeKm;

    resolutionValue.textContent =
      spatialResolutionM;

    frequencyValue.textContent =
      (
        requiredFrequencyHz /
        1000
      ).toFixed(1);


    // -------------------------------------------------------------------------
    // Initial design calculations
    // -------------------------------------------------------------------------

    roundTripOutput.textContent =
      roundTripUs.toFixed(1) +
      " µs";

    prfOutput.textContent =
      (
        maxPRF / 1000
      ).toFixed(1) +
      " kHz";

    nyquistOutput.textContent =
      (
        nyquist / 1000
      ).toFixed(2) +
      " kHz";

    pulseOutput.textContent =
      pulseNs.toFixed(1) +
      " ns";


    // -------------------------------------------------------------------------
    // Pipeline schematic
    // -------------------------------------------------------------------------

    const rangeFraction =
      rangeKm / 20;


    activeFiber.style.width =
      (
        rangeFraction * 100
      ) + "%";

    rangeEnd.style.left =
      (
        rangeFraction * 100
      ) + "%";

    rangeLabel.style.left =
      (
        rangeFraction * 100
      ) + "%";

    rangeLabel.textContent =
      rangeKm +
      " km monitored section";


    frequencyLabel.textContent =
      "frequency content up to " +
      (
        requiredFrequencyHz /
        1000
      ).toFixed(1) +
      " kHz";


    // -------------------------------------------------------------------------
    // Range consequence
    // -------------------------------------------------------------------------

    rangeConsequence.textContent =
      rangeKm +
      " km → " +
      roundTripUs.toFixed(1) +
      " µs round trip";


    rangeDetail.textContent =
      "This limits the conventional single-pulse PRF to about " +
      (
        maxPRF / 1000
      ).toFixed(1) +
      " kHz. Longer range lowers that ceiling.";


    // -------------------------------------------------------------------------
    // Spatial consequence
    // -------------------------------------------------------------------------

    spatialConsequence.textContent =
      spatialResolutionM +
      " m → " +
      pulseNs.toFixed(1) +
      " ns pulse";


    if (
      spatialResolutionM <= 5
    ) {

      spatialDetail.textContent =
        "Fine spatial detail implies a short pulse. Under the fixed-peak-power teaching assumption, this pushes toward lower pulse energy and a wider receiver-bandwidth requirement.";

    }
    else if (
      spatialResolutionM <= 15
    ) {

      spatialDetail.textContent =
        "This maps to a moderate pulse duration in the first-order model. Signal-energy and receiver-bandwidth consequences still require validation.";

    }
    else {

      spatialDetail.textContent =
        "Coarser spatial detail allows a longer pulse in the first-order model, easing the pulse-energy/bandwidth trade-off but resolving less spatial detail.";

    }


    // -------------------------------------------------------------------------
    // Temporal consequence / design iteration
    // -------------------------------------------------------------------------

    const atNyquist =
      Math.abs(
        requiredFrequencyHz -
        nyquist
      ) < 1e-9;


    if (
      requiredFrequencyHz <
      nyquist
    ) {

      temporalConsequence.textContent =
        (
          requiredFrequencyHz /
          1000
        ).toFixed(1) +
        " kHz is below " +
        (
          nyquist /
          1000
        ).toFixed(2) +
        " kHz";


      temporalDetail.textContent =
        "The requested vibration content is within the conventional first-order temporal sampling limit for this selected range.";


      iterationHeading.textContent =
        "Current first-order requirements are not obviously incompatible.";


      iterationText.textContent =
        "This is only a candidate starting point. The next question is whether the measurement quality is adequate under representative conditions.";

    }
    else if (atNyquist) {

      temporalConsequence.textContent =
        "Requirement sits at the Nyquist boundary";


      temporalDetail.textContent =
        "There is no robust temporal sampling margin at this boundary.";


      iterationHeading.textContent =
        "The design needs margin.";


      iterationText.textContent =
        "Reconsider the monitored range, the required vibration bandwidth, or the interrogation approach before treating this as a candidate configuration.";

    }
    else {

      temporalConsequence.textContent =
        (
          requiredFrequencyHz /
          1000
        ).toFixed(1) +
        " kHz exceeds " +
        (
          nyquist /
          1000
        ).toFixed(2) +
        " kHz";


      temporalDetail.textContent =
        "The requested vibration content conflicts with the conventional single-pulse temporal limit at this selected range.";


      iterationHeading.textContent =
        "The current requirements conflict under these assumptions.";


      iterationText.textContent =
        "Possible design questions: can the monitored range be reduced? Is the full selected vibration bandwidth required for the application? Or is a different interrogation approach needed?";

    }

  }


  rangeSlider.addEventListener(
    "input",
    updateApplicationExercise
  );

  resolutionSlider.addEventListener(
    "input",
    updateApplicationExercise
  );

  frequencySlider.addEventListener(
    "input",
    updateApplicationExercise
  );


  updateApplicationExercise();
}


// =============================================================================
// Initialize complete DAS module
// =============================================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initDasPart1();

    initDasSpatialResolution();

    initDasResolutionCost();

    initDasRange();

    initDasTemporalBandwidth();

    initDasApplicationExercise();

  }
);
