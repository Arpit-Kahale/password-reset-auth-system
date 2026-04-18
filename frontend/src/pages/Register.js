import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    // ✅ basic validation
    if (!data.email || !data.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register",
        data
      );

      alert(res.data.msg || "Registered successfully");

      // 👉 success ke baad login page
      navigate("/login");

    } catch (err) {
      const msg = err.response?.data?.msg;

      // ✅ UPDATED MESSAGE MATCH
      if (msg === "User already registered") {
        alert("User already registered, please login");
        navigate("/login");
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
        <h3 className="text-center mb-4">Register</h3>

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

        <button className="btn btn-primary w-100 mb-3" onClick={submit}>
          Register
        </button>

        {/* 🔗 Navigation */}
        <p className="text-center">
          Already have an account?{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}