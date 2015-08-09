//the configuration for require
requirejs.config({
    "baseUrl": "src",//the root path to use for all module lookups
});

//Main application logic 
require(["game_engine"], function (gameEngine) {
    console.log("Main is starting");
    
});


