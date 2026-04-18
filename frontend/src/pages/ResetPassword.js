import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 🔥 SAME BASE URL
  const API = "https://password-reset-auth-system.onrender.com";

  const submit = async () => {
    if (!password || !confirm) {
      return alert("Please fill all fields");
    }

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${API}/api/reset-password/${token}`,
        { password }
      );

      alert(res.data.msg || "Password updated successfully");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f5f7fa" }}>

      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Reset Password</h3>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button className="btn btn-danger w-100 mb-3" onClick={submit}>
          Reset Password
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