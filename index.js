const cool = require('cool-ascii-faces')
const bodyParser = require('body-parser')
const querystring = require('querystring')

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var urlencodedParser = bodyParser.urlencoded({extended: false})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/', (req, res) => res.redirect('/ninjify'))
  /*.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })*/
  .get('/ninjify', (req, res) => {
      res.render('pages/ninjify', {qs: req.query});
  })
  .post('/ninjify', urlencodedParser, async (req, res) => {
    // Prepare output in JSON format
    /*response = {
      complete_ninja_name: 
    };*/

    if(!req.body.buzzword)
    {
      res.render('pages/index');
    }
    else
    {
      try {
        const client = await pool.connect()
        const result = await client.query('SELECT ninja_equivalent FROM buzzword_ninja_name_equiv_table WHERE buzzword="' + req.body.buzzword+'"');
        const results = { 'results': (result) ? result.rows : null};
        //res.render('pages/db', results );
        res.end(JSON.stringify(results));
        client.release();
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }





      /*
      response = {
        name:req.body.buzzword
      };
      */
      //res.end(JSON.stringify(response));

    }
  }) //Probablement ce que je vais devoir utiliser pour la partie post du formulaire?

  //.get('/cool', (req, res) => res.send(cool()))
  //.get('/times', (req, res) => res.send(showTimes()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  /*showTimes = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
      result += i + ' '
    }
    return result;
  }*/