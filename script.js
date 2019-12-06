//define the arry where ingredients will be stored
var ingredList =[];

//create the listeners for all three buttons
$("#ingredSubmit").on("click", submit );
$("#ingredAdd").on("click", add);
$("#ingredClear").on("click", clear );

//this function takes items (text) from the input box and adds to the array
//and display bullet list
function add ()
{   event.preventDefault();
    var newItem = $("#ingredInput").val().trim();
    console.log(newItem);

    //make sure that we are not adding empty strings to the array
    if (newItem.length < 1)
    {
        console.log("null entry");
    }
    else
    {
    //add the item to the array and the display list
    ingredList.push(newItem);
    $("#food-entry-list").append("<li>" + newItem + "</li>");
    $('#ingredInput').val(null);
    }
};

//this functions clear the array, the display, and any previous results
function clear ()
{
    event.preventDefault();
    ingredList = [];
    $("#food-entry-list").empty();
    $("#level01").remove();
}

//this function takes the ingredients adds the to the API to bring back
//a recipe title and ID
function submit ()
{
    event.preventDefault();
    var sendList = "";

    console.log(JSON.stringify(ingredList));
    console.log("length: " + ingredList.length);
    
    //if the submit button is hit with no ingredients in it, do nothing
    if (ingredList.length == 0)
    {
        return;
    };

    //convert each array item into a format that can be added to the API
    for (j=0 ; j<ingredList.length; j++)
    {
        var item = ingredList[j];
        item = item.trim();
        //replace any space with code for spacing
        item = item.replace(/\s/g, "%20");
        sendList = sendList + "+" + item;
    }

 
    var apiKey = "acc2d918d19f494f9490b92a1b73fc4d";
    var queryURL = "https://api.spoonacular.com/recipes/search?query=" + sendList + "&number=1&apiKey=" + apiKey;
    console.log(queryURL);

    //call the API and set variables (some will be used in the 2nd API)
    $.ajax({
            url: queryURL,
            method: "GET"
    }).then(function(response)  
    {
        var results = response.totalResults;
        var title = response.results[0].title;
        var imageBase = response.baseUri;
        var image = response.results[0].image;
        image = imageBase + image;
        var recipeID = response.results[0].id;
        var recipeDetailURL = "https://api.spoonacular.com/recipes/" + recipeID + "/information?includeNutrition=false&apiKey=" + apiKey;
        console.log("image: " + image);
        console.log("detailURL: " + recipeDetailURL);

        //the API will give you a 0 results if it can't find any recipe
        if (results > 0)
        {
            //using information from the first API, call the second API for more detail
            $.ajax({
                url: recipeDetailURL,
                method: "GET"
            }).then(function(recipeDetailResponse)
            {
                var spoonacularSourceURL = recipeDetailResponse.spoonacularSourceUrl;
                var sourceURL = recipeDetailResponse.sourceUrl;
                console.log("source: " + sourceURL);
                console.log("spoon source: " + spoonacularSourceURL);

                //start building the dynamic HTML for the results
                $("#level01").remove();
                $("#recipeReturn").append("<div class = 'pure-u-1 pure-u-md-1-2' id = 'level01' ></div>");
                $("#level01").append("<div class = 'ingred-table ingred-table-biz ingred-table-selected' id = 'level02' ></div>");
    
                $("#level02").append("<div class = 'ingred-table-header' id = 'level03' style = 'text-align:center'></div>");
                $("#level03").append("<img src='" + image  + "' height ='200' width = '200' style = 'padding-bottom:1em'>");
                $("#level03").append("<ul class = 'ingred-table-list' id = 'list'></ul>");
                $("#list").append("<li><b>Your Recipe: </b>" + title + "</li>");
                $("#level03").append("<a class = 'button-choose pure-button' id = 'getRecipeButton' href = '"
                + sourceURL + "'>Go To Recipe</a>");

                //sometimes there is no wine pairing, so check to see if there is one
                if (recipeDetailResponse.winePairing.hasOwnProperty('productMatches') == true)
                {
                    var wineID = recipeDetailResponse.winePairing.productMatches[0].id;
                    var wineTitle = recipeDetailResponse.winePairing.productMatches[0].title;
                    var wineScore = recipeDetailResponse.winePairing.productMatches[0].averageRating;
                    var winePrice = recipeDetailResponse.winePairing.productMatches[0].price;
                    wineScore = wineScore.toFixed(2);
                    console.log("wine: " + wineTitle + " (rating: "+ wineScore + " price: " + winePrice + ")");

                    $("#list").append("<li><b>Wine Pairing: </b>" + wineTitle + "</li>");
                    $("#list").append("<li><b>Rating: </b>" + wineScore + "</li>");
                    $("#list").append("<li><b>Price: </b>" + winePrice + "</li>");
                }
                //if there is no wine pairing, then just add a message saying that
                else
                {
                    console.log("no wine matches");
                    $("#list").append("<li><b>Sorry!</b> No wine pairing is available for this recipe.</li>");
                };
            });
        }
        //so if there are NO recipes then add text that accommodates that
        else
        {
            $("#level01").remove();
            $("#recipeReturn").append("<div class = 'pure-u-1 pure-u-md-1-2' id = 'level01' ></div>");
            $("#level01").append("<div class = 'ingred-table ingred-table-biz ingred-table-selected' id = 'level02' ></div>");
            $("#level02").append("<div class = 'ingred-table-header' id = 'level03' ></div>");
            $("#level03").append("<h3><b>Sorry!</b> There are no recipes for those ingredients.</h3>");

        }
    });
};

