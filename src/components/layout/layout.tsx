import { ReactNode } from "react";
import { Header } from "./header";
import { Main } from "./main";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function Layout({ header, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header>{header}</Header>
        <div className="flex-1 overflow-auto">
          <Main>{children}</Main>
        </div>
      </div>
    </div>
  );
}
