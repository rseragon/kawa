'use client';

import { useState } from "react";

export default function Sidebar({ }) {

  const [showFullSidebar, setShowFullSidebar] = useState(false)

  return <div className={`w-1/6 max-w-24`}>
    <div className={`sticky left-0 top-0 min-h-[calc(100vh-2rem)] z-20 bg-crust text-text ${showFullSidebar ? "hidden" : 'visible'}`}>
      Hewoo!
      <button onClick={_ => setShowFullSidebar(true)}>Click me</button>
    </div>

    <div className={`sticky bg-white min-h-[calc(100vh-2rem)] left-0 top-0 z-20 w-screen max-w-52 ${showFullSidebar ? 'visible' : 'hidden'}`}>
      Aasdf
      <button onClick={_ => setShowFullSidebar(false)}>Click me</button>
    </div>

  </div>
}
