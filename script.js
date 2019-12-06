var ingredList =[];

$("#ingredSubmit").on("click", submit );
$("#ingredAdd").on("click", add);
$("#ingredClear").on("click", clear );

function add ()
{   event.preventDefault();
    var newItem = $("#ingredInput").val().trim();
    console.log(newItem);

    if (newItem.val() === null)
    {
        console.log("null entry");
    }
    else
    {
    ingredList.push(newItem);
    $("#food-entry-list").append("<li>" + newItem + "</li>");
    $('#ingredInput').val(null);
    }
};

function clear ()
{
    event.preventDefault();
    ingredList = [];
    $("#displayList").empty();
    $("#level01").remove();
}


function submit ()
{
    event.preventDefault();
    var sendList = "";

    console.log(JSON.stringify(ingredList));
    console.log("length: " + ingredList.length);

    if (ingredList.length == 0)
    {
        return;
    };


    for (j=0 ; j<ingredList.length; j++)
    {
        var item = ingredList[j];
        item = item.trim();
        item = item.replace(/\s/g, "%20");
        sendList = sendList + "+" + item;
    }



    //create the URL to be used in the first API
    //OPTION? var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" 
    
    var apiKey = "acc2d918d19f494f9490b92a1b73fc4d";
    var queryURL = "https://api.spoonacular.com/recipes/search?query=" + sendList + "&number=1&apiKey=" + apiKey;
    console.log(queryURL);

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

        if (results > 0)
        {
            $.ajax({
                url: recipeDetailURL,
                method: "GET"
            }).then(function(recipeDetailResponse)
            {
                var spoonacularSourceURL = recipeDetailResponse.spoonacularSourceUrl;
                var sourceURL = recipeDetailResponse.sourceUrl;
                console.log("source: " + sourceURL);
                console.log("spoon source: " + spoonacularSourceURL);

                $("#level01").remove();
                $("#recipeReturn").append("<div class = 'pure-u-1 pure-u-md-1-2' id = 'level01' ></div>");
                $("#level01").append("<div class = 'pricing-table pricing-table-biz pricing-table-selected' id = 'level02' ></div>");
                $("#level02").append("<div class = 'pricing-table-header' id = 'level03' ></div>");
                $("#level03").append("<img src='" + image  + "' height ='200' width = '200'>");
                $("#level03").append("<ul class = 'pricing-table-list' id = 'list'></ul>");
                $("#list").append("<li><b>Your Recipe: </b>" + title + "</li>");
                $("#level03").append("<a class = 'button-choose pure-button' id = 'getRecipeButton' href = '"
                + sourceURL + "'>Go To Recipe</a>");

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
                else
                {
                    console.log("no wine matches");
                    $("#list").append("<li><b>Sorry!</b> No wine pairing is available for this recipe.</li>");
                };
            });
        }
        else
        {
            $("#level01").remove();
            $("#recipeReturn").append("<div class = 'pure-u-1 pure-u-md-1-2' id = 'level01' ></div>");
            $("#level01").append("<div class = 'pricing-table pricing-table-biz pricing-table-selected' id = 'level02' ></div>");
            $("#level02").append("<div class = 'pricing-table-header' id = 'level03' ></div>");
            $("#level03").append("<h3><b>Sorry!</b> There are no recipes for those ingredients.</h3>");

        }
    });
};

