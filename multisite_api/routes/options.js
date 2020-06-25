const express = require("express");
const cors = require('cors');
const router = express.Router();
const pg = require('pg');
const config = require('../models/config');
const connectionString = config.connection;

const checkInput = (record) => {
  let r = null;
  if (typeof record === "undefined") return {success: false, error: 'object undefined'};
  return r
}

// New options
router.post(config.url, cors(), (req, res, next) => {
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, error: 'in connection'})
    }

        let document = req.body;
        let date = new Date();

        // Error check
        if (checkInput(document)) {
          return res.status(500).json(checkInput(document))
        }

        client.query('SELECT * FROM options WHERE type=($1) LIMIT 1;', [req.query.type], (err, result) => {
            done();
            if (err) {
                console.error('error running query', err);
                return res.status(500).json({success: false})
            }
            if (result.rows.length === 0) {
                let query2 = client.query('INSERT INTO options (date_modify, content, user_id, type) values($1, $2, $3, $4) RETURNING id',
                [ date, document.content, 1, req.query.type ]);
        
                query2.on('error', (err) => {
                  done();
                  console.error(err);
                  return res.status(500).json({success: false, error: err});
                });
        
                query2.on("end", () => {
                  done();
                  return res.json({ success: true })
                })
            } else {
                let query2 = client.query('UPDATE options SET date_modify=($1), content=($2) WHERE type=($3);',
                [ date, document.content, document.type ]);
        
                query2.on('error', (err) => {
                  done();
                  console.error(err);
                  return res.status(500).json({success: false, error: err});
                });
        
                query2.on("end", () => {
                  done();
                  return res.json({ success: true })
                })
            }
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

    client.query('SELECT * FROM options WHERE type=($1) LIMIT 1;', [req.query.type], (err, result) => {
        done();
        if (err) {
          console.error('error running query', err);
          return res.status(500).json({success: false})
        }

        return res.json(result.rows);
    })
  })
});


module.exports = router;