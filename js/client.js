const socket = io('http://localhost:8000');

// DOM elements  DOCUMENT OBJECT MODULE
// The Document Object Model (DOM) is a programming interface for web documents.
//  It represents the page so that programs can change the document structure, style, and content. 
//  The DOM represents the document as nodes and objects; that way, programming languages can interact with the page.


const form = document.getElementById('send-container');// taking all imports from index.html
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")


var audio = new Audio('ting.mp3');  // audio play karo on msg received

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ // left means another person is ending the message
        audio.play();
    }
}



const name = prompt("Enter your name to join"); // Ask new user for name 


socket.emit('new-user-joined', name);

// emit() to send a message to all the connected clients. 
// This code will notify when a user connects to the server. 
// io.on("connection", function(socket) { io.emit(“user connected”); });



// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})
// socket.on = The function to call when the event happens. Emitted when a message is received from the server. 
// Emitted when a ping is received from the server. The client will automatically send back a pong.


// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{ // jo leave kiya chat uska naam likh kar aa jaayega left the chat
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();  // to avoid reload of form baar baar
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); // aap koi message bhej rahe ho to aapko bhi to dikhna chaiye wo
    socket.emit('send', message); // send kardo msg
    messageInput.value = '' ; // msg bhejne ke baad send box khali kardo
})