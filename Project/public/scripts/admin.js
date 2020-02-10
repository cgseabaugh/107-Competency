var serverURL = "http://localhost:8080/api/";
var messages = [];

// object constructor
function Item(code, description, price, image, category, stock, delivery){
    this.code = code;
    this.description = description;
    this.price = price;
    this.image = image;
    this.category = category;
    this.stock = stock;
    this.delivery = delivery;
    this.user = "Gabe"
};

function saveItem(){
    // get the values
    var code = $("#txtCode").val();
    var description = $("#txtDescription").val();
    var price = $("#txtPrice").val();
    var image = $("#txtImage").val();
    var category = $("#txtCategory").val();
    var stock = $("#txtStock").val();
    var delivery = $("#txtDelivery").val();

    // create an object
    var theItem = new Item(code, description, price, image, category, stock, delivery);
    console.log(theItem);
    var jsonString = JSON.stringify(theItem);

    function clearForm(){
        $("#txtCode").val("");
        $("#txtDescription").val("");
        $("#txtPrice").val("");
        $("#txtImage").val("");
        $("#txtCategory").val("");
        $("#txtStock").val("");
        $("#txtDelivery").val("");
    }

    //send the object to the server
    $.ajax({
        url: serverURL + "items",
        type: "POST",
        data: jsonString,
        contentType: "application/json",
        success: function(response){
            console.log("It works!", response);

            //clear the form
            clearForm();

            //show notification
            $("#alertSuccess").removeClass("hidden");

            // setTimeout(function, miliseconds)
            setTimeout(function(){
                $("#alertSuccess").addClass("hidden");
            }, 3000);
        },
        error: function(errorDetails){
            console.log("Error: ", errorDetails);
        }
    });
};

function testAjax() {
    $.ajax({
        url: serverURL + "test",
        type: 'GET',
        success: function (res) {
            console.log("Server says", res)
        },
        error: function (err) {
            console.log("Error ocurred", err)
        }
    });
};

function retrieveMessages(){
    $.ajax({
        url: serverURL + "messages",
        type: "GET",
        success: function(response){
            console.log("response", response);
            for(var i=0; i < response.length; i++){
                var message = response[i];
                messages.push(message);
                 /* if(message.user == "Gabe"){
                    messages.push(message);   
                } */
            }

            displayMessage();
        },
        error: function(errorDetails){
            console.log("Error:", errorDetails);
        }
    });
};

function drawMessage(){
    var container = $("#messages");

    for (var i = 0; i < messages.length; i++) {
        var c = messages[i];
        var li = `<li class="list-group-item">${c.messages}</li>`;

        container.append(li);
    }
}

function displayMessage(){
    // travel the array
    for(var i=0; i < messages.length; i++){
        // get the item
        var message = messages[i];
        // draw the item on the DOM (html)
        drawMessage(message);
    }
}

function init(){
    // hook events
    $("#btnSave").click(saveItem);
    retrieveMessages();

};

window.onload = init;