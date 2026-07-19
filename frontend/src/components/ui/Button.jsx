function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}) {
  const baseClasses =
    "rounded-lg px-4 py-2 font-medium transition";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300",

    outline:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
