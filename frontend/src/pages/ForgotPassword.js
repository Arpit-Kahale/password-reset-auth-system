import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // 🔥 BACKEND URL (CHANGE ONCE HERE)
  const API = "https://password-reset-auth-system.onrender.com";

  const submit = async () => {
    if (!email) {
      return alert("Please enter email");
    }

    try {
      const res = await axios.post(
        `${API}/api/forgot-password`,
        { email }
      );

      alert(res.data.msg || "Reset link sent to your email");

    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f5f7fa" }}
    >
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Forgot Password</h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-warning w-100 mb-3" onClick={submit}>
          Send Reset Link
        </button>

        <p
          className="text-center"
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}