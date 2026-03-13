const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "is",
  "are",
  "be",
]);

export function extractKeywords(text: string) {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  )];
}

export function compareKeywords(jobDescription: string, resumeText: string) {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const missing = jobKeywords.filter((word) => !resumeKeywords.has(word));
  const matched = jobKeywords.filter((word) => resumeKeywords.has(word));

  const score = jobKeywords.length
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 0;

  return { score, matched, missing };
}
