var serverURL = "http://localhost:8080/";

function Message(name, email, message) {
    this.name = name;
    this.email = email;
    this.message = message;
}


function saveMessage(){
    // get the values
    var name = $("#inputName").val();
    var email = $("#inputEmail").val();
    var message = $("#inputMessage").val();

    // create an object
    var message = new Message(name, email, message);
    console.log(message);
    var jsonString = JSON.stringify(message);

    function clearForm(){
        $("#inputName").val("");
        $("#inputEmail").val("");
        $("#inputMessage").val("");
    }

    //send the object to the server
    $.ajax({
        url: serverURL + "api/messages",
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
}

function init(){
    $("#btnMess").click(saveMessage);
}

window.onload = init;