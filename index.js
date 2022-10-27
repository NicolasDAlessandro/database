const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const { mariaDB, sqlite } = require("./db/config");
const Products = require('./products/products');
const products = new Products('products', mariaDB);
const formatMessage = require('./utils/utils.js');
const Messages = require('./chat/chat')
const messages = new Messages('messages', sqlite);
const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Listen

httpServer.listen( PORT, ()=> {
    console.log('Server up and running in port ', PORT);
})

// Socket

io.on('connection', async (socket) => {
    console.log('New user in');
    console.log(socket.id);

    const prod = await products.getProducts();
    socket.emit('product-list', prod );
    socket.on('add-product', (newProduct) =>{ 
        products.saveProduct(newProduct);
        io.emit('product-list', products.getProducts())
    });


    const chat = await messages.getMessages();
    socket.emit('messages', chat);
    socket.on('new-message', (data) =>{
        const { username, message } = data;
        const newMessage = formatMessage( username,message );
        messages.newMessage(newMessage);
        io.emit('messages', chat)
    });
});
