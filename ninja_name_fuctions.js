const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

module.exports = {
    // Cette fonction recheche dans la base de données
    // la présence de tous les mots dans le paramètre
    // buzzwordData et retourne leur équivalent ninja.
    // Puis, on crée le nom ninja complet
    GetNinjaName : async function(buzzwordData,res)
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
    },

    // Crée le nom ninja selon un array.
    // Puis, on met le résultat dans un JSON
    // qu'on affiche dans une page voulue.
    // Gère aussi le cas où il n'y a aucun
    // nom dans le paramètre arrNinjaname
    CreateNinjaName: function (arrNinjaName, res)
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
            res.render('pages/ninja_error',{error:"None of the words you've written are known to me?! What is this sorcery?!"});
        }
    }

};