function requestPermissions() {
    Notification.requestPermission().then(() => {
        document.getElementById('setup-guide').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        renderMeds();
    });
}

function addMed() {
    let name = document.getElementById('medName').value;
    let time = document.getElementById('medTime').value;
    if(!name || !time) return alert("الرجاء إدخال اسم الدواء والوقت");
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    meds.push({ id: Date.now(), name: name, time: time });
    localStorage.setItem('myMeds', JSON.stringify(meds));
    document.getElementById('medName').value = "";
    renderMeds();
}

window.deleteMed = function(id) {
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    meds = meds.filter(m => m.id !== id);
    localStorage.setItem('myMeds', JSON.stringify(meds));
    renderMeds();
};

function renderMeds() {
    let list = document.getElementById('list');
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    list.innerHTML = meds.map(m => `
        <div class="med-item">
            <span>💊 ${m.name} - ${m.time}</span>
            <button class="delete-btn" onclick="deleteMed(${m.id})">حذف</button>
        </div>
    `).join('');
}

setInterval(() => {
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    let now = new Date();
    let time = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    meds.forEach(m => {
        if (m.time === time) {
            new Notification("Nail Siha", { body: "وقت الدواء: " + m.name });
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
        }
    });
}, 30000);

window.onload = () => {
    if (Notification.permission === "granted") {
        document.getElementById('main-app').style.display = 'block';
    } else {
        document.getElementById('setup-guide').style.display = 'block';
    }
    renderMeds();
};
