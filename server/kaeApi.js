import express from 'express';
import db from './config/firebase.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 8009;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Object array
const myShops = [
    {
    shopId: 100,
    shopName: "Adidas",
    shopType: "Fashion",
    shopLoc: { lat: 100, lon: 150 },
    shopStatus: true
  },
    {
    shopId: 200,
    shopName: "New Balance",
    shopType: "Shoes",
    shopLoc: { lat: 150, lon: 210 },
    shopStatus: true
  },
    {
    shopId: 300,
    shopName: "Puma",
    shopType: "Clothes",
    shopLoc: { lat: 130, lon: 290 },
    shopStatus: true
  },

];

// http://localhost:8009/api/shops/:id
app.get('/', (req, res) => {
    res.send('<h1>Web Programming in 2/2569.</h1>');
});

// Route สำหรับการ Read ข้อมูลจากฐานข้อมูลด้วย id
// GET : http://localhos:8009/api/shops/100
app.get('/api/shops/:id', async (req, res) => { 

try {
      const doc = await db
          .collection("shops_10071")
          .doc(req.params.id)
          .get();

      res.json(
        {
          id: doc.id,
          ...doc.data()
        }
      );
    } catch (error) {
      res.status(500).json(
        {
          message: "FAILED: การอ่านข้อมูล shops ด้วยรหัสร้านค้า (shopId) มีปัญหา กรุณาตรวจสอบ",
          error: error.message
        }
      );
    }});

// GET: http://localhost:8009/api/shops
app.get('/api/shops', async(req,res) => {
    try {
    // คำสั่ง: สำหรับการอ่านหรือดึงข้อมูลจาก Documents ที่จัดเก็บภายใน Collection
    const snapshot = await db
    .collection("shops_10071")
    .orderBy("shopName", "desc")
    .get();

    const shops =  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    }));

      res.json(shops);
    } catch (error) {
        res.statusCode(500).json(
            {
                message: "FAILED: การอ่านข้อมูล shops มีปัญหากรุณาตรวจสอบ",
                error: error.message
            }
        )
    }
});

app.get('/shops{/:shopId}', (req, res) => {
    const { shopId } = req.params;

    res.set('Content-type', 'application/json');
    if(isNaN(shopId)){
        res.send(myShops);
    }else{
        const shopItems = myShops.filter(
            shop => {return shop.shopId === Number(shopId) }
        );
        res.send(shopItems[0]);
    }
    //    res.set('Content-type', 'application/json');
 //   ถ้าประกาศแค่ตัวเดียว myText+= `<b>Shop ID:</b> Latitude - ${myShops.shopLoc.lat}`;
    // const shopItems = myShops.map(
    //     shop => {
    //         `<b>Shop ID:</b> ${myShops.shopId}<br/>
    //         <b>Shop Location (lat, lon):</b> 
    //         ${myShops.shopLoc.lat}, ${myShops.shopLoc.lon}<br/>`
    //     }); 
    // let myText = '';
    // myText+= '<h1>Shop information:</h1><hr/>';
    // myText+= `<b>Shop ID:</b> ${myShops.shopId}<br/>`;
    // myText+= `<b>Shop Name:</b> ${myShops.shopName}<br/>`;
    // myText+= `<b>Shop Type:</b> ${myShops.shopType}<br/>`;
    // myText+= `<b>Shop Location (lat, lon):</b> ${myShops.shopLoc.lat}, ${myShops.shopLoc.lon}<br/>`;
    // myText+= `<b>Shop Status:</b> ${myShops.shopStatus}<br/>`;

    // res.set('Content-type', 'text/html');
    // res.send(myText);
});

// การลบข้อมูลร้านค้าจากไฟร์เบสด้วย id (Method: DELETE)
const deleteShop = async (req, res) => {
    const ShopRef = db
      .collection("shops_10071")
      .doc(req.params.id);
 
    await ShopRef.delete();
 
    res.status(200).json({
      message: "Shop deleted successfully",
      id: req.params.id,
    });
}
 
// App route: /api/shops/:id (Method: DELETE)
// Endpoint: http://localhost:8009/api/shops/100
app.delete('/api/shops/:id', (req, res) => {
  try {
    deleteShop(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to deleting shop.",
      error: error.message,
    });
  }
});

// การสร้างข้อมูลร้านค้าในไฟร์เบส (Method: POST)
const createShop = async (req, res) => {
    const {
      shopName,
      shopType,
      shopStatus,
    } = req.body;
 
    if (!shopName || !shopType || !shopStatus) {
      return res.status(400).json({
          message: "Name, type and status are required",
      });
    }
 
    const shopRef = await db.collection("shops_10071").doc();
    const newId = shopRef.id; // Access the generated ID
 
    const newShop = {
      shopId: newId,
      shopName,
      shopType,
      shopStatus: shopStatus === 'true',
    };
 
    // Builder query: Add
    const docRef = await db
      .collection("shops_10071")
      .add(newShop);
 
    res.status(201).json({
      id: docRef.id,
      ...newShop,
    });
}
 
// App route: /api/shops (Method: POST)
// Endpoint: http://localhost:xxxx/api/shops
app.post('/api/shops', (req, res) => {
  try {
    createShop(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to adding shop.",
      error: error.message,
    });
  }
});

// การแก้ไขข้อมูลร้านค้าในไฟร์เบส (Method: PUT)
const updateShop = async (req, res) => {

  try {

    const ShopRef = db
      .collection("shops_10071")
      .doc(req.params.id);

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
    } = req.body;

    const updateData = {
      shopName,
      shopType,
      shopStatus: shopStatus === 'true',
    };

    await ShopRef.update(updateData);

    res.status(200).json({
      id: req.params.id,
      ...updateData,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update Shop",
    });

  }

};

// App route: /api/shops (Method: PUT)
// Endpoint: http://localhost:8009/api/shops
app.put('/api/shops/:id', (req, res) => {
  try {
    updateShop(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to updating shop.",
      error: error.message,
    });
  }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});