let data = JSON.parse(localStorage.getItem("itf8")) || {
sessions:[]
};

// =====================
// NAVIGATION
// =====================

function show(page){

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));

document.getElementById(page).classList.add("active");

update();
}

// =====================
// SAVE SESSION
// =====================

function save(){

let session = {
date:new Date().toLocaleDateString(),
forms:+forms.value,
sparring:+sparring.value,
strength:+strength.value,
speed:+speed.value,
flex:+flex.value,
endurance:+endurance.value,
notes:notes.value
};

data.sessions.push(session);

localStorage.setItem("itf8", JSON.stringify(data));

update();
drawChart();
}

// =====================
// IA COACH REAL
// =====================

function ai(){

if(data.sessions.length === 0) return "Sin datos";

let last = data.sessions[data.sessions.length - 1];

let load =
last.forms + last.sparring + last.strength +
last.speed + last.flex + last.endurance;

if(load < 40) return "🟡 Baja carga";
if(load < 80) return "⚖️ Óptimo";
return "🔥 Alta carga";

}

// =====================
// CHART EVOLUCIÓN
// =====================

function drawChart(){

let values = data.sessions.map(s=>
s.forms + s.sparring + s.strength +
s.speed + s.flex + s.endurance
);

new Chart(chart,{

type:"line",

data:{
labels:data.sessions.map(s=>s.date),
datasets:[{
label:"Progreso",
data:values,
borderColor:"#00ff99"
}]
}

});

}

// =====================
// HISTORIAL
// =====================

function history(){

let div = document.getElementById("list");

div.innerHTML = "";

data.sessions.slice().reverse().forEach(s=>{

div.innerHTML += `
<div class="card">
📅 ${s.date}<br>
🥋 ${s.forms} | 🥊 ${s.sparring}<br>
💪 ${s.strength} | ⚡ ${s.speed}<br>
🤸 ${s.flex} | 🏃 ${s.endurance}<br>
📝 ${s.notes || "Sin notas"}
</div>
`;

});

}

// =====================
// UPDATE
// =====================

function update(){

document.getElementById("ai").innerText = ai();

history();
}

// =====================

window.onload = update;
