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
    <div className="flex h-[100vh] w-[100vw] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col h-screen">
        <Header>{header}</Header>
        <div className="flex-1 overflow-auto pb-10"> 
          <Main>{children}</Main>
        </div>
      </div>
    </div>
  );
}
