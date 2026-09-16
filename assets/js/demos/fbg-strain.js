// =============================================================================
// FBG Measurement & Design Teaching Module
// =============================================================================

const FBG = {
  lambda0: 1550.0,        // nm
  neff: 1.447001,
  pe: 0.20268,
  Mp: 0.7372,
  deltaN: 1.5e-4,
  L: 4e-3,                // m

  // Explicit teaching assumption used in the temperature examples.
  tempSensitivity: 10.0   // pm/°C
};


function updateFbgDesignParameters() {
  // pm/µε
  FBG.sensitivity =
    FBG.lambda0 * (1 - FBG.pe) * 1e-3;

  // nm
  FBG.Lambda0 =
    FBG.lambda0 / (2 * FBG.neff);
}

updateFbgDesignParameters();


// =============================================================================
// Coupled-mode FBG reflectivity
// =============================================================================

function fbgReflectivity(lambdaNm, lambdaBNm) {

  const lambda =
    lambdaNm * 1e-9;

  const lambdaB =
    lambdaBNm * 1e-9;

  const kappa =
    Math.PI * FBG.deltaN * FBG.Mp / lambda;

  const Lambda =
    lambdaB / (2 * FBG.neff);

  const beta =
    2 * Math.PI * FBG.neff / lambda;

  const detuning =
    beta - Math.PI / Lambda;

  const q =
    kappa * kappa -
    detuning * detuning;


  if (Math.abs(q) < 1e-12 * kappa * kappa) {

    const x =
      kappa * FBG.L;

    return (
      (x * x) /
      (1 + x * x)
    );
  }


  if (q > 0) {

    const s =
      Math.sqrt(q);

    const sh =
      Math.sinh(s * FBG.L);

    const ch =
      Math.cosh(s * FBG.L);

    return (
      kappa * kappa * sh * sh
    ) / (
      q * ch * ch +
      detuning * detuning * sh * sh
    );
  }


  const gamma =
    Math.sqrt(-q);

  const sinTerm =
    Math.sin(gamma * FBG.L);

  const cosTerm =
    Math.cos(gamma * FBG.L);

  return (
    kappa * kappa *
    sinTerm * sinTerm
  ) / (
    gamma * gamma *
    cosTerm * cosTerm +
    detuning * detuning *
    sinTerm * sinTerm
  );
}


// =============================================================================
// Helpers
// =============================================================================

function buildAxis(min, max, count) {

  const axis = [];

  for (let i = 0; i < count; i++) {

    axis.push(
      min +
      i * (max - min) /
      (count - 1)
    );
  }

  return axis;
}


function buildCalibration(
  sensitivityPmPerMicrostrain,
  maxStrain = 2000,
  step = 20
) {

  const x = [];
  const y = [];

  for (
    let strain = 0;
    strain <= maxStrain;
    strain += step
  ) {

    x.push(strain);

    y.push(
      sensitivityPmPerMicrostrain *
      strain /
      1000
    );
  }

  return {
    x: x,
    y: y
  };
}


