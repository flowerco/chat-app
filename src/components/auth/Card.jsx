const Card = ({ className, children }) => {
  return (
    <div
      className={`rounded-3xl px-8 sm:px-10 py-4 drop-shadow-xl
        bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
