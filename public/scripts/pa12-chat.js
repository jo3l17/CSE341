const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const user = document.getElementById('user')
const date = new Date() // Date implementation

socket.on('newMessage', data => {
    addMessage(data, false)
})


const getTime = () => {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

messageEl.addEventListener("keyup", function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        postMessage();
    }
});

// Post message to board
const postMessage = () => {
    // Get input values from the page
    const message = messageEl.value.trim();
    if (!message || messageEl.value.trim() === '') {
        return;
    }
    const from = user.value;
    const time = getTime();
    const data = { message, from, time };
    // Emit the message
    socket.emit('message', data);
    // Add the message to the page
    addMessage(data, true);
    // Clear input
    messageEl.value = '';
}

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
    // Add an li to the page containing the new message
    // Give it the uMessage class if from the current user
    const li = document.createElement('li');
    li.classList.add(`message`);
    user?li.classList.add('uMessage'):'';
    li.innerHTML = `${data.from} @${data.time}: ${data.message}`
    chatBox.appendChild(li);
    console.log(getOffset(li));
    chatBox.scroll(0, getOffset(li).top);
}
