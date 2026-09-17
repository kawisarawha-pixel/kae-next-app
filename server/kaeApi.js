import express from 'express';
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

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});