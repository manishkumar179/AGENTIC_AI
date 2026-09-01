import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

const RootLayouts = () => {
  return (
    <div className="min-h-screen bg-[#08090a]">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayouts;