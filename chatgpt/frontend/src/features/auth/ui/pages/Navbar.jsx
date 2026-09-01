import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="h-16 border-b border-white/10 bg-[#08090a]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          ChatGPT
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-200"
          >
            Sign up
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;