let sessions = JSON.parse(localStorage.getItem("sessions")) || [];

// =====================
// GUARDAR SESIÓN
// =====================

function saveSession(){

let session = {
date: new Date().toLocaleDateString(),
forms:+forms.value,
sparring:+sparring.value,
strength:+strength.value,
speed:+speed.value,
flex:+flex.value,
endurance:+endurance.value
};

sessions.push(session);

localStorage.setItem("sessions", JSON.stringify(sessions));

update();
drawChart();
}

// =====================
// IA COACH
// =====================

function ai(){

if(sessions.length === 0){
return "Sin datos aún";
}

let last = sessions[sessions.length - 1];

let load =
last.forms + last.sparring + last.strength +
last.speed + last.flex + last.endurance;

if(load < 40) return "🟡 Baja carga";
if(load < 80) return "⚖️ Óptimo";
return "🔥 Alta carga (cuidado)";
}

// =====================
// HISTORIAL
// =====================

function updateHistory(){

let div = document.getElementById("history");

div.innerHTML = "";

sessions.slice().reverse().forEach(s=>{

div.innerHTML += `
<div class="session">
📅 ${s.date}<br>
🥋 Forms: ${s.forms} | 🥊 Sparring: ${s.sparring}<br>
💪 Fuerza: ${s.strength} | ⚡ Velocidad: ${s.speed}<br>
🤸 Flex: ${s.flex} | 🏃 Resistencia: ${s.endurance}
</div>
`;
});
}

// =====================
// GRAFICO REAL (EVOLUCIÓN)
// =====================

function drawChart(){

let labels = sessions.map(s=>s.date);

let data = sessions.map(s=>
s.forms + s.sparring + s.strength +
s.speed + s.flex + s.endurance
);

new Chart(chart,{

type:"line",

data:{
labels:labels,
datasets:[{
label:"Progreso total",
data:data,
borderColor:"#00ff99"
}]
}
});
}

// =====================
// UI UPDATE
// =====================

function update(){

document.getElementById("aiMessage").innerText = ai();

updateHistory();
}

// =====================

window.onload = function(){
update();
drawChart();
};
