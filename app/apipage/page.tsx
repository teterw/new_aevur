"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const data = await res.json();
      setMessage(data.message);
    };

    fetchData(); // get first data
    const interval = setInterval(fetchData, 3000); // update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ fontFamily: "monospace", textAlign: "center", marginTop: "50px" }}>
      <h1>Arduino Message:</h1>
      <p>{message}</p>
    </main>
  );
}
