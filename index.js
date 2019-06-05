const cool = require('cool-ascii-faces')
const bodyParser = require('body-parser')
const qs = require('qs')

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var urlencodedParser = bodyParser.urlencoded({extended: true})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.redirect('/ninjify'))

  .get('/ninjify', (req, res) => {

    // Converti le query en JSON où les virgules est un délimiteur d'array
    var stringifyiedReqQuery = qs.stringify(req.query);
    var parsedQuery = qs.parse(stringifyiedReqQuery, { comma: true })

    console.error(parsedQuery);
    res.render('pages/ninjify', {qs: parsedQuery});
  })

  .post('/ninjify', urlencodedParser, async (req, res) => {

    //Vérifie si le champs du formulaire est vide
    if(!req.body.buzzword)
    {
      res.render('pages/ninjify');
    }
    else
    {

      try 
      {
        const client = await pool.connect()

        const sqlQuery = 'SELECT ninja_equivalent FROM buzzword_ninja_name_equiv_table WHERE buzzword = $1';
        const result = await client.query(sqlQuery, [req.body.buzzword[0]]);

        // Condition de gestion des cas où le query ne trouve pas le résultat
        if(result.rows.length)
        {
          var tmp_ninja_name = result.rows[0].ninja_equivalent + ' ' + result.rows[0].ninja_equivalent; 
          var obj = {'name':tmp_ninja_name};

          res.end(JSON.stringify(obj));
        }
        else
        {
          res.end("ERROR");
        }

        client.release();
      } 
      catch (err) 
      {
        console.error(err);
        res.send("Error " + err);
      }
    }
  }) 

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
