
window.addEventListener("load", function() {
    //Place start screen overlay (shadow)
    let startscreen = document.createElement("startscreen");
    document.body.appendChild(startscreen);

    //Place start button and add event listener
    let controls = document.createElement("controls");
    document.body.appendChild(controls);

    //Place footer text (credits)
    let footer = document.createElement("footer");
    document.body.appendChild(footer);
    footer.innerHTML = "Created By: Brandon Yuen";

    //Place start button and add event listener
    let startButton = document.createElement("startbutton");
    document.body.appendChild(startButton);
    startButton.innerHTML = "START";
    startButton.addEventListener("click", function() {
        document.body.removeChild(startscreen);
        document.body.removeChild(controls);
        document.body.removeChild(startButton);
        document.body.removeChild(footer);
        startGame();
    });


});

function startGame(){
    new Game();
}