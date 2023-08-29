import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  return (
    <div className="absolute w-full h-full">
      <div className="bg-lime-500 h-1/5 flex items-center justify-center text-9xl">
        RYN
      </div>
      <div className="relative h-4/5">
        <h1>Initialized</h1>
      </div>
    </div>
  );
}

export default App;
