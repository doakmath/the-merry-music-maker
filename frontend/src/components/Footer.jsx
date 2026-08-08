function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <p className="text-sm text-gray-500">
          © {year} The Merry Music Maker
        </p>
      </div>
    </footer>
  );
}

export default Footer;
