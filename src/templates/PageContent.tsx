export const PageContent = ({ children }: { children: React.ReactNode; }) => {
    return (
        <div className="content">
            {children}
        </div>
    );
};

export default PageContent;