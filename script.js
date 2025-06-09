// Variáveis globais para controlar o cronômetro
let currentTime = 0; // Tempo atual em segundos
let isRunning = false; // Se o cronômetro está rodando
let lastRecordedTime = 0; // Último tempo que foi resetado
let intervalId = null; // ID do setInterval para poder parar depois

// Elementos do DOM - pego eles uma vez só no início para performance
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const lastTimeSection = document.getElementById('lastTimeSection');
const lastTimeValue = document.getElementById('lastTimeValue');

// Função para formatar o tempo - aprendi que é melhor separar a lógica
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
    };
}

// Função para atualizar o display do tempo na tela
function updateDisplay() {
    const time = formatTime(currentTime);
    hoursElement.textContent = time.hours;
    minutesElement.textContent = time.minutes;
    secondsElement.textContent = time.seconds;
}

// Função para atualizar o status visual (rodando/pausado)
function updateStatus() {
    if (isRunning) {
        statusDot.classList.add('running');
        statusText.textContent = 'Em execução';
        
        // Muda o botão para "Parar"
        startStopBtn.classList.add('stop');
        startStopBtn.innerHTML = '<i data-lucide="pause"></i><span>Parar</span>';
    } else {
        statusDot.classList.remove('running');
        statusText.textContent = 'Pausado';
        
        // Muda o botão para "Iniciar"
        startStopBtn.classList.remove('stop');
        startStopBtn.innerHTML = '<i data-lucide="play"></i><span>Iniciar</span>';
    }
    
    // Atualiza os ícones do Lucide (necessário após mudar o HTML)
    lucide.createIcons();
}

// Função principal do cronômetro - roda a cada segundo
function tick() {
    currentTime++;
    updateDisplay();
}

// Função para iniciar o cronômetro
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // setInterval executa a função tick a cada 1000ms (1 segundo)
        intervalId = setInterval(tick, 1000);
        updateStatus();
    }
}

// Função para parar o cronômetro
function stopTimer() {
    if (isRunning) {
        isRunning = false;
        // clearInterval para a execução do setInterval
        clearInterval(intervalId);
        intervalId = null;
        updateStatus();
    }
}

// Função para resetar o cronômetro
function resetTimer() {
    // Para o cronômetro se estiver rodando
    stopTimer();
    
    // Salva o tempo atual como último tempo registrado (se for maior que 0)
    if (currentTime > 0) {
        lastRecordedTime = currentTime;
        const lastTime = formatTime(lastRecordedTime);
        lastTimeValue.textContent = `${lastTime.hours}:${lastTime.minutes}:${lastTime.seconds}`;
        lastTimeSection.style.display = 'block'; // Mostra a seção do último tempo
    }
    
    // Zera o tempo atual
    currentTime = 0;
    updateDisplay();
    updateStatus();
}

// Event listeners - aqui conecto as funções aos cliques dos botões
startStopBtn.addEventListener('click', function() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

// Inicialização - roda quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones do Lucide
    lucide.createIcons();
    
    // Atualiza o display inicial
    updateDisplay();
    updateStatus();
    
    console.log('Cronômetro inicializado com sucesso! 🚀');
});

// Função extra: limpar interval se o usuário sair da página
// Isso evita memory leaks - aprendi que é uma boa prática
window.addEventListener('beforeunload', function() {
    if (intervalId) {
        clearInterval(intervalId);
    }
});