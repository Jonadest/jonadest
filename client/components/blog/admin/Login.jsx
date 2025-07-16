"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";

const Login = () => {
  const router = useRouter();
  const { axios, setToken } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/blog/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
        toast.success("Login successful");
        router.push("/blog/admin"); // Redirect to dashboard
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center h-screen"
    >
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">
          <h2 className="font-bold text-2xl">Login</h2>
        </legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          autoComplete="on"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <p className="mt-2 text-sm">Login as admin</p>

        <button className="btn btn-neutral mt-4 w-full">Login</button>
      </fieldset>
    </form>
  );
};

export default Login;
