const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/users', (req, res) => {
  console.log(req.body);

  if (req.body.sord === 'desc') {
    users.rows.sort(function (a, b) {
      let valA = String(eval('a.' + req.body.index)).toUpperCase();
      let valB = String(eval('b.' + req.body.index)).toUpperCase();

      return valB - valA;
    });
  } else {
    users.rows.sort(function (a, b) {
      let valA = String(eval('a.' + req.body.index)).toUpperCase();
      let valB = String(eval('b.' + req.body.index)).toUpperCase();

      return valA - valB;
    });
  }

  return res.json(users);
});

let users = {
  page: 1,
  records: 15,
  rows: [
    {
      id: 1,
      name: 'alice',
      age: '15',
      birthday: '1985-11-5'
    },
    {
      id: 2,
      name: 'bek',
      age: '20',
      birthday: '1985-11-5'
    },
    {
      id: 3,
      name: 'chris',
      age: '30',
      birthday: '1985-11-5'
    },
    {
      id: 4,
      name: 'ssunny',
      age: '34',
      birthday: '1985-10-29'
    },
    {
      id: 5,
      name: 'seo',
      age: '39',
      birthday: '1981-11-13'
    },
    {
      id: 6,
      name: 'alice6',
      age: '15',
      birthday: '1985-11-5'
    },
    {
      id: 7,
      name: 'bek7',
      age: '20',
      birthday: '1985-11-5'
    },
    {
      id: 8,
      name: 'chris8',
      age: '30',
      birthday: '1985-11-5'
    },
    {
      id: 9,
      name: 'ssunny9',
      age: '34',
      birthday: '1985-10-29'
    },
    {
      id: 10,
      name: 'seo10',
      age: '39',
      birthday: '1981-11-13'
    },
    {
      id: 11,
      name: 'alice11',
      age: '15',
      birthday: '1985-11-5'
    },
    {
      id: 12,
      name: 'bek12',
      age: '20',
      birthday: '1985-11-5'
    },
    {
      id: 13,
      name: 'chris13',
      age: '30',
      birthday: '1985-11-5'
    },
    {
      id: 14,
      name: 'ssunny14',
      age: '34',
      birthday: '1985-10-29'
    },
    {
      id: 15,
      name: 'seo15',
      age: '39',
      birthday: '1981-11-13'
    }
  ]
};