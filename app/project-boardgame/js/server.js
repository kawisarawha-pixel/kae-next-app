import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;
const SECRET_KEY = "MY_SUPER_SECRET_KEY";

app.use(express.json());
app.use(cookieParser());

// ตั้งค่า CORS
app.use(
  cors({
    origin: "http://localhost:3000", // URL ของ React
    credentials: true, // อนุญาตให้รับ-ส่ง Cookie
  }),
);

// Middleware ตรวจสอบ Session จาก Cookie
const verifySession = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ loggedIn: false, message: "ไม่มี Session" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ loggedIn: false, message: "Session หมดอายุหรือย่อยสลายแล้ว" });
  }
};

// ---------------- API ROUTES ---------------- //

// [GET] เช็คสถานะ Session (ใช้ตอนโหลดหน้าเว็บ / Refresh F5)
app.get("/api/me", verifySession, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

// [POST] เข้าสู่ระบบ (สร้าง Session)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบ User/Pass (สมมติข้อมูลตัวอย่าง)
  if (username === "admin" && password === "1234") {
    const userPayload = { username: "admin", name: "ผู้ดูแลระบบ" };

    // สร้าง Token อายุ 1 วัน
    const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1d" });

    // ฝัง Cookie ลง Browser
    res.cookie("token", token, {
      httpOnly: true, // ป้องกัน JavaScript เข้าถึง Cookie (กัน XSS)
      secure: process.env.NODE_ENV === "production", // เป็น true เมื่อใช้ HTTPS
      sameSite: "lax", // ป้องกัน CSRF
      maxAge: 24 * 60 * 60 * 1000, // อายุ Session (1 วัน)
    });

    return res.json({ message: "เข้าสู่ระบบสำเร็จ", user: userPayload });
  }

  return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
});

// [POST] ออกจากระบบ (Clear Session)
app.post("/api/logout", (req, res) => {
  // ลบ Cookie ออกจาก Browser
  res.clearCookie("token");
  res.json({ message: "ออกจากระบบเรียบร้อยแล้ว" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
