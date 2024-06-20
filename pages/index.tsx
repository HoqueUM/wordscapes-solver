import { Inter } from "next/font/google";
import DisplayOutput from "@/components/DisplayOutput";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`relative flex min-h-screen flex-col items-center justify-center bg-stone-900 ${inter.className}`}
    >
      <p className="z-30 p-4 text-4xl"> Wordscapes Solver</p>
      <DisplayOutput />

    </main>
  );
}