const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const NINJA_NAME_LENGTH = 3;
const KONAMI_CODE_EN = ['up','up','down','down','left','right','left','right','b','a'];
const KONAMI_CODE_FR = ['haut','haut','bas','bas','gauche','droite','gauche','droite','b','a'];

module.exports = {
    // Cette fonction recheche dans la base de données
    // la présence de tous les mots dans le paramètre
    // buzzwordData et retourne leur équivalent ninja.
    // Puis, on crée le nom ninja complet
    GetNinjaName : async function(buzzwordData,res)
    {
        // Petit easter egg, si les 10 premières entrées sont le konami code
        if(IsUsingKonamiCode(buzzwordData))
        {
            res.render('pages/konami_code');
        }
        else
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
                res.render('pages/ninja_error',{error:err});
            }
        }
        
    }

};

// Crée le nom ninja selon un array.
// Puis, on met le résultat dans un JSON
// qu'on affiche dans une page voulue.
// Gère aussi le cas où il n'y a aucun
// nom dans le paramètre arrNinjaname
function CreateNinjaName(arrNinjaName, res)
{
    if(arrNinjaName.length > 0)
    {
        var stringFullNinjaName = [];

        // Génère un nom de 3 mots maximum
        // Si l'array de buzzword est plus grand que 3,
        // on en prend 3 aléatoirement
        if(arrNinjaName.length <= NINJA_NAME_LENGTH)
        {
            stringFullNinjaName = arrNinjaName[0] + ' '
            for(i = 1; i < arrNinjaName.length; i++)
            {
                stringFullNinjaName = stringFullNinjaName + ' ' + arrNinjaName[i];
            }
        }
        else
        {
            var randomNumber = randomInt(arrNinjaName.length);
            stringFullNinjaName = arrNinjaName[randomNumber] + ' ';
            arrNinjaName.splice(randomNumber, 1);
            for(i = 1; i < NINJA_NAME_LENGTH; i++)
            {
                randomNumber = randomInt(arrNinjaName.length);
                stringFullNinjaName = stringFullNinjaName + ' ' +arrNinjaName[randomNumber];
                arrNinjaName.splice(randomNumber, 1);
            }
        }
        
        var objFullNinjaName = {'name':stringFullNinjaName};
        res.render('pages/ninja_name', objFullNinjaName);

    }
    else
    {
        res.render('pages/ninja_error',{error:"None of the words you've entered are known to me?! What is this? Sorcery?!"});
    }
}

// Retourne un chiffre entre 0 (inclus) et "high" (exclus)
function randomInt(high)
{
    return Math.floor(Math.random() * high);
}

// Vérifie si les premières entrées sont
// le konami code en francais ou anglais
function IsUsingKonamiCode(buzzwordData)
{
    if(IsUsingKonamiCodeEN(buzzwordData) || IsUsingKonamiCodeFR(buzzwordData))
    {
        return true;
    }

    return false;
}

// Vérifie s'il s'agit du konami code anglais
function IsUsingKonamiCodeEN(buzzWordData)
{
    for(i = 0; i < KONAMI_CODE_FR.length; i++)
    {
        if(buzzWordData[i].toLowerCase() != KONAMI_CODE_EN[i])
        {
            return false;
        }
    }

    return true;
}

// Vérifie s'il s'agit du konami code francais
function IsUsingKonamiCodeFR(buzzWordData)
{
    for(i = 0; i < KONAMI_CODE_FR.length; i++)
    {
        if(buzzWordData[i].toLowerCase() != KONAMI_CODE_FR[i])
        {
            return false;
        }
    }

    return true;
}