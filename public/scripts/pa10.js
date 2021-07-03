const socket = io('/')

socket.on('update-list', () => {
    getAvengers()
})


const getAvengers = () => {
    const avengers = document.getElementById('avengers_list')
    avengers.innerHTML = "";
    fetch('/proveAssignments/pa10/fetchAll')
        .then(res => res.json())
        .then(data => {
            for (const avenger of data.avengers) {
                const li = document.createElement('li')
                li.innerHTML = avenger.name;
                li.classList.add('list-group-item')
                avengers.appendChild(li)
            }
        })
        .catch(err => {
            console.error(err)
        })
}

const submitName = () => {
    const newAvenger = document.getElementById('newAvengerInput').value // Grab the value of our new name

    fetch('/proveAssignments/pa10/insert', {
        method: 'POST', // Send a POST request
        headers: {
            // Set the Content-Type, since our server expects JSON
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newAvenger })
    })
        .then(res => {
            document.getElementById('newAvengerInput').value = ''
            getAvengers();
            socket.emit('new-avenger')
        })
        .catch(err => {
            document.getElementById('newAvengerInput').value = ''
            console.error(err)
        })
}

getAvengers()