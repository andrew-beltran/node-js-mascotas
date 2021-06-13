const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//initialiazations
const app = express();
require('./database');
require('./config/passport');

// settings
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    helpers: require("./helpers/handlebars.js").helpers,
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
   secret: 'macarrones con tomatico',
   resave: true,
   saveUninitialized: true 
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    if (req.user) {
        res.locals.username = req.user.username;
        res.locals.userId = req.user._id;
    }
    next();
});

// routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/pets'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

//server is listening
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});