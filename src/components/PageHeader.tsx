import React from 'react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBack, onBack }) => {
  return (
    <div className="page-header">
      {showBack && (
        <button className="icon-btn back-btn" onClick={onBack} aria-label="Go back">
          <svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.939341 10.5917C0.353554 11.1775 0.353554 12.1272 0.939341 12.713L10.4853 22.2589C11.0711 22.8447 12.0208 22.8447 12.6066 22.2589C13.1924 21.6732 13.1924 20.7234 12.6066 20.1376L4.12132 11.6523L12.6066 3.16706C13.1924 2.58128 13.1924 1.63153 12.6066 1.04574C12.0208 0.459955 11.0711 0.459955 10.4853 1.04574L0.939341 10.5917ZM27 10.1523L2 10.1523V13.1523L27 13.1523V10.1523Z" fill="white" />
          </svg>
        </button>
      )}
      <h1 className='page-header-title'>{title}</h1>
    </div>
  );
};

export default PageHeader;
