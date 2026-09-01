import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import RootLayouts from "../../features/auth/ui/components/RootLayouts";
import ProtectedRoute from "../../features/auth/ui/components/ProtectedRoute";
import AuthBootstrap from "../../features/auth/hooks/AuthBootstrap";

import Home from "../../features/auth/ui/pages/Home";
import Login from "../../features/auth/ui/pages/Login";
import Register from "../../features/auth/ui/pages/Register";

const router = createBrowserRouter([
  {
    element: <AuthBootstrap />,

    children: [
      {
        element: <RootLayouts />,

        children: [
          {
            path: "/",
            element: <Home />,
          },

          {
            path: "/login",
            element: <Login />,
          },

          {
            path: "/register",
            element: <Register />,
          },

          {
            element: <ProtectedRoute />,

            children: [
              {
                path: "/chat",
                element: <div className="text-white">Chat</div>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;