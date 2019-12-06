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

