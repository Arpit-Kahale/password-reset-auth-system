import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // 🔥 ONE CENTRAL API URL
  const API = "https://password-reset-auth-system.onrender.com";

  const submit = async () => {
    if (!data.email || !data.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post(
        `${API}/api/register`,
        data
      );

      alert(res.data.msg || "Registered successfully");

      navigate("/login");

    } catch (err) {
      const msg = err.response?.data?.msg;

      if (msg === "User already registered") {
        alert("User already registered, please login");
        navigate("/login");
      } else {
        alert(msg || "Something went wrong");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f5f7fa" }}>

      <div className="card shadow p-4" style={{ width: "350px" }}>
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