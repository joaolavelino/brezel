"use client";

import { FooterTabs } from "@/components/footerTabs.tsx";
import { greetings } from "@/data/greetings";

function getDailyGreeting() {
  const today = new Date();
  const index = today.getDate() % greetings.length;
  return greetings[index];
}

export default function Home() {
  const greeting = getDailyGreeting().greeting;

  return (
    <div className=" min-h-screen ">
      <main className="flex flex-col min-h-screen pt-15">
        <h1>Brezel</h1>
        <p>{greeting}</p>
        <FooterTabs />
      </main>
    </div>
  );
}
