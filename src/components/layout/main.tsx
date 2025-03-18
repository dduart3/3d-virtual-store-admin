import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="container h-full w-full px-4 pt-6 pb-0 sm:px-6 lg:px-8"> {/* Changed py-6 to pt-6 pb-0 */}
      {children}
    </main>
  );
}
