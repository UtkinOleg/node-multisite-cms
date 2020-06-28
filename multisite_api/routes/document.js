const express = require("express");
const cors = require('cors');
const router = express.Router();
const pg = require('pg');
const config = require('../models/config');
const connectionString = config.connection;

const checkInput = (record) => {
  let r = null;
  if (typeof record === "undefined") return {success: false, error: 'Object is undefined'};
  return r
}

// New site content
router.post(config.url, cors(), (req, res, next) => {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'Database connection error'})
    }

    let document = req.body;
    let date = new Date();

    // Error check
    if (checkInput(document)) {
      return res.status(500).json(checkInput(document))
    }

    let query2 = client.query('INSERT INTO documents (date_create, name, url, content, user_id, type) values($1, $2, $3, $4, $5, $6) RETURNING id',
    [ date, document.name, document.url, document.content, 1, req.query.type ]);

    query2.on('error', (err) => {
      done();
      console.error(err);
      return res.status(500).json({success: false, error: err});
    });

    query2.on("end", () => {
      done();
      return res.json({ success: true })
    })
  })
});

// Update site content
router.put(config.url, cors(), (req, res, next) => {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'Database connection error'})
    }

    let document = req.body;
    let date = new Date();

    // Error check
    if (checkInput(document)) {
      return res.status(500).json(checkInput(document))
    }

    let query2 = client.query('UPDATE documents SET date_modify=($1), name=($2), url=($3), content=($4), published=($5) WHERE id=($6);',
    [ date, document.name, document.url, document.content, document.published, document.id ]);

    query2.on('error', (err) => {
      done();
      console.error(err);
      return res.status(500).json({success: false, error: err});
    });

    query2.on("end", () => {
      done();
      return res.json({ success: true })
    })
  })
});

// Delete content
router.delete(config.url + '/:id', cors(), (req, res, next) => {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'Database connection error'})
    }

    let document = req.body;
    let date = new Date();

    // Error check
    if (checkInput(document)) {
      return res.status(500).json(checkInput(document))
    }

    let query2 = client.query('UPDATE documents SET date_modify=($1), deleted=($2), published=($3) WHERE id=($4);',
    [ date, true, false, req.params.id]);

    query2.on('error', (err) => {
      done();
      console.error(err);
      return res.status(500).json({success: false, error: 'Update document error'});
    });

    query2.on("end", () => {
      done();
      return res.json({ success: true })
    })
  })
});

// Get content
router.get(config.url, cors(), (req, res, next) => {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'Database connection error'});
    }

    let qs = 'SELECT * FROM documents WHERE type=($1) AND (deleted IS NULL OR deleted=FALSE) ORDER BY id DESC;'; 
    client.query(qs, [req.query.type], (err, result) => {
        done();
        if (err) {
          console.error('error running query', err);
          return res.status(500).json({success: false, error: 'Get document error'});
        }
        console.log('get');
        return res.json(result.rows);
    })
  })
});


module.exports = router;