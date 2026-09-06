"use client";

import { useEffect, useState } from "react";

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let message: string;

    if (hour >= 5 && hour < 12) {
      message = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      message = "Good afternoon";
    } else if (hour >= 18 && hour < 21) {
      message = "Good evening";
    } else {
      message = "Good night";
    }

    // Server can't know the visitor's local time; set after mount to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(`${message}, ${name}`);
  }, [name]);

  return <h2>{greeting}</h2>;
}
