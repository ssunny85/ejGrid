const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

app.get('/', (req, res) => {
    res.send('Hello World!\n');
});

app.get('/users', (req, res) => {
    return res.json(users);
});

let users = [
    {
        id: 1,
        name: 'alice'
    },
    {
        id: 2,
        name: 'bek'
    },
    {
        id: 3,
        name: 'chris'
    }
]