var addBuzzwordButton = document.getElementById("addBuzzword");
var removeBuzzwordButton = document.getElementById("removeBuzzword");

var count = 0;

addBuzzwordButton.onclick = function()
{
    count += 1;

    // Crée un input text
    var inputBuzzword = document.createElement("input");
    inputBuzzword.type = "text";
    inputBuzzword.name = "buzzword[" + count + "]";
    inputBuzzword.required = true;

    // Crée une balise <br>
    var addBr = document.createElement("br");

    // Recherche le formulaire de la page
    var buzzwordForm = document.getElementById("buzzwordForm");

    // Recherche le dernier élément du formulaire
    var lastChildElement = buzzwordForm.childElementCount -1;

    // Place un input devant le bouton submit, suivit d'une balise <br> à tous les 3 inputs
    buzzwordForm.insertBefore(inputBuzzword, buzzwordForm.childNodes[lastChildElement]);
    if(count % 3 === 0)
    {
        buzzwordForm.insertBefore(addBr, buzzwordForm.childNodes[lastChildElement]);

    }
}

removeBuzzwordButton.onclick = function()
{
    if(count > 0)
    {
        // Recherche le formulaire de la page
        var buzzwordForm = document.getElementById("buzzwordForm");

        // Recherche le dernier élément du formulaire
        var lastChildElement = buzzwordForm.childElementCount - 2;

        buzzwordForm.removeChild(buzzwordForm.childNodes[lastChildElement]);
        if(count % 3 === 0)
        {
            lastChildElement = buzzwordForm.childElementCount - 2;
            buzzwordForm.removeChild(buzzwordForm.childNodes[lastChildElement]);
        }

        count--;
    }
}