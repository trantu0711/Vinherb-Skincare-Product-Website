document.addEventListener("DOMContentLoaded", function() {
    var loader = document.getElementById("loader");
    var content = document.getElementById("content");

    function load() {
        loader.style.display = "none";
        content.style.display = "block";

    }

    setTimeout(load, 500);
    
});