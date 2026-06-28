"use client";

import { Project, categoryLabels } from "@/data/projects";

const statusLabel: Record<Project["status"], string> = {
  shipped: "shipped",
  wip: "in progress",
  idea: "idea",
};

const statusDot: Record<Project["status"], string> = {
  shipped: "#5a9e6f",
  wip: "#c9963a",
  idea: "#7a7aaa",
};

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const card = (
    <div
      className="component-card"
      style={{
        padding: "1.25rem",
        minHeight: "160px",
        marginTop: "16px", // space for rail
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Category tag */}
      <span className="category-tag" style={{ alignSelf: "flex-start" }}>
        {categoryLabels[project.category]}
      </span>

      {/* Title */}
      <h3 style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 500,
        fontSize: "0.95rem",
        color: "#1a1a1a",
        lineHeight: 1.3,
        margin: 0,
      }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 300,
        fontSize: "0.82rem",
        color: "#5a5a5a",
        lineHeight: 1.5,
        margin: 0,
        flex: 1,
      }}>
        {project.description}
      </p>

      {/* Footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "0.5rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid #e0e0dc",
      }}>
        <span style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          color: "#8a8a8a",
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: statusDot[project.status],
            display: "inline-block",
          }} />
          {statusLabel[project.status]}
        </span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          color: "#aaa",
        }}>
          {project.year}
        </span>
      </div>
    </div>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", textDecoration: "none" }}
      >
        {card}
      </a>
    );
  }

  return card;
}
