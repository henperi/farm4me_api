/**
 * This method converts a Naira amount to kobo
 * @param {number} amountInNaira
 * @returns {number} the amount in kobo
 */
export const toKobo = (amountInNaira) => {
  const koboMultiplier = 100;

  return Number(amountInNaira) * koboMultiplier;
};
