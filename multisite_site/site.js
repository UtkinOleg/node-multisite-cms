let cookieParser = require("cookie-parser"),
  	bodyParser = require("body-parser"),
  	routes = require('./routes/app'),
	express = require("express"),
	app = express();

app.set("views", __dirname + "/views_jade");
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/', routes);

app.listen(process.env.PORT | 80, () => {
	console.log(process.env.NODE_ENV);
});