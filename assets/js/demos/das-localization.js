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
