import React, { useState, useEffect } from "react";
import axios from "axios";

// Axios แนบ Cookie ไปด้วยทุกครั้งที่เรียก API
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // เช็ค Session อัตโนมัติทุกครั้งที่เปิดหน้าเว็บ
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`);
        if (res.data.loggedIn) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);
  // ฟังก์ชัน Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setUser(res.data.user);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  // ฟังก์ชัน Logout (ส่งไปลบ Cookie ที่ Server)
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      setUser(null); // ล้างค่า State ฝั่ง React
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ระหว่างรอเช็ค Session จาก Server ตอนโหลดหน้าเว็บแรก
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>กำลังโหลด...</div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {user ? (
        // ================= หน้าจอเมื่อ Login แล้ว (Session ยังอยู่) =================
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h2>ยินดีต้อนรับ!</h2>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>ชื่อ:</strong> {user.name}
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Logout (ออกจากระบบ)
          </button>
        </div>
      ) : (
        // ================= ฟอร์ม Login (ยังไม่มี Session) =================
        <form
          onSubmit={handleLogin}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>เข้าสู่ระบบ</h2>
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Username (ใช้: admin)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Password (ใช้: 1234)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
