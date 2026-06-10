let data = {
tkd:0,
strength:0,
speed:0,
flex:0,
swim:0,
bike:0,
intensity:5,
fatigue:5
};

function saveDay(){

data.tkd = +document.getElementById("tkd").value;
data.strength = +document.getElementById("strength").value;
data.speed = +document.getElementById("speed").value;
data.flex = +document.getElementById("flex").value;
data.swim = +document.getElementById("swim").value;
data.bike = +document.getElementById("bike").value;
data.intensity = +document.getElementById("intensity").value;
data.fatigue = +document.getElementById("fatigue").value;

localStorage.setItem("tkdData", JSON.stringify(data));

update();
addPoints();
checkAchievements();
}

function update(){

let total =
data.tkd +
data.strength +
data.speed +
data.flex +
data.swim +
data.bike;

let percent = Math.min(100, total/6);

document.getElementById("progress").style.width = percent + "%";
document.getElementById("progressText").innerText = Math.round(percent) + "%";
}

function addPoints(){

let points =
data.tkd +
data.strength +
data.speed +
data.flex;

document.getElementById("points").innerText = points;
}

function load(){

let saved = JSON.parse(localStorage.getItem("tkdData"));

if(saved){

data = saved;

document.getElementById("tkd").value = data.tkd;
document.getElementById("strength").value = data.strength;
document.getElementById("speed").value = data.speed;
document.getElementById("flex").value = data.flex;
document.getElementById("swim").value = data.swim;
document.getElementById("bike").value = data.bike;
document.getElementById("intensity").value = data.intensity;
document.getElementById("fatigue").value = data.fatigue;

update();
addPoints();
}
}

function checkAchievements(){

let list = document.getElementById("achievements");

if(data.tkd > 80){
list.innerHTML += "<li>🥋 Entreno fuerte de TKD</li>";
}

if(data.flex > 40){
list.innerHTML += "<li>🤸 Flexibilidad en progreso</li>";
}

if(data.speed > 30){
list.innerHTML += "<li>⚡ Velocidad mejorando</li>";
}
}

function chart(){

new Chart(document.getElementById("chart"),{

type:"radar",

data:{
labels:["TKD","Fuerza","Velocidad","Flex","Natación","Bici"],
datasets:[{
data:[data.tkd,data.strength,data.speed,data.flex,data.swim,data.bike],
backgroundColor:"rgba(0,255,136,0.3)",
borderColor:"#00ff88"
}]
}

});

}

window.onload = function(){
load();
chart();
};
