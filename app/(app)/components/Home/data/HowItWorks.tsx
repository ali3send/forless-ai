export type HowItWorksStep = {
  id: number;
  number: string;
  title: string;
  description: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    number: "01",
    title: "Describe your idea",
    description:
      "Write what you want to build in simplewords.",
  },
  {
    id: 2,
    number: "02",
    title: "We generate your website",
    description:
      "The system creates a ready-to-use website automatically.",
  },
  {
    id: 3,
    number: "03",
    title: "Publish when ready",
    description:
      "Review, edit, and go live instantly.",
  },
];
