const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const csp = require(`helmet-csp`);
let app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(csp({
    directives: {
      imgSrc: [`'self'`]
    }
  }))

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server log.');
        }
    });
    next();
})

app.use((req, res, next) => {
    res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

// create a new view in view folder mantenance.hbs, render a h1 ->  BRB & the site is currentrly being updated, I'll be back soon
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', function(text) {
    return text.toUpperCase();
});


app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    res.send({
        name: 'Adi',
        likes: ['Biking', 'Cooking']
    });
});


app.get('/about', (req, res) => {
    // res.send('About Page');
    res.render('about.hbs', {
        pageTitle: 'About Page',
        // currentYear: new Date().getFullYear()
        
    });
});

app.get('/home', (req, res) => {
    res.render('home.hbs',{
        welcomeMsg: 'Welcome to my beautiful website',
        
        // currentYear: new Date().getFullYear()
    })
});

// app.get('/bad', (req, res) => {
//     res.send( new Error('dassad'));
// });


app.get('/bad', (req, res) => {
    res.send({
        errorMsg: 'Unable to handle request'
    });
});



app.listen(4000);

