
//Fix the margin of the unity webplayer
document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById("gameContainer").style.margin = "auto";
    console.log("Correcting margin");
});



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
