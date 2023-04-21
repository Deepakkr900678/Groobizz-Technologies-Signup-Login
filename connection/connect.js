const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Groobizz_Technologies')
  .then(console.log("Login Successful"))
  .catch(console.error)
