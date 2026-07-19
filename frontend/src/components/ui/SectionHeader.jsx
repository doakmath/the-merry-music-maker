function SectionHeader({ title, subtitle }) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-lg text-gray-600">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export default SectionHeader;
