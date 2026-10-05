/**
 * Utility functions for score sanitization and formatting.
 */

/**
 * Sanitizes any raw score value:
 * Uses Number(val) and treats NaN, null, undefined, unparseable strings,
 * and negative numbers as 0.
 */
export function sanitizeScore(val) {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return 0;
  }
  return num;
}

/**
 * Formats a score for display:
 * Displays up to 2 decimal places, trimming trailing zeros.
 * Examples: 1250 -> "1250", 22.5 -> "22.5", 1671.25 -> "1671.25", -10 -> "0"
 */
export function formatScore(val) {
  const num = sanitizeScore(val);
  // Round to max 2 decimal places
  const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
  // Convert to string (JavaScript toString naturally omits trailing decimal zeros)
  return String(rounded);
}
