import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  authStart,
  loginSuccess,
  registerSuccess,
  authFailure,
  setUser,
  logoutSuccess,
} from "../state/authSlice";

import {
  loginApi,
  registerApi,
  logoutApi,
  meApi,
} from "../api/authService";

const useAuth = () => {
  const dispatch = useDispatch();

  const login = useCallback(async (data) => {
    try {
      dispatch(authStart());

      const response = await loginApi(data);

      dispatch(loginSuccess(response.user));

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";

      dispatch(authFailure(message));

      return {
        success: false,
        message,
      };
    }
  }, [dispatch]);

  const register = useCallback(async (data) => {
    try {
      dispatch(authStart());

      const response = await registerApi(data);

      dispatch(registerSuccess(response.user));

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      dispatch(authFailure(message));

      return {
        success: false,
        message,
      };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      dispatch(authStart());

      await logoutApi();

      dispatch(logoutSuccess());

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed";

      dispatch(authFailure(message));

      return {
        success: false,
        message,
      };
    }
  }, [dispatch]);

  const me = useCallback(async () => {
    try {
      const response = await meApi();

      dispatch(setUser(response.user));

      return {
        success: true,
        user: response.user,
      };
    } catch {
      dispatch(setUser(null));

      return {
        success: false,
      };
    }
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    me,
  };
};

export default useAuth;