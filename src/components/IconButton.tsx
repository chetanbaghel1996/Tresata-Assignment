const IconButton = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className="icon-button" onClick={onClick} style={{ padding: 0 }}>
      {icon}
    </button>
  );
};

export default IconButton;