// =============================================================================
// Interactive module
// =============================================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // -------------------------------------------------------------------------
    // Required main elements
    // -------------------------------------------------------------------------

    const strainSlider =
      document.getElementById(
        "fbg-strain-slider"
      );

    const spectrum =
      document.getElementById(
        "fbg-spectrum"
      );

    if (!strainSlider || !spectrum) {
      return;
    }


    // -------------------------------------------------------------------------
    // Main FBG elements
    // -------------------------------------------------------------------------

    const strainValue =
      document.getElementById(
        "fbg-strain-value"
      );

    const braggValue =
      document.getElementById(
        "fbg-bragg-wavelength"
      );

    const shiftValue =
      document.getElementById(
        "fbg-wavelength-shift"
      );

    const sensitivityValue =
      document.getElementById(
        "fbg-sensitivity"
      );

    const periodValue =
      document.getElementById(
        "fbg-grating-period"
      );

    const grating =
      document.getElementById(
        "fbg-grating"
      );

    const calibrationPlot =
      document.getElementById(
        "fbg-calibration"
      );


    // -------------------------------------------------------------------------
    // Measurement-error elements
    // -------------------------------------------------------------------------

    const temperatureSlider =
      document.getElementById(
        "fbg-temperature-change"
      );

    const temperatureValue =
      document.getElementById(
        "fbg-temperature-change-value"
      );

    const errorReferenceStrain =
      document.getElementById(
        "fbg-error-reference-strain"
      );

    const errorStrainShift =
      document.getElementById(
        "fbg-error-strain-shift"
      );

    const errorTemperatureShift =
      document.getElementById(
        "fbg-error-temperature-shift"
      );

    const errorReportedStrain =
      document.getElementById(
        "fbg-error-reported-strain"
      );

    const apparentStrainError =
      document.getElementById(
        "fbg-apparent-strain-error"
      );

    const errorPlot =
      document.getElementById(
        "fbg-error-plot"
      );


    // -------------------------------------------------------------------------
    // Resolution elements
    // -------------------------------------------------------------------------

    const resolutionStrainSlider =
      document.getElementById(
        "fbg-resolution-strain"
      );

    const resolutionReadoutSlider =
      document.getElementById(
        "fbg-resolution-readout"
      );

    const resolutionStrainValue =
      document.getElementById(
        "fbg-resolution-strain-value"
      );

    const resolutionReadoutValue =
      document.getElementById(
        "fbg-resolution-readout-value"
      );

    const resolutionReference =
      document.getElementById(
        "fbg-resolution-reference"
      );

    const resolutionCapture =
      document.getElementById(
        "fbg-resolution-capture"
      );

    const resolutionPhysicalShift =
      document.getElementById(
        "fbg-resolution-physical-shift"
      );

    const resolutionSelected =
      document.getElementById(
        "fbg-resolution-selected"
      );

    const resolutionShift =
      document.getElementById(
        "fbg-resolution-shift"
      );

    const resolutionComparison =
      document.getElementById(
        "fbg-resolution-comparison"
      );

    const resolutionThreshold =
      document.getElementById(
        "fbg-resolution-threshold"
      );

    const resolutionStatus =
      document.getElementById(
        "fbg-resolution-status"
      );

    const resolutionEquationReadout =
      document.getElementById(
        "fbg-resolution-equation-readout"
      );

    const resolutionEquationSensitivity =
      document.getElementById(
        "fbg-resolution-equation-sensitivity"
      );

    const resolutionEquivalentStrain =
      document.getElementById(
        "fbg-resolution-equivalent-strain"
      );


    // -------------------------------------------------------------------------
    // Bridge application elements
    // -------------------------------------------------------------------------

    const bridgeStrainSlider =
      document.getElementById(
        "fbg-bridge-required-strain"
      );

    const bridgeReadoutSlider =
      document.getElementById(
        "fbg-bridge-readout-resolution"
      );

    const bridgeTemperatureSlider =
      document.getElementById(
        "fbg-bridge-temperature-change"
      );

    const bridgeStrainValue =
      document.getElementById(
        "fbg-bridge-required-strain-value"
      );

    const bridgeReadoutValue =
      document.getElementById(
        "fbg-bridge-readout-resolution-value"
      );

    const bridgeTemperatureValue =
      document.getElementById(
        "fbg-bridge-temperature-change-value"
      );

    const bridgeSpectrum =
      document.getElementById(
        "fbg-bridge-spectrum"
      );

    const bridgeReadoutPlot =
      document.getElementById(
        "fbg-bridge-readout-plot"
      );

    const bridgeReadoutStatus =
      document.getElementById(
        "fbg-bridge-readout-status"
      );

    const bridgeErrorPlot =
      document.getElementById(
        "fbg-bridge-error-plot"
      );

    const bridgeFeedbackHeading =
      document.getElementById(
        "fbg-bridge-feedback-heading"
      );

    const bridgeFeedbackText =
      document.getElementById(
        "fbg-bridge-feedback-text"
      );


    // =========================================================================
    // Build visible grating
    // =========================================================================

    if (
      grating &&
      !grating.querySelector(
        ".fbg-grating-plane"
      )
    ) {

      for (let i = 0; i < 18; i++) {

        const plane =
          document.createElement("span");

        plane.className =
          "fbg-grating-plane";

        grating.appendChild(plane);
      }
    }


    // =========================================================================
    // 1. Wavelength-encoded sensing
    // =========================================================================

    function updateMainFbg() {

      const strainMicro =
        Number(strainSlider.value);

      const strain =
        strainMicro * 1e-6;


      // -----------------------------------------------------------------------
      // Current FBG response
      // -----------------------------------------------------------------------

      const wavelengthShift =
        FBG.lambda0 *
        (1 - FBG.pe) *
        strain;

      const currentBragg =
        FBG.lambda0 +
        wavelengthShift;

      const currentPeriod =
        FBG.Lambda0 *
        (1 + strain);


      strainValue.textContent =
        strainMicro.toLocaleString();

      braggValue.textContent =
        currentBragg.toFixed(3) +
        " nm";

      shiftValue.textContent =
        (wavelengthShift >= 0 ? "+" : "") +
        wavelengthShift.toFixed(3) +
        " nm";

      sensitivityValue.textContent =
        FBG.sensitivity.toFixed(3) +
        " pm/µε";

      periodValue.textContent =
        currentPeriod.toFixed(3) +
        " nm";


      // -----------------------------------------------------------------------
      // Spectrum
      // -----------------------------------------------------------------------

      const maximumShift =
        FBG.sensitivity *
        2000 /
        1000;

      const wavelengthMin =
        FBG.lambda0 - 1.5;

      const wavelengthMax =
        FBG.lambda0 +
        maximumShift +
        1.5;

      const wavelengths =
        buildAxis(
          wavelengthMin,
          wavelengthMax,
          2200
        );


      const referenceSpectrum =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              FBG.lambda0
            );
          }
        );


      const currentSpectrum =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              currentBragg
            );
          }
        );


      const traces = [];


      if (strainMicro !== 0) {

        traces.push({
          x: wavelengths,
          y: referenceSpectrum,

          mode: "lines",

          name: "0 µε reference",

          line: {
            width: 2,
            dash: "dash"
          }
        });
      }


      traces.push({
        x: wavelengths,
        y: currentSpectrum,

        mode: "lines",

        name:
          strainMicro +
          " µε",

        line: {
          width: 3
        }
      });


      Plotly.react(
        spectrum,

        traces,

        {
          margin: {
            l: 65,
            r: 20,
            t: 150,
            b: 60
          },

          xaxis: {
            title:
              "Wavelength (nm)",

            range: [
              wavelengthMin,
              wavelengthMax
            ]
          },

          yaxis: {
            title:
              "Reflectivity",

            range: [
              0,
              0.62
            ]
          },

          legend: {
            orientation: "h",
            y: 1.08
          },

          hovermode:
            "x unified"
        },

        {
          responsive: true,
          displaylogo: false
        }
      );


      // -----------------------------------------------------------------------
      // Calibration inset
      // -----------------------------------------------------------------------

      if (calibrationPlot) {

        const currentShiftNm =
          wavelengthShift;

        const xMax =
          Math.max(
            250,
            strainMicro * 1.18
          );

        const yMax =
          Math.max(
            0.35,
            currentShiftNm * 1.22
          );


        const traceX =
          strainMicro > 0
            ? [0, strainMicro]
            : [0, Math.min(200, xMax)];

        const traceY =
          strainMicro > 0
            ? [0, currentShiftNm]
            : [
                0,
                FBG.sensitivity *
                Math.min(200, xMax) /
                1000
              ];


        const shapes = [];
        const annotations = [];


        if (strainMicro > 0) {

          shapes.push(
            {
              type: "line",

              x0: 0,
              x1: strainMicro,

              y0: 0,
              y1: 0,

              line: {
                width: 1,
                dash: "dot"
              }
            },

            {
              type: "line",

              x0: strainMicro,
              x1: strainMicro,

              y0: 0,
              y1: currentShiftNm,

              line: {
                width: 1,
                dash: "dot"
              }
            }
          );


          annotations.push(
            {
              x:
                strainMicro / 2,

              y: 0,

              text: "Δε",

              showarrow: false,

              yshift: -10,

              font: {
                size: 9
              }
            },

            {
              x:
                strainMicro,

              y:
                currentShiftNm / 2,

              text: "ΔλB",

              showarrow: false,

              xshift: 20,

              font: {
                size: 9
              }
            }
          );
        }


        Plotly.react(
          calibrationPlot,

          [
            {
              x: traceX,
              y: traceY,

              mode: "lines",

              line: {
                width: 2.2
              },

              showlegend: false
            },

            {
              x: [strainMicro],
              y: [currentShiftNm],

              mode: "markers",

              marker: {
                size: 9
              },

              showlegend: false
            }
          ],

          {
            margin: {
              l: 38,
              r: 6,
              t: 2,
              b: 28
            },

            xaxis: {
              title: "Strain (µε)",
              range: [0, xMax],
              nticks: 3,

              titlefont: {
                size: 9
              },

              tickfont: {
                size: 8
              }
            },

            yaxis: {
              title: "ΔλB (nm)",
              range: [0, yMax],
              nticks: 3,

              titlefont: {
                size: 9
              },

              tickfont: {
                size: 8
              }
            },

            showlegend: false,

            shapes: shapes,

            annotations:
              annotations
          },

          {
            responsive: true,
            displaylogo: false
          }
        );
      }


      // -----------------------------------------------------------------------
      // Exaggerated grating deformation
      // -----------------------------------------------------------------------

      if (grating) {

        const visualStretch =
          1 +
          strainMicro / 4000;

        grating.style.transform =
          "scaleX(" +
          visualStretch +
          ")";
      }


      // Error section uses the current
      // main-demo strain as its reference.
      updateMeasurementError();
    }


    // =========================================================================
    // Reference-wavelength comparison
    // =========================================================================

    document
      .querySelectorAll(
        ".fbg-wl-button"
      )
      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              FBG.lambda0 =
                Number(
                  button.dataset.lambda
                );

              updateFbgDesignParameters();


              document
                .querySelectorAll(
                  ".fbg-wl-button"
                )
                .forEach(
                  function (item) {

                    item.classList.toggle(
                      "active",
                      item === button
                    );
                  }
                );


              updateMainFbg();
            }
          );
        }
      );


    // =========================================================================
    // 2. Measurement error
    // =========================================================================

    function updateMeasurementError() {

      if (
        !temperatureSlider ||
        !errorPlot
      ) {
        return;
      }


      const strainMicro =
        Number(
          strainSlider.value
        );

      const deltaT =
        Number(
          temperatureSlider.value
        );


      const strainShiftPm =
        FBG.sensitivity *
        strainMicro;

      const temperatureShiftPm =
        FBG.tempSensitivity *
        deltaT;

      const totalShiftPm =
        strainShiftPm +
        temperatureShiftPm;


      const reportedStrain =
        totalShiftPm /
        FBG.sensitivity;

      const strainError =
        reportedStrain -
        strainMicro;


      temperatureValue.textContent =
        deltaT.toFixed(0);

      errorReferenceStrain.textContent =
        strainMicro.toFixed(0) +
        " µε";

      errorStrainShift.textContent =
        (
          strainShiftPm /
          1000
        ).toFixed(3) +
        " nm";

      errorTemperatureShift.textContent =
        (
          temperatureShiftPm >= 0
            ? "+"
            : ""
        ) +
        (
          temperatureShiftPm /
          1000
        ).toFixed(3) +
        " nm";

      errorReportedStrain.textContent =
        reportedStrain.toFixed(1) +
        " µε";

      apparentStrainError.textContent =
        (
          strainError >= 0
            ? "+"
            : ""
        ) +
        strainError.toFixed(1) +
        " µε";


      const expectedNm =
        strainShiftPm /
        1000;

      const measuredNm =
        totalShiftPm /
        1000;


      // -----------------------------------------------------------------------
      // Dynamic zoom bounds
      // -----------------------------------------------------------------------

      const xLow =
        Math.max(
          0,

          Math.min(
            strainMicro,
            reportedStrain
          ) -
          Math.max(
            35,
            Math.abs(
              reportedStrain -
              strainMicro
            ) * 0.55
          )
        );


      const xHigh =
        Math.max(
          strainMicro,
          reportedStrain
        ) +
        Math.max(
          35,
          Math.abs(
            reportedStrain -
            strainMicro
          ) * 0.55
        );


      const ySpan =
        Math.max(
          0.06,
          Math.abs(
            measuredNm -
            expectedNm
          )
        );


      const yLow =
        Math.max(
          0,
          Math.min(
            expectedNm,
            measuredNm
          ) -
          ySpan * 0.65
        );


      const yHigh =
        Math.max(
          expectedNm,
          measuredNm
        ) +
        ySpan * 0.65;


      const calibration =
        buildCalibration(
          FBG.sensitivity,
          2000,
          20
        );


      // -----------------------------------------------------------------------
      // Context + large zoom
      // -----------------------------------------------------------------------

      Plotly.react(
        errorPlot,

        [
          // Full calibration
          {
            x: calibration.x,
            y: calibration.y,

            mode: "lines",

            name:
              "Strain-only calibration",

            line: {
              width: 2.3,
              color: "#1f77b4"
            },

            xaxis: "x",
            yaxis: "y"
          },

          {
            x: [strainMicro],
            y: [expectedNm],

            mode: "markers",

            name:
              "Expected response from strain alone",

            marker: {
              size: 9,
              color: "#ff7f0e"
            },

            xaxis: "x",
            yaxis: "y"
          },

          {
            x: [strainMicro],
            y: [measuredNm],

            mode: "markers",

            name:
              "Measured wavelength shift",

            marker: {
              size: 10,
              color: "#2ca02c"
            },

            xaxis: "x",
            yaxis: "y"
          },

          {
            x: [reportedStrain],
            y: [measuredNm],

            mode: "markers",

            name:
              "Reported strain if temperature is ignored",

            marker: {
              size: 10,
              symbol: "diamond",
              color: "#d62728"
            },

            xaxis: "x",
            yaxis: "y"
          },


          // Zoom
          {
            x: calibration.x,
            y: calibration.y,

            mode: "lines",

            showlegend: false,

            line: {
              width: 2.3,
              color: "#1f77b4"
            },

            xaxis: "x2",
            yaxis: "y2"
          },

          {
            x: [strainMicro],
            y: [expectedNm],

            mode: "markers",

            showlegend: false,

            marker: {
              size: 11,
              color: "#ff7f0e"
            },

            xaxis: "x2",
            yaxis: "y2"
          },

          {
            x: [strainMicro],
            y: [measuredNm],

            mode: "markers",

            showlegend: false,

            marker: {
              size: 12,
              color: "#2ca02c"
            },

            xaxis: "x2",
            yaxis: "y2"
          },

          {
            x: [reportedStrain],
            y: [measuredNm],

            mode: "markers",

            showlegend: false,

            marker: {
              size: 12,
              symbol: "diamond",
              color: "#d62728"
            },

            xaxis: "x2",
            yaxis: "y2"
          }
        ],

        {
          margin: {
            l: 78,
            r: 30,
            t: 92,
            b: 65
          },


          // Context plot
          xaxis: {
            title:
              "Strain interpreted by calibration (µε)",

            domain: [0, 1],

            range: [
              0,
              Math.max(
                2000,
                reportedStrain + 100
              )
            ]
          },

          yaxis: {
            title:
              "Bragg-wavelength shift, ΔλB (nm)",

            domain: [
              0,
              0.42
            ]
          },


          // Large zoom
          xaxis2: {
            domain: [
              0.12,
              0.94
            ],

            anchor: "y2",

            range: [
              xLow,
              xHigh
            ],

            showgrid: true,
            zeroline: false,

            title: {
              text:
                "Zoom: strain (µε)",

              font: {
                size: 10
              }
            }
          },

          yaxis2: {
            domain: [
              0.57,
              0.96
            ],

            anchor: "x2",

            range: [
              yLow,
              yHigh
            ],

            showgrid: true,
            zeroline: false,

            title: {
              text: "ΔλB",

              font: {
                size: 10
              }
            }
          },


          legend: {
            orientation: "h",

            x: 0.5,
            xanchor: "center",

            y: 1.22,
            yanchor: "bottom"
          },


          shapes: [
            // Zoom region in context plot
            {
              type: "rect",

              xref: "x",
              yref: "y",

              x0: xLow,
              x1: xHigh,

              y0: yLow,
              y1: yHigh,

              line: {
                width: 1,
                dash: "dot"
              },

              fillcolor:
                "rgba(0,0,0,0)"
            },


            // Temperature contribution
            {
              type: "line",

              xref: "x2",
              yref: "y2",

              x0: strainMicro,
              x1: strainMicro,

              y0: expectedNm,
              y1: measuredNm,

              line: {
                width: 1.5,
                dash: "dot"
              }
            },


            // Apparent strain error
            {
              type: "line",

              xref: "x2",
              yref: "y2",

              x0: strainMicro,
              x1: reportedStrain,

              y0: measuredNm,
              y1: measuredNm,

              line: {
                width: 1.5,
                dash: "dot"
              }
            }
          ],


          annotations: [
            {
              xref: "paper",
              yref: "paper",

              x: 0.53,
              y: 0.985,

              text:
                "Zoomed measurement",

              showarrow: false,

              font: {
                size: 10
              }
            },


            // Temperature label
            {
              xref: "x2",
              yref: "y2",

              x: strainMicro,
              y:
                (
                  expectedNm +
                  measuredNm
                ) / 2,

              text:
                "temperature shift",

              showarrow: false,

              xanchor: "right",

              xshift: -18,

              font: {
                size: 10
              }
            },


            // Apparent strain error label
            {
              xref: "x2",
              yref: "y2",

              x:
                (
                  strainMicro +
                  reportedStrain
                ) / 2,

              y: measuredNm,

              text:
                "apparent strain error",

              showarrow: false,

              yshift: 14,

              font: {
                size: 10
              }
            },


            // Temperature arrow
            {
              xref: "x2",
              yref: "y2",

              axref: "x2",
              ayref: "y2",

              x:
                strainMicro -
                0.035 *
                (xHigh - xLow),

              y: measuredNm,

              ax:
                strainMicro -
                0.035 *
                (xHigh - xLow),

              ay: expectedNm,

              text: "",

              showarrow: true,

              arrowhead: 2,
              arrowsize: 1,
              arrowwidth: 1.4
            },


            // Strain-induced shift arrow
            {
              xref: "x2",
              yref: "y2",

              axref: "x2",
              ayref: "y2",

              x:
                strainMicro +
                0.035 *
                (xHigh - xLow),

              y:
                expectedNm -
                0.015 *
                (yHigh - yLow),

              ax:
                strainMicro +
                0.035 *
                (xHigh - xLow),

              ay:
                yLow +
                0.03 *
                (yHigh - yLow),

              text: "",

              showarrow: true,

              arrowhead: 2,
              arrowsize: 1,
              arrowwidth: 1.4
            },


            {
              xref: "x2",
              yref: "y2",

              x:
                strainMicro +
                0.035 *
                (xHigh - xLow),

              y:
                (
                  expectedNm +
                  yLow
                ) / 2,

              text:
                "strain-induced shift",

              showarrow: false,

              xanchor: "left",

              xshift: 8,

              font: {
                size: 10
              }
            }
          ]
        },

        {
          responsive: true,
          displaylogo: false
        }
      );
    }


    // =========================================================================
    // 3. Measurement resolution
    // =========================================================================

    function updateResolution() {

      if (
        !resolutionStrainSlider ||
        !resolutionReadoutSlider ||
        !resolutionReference ||
        !resolutionCapture
      ) {
        return;
      }


      // Resolution mini-experiment intentionally
      // uses a fixed 1550-nm reference FBG.
      const lambda0 =
        1550.0;

      const sensitivity =
        lambda0 *
        (1 - FBG.pe) *
        1e-3;


      const deltaStrain =
        Number(
          resolutionStrainSlider.value
        );

      const readoutPm =
        Number(
          resolutionReadoutSlider.value
        );


      const physicalShiftPm =
        sensitivity *
        deltaStrain;

      const physicalShiftNm =
        physicalShiftPm /
        1000;


      const shiftedLambda =
        lambda0 +
        physicalShiftNm;


      const strainResolution =
        readoutPm /
        sensitivity;


      const distinguishable =
        physicalShiftPm >=
        readoutPm;


      resolutionStrainValue.textContent =
        deltaStrain.toFixed(1);

      resolutionReadoutValue.textContent =
        readoutPm.toFixed(0);

      resolutionPhysicalShift.textContent =
        physicalShiftPm.toFixed(2) +
        " pm";

      resolutionSelected.textContent =
        readoutPm.toFixed(0) +
        " pm";

      resolutionShift.textContent =
        physicalShiftPm.toFixed(2) +
        " pm";

      resolutionComparison.textContent =
        distinguishable
          ? "≥"
          : "<";

      resolutionThreshold.textContent =
        readoutPm.toFixed(0) +
        " pm";

      resolutionStatus.textContent =
        distinguishable
          ? "RESOLVED"
          : "NOT RESOLVED";

      resolutionEquationReadout.textContent =
        readoutPm.toFixed(0) +
        " pm";

      resolutionEquationSensitivity.textContent =
        sensitivity.toFixed(3) +
        " pm/µε";

      resolutionEquivalentStrain.textContent =
        strainResolution.toFixed(2) +
        " µε";


      // -----------------------------------------------------------------------
      // Full recognizable FBG spectral shape
      // -----------------------------------------------------------------------

      const wavelengthMin =
        lambda0 - 0.55;

      const wavelengthMax =
        lambda0 + 0.55;

      const wavelengths =
        buildAxis(
          wavelengthMin,
          wavelengthMax,
          2200
        );


      const reference =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              lambda0
            );
          }
        );


      const shifted =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              shiftedLambda
            );
          }
        );


      const commonLayout = {
        margin: {
          l: 58,
          r: 15,
          t: 48,
          b: 52
        },

        xaxis: {
          title:
            "Wavelength (nm)",

          range: [
            wavelengthMin,
            wavelengthMax
          ],

          tickformat: ".2f"
        },

        yaxis: {
          title:
            "Reflectivity",

          range: [
            0,
            0.62
          ]
        },

        legend: {
          orientation: "h",

          x: 0.5,
          xanchor: "center",

          y: 1.09,
          yanchor: "bottom"
        }
      };


      // -----------------------------------------------------------------------
      // High-resolution reference
      // -----------------------------------------------------------------------

      Plotly.react(
        resolutionReference,

        [
          {
            x: wavelengths,
            y: reference,

            mode: "lines",

            name:
              "0 µε reference",

            line: {
              width: 2,
              dash: "dash"
            }
          },

          {
            x: wavelengths,
            y: shifted,

            mode: "lines",

            name:
              "+" +
              deltaStrain.toFixed(1) +
              " µε",

            line: {
              width: 2.7
            }
          }
        ],

        {
          ...commonLayout,

          shapes: [
            {
              type: "line",

              x0: lambda0,
              x1: lambda0,

              y0: 0,
              y1: 0.54,

              line: {
                width: 1,
                dash: "dot"
              }
            },

            {
              type: "line",

              x0: shiftedLambda,
              x1: shiftedLambda,

              y0: 0,
              y1: 0.54,

              line: {
                width: 1,
                dash: "dot"
              }
            }
          ],

          annotations: [
            {
              x:
                (
                  lambda0 +
                  shiftedLambda
                ) / 2,

              y: 0.565,

              text:
                "ΔλB = " +
                physicalShiftPm.toFixed(2) +
                " pm",

              showarrow: false,

              font: {
                size: 10
              }
            }
          ]
        },

        {
          responsive: true,
          displaylogo: false
        }
      );


      // -----------------------------------------------------------------------
      // Selected finite-resolution teaching view
      // -----------------------------------------------------------------------

      const capturedLambda =
        distinguishable
          ? shiftedLambda
          : lambda0;


      const captured =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              capturedLambda
            );
          }
        );


      Plotly.react(
        resolutionCapture,

        [
          {
            x: wavelengths,
            y: reference,

            mode: "lines",

            name:
              "0 µε captured reference",

            line: {
              width: 2,
              dash: "dash"
            }
          },

          {
            x: wavelengths,
            y: captured,

            mode: "lines",

            name:
              "Captured after +" +
              deltaStrain.toFixed(1) +
              " µε",

            line: {
              width: 2.7
            }
          }
        ],

        {
          ...commonLayout,

          annotations: [
            {
              xref: "paper",
              yref: "paper",

              x: 0.5,
              y: 0.91,

              text:
                distinguishable
                  ? "shift represented as distinguishable"
                  : "both captures represented at the same wavelength",

              showarrow: false,

              font: {
                size: 10
              }
            }
          ]
        },

        {
          responsive: true,
          displaylogo: false
        }
      );
    }


    // =========================================================================
    // 4. Railway bridge application
    // =========================================================================

    function updateBridgeApplication() {

      if (
        !bridgeStrainSlider ||
        !bridgeReadoutSlider ||
        !bridgeTemperatureSlider ||
        !bridgeSpectrum ||
        !bridgeErrorPlot
      ) {
        return;
      }


      const requiredStrain =
        Number(
          bridgeStrainSlider.value
        );

      const readoutResolution =
        Number(
          bridgeReadoutSlider.value
        );

      const deltaT =
        Number(
          bridgeTemperatureSlider.value
        );


      // Application uses a fixed
      // 1550-nm FBG.
      const lambda0 =
        1550.0;

      const sensitivity =
        lambda0 *
        (1 - FBG.pe) *
        1e-3;


      const strainShiftPm =
        sensitivity *
        requiredStrain;

      const strainShiftNm =
        strainShiftPm /
        1000;


      const temperatureShiftPm =
        FBG.tempSensitivity *
        deltaT;

      const temperatureShiftNm =
        temperatureShiftPm /
        1000;


      const totalShiftNm =
        strainShiftNm +
        temperatureShiftNm;


      const strainLambda =
        lambda0 +
        strainShiftNm;

      const measuredLambda =
        strainLambda +
        temperatureShiftNm;


      const strainResolution =
        readoutResolution /
        sensitivity;


      const resolutionOK =
        strainShiftPm >=
        readoutResolution;


      const apparentTemperatureStrain =
        temperatureShiftPm /
        sensitivity;


      // -----------------------------------------------------------------------
      // Controls
      // -----------------------------------------------------------------------

      bridgeStrainValue.textContent =
        requiredStrain.toFixed(0);

      bridgeReadoutValue.textContent =
        readoutResolution.toFixed(0);

      bridgeTemperatureValue.textContent =
        deltaT.toFixed(0);


      // -----------------------------------------------------------------------
      // Dynamic feedback
      // -----------------------------------------------------------------------

      if (!resolutionOK) {

        bridgeFeedbackHeading.textContent =
          "The candidate readout does not yet meet the selected strain-resolution requirement.";

        bridgeFeedbackText.textContent =
          "The required bridge strain change produces a wavelength shift of " +
          strainShiftPm.toFixed(2) +
          " pm, which is smaller than the selected " +
          readoutResolution.toFixed(0) +
          " pm readout resolution. A design iteration could use finer wavelength readout resolution or reconsider the sensing/interrogation approach.";

      } else if (deltaT > 0) {

        bridgeFeedbackHeading.textContent =
          "The strain change is resolvable, but temperature can still bias the measurement.";

        bridgeFeedbackText.textContent =
          "The selected bridge strain change produces a resolvable wavelength shift, while the modeled temperature contribution corresponds to approximately " +
          apparentTemperatureStrain.toFixed(1) +
          " µε of apparent strain if uncompensated. Temperature compensation and installation validation therefore remain part of the measurement design.";

      } else {

        bridgeFeedbackHeading.textContent =
          "The first-order resolution check is satisfied under the selected conditions.";

        bridgeFeedbackText.textContent =
          "This is only a candidate starting point. The installed sensor system still requires calibration and validation under representative bridge loading and environmental conditions.";
      }


      // -----------------------------------------------------------------------
      // Application spectrum
      //
      // Display range intentionally extends farther to the right so the
      // maximum strain + temperature peaks remain clear of the floating inset.
      // -----------------------------------------------------------------------

      const wavelengthMin =
        1549.45;

      const wavelengthMax =
        1551.18;

      const wavelengths =
        buildAxis(
          wavelengthMin,
          wavelengthMax,
          1800
        );


      const referenceSpectrum =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              lambda0
            );
          }
        );


      const strainSpectrum =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              strainLambda
            );
          }
        );


      const measuredSpectrum =
        wavelengths.map(
          function (lambda) {

            return fbgReflectivity(
              lambda,
              measuredLambda
            );
          }
        );


      Plotly.react(
        bridgeSpectrum,

        [
          {
            x: wavelengths,
            y: referenceSpectrum,

            mode: "lines",

            name: "Reference",

            line: {
              width: 2,
              dash: "dash",
              color: "#1f77b4"
            }
          },

          {
            x: wavelengths,
            y: strainSpectrum,

            mode: "lines",

            name: "Strain only",

            line: {
              width: 2.5,
              color: "#ff7f0e"
            }
          },

          {
            x: wavelengths,
            y: measuredSpectrum,

            mode: "lines",

            name:
              "Strain + temperature",

            line: {
              width: 2.5,
              color: "#2ca02c"
            }
          }
        ],

        {
          margin: {
            l: 55,
            r: 12,
            t: 48,
            b: 92
          },

          xaxis: {
            title:
              "Wavelength (nm)",

            range: [
              wavelengthMin,
              wavelengthMax
            ]
          },

          // Deliberate headroom for
          // floating readout monitor.
          yaxis: {
            title:
              "Reflectivity",

            range: [
              0,
              0.80
            ]
          },

          legend: {
            orientation: "h",

            x: 0.5,
            xanchor: "center",

            y: -0.28,
            yanchor: "top",

            font: {
              size: 9
            }
          },

          annotations: [
            {
              x:
                (
                  lambda0 +
                  strainLambda
                ) / 2 -
                0.16,

              y: 0.61,

              text:
                "strain shift = " +
                strainShiftPm.toFixed(2) +
                " pm",

              showarrow: false,

              font: {
                size: 9
              }
            },

            {
              x:
                (
                  strainLambda +
                  measuredLambda
                ) / 2 -
                0.20,

              y: 0.69,

              text:
                "temperature shift = +" +
                temperatureShiftPm.toFixed(0) +
                " pm",

              showarrow: false,

              font: {
                size: 9
              }
            }
          ]
        },

        {
          responsive: true,
          displaylogo: false
        }
      );


      // -----------------------------------------------------------------------
      // Floating readout inset
      //
      // The readout sees reference versus the combined strain + temperature
      // response. The strain-resolution decision remains based on the
      // strain-induced shift alone.
      // -----------------------------------------------------------------------

      if (
        bridgeReadoutPlot &&
        bridgeReadoutStatus
      ) {

        bridgeReadoutStatus.textContent =
          resolutionOK
            ? "Strain-resolution check: RESOLVED"
            : "Strain-resolution check: NOT RESOLVED";


        Plotly.react(
          bridgeReadoutPlot,

          [
            {
              x: wavelengths,
              y: referenceSpectrum,

              mode: "lines",

              name: "Reference",

              line: {
                width: 1.4,
                dash: "dash",
                color: "#1f77b4"
              }
            },

            {
              x: wavelengths,
              y: measuredSpectrum,

              mode: "lines",

              name:
                "Captured: strain + temperature",

              line: {
                width: 1.9,
                color: "#2ca02c"
              }
            }
          ],

          {
            margin: {
              l: 34,
              r: 5,
              t: 20,
              b: 28
            },

            xaxis: {
              range: [
                wavelengthMin,
                wavelengthMax
              ],

              tickfont: {
                size: 7
              },

              title: {
                text: "Wavelength",

                font: {
                  size: 8
                }
              }
            },

            yaxis: {
              range: [
                0,
                0.62
              ],

              tickfont: {
                size: 7
              },

              title: {
                text: "R",

                font: {
                  size: 8
                }
              }
            },

            showlegend: false
          },

          {
            responsive: true,
            displaylogo: false
          }
        );
      }


      // -----------------------------------------------------------------------
      // Auto-zoomed application interpretation plot
      // -----------------------------------------------------------------------

      const expectedStrain =
        requiredStrain;

      const expectedNm =
        strainShiftNm;

      const measuredNm =
        totalShiftNm;


      const reportedStrain =
        measuredNm *
        1000 /
        sensitivity;


      const xMin =
        Math.max(
          0,

          Math.min(
            expectedStrain,
            reportedStrain
          ) -
          Math.max(
            5,
            Math.abs(
              reportedStrain -
              expectedStrain
            ) * 0.45
          )
        );


      const xMax =
        Math.max(
          expectedStrain,
          reportedStrain
        ) +
        Math.max(
          5,
          Math.abs(
            reportedStrain -
            expectedStrain
          ) * 0.45
        );


      const ySpan =
        Math.max(
          0.008,
          Math.abs(
            measuredNm -
            expectedNm
          )
        );


      const yMin =
        Math.min(
          expectedNm,
          measuredNm
        ) -
        ySpan * 0.55;


      const yMax =
        Math.max(
          expectedNm,
          measuredNm
        ) +
        ySpan * 0.55;


      const calibrationX = [];
      const calibrationY = [];


      const step =
        Math.max(
          0.2,
          (xMax - xMin) / 150
        );


      for (
        let x = xMin;
        x <= xMax + step;
        x += step
      ) {

        calibrationX.push(x);

        calibrationY.push(
          sensitivity *
          x /
          1000
        );
      }


      Plotly.react(
        bridgeErrorPlot,

        [
          {
            x: calibrationX,
            y: calibrationY,

            mode: "lines",

            name:
              "Strain-only calibration",

            line: {
              width: 2.3,
              color: "#1f77b4"
            }
          },

          {
            x: [expectedStrain],
            y: [expectedNm],

            mode: "markers",

            name:
              "Expected from strain",

            marker: {
              size: 10,
              color: "#ff7f0e"
            }
          },

          {
            x: [expectedStrain],
            y: [measuredNm],

            mode: "markers",

            name:
              "Measured with temperature",

            marker: {
              size: 11,
              color: "#2ca02c"
            }
          },

          {
            x: [reportedStrain],
            y: [measuredNm],

            mode: "markers",

            name:
              "Reported if temperature ignored",

            marker: {
              size: 11,
              symbol: "diamond",
              color: "#d62728"
            }
          }
        ],

        {
          margin: {
            l: 58,
            r: 15,
            t: 58,
            b: 52
          },

          xaxis: {
            title:
              "Strain interpreted by calibration (µε)",

            range: [
              xMin,
              xMax
            ]
          },

          yaxis: {
            title:
              "ΔλB (nm)",

            range: [
              yMin,
              yMax
            ]
          },

          legend: {
            orientation: "h",

            x: 0.5,
            xanchor: "center",

            y: 1.13,
            yanchor: "bottom",

            font: {
              size: 9
            }
          },

          shapes: [
            {
              type: "line",

              x0: expectedStrain,
              x1: expectedStrain,

              y0: expectedNm,
              y1: measuredNm,

              line: {
                width: 1.3,
                dash: "dot"
              }
            },

            {
              type: "line",

              x0: expectedStrain,
              x1: reportedStrain,

              y0: measuredNm,
              y1: measuredNm,

              line: {
                width: 1.3,
                dash: "dot"
              }
            }
          ],

          annotations: [
            {
              x: expectedStrain,

              y:
                (
                  expectedNm +
                  measuredNm
                ) / 2,

              text:
                "temperature shift",

              showarrow: false,

              xanchor: "right",

              xshift: -8,

              font: {
                size: 9
              }
            },

            {
              x:
                (
                  expectedStrain +
                  reportedStrain
                ) / 2,

              y: measuredNm,

              text:
                "apparent strain error",

              showarrow: false,

              yshift: 13,

              font: {
                size: 9
              }
            }
          ]
        },

        {
          responsive: true,
          displaylogo: false
        }
      );
    }


    // =========================================================================
    // Interaction
    // =========================================================================

    strainSlider.addEventListener(
      "input",
      updateMainFbg
    );


    if (temperatureSlider) {

      temperatureSlider.addEventListener(
        "input",
        updateMeasurementError
      );
    }


    if (resolutionStrainSlider) {

      resolutionStrainSlider.addEventListener(
        "input",
        updateResolution
      );
    }


    if (resolutionReadoutSlider) {

      resolutionReadoutSlider.addEventListener(
        "input",
        updateResolution
      );
    }


    if (bridgeStrainSlider) {

      bridgeStrainSlider.addEventListener(
        "input",
        updateBridgeApplication
      );
    }


    if (bridgeReadoutSlider) {

      bridgeReadoutSlider.addEventListener(
        "input",
        updateBridgeApplication
      );
    }


    if (bridgeTemperatureSlider) {

      bridgeTemperatureSlider.addEventListener(
        "input",
        updateBridgeApplication
      );
    }


    // =========================================================================
    // Initial render
    // =========================================================================

    updateMainFbg();

    updateResolution();

    updateBridgeApplication();

  }
);
