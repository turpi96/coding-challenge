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
    var buzzwordData = req.body.buzzword;

    //Vérifie si le champs du formulaire est vide
    if(!buzzwordData)
    {
      res.render('pages/ninjify');
    }
    else
    {
      
      try 
      {
        const client = await pool.connect()
        const sqlQuery = 'SELECT ninja_equivalent FROM buzzword_ninja_name_equiv_table WHERE buzzword = $1';
        
        var arrNinjaName = [];

        buzzwordData.forEach(function(buzzwordDataItem, itemIndex)
        {
          const result = await client.query(sqlQuery, [buzzwordDataItem]);

          // Condition de gestion des cas où le query ne trouve pas le résultat
          if(result.rows.length)
          {
            arrNinjaName.push(result.rows[0].ninja_equivalent); 
          }

        });

        if(arrNinjaName.length > 0)
        {
          var stringFullNinjaName = arrNinjaName[0];
          for(i = 1; i < arrNinjaName.length; i++)
          {
            stringFullNinjaName = stringFullNinjaName + ' ' + arrNinjaName[i];
          }
          var objFullNinjaName = {'name':stringFullNinjaName};
          res.end(JSON.stringify(objFullNinjaName));
        }
        else
        {
          res.end("Error: buzzwords don't exists in my database");
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
