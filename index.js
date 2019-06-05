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
  .get('/', (req, res) => res.redirect('/ninjify'))

  .get('/ninjify', (req, res) => {
      res.render('pages/ninjify', {qs: req.query});
  })

  .post('/ninjify', urlencodedParser, async (req, res) => {
    // Prepare output in JSON format
    /*response = {
      complete_ninja_name: 
    };*/

    //Vérifie si le champs du formulaire est vide
    if(!req.body.buzzword)
    {
      res.render('pages/index');
    }
    else
    {

      try 
      {
        const client = await pool.connect()

        var sql_query = 'SELECT ninja_equivalent FROM buzzword_ninja_name_equiv_table WHERE buzzword = $1';
        const result = await client.query(sql_query, [req.body.buzzword]);
        
        if(result.rows[0])
        {
          // TODO: Gestion des cas où le résultat n'existe pas dans la BD

          var tmp_ninja_name = result.rows[0].ninja_equivalent + ' ' + result.rows[0].ninja_equivalent; 
          var obj = {'name':tmp_ninja_name};

          res.end(JSON.stringify(obj));
        }
        else
        {
          res.end("ERROR");
        }
        
        //res.end(JSON.stringify(result));


        
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
