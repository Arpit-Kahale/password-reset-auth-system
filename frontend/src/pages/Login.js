import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    // ✅ basic validation
    if (!data.email || !data.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        data
      );

      alert(res.data.msg || "Login successful");

      // 👉 login ke baad (future me dashboard bhi bana sakta hai)
      // abhi ke liye bas reload ya redirect optional
      // navigate("/dashboard");

    } catch (err) {
      const msg = err.response?.data?.msg;

      // ✅ proper messages from backend
      if (msg === "User not found") {
        alert("Email not registered, please register first");
      } else if (msg === "Incorrect password") {
        alert("Incorrect password, try again");
      } else {
        alert(msg || "Something went wrong");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f5f7fa" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "350px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4">Login</h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="btn btn-success w-100 mb-3" onClick={submit}>
          Login
        </button>

        {/* Forgot Password */}
        <p
          className="text-center mb-2"
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate("/forgot")}
        >
          Forgot Password?
        </p>

        {/* Register Redirect */}
        <p className="text-center">
          Don't have an account?{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}