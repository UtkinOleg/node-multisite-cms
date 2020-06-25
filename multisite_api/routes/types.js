const express = require("express");
const cors = require('cors');
const router = express.Router();
const pg = require('pg');
const config = require('../models/config');
const connectionString = config.connection;

// New type
router.post(config.url, cors(), (req, res, next) => {
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'in connection'})
    }

    let query2 = client.query('CREATE TYPE public.doctypes AS ENUM ($1);',
    [ req.body.type ]);

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

router.get(config.url, cors(), (req, res, next) => {
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'in connection'});
    }

    client.query('SELECT enum_range(NULL::public.doctypes);', (err, result) => {
        done();
        if (err) {
          console.error('error running query', err);
          return res.status(500).json({success: false})
        }

        return res.json(result.rows);
    })
  })
});

// Delete types
router.delete(config.url, cors(), (req, res, next) => {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'Database connection error'})
    }

    let query2 = client.query('ALTER TYPE public.doctypes RENAME TO public.doctypes_old;' +
    'CREATE TYPE public.doctypes AS ENUM ("page");' + 
    'ALTER TABLE options ALTER COLUMN type TYPE public.doctypes USING status::text::public.doctypes;' + 
    'ALTER TABLE documents ALTER COLUMN type TYPE public.doctypes USING status::text::public.doctypes;' + 
    'DROP TYPE public.doctypes_old;');

    query2.on('error', (err) => {
      done();
      console.error(err);
      return res.status(500).json({success: false, error: 'Delete type error'});
    });

    query2.on("end", () => {
      done();
      return res.json({ success: true })
    })
  })
});



module.exports = router;