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
