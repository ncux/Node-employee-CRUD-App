const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');

const port = process.env.PORT || 3000;

// bootstrap database connection
const { database } = require('./database');

// API controller
const employees = require('./controllers/employees');

const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static dir
app.use(express.static(path.join(__dirname, 'static')));

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// index route
app.get('/', (req, res) => {
    const title = 'Home';
    res.render('index', {title: title});
});

// about page
app.get('/about', (req, res) => {
    const title = 'About';
    res.render('about', {title: title});
});

app.use('/employees', employees);

app.listen(port, () => console.log(`Server running on port ${port}`));
