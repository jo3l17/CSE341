const fs = require('fs');
const requestHandler = (req, res) => {
    const { url, method } = req;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Main Page</title><head>');
        res.write('<body><h1>Welcome to prove01 App</h1></body><hr>');
        res.write('<form action="/create-user" method="POST"><label>Username</label><br><input type="text" name="username"><br><br><button type="submit">Create User</button></form>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        fs.readFile('users.json', (err, data) => {
            if (err) throw err;
            res.write('<html>');
            res.write('<head><title>Enter Message</title><head>');
            let users = JSON.parse(data).users;
            res.write('<body><ul>');
            users.forEach(user => {
                res.write('<li>' + user.name + '</li>');
            });
            res.write('</ul></body>');
            res.write('</html>');
            return res.end();
        });
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            fs.readFile('users.json', (err, data) => {
                if (err) throw err;
                let users = JSON.parse(data).users;
                const parsedBody = Buffer.concat(body).toString();
                const user = decodeURIComponent(parsedBody.split('=')[1].replace(/\+/g, ' '));
                console.log(user);
                users.push({ name: user });
                let dataSend = {
                    users: users
                };
                dataSend = JSON.stringify(dataSend);
                fs.writeFile('users.json', dataSend, err => {
                    if (err) throw err;
                    res.statusCode = 302;
                    res.setHeader('Location', '/users');
                    return res.end();
                })
            });
        });
    }
}

module.exports = requestHandler;