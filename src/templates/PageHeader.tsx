import React from "react";
import BackIcon from "../icons/BackIcon";
import IconButton from "../components/IconButton";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBack }) => {
  const onBack = () => {
    if (showBack) {
      window.history.back();
    }
  };
  return (
    <div className="page-header">
      {showBack && (
        <IconButton onClick={onBack} aria-label="Go back" icon={<BackIcon />} />
      )}
      <h1>{title}</h1>
    </div>
  );
};

export default PageHeader;
