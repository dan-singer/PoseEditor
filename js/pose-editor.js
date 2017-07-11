
//Fix the margin of the unity webplayer
document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById("gameContainer").style.margin = "auto";
    console.log("Correcting margin");
    ApplyToolbarHandlers();
});


/**
 * Applies click listeners to the toolbar buttons
 */
function ApplyToolbarHandlers(){
    var buttons = document.getElementsByClassName("toolbar-button");
    //Megaplay
    buttons[0].addEventListener("click", function(){
        gameInstance.SendMessage("RTClipEditor", "PlayActiveClipFromHTML");
    });
    //Play/pause
    buttons[1].addEventListener("click", function(){
        gameInstance.SendMessage("RTClipEditor", "TogglePause");
    });
    //Reset active curve
    buttons[2].addEventListener("click", function(){
        gameInstance.SendMessage("RTClipEditor", "ResetActiveCurve");
    });
    //Reset active clip
    buttons[3].addEventListener("click", function(){
        gameInstance.SendMessage("RTClipEditor", "ResetActiveClip");
    });
}


function Export(){
    gameInstance.SendMessage("RTClipEditor", "SaveActiveClip");
}


/**
 * SelectClip - Send a message to unity to select this clip
 *
 * @param  {type} name description
 * @return {type}      description
 */
function SelectClip(name){
    console.log("Selecting " + name);
    gameInstance.SendMessage("pAnimBank", "SwitchClip", name);
}


/**
 * SelectBodyPart - Send a message to unity to select this body part
 *
 * @param  {type} bodyPart description
 * @return {type}          description
 */
function SelectBodyPart(bodyPart){
    gameInstance.SendMessage("pQuickPick", "HandleRadioButtonChanged", bodyPart);
}
