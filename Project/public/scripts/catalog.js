var serverURL = "http://localhost:8080/api/";
var categories = [];
var items = [];

function fetchCatalog(){

    $.ajax({
        url: serverURL + "items",
        type: "GET",
        success: function(response){
            console.log("response", response);

            for(var i=0; i < response.length; i++){
                var item = response[i];
                if(item.user == "Gabe"){
                    items.push(item);
                    
                }
    
            }

            displayCatalog();
        },
        error: function(errorDetails){
            console.log("Error:", errorDetails);
        }
    });

     /* items = [

         {
            "code" : "SRD01",
            "description" : "Short Sword",
            "price" : 99,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/4/4e/Shortsword_%28DSIII%29.png/revision/latest?cb=20160612043504",
            "category" : "Swords",
            "stock" : 5,
            "delivery" : 14
        },
        {
            "code" : "SPR01",
            "description" : "Spear",
            "price" : 120,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/0/0b/Spear_%28DSIII%29.png/revision/latest?cb=20160612061036",
            "category" : "Spears",
            "stock" : 3,
            "delivery" : 18
        },
        {
            "code" : "HMR01",
            "description" : "Mace.",
            "price" : 119,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/7/78/Mace_%28DSIII%29.png/revision/latest?cb=20160629134521",
            "category" : "Hammers",
            "stock" : 12,
            "delivery" : 7
        },
        {
            "code" : "BOW01",
            "description" : "Longbow.",
            "price" : 190,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/0/07/Longbow_%28DSIII%29.png/revision/latest?cb=20160613021801",
            "category" : "Bows",
            "stock" : 5,
            "delivery" : 14
        },
        {
            "code" : "AXE01",
            "description" : "Battle Axe",
            "price" : 109,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/9/97/Battle_Axe_%28DSIII%29.png/revision/latest?cb=20160612040437",
            "category" : "Axes",
            "stock" : 16,
            "delivery" : 9
        },
        {
            "code" : "SRD02",
            "description" : "Katana.",
            "price" : 2100,
            "image" : "https://vignette.wikia.nocookie.net/darksouls/images/c/cc/Washing_Pole_%28DSIII%29.png/revision/latest?cb=20160612055046",
            "category" : "Swords",
            "stock" : 7,
            "delivery" : 280
        }
    ]; */
}

function displayCatalog(){
    // travel the array
    for(var i=0; i < items.length; i++){
        // get the item
        var item = items[i];
        // draw the item on the DOM (html)
        drawItem(item);

        var cat = item.category;
        if( !categories.includes(cat) ){
            categories.push(cat);
        }
    }

    console.log(categories);
    drawCategories();
}

function drawCategories(){

    // get the container for the categories
    var container = $("#categories");

    //travel the categories array
    for(var i=0; i < categories.length; i ++){

        //get each category
        var c = categories[i];

        //create an LI for category
        var li = `<li class="list-group-item"> <a href="#" onclick="searchByCategory('${c}')"> ${c} </a> </li>`;

        //ad LI to container
        container.append(li);
    }
   
    
    
}

function drawItem(item){
    //  create the sintax
    var sntx = 
    `<div class='item'> 
        <img class="itemImage" src='${item.image}'>

        <label class="itemCode">${item.code}</label>
        <label class="itemCategory">${item.category}</label>

        <label class="itemDescription">${item.description}</label> 

        <label class="itemPrice">$ ${(item.price*1).toFixed(2)}</label>
        <button class='btn btn-sm btn-indo' id="addToCart"> Add To Cart </button>
        
        <br>

        <label class="itemStock">${item.stock} Left in Stock</label>

        <br>
        
        <label class="itemDelivery">${item.delivery}-Day Delivery</label>
    </div>`;

    // get the element from the screen
    var container = $("#catalog");

    // append the sintac to the element
    container.append(sntx);
}

function search() {

    // get the text
    var text = $("#txtSearch").val().toLowerCase();

    // clear previous results
    $("#catalog").html("");

    //travel array and show only items that contain the text
    for(var i=0; i< items.length; i++){
        var item = items[i];
        //if the description contains the text, or catefory, or code, or price, etc...
        // if title contains the text, then show the item on the screen
        if (item.description.toLowerCase().includes(text)
            || item.category.toLowerCase().includes(text)
            || item.code.toLowerCase().includes(text)
            || item.price.toLowerCase().includes(text)
            ){
                drawItem(item);
            }
    }
}

function searchByCategory(catName){
    console.log("Search by", catName);

    $("#catalog").html("");

    
    for(var i=0; i< items.length; i++){
        var item = items[i];
        
        if (item.category.toLowerCase().includes(catName.toLowerCase())){
                drawItem(item);
            }
    }
}

/* 
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
} */




function init(){
    console.log("This is the catalog page!");

    // get data
    fetchCatalog();
    

    // hook events
    $("#btnSearch").click(search);
    $("#txtSearch").keypress(function(e){
        // console.log(e);

        if(e.keyCode == 13){
            search();
        }
    });

    $("#catalog").on("click", ".item", function(){
        
        // $(this).toggleClass("selected");

        // get the image of the clicked element

        var img = $(this).find('img').clone();

        $(".modal-body").html(img);
        $("#modal").modal();
    })
}


window.onload = init;