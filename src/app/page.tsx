"use client";

import { FooterTabs } from "@/components/footerTabs.tsx";
import { Greeting } from "@/components/Greeting";
import { greetings } from "@/data/greetings";

export default function Home() {
  return (
    <div className=" min-h-screen ">
      <main className="flex flex-col min-h-screen p-4 pt-36">
        <Greeting />
      </main>
      <FooterTabs />
    </div>
  );
}
