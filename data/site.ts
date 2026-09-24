export const comparison = {
  caption: "What this prototype actually does",
  columns: ["F5 Test", "Traditional type tests"] as const,
  rows: [
    {
      feature: "Memorable identity",
      f5: "Four plain-language working styles",
      traditional: "Often a code or a long label",
    },
    {
      feature: "Two-axis dimensional profile",
      f5: "Focus and Style scores, plus a secondary lean when you sit near the middle",
      traditional: "Usually a single type label",
    },
    {
      feature: "How to work with each type",
      f5: "A 16-cell adjustment playbook",
      traditional: "Rarely this specific",
    },
    {
      feature: "Shareable result card",
      f5: "A link and a Fiveprint card",
      traditional: "Varies by test",
    },
  ],
};

export const framework = [
  {
    id: "F1",
    title: "Find Yourself",
    status: "Live" as const,
    body: "Take the assessment and get your type, scores, and Fiveprint.",
  },
  {
    id: "F2",
    title: "Find Your Future",
    status: "Coming soon" as const,
    body: "Goals and where you want to head next. Not available in this prototype.",
  },
  {
    id: "F3",
    title: "Find Your Friction",
    status: "Coming soon" as const,
    body: "Habits and attention patterns. Not available in this prototype.",
  },
  {
    id: "F4",
    title: "Find Your Five",
    status: "Partly live" as const,
    body: "The playbook shows how to adjust to each type. A fuller “your five people” match is still ahead.",
  },
  {
    id: "F5",
    title: "Find Your Path",
    status: "Coming soon" as const,
    body: "A 30-day action experiment. Not available in this prototype.",
  },
];

export const teasers = [
  {
    id: "famous-five",
    title: "Famous Five",
    status: "Coming soon" as const,
    body: "A look at public figures with a similar pattern. Not available in this prototype — no real-person matching.",
  },
  {
    id: "experiment",
    title: "30-day experiment",
    status: "Coming soon" as const,
    body: "A short practice plan based on your Fiveprint. Not available in this prototype.",
  },
];
