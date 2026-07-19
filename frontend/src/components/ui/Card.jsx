function Card({ children, className = "", ...props }) {
  return (
    <article
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </article>
  );
}

export default Card;
