import type { Metadata } from "next";
import Board from "@/components/Board";

export const metadata: Metadata = {
  title: "Karanpreet Singh Arora",
  description: "Product engineer and designer — software, hardware, and ideas.",
  openGraph: {
    title: "Karanpreet Singh Arora",
    description: "Product engineer and designer — software, hardware, and ideas.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Karanpreet Singh Arora",
    description: "Product engineer and designer — software, hardware, and ideas.",
  },
};

export default function Home() {
  return <Board />;
}
