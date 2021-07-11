let cvs = document.getElementById("canvas")
let ctx = cvs.getContext("2d")

//Объявление объектов
let brain = new Image()
let background = new Image()
let foreground = new Image()
let neuronUp = new Image()
let neuronBottom = new Image()

//Указывание пути для изображений объектов
brain.src = "img/brain.png"
background.src = "img/background.png"
foreground.src = "img/foreground.png"
neuronUp.src = "img/neuronUp.png"
neuronBottom.src = "img/neuronBottom.png"

//Звуковые файлы
let fly = new Audio()
let scoreAudio = new Audio()

fly.src = "audio/fly.mp3"
scoreAudio.src = "audio/score.mp3"

//Расстояние между нейронами
let gap = 90
let constant = neuronUp.height + gap

//Управление
document.addEventListener("keydown", moveUp)

//Скорость подъема мозга
function moveUp() {
    yPos -= 40
    fly.play()
}

//Создание блоков
let neuron = []
neuron[0] = {
    x: cvs.width,
    y: 0
}

//Параметры мозга
let xPos = 10
let yPos = 150
let gravity = 1.5
let score = 0

function draw() {
    ctx.drawImage(background, 0, 0)

    for (let i = 0; i < neuron.length; i++) {
        ctx.drawImage(neuronUp, neuron[i].x, neuron[i].y)
        ctx.drawImage(neuronBottom, neuron[i].x, neuron[i].y + constant)

        neuron[i].x--

        //Автоматическое создание труб
        if (neuron[i].x == 125) {
            neuron.push({
                x: cvs.width,
                y: Math.floor(Math.random() * neuronUp.height) - neuronUp.height
            })
        }

        // Отслеживание прикосновений
        if (xPos + brain.width >= neuron[i].x && xPos <= neuron[i].x + neuronUp.width && (yPos <= neuron[i].y + neuronUp.height || yPos + brain.height >= neuron[i].y + constant) || yPos + brain.height >= cvs.height - foreground.height) {
            location.reload()
        }

        //Счетчик очков
        if (neuron[i].x == 5) {
            score++
            scoreAudio.play()
        }
    }

    ctx.drawImage(foreground, 0, cvs.height - foreground.height)
    ctx.drawImage(brain, xPos, yPos)

    yPos += gravity

    ctx.fillStyle = "#000"
    ctx.font = "24px Inter"
    ctx.fillText("Счет: " + score, 10, cvs.height - 20)

    requestAnimationFrame(draw)
}

neuronBottom.onload = draw

//----------------------------------------------------------------------------------------------

var neuroplay = null;

function bci(data) {
    //В этой функции необходимо преобразовывать входящий сигнал (медитацию ИЛИ концентрацию) 
    //и превращать его в управляющее воздействие
    //data.meditation и data.concentration лежат в диапазоне от 0 до 100

    $("#med").html(data.meditation + "%");
    $("#con").html(data.concentration + "%");
}

$(function () {
    //Этот код выполняет подключение к ПО NeuroPlay
    //10 раз в секунду запрашивает состояние нейроинтерфейса (медитацию, концентрацию и т.д.) 
    neuroplay = new NeuroplayConnector();
    neuroplay.connect();
    neuroplay.on('bci', bci);
    setInterval(function () {
        neuroplay.send('bci');
    }, 100);
});