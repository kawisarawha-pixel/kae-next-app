import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './config/firebase.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const port = 8009;

app.use(cors());
app.use(bodyParser.json());

const myShops = [
    { shopId: 100, shopName: "Adides", shopType: "Fashion", shopLoc: { lat: 100, lon: 150 }, shopStatus: true },
    { shopId: 200, shopName: "Bata", shopType: "Shoes", shopLoc: { lat: 180, lon: 190 }, shopStatus: true },
    { shopId: 300, shopName: "Nike", shopType: "Clothes", shopLoc: { lat: 130, lon: 290 }, shopStatus: true }
];

// GET: อ่านรายการทั้งหมด
app.get('/api/shops', async (req, res) => { 
    try {
        const snapshot = await db
            .collection("shops_10071")
            .orderBy("shopName", "desc")
            .get();

        const shops = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(shops);
    } catch (error) {
        res.status(500).json({
            message: "FAILED: การอ่านข้อมูล shops มีปัญหากรุณาตรวจสอบ",
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Web Programming in 2/2569.</h1>');
});

// GET: อ่านข้อมูลตาม ID
app.get('/api/shops/:id', async (req, res) => { 
    try {
        const doc = await db
            .collection("shops_10071")
            .doc(req.params.id)
            .get();

        if (!doc.exists) {
            return res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการ" });
        }

        res.json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error) {
        res.status(500).json({
            message: "FAILED: การอ่านข้อมูล shops ด้วยรหัสร้านค้า (shopId) มีปัญหา กรุณาตรวจสอบ",
            error: error.message
        });
    }
});

app.get('/shops{/:shopId}', (req, res) => {
    const { shopId } = req.params;
    res.set('Content-type', 'application/json');
    if (isNaN(shopId)) {
        res.send(myShops);
    } else {
        const shopItem = myShops.filter(shop => shop.shopId === Number(shopId));
        res.send(shopItem[0]);
    }
    let myText = '<h1>Shop information :</h1><hr/>';
    myText += `<b>Shop ID: </b>${myShops.shopId}`;
    myText += `<br/><b>Shop Name: </b>${myShops.shopName}`;
    myText += `<br/><b>Shop Type: </b>${myShops.shopType}`;
    myText += `<br/><b>Supplier: </b>${myShops.Suplier}`;
    myText += `<br/><b>Shop Status: </b>${myShops.shopStatus}`;

    res.set('Content-type', 'text/html');
    res.send(myText);
});

// DELETE: ลบข้อมูลร้านค้า
const deleteShop = async (req, res) => {
    const ShopRef = db.collection("shops_10071").doc(req.params.id);
    await ShopRef.delete();
    res.status(200).json({
        message: "Shop deleted successfully",
        id: req.params.id,
    });
};

app.delete('/api/shops/:id', async (req, res) => {
    try {
        await deleteShop(req, res);
    } catch (error) {
        res.status(500).json({
            message: "Failed to deleting shop.",
            error: error.message,
        });
    }
});

// POST: เพิ่มข้อมูลใหม่ (แก้ไขรับ Suplier/supplier และเปลี่ยนชื่อ Collection ให้ถูกต้อง)
const createShop = async (req, res) => {
    const {
        shopName,
        shopType,
        shopStatus,
        Suplier,
        supplier
    } = req.body;

    const producerName = Suplier || supplier || "";

    if (!shopName || !shopType || !shopStatus) {
        return res.status(400).json({
            message: "Name, Type and Status are required",
        });
    }

    const newShop = {
        shopName,
        shopType,
        shopStatus, // เก็บค่าสตริง เช่น "หัว", "ใบ" โดยตรง
        Suplier: producerName,
        supplier: producerName
    };

    // แก้ไขจาก shops_10030 เป็น shops_10071
    const docRef = await db.collection("shops_10071").add(newShop);

    res.status(201).json({
        id: docRef.id,
        ...newShop,
    });
};

app.post('/api/shops', async (req, res) => {
    try {
        await createShop(req, res);
    } catch (error) {
        res.status(500).json({
            message: "Failed to adding shop.",
            error: error.message,
        });
    }
});

// PUT: แก้ไขข้อมูล (แก้ไขรับ Suplier/supplier และอัปเดตลง Database)
const updateShop = async (req, res) => {
    try {
        const ShopRef = db.collection("shops_10071").doc(req.params.id);
        const doc = await ShopRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                message: "Shop not found",
            });
        }

        const {
            shopName,
            shopType,
            shopStatus,
            Suplier,
            supplier
        } = req.body;

        const producerName = Suplier || supplier || "";

        const updateData = {
            shopName,
            shopType,
            shopStatus,
            Suplier: producerName,
            supplier: producerName
        };

        await ShopRef.update(updateData);

        res.status(200).json({
            id: req.params.id,
            ...updateData,
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update Shop",
            error: error.message
        });
    }
};

app.put('/api/shops/:id', async (req, res) => {
    try {
        await updateShop(req, res);
    } catch (error) {
        res.status(500).json({
            message: "Failed to updating shop.",
            error: error.message,
        });
    }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    const JWT_SECRET = "REACT-NEXTJS-KHAEG";
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const snapshot = await db
            .collection("users")
            .where("email", "==", email.toLowerCase().trim())
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const userDoc = snapshot.docs[0];
        const user = {
            id: userDoc.id,
            ...userDoc.data(),
        };

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const safeUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        res.status(200).json({
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});