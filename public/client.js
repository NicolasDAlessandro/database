const socket = io();


// Products
const productForm = document.getElementById('productForm');
const prodName = document.getElementById('name');
const price = document.getElementById('price');
const url = document.getElementById('url');
const table = document.getElementById('table');

productForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    if( !prodName || !price.value || !url.value){
        alert('Debes completar todos los casilleros!')
    }else{
        const newProduct = {
            name: prodName.value,
            price: price.value,
            url: url.value
        }
        socket.emit('add-product', newProduct)
        prodName.value = "";
        price.value = "";
        url.value = "";
    }
})

socket.on('product-list', (products) =>{
    fetch('table.hbs')
        .then((data) =>data.text())
        .then((serverTemplate) =>{
            const template = Handlebars.compile(serverTemplate);
            const html = template({products});
            table.innerHTML = html;
        })  
})

// Chat

const username = document.getElementById('userName');
const message = document.getElementById('message');
const chatForm = document.getElementById('chatForm');
const chat = document.getElementById('chat');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        username: username.value,
        message: message.value
    };
    socket.emit('new-message', data);    
});

socket.on('messages', (data) => {
    const html = data.map((user) => {
        let renderMessage = `
            <p style="marging-top: 2px;"><b>
            <span style="color: blue;">${user.username}</b></span> 
            <span style="color: brown;">[${user.time}]:</span> 
            <span style="color: green;"><i>${user.message}</i></span></p>
        `        
        return renderMessage;
      })
      .join("\n");
    chat.innerHTML = html;
})