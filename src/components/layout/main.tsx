import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="container flex-1 items-start px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
