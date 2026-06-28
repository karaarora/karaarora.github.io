export type Category = "software" | "hardware" | "writing";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: "shipped" | "wip" | "idea";
  link?: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Project One",
    description: "A short description of what this does and why you built it.",
    category: "software",
    status: "shipped",
    link: "https://github.com",
    year: 2025,
  },
  {
    id: "project-2",
    title: "Project Two",
    description: "Another mini-project — maybe a tool, a script, or a small web app.",
    category: "software",
    status: "wip",
    year: 2025,
  },
  {
    id: "project-3",
    title: "Hardware Build",
    description: "Something physical — a 3D print, electronics project, or DIY contraption.",
    category: "hardware",
    status: "shipped",
    year: 2024,
  },
  {
    id: "project-4",
    title: "Writing Piece",
    description: "An essay, a thought, a thing I worked through on paper and wanted to share.",
    category: "writing",
    status: "shipped",
    link: "https://example.com",
    year: 2024,
  },
  {
    id: "project-5",
    title: "Another Idea",
    description: "A concept I'm still noodling on. Check back later.",
    category: "software",
    status: "idea",
    year: 2026,
  },
  {
    id: "project-6",
    title: "Yet Another Build",
    description: "More things made with hands and time and probably too much coffee.",
    category: "hardware",
    status: "shipped",
    year: 2025,
  },
];

export const categoryLabels: Record<Category, string> = {
  software: "Software",
  hardware: "Hardware",
  writing: "Writing",
};
