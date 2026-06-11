// عند تحميل الصفحة، نتحقق من الإذن
window.onload = () => {
    if (Notification.permission !== "granted") {
        document.getElementById('setup-guide').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    }
};

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

// دالة الفحص (تظل كما هي لتعمل في الخلفية النشطة)
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
            // الصوت يعمل في الخلفية إذا كان التطبيق نشطاً
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
        }
    });
}, 30000);

function renderMeds() {
    let list = document.getElementById('list');
    let meds = JSON.parse(localStorage.getItem('myMeds') || '[]');
    list.innerHTML = meds.map(m => `
        <div class="med-item">
            <span>💊 <b>${m.name}</b><br> الساعة: ${m.time}</span>
            <button class="delete-btn" onclick="deleteMed(${m.id})">حذف</button>
        </div>
    `).join('');
}