const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')
//Get username and room from URL
const {username , room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);

const socket=io();
//Message from server

socket.emit('joinRoom',{username,room});

//Get room and users
socket.on('roomUsers',({room,users})=>{
    OutputRoomName(room);
    OutputUsers(users);
})

socket.on('message', message =>{
  console.log(message);
  outputMessage(message);

  //Scroll Down
  chatMessages.scrollTop=chatMessages.scrollHeight;
});
//Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    //Emit mssg to server
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//Output message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').append(div);
}
//Add room name to DOM
function OutputRoomName(room){
roomName.innerText=room;
}

//Add users to DOM
function OutputUsers(users){
    userList.innerHTML=`
    ${users.map(user=> `<li>${user.username}</li>`).join('')}`;
}