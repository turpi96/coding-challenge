Code Challenge de TLM par Jean-Philippe Savard

Lien vers l'application: https://jp-code-challenge.herokuapp.com/ninjify



Première expérience avec:
-Heroku
-Node.js
-En théorie, PostgreSQL (mais j'ai déjà travaillé avec MySQL et SQL Server, donc...)


À noter que je me suis aidé à décoller ce challenge en utilisant un projet offert
par Heroku pour apprendre à utiliser Node.js sur leur plateforme (https://github.com/heroku/node-js-getting-started.git).

Le but du challenge est de générer un nom de ninja basé sur des "buzzwords".

Il faut que le backend soit accéssible par le endpoint "/ninjify" et 
qu'on puisse passer un querystring pour faire la recherche avec comme
paramètre "x". L'endpoint doit alors retourner un JSON avec le nom ninja.

Le frontend doit être responsive et compatible avec les ordis et mobiles.



L'application s'ouvre sur un formulaire que l'on peut remplir et soumettre.
On peut aussi ajouter des "input text" pour ajouter plus de buzzwords ou
en retirer.

En soumettant le formulaire, le serveur cherche la présence de chaque mot
dans une base de données et retire l'équivalent "ninja". Puis, s'il y a plus
de 3 mots qui sont retournés, on choisit 3 mots dans la liste de façon aléatoire
pour former le nom. Enfin, un JSON est alors passé dans une page où on l'affiche de 
façon "élégante".

On peut aussi faire l'équivalent de la soumission du formulaire en utilisant un
querystring avec paramètre "x", il suffit de séparer chaque mot par une virgule
comme "/ninjy?x=Ruby,C,HTML".




Il y a présence de l'easter egg du Konami Code, par très dure à trouver. Je donne
comme indice "10 mots"!
