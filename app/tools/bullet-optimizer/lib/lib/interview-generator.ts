export function generateInterviewPrep(role: string, jobDescription: string) {
  const lower = jobDescription.toLowerCase();

  const technical = [];
  const behavioral = [
    "Tell me about yourself.",
    "Describe a time you solved a difficult problem.",
    "Tell me about a time you worked on a team under pressure.",
  ];

  if (lower.includes("react")) technical.push("Explain how React state and props work.");
  if (lower.includes("next")) technical.push("What are server and client components in Next.js?");
  if (lower.includes("typescript")) technical.push("Why use TypeScript over plain JavaScript?");
  if (lower.includes("sql")) technical.push("How would you design and query a relational schema for this app?");
  if (lower.includes("api")) technical.push("How would you design and secure an API route?");

  if (technical.length === 0) {
    technical.push(`What technical skills would you bring to this ${role} role?`);
  }

  return { technical, behavioral };
}