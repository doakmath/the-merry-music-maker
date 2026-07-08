import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>{" "}
      <Link to="/music">Music</Link>{" "}
      <Link to="/videos">Videos</Link>{" "}
      <Link to="/bio">Bio</Link>{" "}
      <Link to="/history">History</Link>{" "}
      <Link to="/other">Other</Link>
    </nav>
  );
}


export default Navbar;
