'use client';

import { ReactNode, useState, useCallback } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, [setIsSidebarOpen]);

  return (
    <div className="flex w-full">
      <div className={`relative flex flex-col w-5/6 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <main className="text-text mx-auto pt-8 w-11/12">{children}</main>
      </div>
    </div>
  );
}

