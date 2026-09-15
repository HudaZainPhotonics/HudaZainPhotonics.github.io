const FBG = {
  lambda0: 1550.0, // nm
  neff: 1.447001,
  pe: 0.20268,
  Mp: 0.7372,
  deltaN: 1.5e-4,
  L: 4e-3 // m
};

FBG.sensitivity = FBG.lambda0 * (1 - FBG.pe) * 1e-3; // pm/µε
FBG.Lambda0 = FBG.lambda0 / (2 * FBG.neff); // nm

function fbgReflectivity(lambdaNm, lambdaBNm) {
  const lambda = lambdaNm * 1e-9;
  const lambdaB = lambdaBNm * 1e-9;

  const kappa =
    Math.PI * FBG.deltaN * FBG.Mp / lambda;

  const Lambda =
    lambdaB / (2 * FBG.neff);

  const beta =
    2 * Math.PI * FBG.neff / lambda;

  const detuning =
    beta - Math.PI / Lambda;

  const q =
    kappa * kappa - detuning * detuning;

  if (Math.abs(q) < 1e-12 * kappa * kappa) {
    const x = kappa * FBG.L;

    return (x * x) / (1 + x * x);
  }

  if (q > 0) {
    const s = Math.sqrt(q);
    const sh = Math.sinh(s * FBG.L);
    const ch = Math.cosh(s * FBG.L);

    return (
      kappa * kappa * sh * sh
    ) / (
      q * ch * ch +
      detuning * detuning * sh * sh
    );
  }

  const gamma = Math.sqrt(-q);
  const sinTerm = Math.sin(gamma * FBG.L);
  const cosTerm = Math.cos(gamma * FBG.L);

  return (
    kappa * kappa * sinTerm * sinTerm
  ) / (
    gamma * gamma * cosTerm * cosTerm +
    detuning * detuning * sinTerm * sinTerm
  );
}


// -----------------------------------------------------------------------------
// Interactive demo
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("fbg-strain-slider");
  const strainValue = document.getElementById("fbg-strain-value");
  const braggValue = document.getElementById("fbg-bragg-wavelength");
  const shiftValue = document.getElementById("fbg-wavelength-shift");
  const sensitivityValue = document.getElementById("fbg-sensitivity");
  const periodValue = document.getElementById("fbg-grating-period");
  const grating = document.getElementById("fbg-grating");
  const spectrum = document.getElementById("fbg-spectrum");

  // Stop quietly if this script is loaded on another page.
  if (!slider || !spectrum) return;

  // Build the visible grating planes.
  for (let i = 0; i < 18; i++) {
    const plane = document.createElement("span");
    plane.className = "fbg-grating-plane";
    grating.appendChild(plane);
  }

  // Wavelength axis used for both spectra.
  const wavelengths = [];

  const wavelengthMin = 1548.5;
  const wavelengthMax = 1554.0;
  const numberOfPoints = 2200;

  for (let i = 0; i < numberOfPoints; i++) {
    wavelengths.push(
      wavelengthMin +
      i * (wavelengthMax - wavelengthMin) / (numberOfPoints - 1)
    );
  }

  // Calculate the unstrained reference only once.
  const referenceSpectrum = wavelengths.map(function (lambda) {
    return fbgReflectivity(lambda, FBG.lambda0);
  });

  function updateDemo() {
    const strainMicro = Number(slider.value);
    const strain = strainMicro * 1e-6;

    // Bragg-wavelength response to uniform axial strain.
    const wavelengthShift =
      FBG.lambda0 * (1 - FBG.pe) * strain;

    const currentBragg =
      FBG.lambda0 + wavelengthShift;

    // Physical elongation of the grating period.
    const currentPeriod =
      FBG.Lambda0 * (1 + strain);

    // Update numerical outputs.
    strainValue.textContent =
      strainMicro.toLocaleString();

    braggValue.textContent =
      currentBragg.toFixed(3) + " nm";

    shiftValue.textContent =
      "+" + wavelengthShift.toFixed(3) + " nm";

    sensitivityValue.textContent =
      FBG.sensitivity.toFixed(3) + " pm/µε";

    periodValue.textContent =
      currentPeriod.toFixed(3) + " nm";

    // Current strained spectrum.
    const currentSpectrum = wavelengths.map(function (lambda) {
      return fbgReflectivity(lambda, currentBragg);
    });

    const traces = [];

    // At zero strain, avoid drawing two identical spectra.
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
      name: strainMicro + " µε",
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
          t: 45,
          b: 60
        },

        xaxis: {
          title: "Wavelength (nm)",
          range: [wavelengthMin, wavelengthMax]
        },

        yaxis: {
          title: "Reflectivity",
          range: [0, 0.58]
        },

        legend: {
          orientation: "h",
          y: 1.12
        },

        hovermode: "x unified"
      },
      {
        responsive: true,
        displaylogo: false
      }
    );

    // Exaggerated visual deformation so microstrain is visible.
    const visualStretch =
      1 + strainMicro / 4000;

    grating.style.transform =
      "scaleX(" + visualStretch + ")";
  }

  slider.addEventListener("input", updateDemo);

  updateDemo();
});
