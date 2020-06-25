const express = require("express");
const router  = express.Router();
const passport = require("passport");
const nodemailer = require('nodemailer');
const models = require("../models/config");
const fetch = require('node-fetch');

const urls = [models.api_url + models.document_prefix + models.default_type, 
  models.api_url + models.options_prefix + models.default_type];

const header = {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  };

const fetchJSON = (url, header) => {
  return fetch(url, header).then(response => response.ok ? response.json() : null)
}

const renderData = (req, res, url, big_data) => {
	big_data.site_data = models.site_data; 
  big_data.url=req.protocol + '://' + req.get('host') + req.originalUrl;
  res.render(url, big_data)
}

router.post("/feedback", (req, res) => {
	if (!req.body.name && !req.body.phone) {
		return res.json({success: false});
	}

	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

	const transporter = nodemailer.createTransport({
		host: models.site_data.mailhost,
		port: models.site_data.port,
		secure: true, // use TLS
		auth: {
      user: models.site_data.email,
      pass: models.site_data.email_password
    }
	});

	const mailoptions = {
		from: models.site_data.email,
		to: models.site_data.email,
		subject: req.body.name,
    text: JSON.stringify(req.body)
	}

  if (transporter) {
    transporter.verify( (error, success) => {
      if (error) {
        console.error(error);
        res.render('mailerror')
      } else {
        transporter.sendMail(mailoptions, (error, info) =>{
          if(error) {
            console.log(error);
            res.render('mailerror')
          } else {
            console.log('Email sent', info);
            res.render('mailsent')
          }
        })
      }
    })
  }
}); 

router.get('/feedback/:type/:url', (req, res, next) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  const urls = [models.api_url + models.document_prefix + req.params.type, 
    models.api_url + models.options_prefix + req.params.type, 
    models.api_url + '/common-'+req.params.url+'.json',
    models.api_url + '/adding-'+req.params.url+'.json'
  ];

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  let promises = urls.map(url => fetchJSON(url, header));

  Promise.all(promises)
  .then(data => {
    if (data[0] && data[1]) {
      models.site_data.pages = data[0];
      models.site_data.options = data[1][0];

      let page = models.site_data.pages.find(item => item.url === req.params.url);
      if (!page) {
        res.render('notfound')
      }
      console.log(data[2]);
      let big_data = {
        title: page.content.seo_title,
        options: models.site_data.options,
        page: page,
        common: data[2],
        adding: data[3],
        description: page.content.seo_description
      };
      renderData(req, res, 'feedback', big_data)
    } else {
      res.render('notfound')
    }
  })
  .catch(err => {
    console.error(err);
    res.render('notfound')
  })
});

// Route single page
router.get('/'+models.default_type+'/:url', (req, res, next) => {
  const urls = [models.api_url + models.document_prefix + models.default_type, 
    models.api_url + models.options_prefix + models.default_type];
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  let promises = urls.map(url => fetchJSON(url, header));

  Promise.all(promises)
  .then(data => {
    if (data[0] && data[1]) {
      models.site_data.pages = data[0];
      models.site_data.options = data[1][0];

      let page = models.site_data.pages.find(item => item.url === req.params.url);
      if (!page) {
        res.render('notfound')
      }

      renderData(req, res, 'index', {
        title: page.content.seo_title,
        pages: models.site_data.pages,
        options: models.site_data.options,
        item: req.params.url,
        name: page.name,
        description: page.content.seo_description
      })
    } else {
      res.render('notfound')
    }
  })
  .catch(err => {
    console.error(err);
    res.render('notfound')
  }) 
});

router.get('/' + models.default_type, (req, res, next) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  
  const urls = [models.api_url + models.document_prefix + models.default_type, 
    models.api_url + models.options_prefix + models.default_type];

  let promises = urls.map(url => fetchJSON(url, header));

  Promise.all(promises)
  .then(data => {
    if (data[0] && data[1]) {
      models.site_data.pages = data[0];
      models.site_data.options = data[1][0];
      renderData(req, res, "index", {
        pages: models.site_data.pages,
        options: models.site_data.options,
        item: 'all'
      })
    } else {
      res.render('notfound')
    }
  })
  .catch(err => {
    console.error(err);
    res.render('notfound')
  })
});

// Default route PAGE
router.get('/', (req, res, next) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  
  let promises = urls.map(url => fetchJSON(url, header));

  Promise.all(promises)
  .then(data => {
    if (data[0] && data[1]) {
      models.site_data.pages = data[0];
      models.site_data.options = data[1][0];
      renderData(req, res, "index", {
        pages: models.site_data.pages,
        options: models.site_data.options,
        item: 'all'
     })
    } else {
      res.render('notfound')
    }
  })
  .catch(err => {
    console.error(err);
    res.render('notfound')
  })
});

module.exports = router;
module.exports.passport = passport;