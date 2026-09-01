import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.success) {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0f] p-5 sm:p-7 shadow-2xl">

        {/* Header */}
        <div className="mb-5">
          <p className="mb-1.5 text-xs font-medium tracking-[0.25em] text-gray-500">
            GET STARTED
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Create account
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Create your AI workspace account.
          </p>
        </div>

        {/* Backend Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`w-full rounded-lg border ${
                errors.name
                  ? "border-red-500"
                  : "border-white/10"
              } bg-[#191a1d] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30`}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : "border-white/10"
              } bg-[#191a1d] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30`}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className={`w-full rounded-lg border ${
                  errors.password
                    ? "border-red-500"
                    : "border-white/10"
                } bg-[#191a1d] px-4 py-2.5 pr-16 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-white/10"
              } bg-[#191a1d] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/30`}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-white py-2.5 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        {/* Login */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-white hover:underline"
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;