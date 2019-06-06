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

  // La page par défaut est redirigé vers le endpoint /ninjify
  .get('/', (req, res) => res.redirect('/ninjify'))

  .get('/ninjify', (req, res) => {

    // Vérifie s'il y a présence d'un query string 
    // et s'il y a présence du paramètre 'x' dans celui-ci
    // Si les deux conditions sont vraies, alors on affiche
    // le nom ninja. Sinon, on affiche le formulaire pour
    // trouver un nom ninja
    if(Object.keys(req.query).length != 0 && req.param('x') != null)
    {
      // Converti le query en JSON où les virgules est un délimiteur d'array
      var stringifyiedReqQuery = qs.stringify(req.query);
      var parsedQuery = qs.parse(stringifyiedReqQuery, { comma: true });

      const queryData = parsedQuery.x;
      GetNinjaName(queryData,res);
    }
    else
    {
      res.render('pages/ninjify');
    }
  })

  // Si on remplit le formulaire du endpoint, on recherche
  // le nom ninja équivalent, le formulaire 
  // est envoyé sous la méthode POST
  .post('/ninjify', urlencodedParser, (req, res) => {
    var buzzwordData = req.body.buzzword;
    GetNinjaName(buzzwordData, res);
  }) 

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


// Cette fonction recheche dans la base de données
// la présence de tous les mots dans le paramètre
// buzzwordData et retourne leur équivalent ninja.
// Puis, on crée le nom ninja complet
async function GetNinjaName(buzzwordData,res)
{
  try 
  {
    // Connection à la BD et création de la query 
    // pour récupérer les données
    const client = await pool.connect()
    const sqlQuery = 'SELECT ninja_equivalent FROM buzzword_ninja_name_equiv_table WHERE buzzword ILIKE $1';
    
    // Array pour se souvenir de tous les noms ninjas équivalents
    var arrayNinjaName = [];

    // Parcours l'array buzzWordData pour trouver tous les 
    // équivalents ninjas et les inserts dans un autre array
    // s'il y a une correspondance 
    for(i = 0; i < buzzwordData.length; i++)
    {
      const result = await client.query(sqlQuery, [buzzwordData[i]]);

      // Condition de gestion des cas où le query ne trouve pas le résultat
      if(result.rows.length)
      {
        arrayNinjaName.push(result.rows[0].ninja_equivalent); 
      }
    }

    // Crée et affiche le nom ninja formé par les
    // buzzwords entrés dans le formulaire ou
    // query string
    await CreateNinjaName(arrayNinjaName,res);

    client.release();
    
  } 
  catch (err) 
  {
    console.error(err);
    res.send("Error: " + err);
  }
}

// Crée le nom ninja selon un array
// Puis, on met le résultat dans un JSON
// qu'on affiche dans une page voulue.
// Gère aussi le cas où il n'y a aucun
// nom dans le paramètre arrNinjaname
function CreateNinjaName(arrNinjaName, res)
{
  if(arrNinjaName.length > 0)
  {
    var stringFullNinjaName = arrNinjaName[0];
    for(i = 1; i < arrNinjaName.length; i++)
    {
      stringFullNinjaName = stringFullNinjaName + ' ' + arrNinjaName[i];
    }
    var objFullNinjaName = {'name':stringFullNinjaName};
    res.render('pages/ninja_name', objFullNinjaName);

  }
  else
  {
    res.render('pages/ninja_error',{error:"Error: buzzwords don't exists in my database"});
  }
}