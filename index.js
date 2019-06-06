const bodyParser = require('body-parser')
const qs = require('qs')

// ensemble de fonctions utilisés pour extraire le 
// nom ninja selon les buzzwords entrés
var ninja_function = require('./ninja_name_fuctions')

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

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
      ninja_function.GetNinjaName(queryData,res);
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
    ninja_function.GetNinjaName(buzzwordData, res);
  }) 

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
