const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const document = require('./routes/document');
const docs = require('./routes/docs');
const options = require('./routes/options');
const types = require('./routes/types');
const config = require('./models/config');
const sitemapGenerator = require('sitemap-generator');
const express = require('express'),
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
app.use('/document', document); // API for CMS
app.use('/docs', docs); // API for Site
app.use('/options', options); // API for options
app.use('/types', types); // API for types of docs

/* Gen sitemap */
app.get('/gensitemap', cors(), (req, res) => {
	let generator = sitemapGenerator(config.site_name, {
		maxDepth: 0,
		filepath: config.sitemap_path,
		maxEntriesPerFile: 50000,
		stripQuerystring: true,
		priorityMap: [1.0, 0.8, 0.6, 0.4, 0.2, 0],
		lastMod: true,
		changeFreq: 'monthly'
	});

	// register event listeners
	generator.on('done', () => {
    console.log('sitemap created');
    res.send('sitemap created');
  });
   
  generator.on('error', (error) => {
    console.log(error);
    res.send('sitemap error');
  });

  // start the crawler
  generator.start();  
}); 

/* Administrator Dashboard */
app.get('/*', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
    res.send(text);
  })
});

serverHttp.listen(process.env.PORT);
