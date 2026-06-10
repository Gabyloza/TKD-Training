let data = JSON.parse(localStorage.getItem("tornado11")) || {
sessions:[]
};

// =====================
// SAVE
// =====================

function save(){

let session = {
date:new Date().toLocaleDateString(),

energy:+energy.value,
motivation:+motivation.value,
fatigue:+fatigue.value,

forms:+forms.value,
sparring:+sparring.value,
strength:+strength.value,
speed:+speed.value,
flex:+flex.value,
endurance:+endurance.value,

notes:notes.value
};

data.sessions.push(session);

localStorage.setItem("tornado11", JSON.stringify(data));

update();
draw();
}

// =====================
// IA HUMANA REAL
// =====================

function humanAI(){

if(data.sessions.length === 0)
return "Aún no tengo datos suficientes sobre tu rendimiento real.";

let last = data.sessions[data.sessions.length - 1];

let physical =
last.forms + last.sparring + last.strength +
last.speed + last.flex + last.endurance;

let feeling =
last.energy - last.fatigue + last.motivation;

// lógica humana (no matemática fría)
let msg = "";

if(feeling < 3){
msg = "Hoy estás bajo de energía. Mejor técnica suave o descanso activo.";
}
else if(feeling < 10){
msg = "Estás en un estado normal. Entrenamiento equilibrado recomendado.";
}
else{
msg = "Estás en buen estado. Podés subir intensidad sin problema.";
}

if(last.fatigue >= 8){
msg += " ⚠️ Estás acumulando fatiga alta.";
}

if(last.speed < 20){
msg += " ⚡ Tu velocidad está bajando, cuidala.";
}

return msg;
}

// =====================
// HISTORIAL
// =====================

function history(){

let div = document.getElementById("history");

div.innerHTML = "";

data.sessions.slice().reverse().forEach(s=>{

div.innerHTML += `
<div class="card">
📅 ${s.date}<br>
⚡ Energía: ${s.energy} | 🔥 Motivación: ${s.motivation}<br>
🥋 Forms: ${s.forms} | 🥊 Sparring: ${s.sparring}<br>
💪 Fuerza: ${s.strength} | ⚡ Velocidad: ${s.speed}<br>
🤸 Flex: ${s.flex} | 🏃 Resistencia: ${s.endurance}<br>
📝 ${s.notes}
</div>
`;
});

}

// =====================
// GRAFICO HUMANO
// =====================

function draw(){

let values = data.sessions.map(s=>
(s.energy + s.motivation) - s.fatigue
);

new Chart(chart,{
type:"line",
data:{
labels:data.sessions.map(s=>s.date),
datasets:[{
label:"Estado humano",
data:values,
borderColor:"#00ff99"
}]
}
});
}

// =====================
// UPDATE
// =====================

function update(){

document.getElementById("humanAI").innerText = humanAI();

history();
}

// =====================

window.onload = update;
