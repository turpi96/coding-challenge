var addBuzzwordButton = document.getElementById("addBuzzword"), count = 0;

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
    var lastChildElement = buzzwordForm.childElementCount;

    // Place un input devant le bouton submit, suivit d'une balise <br>
    buzzwordForm.insertBefore(inputBuzzword, buzzwordForm.childNodes[lastChildElement]);
    buzzwordForm.insertBefore(addBr, buzzwordForm.childNodes[lastChildElement]);
}