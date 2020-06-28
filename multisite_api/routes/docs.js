const express = require("express");
const cors = require('cors');
const router = express.Router();
const pg = require('pg');
const config = require('../models/config');
const connectionString = config.connection;

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

    let qs = req.query.preview ? 
    'SELECT * FROM documents WHERE type=($1) AND (deleted IS NULL OR deleted=FALSE) ORDER BY id DESC;' :
    'SELECT * FROM documents WHERE type=($1) AND (deleted IS NULL OR deleted=FALSE) AND published=TRUE ORDER BY id DESC;'; 
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