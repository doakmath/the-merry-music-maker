import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClasses = ({ isActive }) =>
    `font-medium transition ${
      isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4">
        <NavLink to="/" end className={linkClasses}>
          Home
        </NavLink>

        <NavLink to="/music" className={linkClasses}>
          Music
        </NavLink>

        <NavLink to="/videos" className={linkClasses}>
          Videos
        </NavLink>

        <NavLink to="/bio" className={linkClasses}>
          Bio
        </NavLink>

        <NavLink to="/history" className={linkClasses}>
          History
        </NavLink>

        <NavLink to="/gallery" className={linkClasses}>
          Gallery
        </NavLink>

        <NavLink to="/other" className={linkClasses}>
          Other
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
