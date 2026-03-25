// Данные для имитации разных разделов
const contentData = {
    lectures: {
        title: "Лекции",
        files: [
            { name: "Lecture_01_Intro.pdf", size: "1.2 MB", date: "01.09.2025" },
            { name: "Lecture_04_Limits.pdf", size: "2.4 MB", date: "10.01.2026" }
        ]
    },
    labs: {
        title: "Лабораторные работы",
        files: [
            { name: "Lab_01_Report.docx", size: "450 KB", date: "15.09.2025" },
            { name: "Lab_02_Data.pdf", size: "3.1 MB", date: "20.09.2025" }
        ]
    },
    practicals: {
        title: "Практические занятия",
        files: [
            { name: "Practice_Set_1.pdf", size: "800 KB", date: "05.09.2025" }
        ]
    }
};

let currentTab = 'lectures';

// Мобильное меню
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const btn = document.querySelector('.mobile-menu-btn');
    nav.classList.toggle('active');
    btn.classList.toggle('active');
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.mobile-menu-btn').classList.remove('active');
    });
});

function switchTab(tabName) {
    currentTab = tabName;
    
    // Обновляем кнопки
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Обновляем заголовок
    document.getElementById('section-title').innerText = contentData[tabName].title;

    // Очищаем и перерисовываем список файлов
    const listContainer = document.getElementById('file-list');
    listContainer.innerHTML = '';
    
    contentData[tabName].files.forEach(file => {
        addFileToList(file.name, file.size, file.date);
    });

    // Сбрасываем превью
    document.getElementById('preview-container').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📄</div>
            <p>Выберите файл для предпросмотра</p>
            <small>Поддерживаются PDF и DOCX</small>
        </div>
    `;
}

function addFileToList(name, size, date) {
    const listContainer = document.getElementById('file-list');
    const div = document.createElement('div');
    div.className = 'file-item';
    
    // Иконка в зависимости от расширения
    const icon = name.endsWith('.pdf') ? '📄' : '📝';
    
    div.innerHTML = `
        <span class="file-icon">${icon}</span>
        <div class="file-info">
            <span class="file-name">${name}</span>
            <span class="file-meta">${size} • ${date}</span>
        </div>
        <button class="btn-sm" onclick="simulatePreview('${name}')">Открыть</button>
    `;
    listContainer.appendChild(div);
}

// Обработка загрузки файла
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // Добавляем в список визуально
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const date = new Date().toLocaleDateString('ru-RU');
    
    addFileToList(file.name, sizeMB, date);

    // Сразу открываем превью если это PDF
    if (file.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(file);
        showPDFPreview(fileURL);
    } else if (file.name.endsWith('.docx')) {
        alert("Предпросмотр DOCX недоступен в демо-режиме. Файл добавлен в список.");
    }
}

function simulatePreview(fileName) {
    // Имитация открытия файла из списка
    if (fileName.endsWith('.pdf')) {
        document.getElementById('preview-container').innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">📄</div>
                <h3>${fileName}</h3>
                <p style="margin-top: 10px; opacity: 0.8;">Здесь отображался бы PDF документ</p>
                <br>
                <small>(В полной версии здесь будет iframe с файлом)</small>
            </div>
        `;
    } else {
        alert("Открытие DOCX требует конвертации на сервере.");
    }
}

function showPDFPreview(url) {
    const container = document.getElementById('preview-container');
    container.innerHTML = `<embed src="${url}" type="application/pdf" width="100%" height="100%" />`;
}

// AI Chat функционал
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.querySelector('.ai-input');
    const aiBody = document.querySelector('.ai-body');
    
    if (aiInput && aiBody) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && aiInput.value.trim()) {
                const userMsg = document.createElement('div');
                userMsg.className = 'ai-msg';
                userMsg.style.background = '#4F46E5';
                userMsg.style.color = 'white';
                userMsg.style.alignSelf = 'flex-end';
                userMsg.style.marginLeft = 'auto';
                userMsg.style.maxWidth = '85%';
                userMsg.style.borderTopLeftRadius = '12px';
                userMsg.style.borderTopRightRadius = '2px';
                userMsg.innerText = aiInput.value;
                aiBody.appendChild(userMsg);
                aiInput.value = '';
                
                aiBody.scrollTop = aiBody.scrollHeight;

                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'ai-msg';
                    botMsg.innerText = "Интересный вопрос! Согласно конспекту, это связано с эпсилон-окрестностью...";
                    aiBody.appendChild(botMsg);
                    aiBody.scrollTop = aiBody.scrollHeight;
                }, 800);
            }
        });
    }
    
    // Загружаем дефолтные файлы для Лекций
    contentData.lectures.files.forEach(f => addFileToList(f.name, f.size, f.date));
});

// Закрытие мобильного меню при клике вне его
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-menu');
    const btn = document.querySelector('.mobile-menu-btn');
    
    if (!nav.contains(e.target) && !btn.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        btn.classList.remove('active');
    }
});

// Обработка изменения размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            document.querySelector('.nav-menu').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
        }
    }, 250);
});