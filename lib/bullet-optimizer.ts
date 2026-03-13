const ACTION_VERBS = [
  "Built",
  "Developed",
  "Implemented",
  "Designed",
  "Optimized",
  "Engineered",
  "Created",
  "Established",
  "Improved",
  "Enhanced",
  "Accelerated",
  "Scaled",
];

export function optimizeBullet(input: string) {
  const cleaned = input.trim().replace(/\.$/, "");
  const firstWord = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);

  return ACTION_VERBS.slice(0, 3).map(
    (verb) =>
      `${verb} ${firstWord}, improving clarity and emphasizing impact.`
  );
}
