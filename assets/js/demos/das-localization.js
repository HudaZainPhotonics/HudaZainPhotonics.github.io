// =============================================================================
// DAS Disturbance Localization
// Scientific model
// =============================================================================

const DAS = {
  c: 299792458,      // speed of light in vacuum, m/s
  Ng: 1.47,          // representative group refractive index
  fiberLength: 1000, // m
  sigmaZ: 15,        // m, spatial width of idealized disturbance
  slowFs: 500,       // Hz, visualization sampling rate
  slowDuration: 1.0  // s
};


// -----------------------------------------------------------------------------
// Optical fast-time localization
// -----------------------------------------------------------------------------

function dasFastTimeMicroseconds(positionM) {
  return (
    (2 * DAS.Ng * positionM / DAS.c) * 1e6
  );
}


// -----------------------------------------------------------------------------
// Spatial envelope of the localized disturbance
// -----------------------------------------------------------------------------

function dasSpatialEnvelope(positionM, disturbanceLocationM) {
  const dz =
    positionM - disturbanceLocationM;

  return Math.exp(
    -0.5 * Math.pow(dz / DAS.sigmaZ, 2)
  );
}


// -----------------------------------------------------------------------------
// Slow-time oscillation
// -----------------------------------------------------------------------------

function dasTemporalResponse(slowTimeS, frequencyHz) {
  return Math.sin(
    2 * Math.PI * frequencyHz * slowTimeS
  );
}


// -----------------------------------------------------------------------------
// Idealized DAS space-time response
// -----------------------------------------------------------------------------

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

// =============================================================================
// Interactive demo
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {

  const locationSlider =
    document.getElementById("das-location-slider");

  const frequencySlider =
    document.getElementById("das-frequency-slider");

  const heatmap =
    document.getElementById("das-heatmap");

  const timeTrace =
    document.getElementById("das-time-trace");

  // Exit quietly if this script is loaded on another page.
  if (!locationSlider || !frequencySlider || !heatmap || !timeTrace) {
    return;
  }


  // ---------------------------------------------------------------------------
  // Build axes
  // ---------------------------------------------------------------------------

  const zAxis = [];
  const numberOfSpatialPoints = 401;

  for (let i = 0; i < numberOfSpatialPoints; i++) {
    zAxis.push(
      i * DAS.fiberLength / (numberOfSpatialPoints - 1)
    );
  }


  const slowTime = [];
  const numberOfSlowTimePoints =
    Math.round(DAS.slowDuration * DAS.slowFs) + 1;

  for (let i = 0; i < numberOfSlowTimePoints; i++) {
    slowTime.push(i / DAS.slowFs);
  }


  // ---------------------------------------------------------------------------
  // Generate space-time response
  // ---------------------------------------------------------------------------

  function buildSpaceTimeResponse(locationM, frequencyHz) {

    return slowTime.map(function (timeS) {

      return zAxis.map(function (positionM) {

        return dasResponse(
          positionM,
          timeS,
          locationM,
          frequencyHz
        );

      });

    });

  }


  // ---------------------------------------------------------------------------
  // Update demo
  // ---------------------------------------------------------------------------

  function updateDemo() {

    const locationM =
      Number(locationSlider.value);

    const frequencyHz =
      Number(frequencySlider.value);

    const fastTimeUs =
      dasFastTimeMicroseconds(locationM);

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
    // Move disturbance marker along schematic fiber
    // -------------------------------------------------------------------------

    // The visual fiber occupies approximately 7–96% of its container.
    const markerPosition =
      7 +
      (locationM / DAS.fiberLength) * 89;

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
  title: "Normalized<br>dynamic response",
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
          title: "Distance along fiber (m)",
          range: [0, DAS.fiberLength]
        },

        yaxis: {
          title: "Slow time (s)",
          autorange: "reversed"
        }
      },

      {
        responsive: true,
        displaylogo: false
      }
    );


    // -------------------------------------------------------------------------
    // Slow-time signal at the disturbance location
    // -------------------------------------------------------------------------

    const temporalResponse =
      slowTime.map(function (timeS) {

        return dasTemporalResponse(
          timeS,
          frequencyHz
        );

      });


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
          title: "Slow time (s)",
          range: [0, DAS.slowDuration]
        },

        yaxis: {
          title: "Normalized response",
          range: [-1.1, 1.1]
        },

        showlegend: false
      },

      {
        responsive: true,
        displaylogo: false
      }
    );

  }


  // ---------------------------------------------------------------------------
  // Interaction
  // ---------------------------------------------------------------------------

  locationSlider.addEventListener(
    "input",
    updateDemo
  );

  frequencySlider.addEventListener(
    "input",
    updateDemo
  );


  // Initial render
  updateDemo();

});
