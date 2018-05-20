// @flow

export function setColor(score: number) {
  return (
    "rgb(" +
    Math.round(255 - score / 10 * 255) +
    "," +
    Math.round(score / 10 * 255) +
    ",0)"
  );
}
