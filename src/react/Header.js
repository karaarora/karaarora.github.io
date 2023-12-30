import { useState } from "react";
import { WHO_AM_I } from "./constants";

export function Header() {
  const [whoAmIndex, setWhoAmIndex] = useState(0);
  return (
    <div>
      <h1 className="text-black text-3xl p-4 font-bold">
        Karanpreet Singh Arora
      </h1>
      <h2
        className="text-black text-lg px-4 cursor-pointer"
        onClick={() => {
            setWhoAmIndex(whoAmIndex > WHO_AM_I.length - 2 ? 0 : whoAmIndex + 1);
        }}
      >
        {WHO_AM_I[whoAmIndex]}
      </h2>
    </div>
  );
}
