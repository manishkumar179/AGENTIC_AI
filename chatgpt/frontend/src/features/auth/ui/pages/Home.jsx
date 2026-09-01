import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="
        min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-6
      "
    >
      <h1 className="text-5xl font-semibold">ChatGPT Clone</h1>

      <p className="mt-4 text-gray-400">Your AI workspace.</p>

      <div className="mt-8 flex gap-3">
        <Link
          to="/login"
          className="
            rounded-full
            border
            border-white/20
            px-6
            py-3
            hover:bg-white/10
          "
        >
          Log in
        </Link>

        <Link
          to="/register"
          className="
            rounded-full
            bg-white
            px-6
            py-3
            text-black
            hover:bg-gray-200
          "
        >
          Get started
        </Link>
      </div>
    </div>
  );
};

export default Home;
