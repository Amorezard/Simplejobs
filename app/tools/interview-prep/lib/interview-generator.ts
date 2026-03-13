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
  if (lower.includes("database")) technical.push("What considerations matter for database design?");
  if (lower.includes("python")) technical.push("How do you handle async operations in Python?");
  if (lower.includes("javascript")) technical.push("Explain the event loop and how JavaScript handles asynchronous code.");
  if (lower.includes("testing")) technical.push("What's your approach to writing and organizing tests?");
  if (lower.includes("aws")) technical.push("Describe your experience with AWS services and deployment.");
  if (lower.includes("docker")) technical.push("How do you containerize and deploy applications with Docker?");

  if (technical.length === 0) {
    technical.push(`What technical skills would you bring to this ${role} role?`);
    technical.push("How would you approach learning new technologies required for this role?");
  }

  return { technical, behavioral };
}
