import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import store from "./app/store";

import './index.css'
// import App from "./app/App";
import AppRoutes from "./app/router/AppRoutes";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </>,
);
