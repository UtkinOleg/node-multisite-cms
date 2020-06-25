let cors = require('cors');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let fs = require('fs');
let document = require('./routes/document');
let options = require('./routes/options');
let types = require('./routes/types');
let express = require('express'),
    app = express(),
    serverHttp = require('http').createServer(app);

app.disable('x-powered-by');
app.use(cors());
app.options('*', cors());

/* Administrator Dashboard */
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

/* Site API */
app.use('/document', document); // API for docs
app.use('/options', options); // API for options
app.use('/types', types); // API for types of docs

/* Administrator Dashboard */
app.get('/*', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
    res.send(text);
  })
});

serverHttp.listen(process.env.PORT);
