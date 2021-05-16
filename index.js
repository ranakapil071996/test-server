const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(body_parser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

const mongoUri =
  'mongodb+srv://kapildb:1234@cluster1.0vsbi.mongodb.net/kapildb?retryWrites=true&w=majority';

mongoose.connect(
  mongoUri,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  },
  () => console.log('Mongoo initialize')
);
mongoose.connection.on('connected', () => console.log('Mongoose authroized'));
mongoose.connection.on('error', (err) => console.log('Mongoose err ' + err));

app.use('/save-kyc', require('./api/upload'));

app.listen(port, () => {
  console.log('Server up at ' + port);
});
