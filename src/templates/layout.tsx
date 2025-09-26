import type { ReactNode } from "react";
import PageHeader from "./PageHeader";
import PageContent from "./PageContent";

export interface LayoutRouteProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
}

export const Layout = ({ children, title, showBack }: LayoutRouteProps) => {
  return (
    <div className="container">
      <PageHeader title={title} showBack={showBack} />
      <PageContent children={children} />
    </div>
  );
};

export default Layout;
