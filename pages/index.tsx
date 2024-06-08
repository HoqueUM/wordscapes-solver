import Image from "next/image";
import { Inter } from "next/font/google";
import DisplayOutput from "@/components/DisplayOutput";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <DisplayOutput />
      <input type="text" className="p-4" />

    </main>
  );
}
