const express = require('express');
const app = express();
const PORT = 3000;
const json = {
    "name": "Caleb Curry",
    "industry": "Music",
    "favouriteColours": [
        "red",
        "blue",
        "green"
    ],
    "favouriteNumbers": [
        5,
        3,
        7
    ],
    "favouritePeople": [
        {
            "name": "mom",
            "relationship": "parent"
        },
        {
            "name": "dad",
            "relationship": "parent"
        }
    ]
};

app.get('/', (req, res) => {
	res.send({"data": json.favouritePeople});
});

app.post('/', (req, res) => {
   res.send('This is a post request.')
});

app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});



