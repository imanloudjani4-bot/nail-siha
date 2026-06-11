// طلب إذن التنبيهات
function requestPermissions() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            document.getElementById('setup-guide').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            renderMeds();
        }
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

function deleteMed(id) {
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    meds = meds.filter(m => m.id !== id);
    localStorage.setItem('myMeds', JSON.stringify(meds));
    renderMeds(); // تحديث القائمة فوراً
}

function renderMeds() {
    let list = document.getElementById('list');
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    list.innerHTML = meds.map(m => `
        <div class="med-item" style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; margin: 5px 0; border-radius: 8px; border: 1px solid #ddd;">
            <span>💊 <b>${m.name}</b> - ${m.time}</span>
            <button onclick="deleteMed(${m.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; width: auto;">حذف</button>
        </div>
    `).join('');
}

// دالة التنبيه
setInterval(() => {
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    let now = new Date();
    let currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                      now.getMinutes().toString().padStart(2, '0');

    meds.forEach(m => {
        if (m.time === currentTime) {
            new Notification("Nail Siha 💊", {
                body: "حان وقت تناول دواء: " + m.name,
                icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063189.png'
            });
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
        }
    });
}, 30000);

// عند فتح الصفحة، تأكد من عرض البيانات
window.onload = () => {
    if (Notification.permission === "granted") {
        document.getElementById('setup-guide').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }
    renderMeds();
};
