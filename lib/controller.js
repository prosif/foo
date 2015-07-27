var haveEvents = 'ongamepadconnected' in window;
var controllers = ();

function connectHandler(e){
    addGamePad(e.gamepad);
}

function addGamepad(gamepad){
    controllers[gamepad.index] = gamepad;
}

function scanGamePads(){
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for(var i = 0; i < gamepads.length; i++){
        if(gamepads[i].index in controllers){
            controllers[gamepads[i].index] = gamepads[i];
        }
        else{
            addGamepad(gamepads[i]);
        }
    }
}

window.addEventListener("gamepadconnected", connectHandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if(!haveEvents){
    setInterval(scanGamepads, 500);
}
