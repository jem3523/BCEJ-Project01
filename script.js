var APIKey = "b156bd4b72934f839219b3c296bbeffa";

//URL we need to query the database
var queryURL = "https://api.spoonacular.com/recipes/search?apiKey=" + APIKey + "&query=" + "cheese, chicken" + "&number=5"

var ingredAdd = $("#ingredAdd"); 
var ingredClear = $("#ingredClear"); 
var foodEntryBox = $("#foodEntryBox"); 
var inputBox = $("<input>"); 
var foodEntryList = []; 

//INGREDADD
//user inputs ingredients into box on click of add
//ingredient is displayed in box
//ingredient added to array

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

//INGREDCLEAR
//empties div holding ingredients

//INGREDSUBMIT
//user confirms ingredients, that are saved into an array
//the array is then re-formatted and inputted into the spoontacular API
