const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.json());

app.get('/sandwich-order', (req, res) => {

    const filePath = path.join(__dirname, 'public', 'index.html');
            
            fs.readFile(filePath, 'utf8', (err, fileContent) => {
                if (err) {
                    res.status(404).send('Not found!');
                } else {
                    res.status(200).send(fileContent);
                }
            });
    });
app.get('/rendelesek', (req, res) => {
    const filePath = path.join(__dirname,  'admin', 'admin.html');

    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            res.status(404).send('Not found!');
        } else {
            res.status(200).send(fileContent);
        }
    });
})

//---------------CREATE--------------------


app.post('/submitOrder', (req, res) => {
   const { breadType, baseType, toppings, customerName, totalPrice } = req.body; 
    const orderData = {

        "id": "",
        "breadType": breadType,
        "base": baseType,
        "toppings": toppings,
        "customerName": customerName,
        "totalPrice": totalPrice
    } ;

    let orders = [];
    try {
        const data = fs.readFileSync('./admin/orders.json');
        orders = JSON.parse(data);
    } catch (error) {
        console.error('Error reading orders.json file:', error);
    }

    orders.push(orderData);
    
    let newId = orders.length;
    orderData.id = newId;

    fs.writeFileSync('./admin/orders.json', JSON.stringify(orders, null, 2));

    res.send('A rendelés sikeresen elküldve!');
});

//------------UPDATE--------------


app.patch('/submitOrder', (req, res) => {
    fs.readFile(path.join(__dirname, 'admin','orders.json'), (err, fileContent) => {
        const orders = JSON.parse(fileContent);

        const order = orders.find(order => order.id == req.body.id );

        order.breadType = req.body.breadType;
        order.base = req.body.baseType;
        order.toppings = req.body.toppings;
        order.customerName = req.body.name;
        order.totalPrice = req.body.totalPrice;

        fs.writeFile( path.join(__dirname,'admin', 'orders.json'), JSON.stringify(orders, null, "\t"), err => {
            res.json({updated: "ok"});
        });

    });
});


//----------------DELETE -------------------

app.delete('/submitOrder/:id', (req, res) => {
    console.log(req.params.id);

    const orderId = req.params.id;
    fs.readFile(path.join(__dirname, 'admin', 'orders.json'), (err, fileContent) => {
        if (err) {
            console.error('Error reading orders.json file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const orders = JSON.parse(fileContent);
        const deletedIndex = orders.findIndex(order => order.id === parseInt(orderId) );

        if (deletedIndex === -1) {
            console.log('Order not found. Orders:', orders);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log('Deleting order at index:', deletedIndex);
        orders.splice(deletedIndex, 1);

        fs.writeFile(path.join(__dirname, 'admin', 'orders.json'), JSON.stringify(orders, null, "\t"), err => {
            if (err) {
                console.error('Error writing to orders.json file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ deleted: "ok" });
        });
    });
});

app.listen(2000);