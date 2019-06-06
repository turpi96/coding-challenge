var addBuzzwordButton = document.getElementById("addBuzzword"), count = 0;

addBuzzwordButton.onclick = function()
{
    count += 1;

    var inputBuzzword = document.createElement("input");
    inputBuzzword.type = "text";
    inputBuzzword.name = "buzzword[" + count + "]";
    inputBuzzword.required = true;

    var addBr = document.createElement("br");

    var buzzwordForm = document.getElementById("buzzwordForm");

    var beforeLastCount = buzzwordForm.childElementCount;

    buzzwordForm.insertBefore(inputBuzzword, buzzwordForm.childNodes[beforeLastCount]);
    buzzwordForm.insertBefore(addBr, buzzwordForm.childNodes[beforeLastCount]);
    
    //buzzwordForm.appendChild(inputBuzzword);
    //buzzwordForm.appendChild(addBr);

    //addBuzzwordButton.innerHTML = buzzwordForm.childElementCount;
}