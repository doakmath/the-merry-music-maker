function Card({ children, className = "" }) {
  return (
    <article
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {children}
    </article>
  );
}

export default Card;
