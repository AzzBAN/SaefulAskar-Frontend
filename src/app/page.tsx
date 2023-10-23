import Image from "next/image";
import LoginPage from "./login/page";
import React, { createContext } from "react";

export default function Home() {
  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}
