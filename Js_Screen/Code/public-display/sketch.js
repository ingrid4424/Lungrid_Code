let socket = io();
let game_screen, characterImg, table;
let count = 0;
const element = document.querySelector('body');
element.addEventListener('click', () => {
    count++;
    socket.emit('leds', 1);
});


let character = {
    x: 500,
    y: 500,
    size: 50
};

let result = {
    timeplay: 0,
    isWin: false,
    isRedeem: false,
}

let itemsAdquired = {
    cucumber: false,
    chopsticks: false,
    egg: false,
    mushroom: false,
    noodle: false,
    rice: false,
    rice_two: false,
    shrimp: false,
}

let arrayIngredients = [];


let imgObject = {
}

let pauseGame = false;
let pause = false;

let completed = 0;


let timer;
let score = 3;

let screenStatus = 0;
let screenBg = [];

let topScreen = [];

let pause_game_screen;
let isGame = false;

let winSound, failSound, gameSound;
let isSoundWin = false;
let isSoundFail = false;
let isSoundGame = false;

function preload() {
    //pantallas
    screenBg[0] = loadImage("assests/screen1.png");
    screenBg[1] = loadImage("assests/screen2.png");
    screenBg[2] = loadImage("assests/screen3.png");
    screenBg[3] = loadImage("assests/screen4.png");
    screenBg[4] = loadImage("assests/screen5.png");
    screenBg[5] = loadImage("assests/game_screen.png");
    screenBg[6] = loadImage("assests/screen8.png");
    screenBg[7] = loadImage("assests/screen9.png");

    topScreen[0] = loadImage("assests/front_version.png");
    topScreen[1] = loadImage("assests/front_version_2.png");

    winSound = loadSound("assests/win_game.wav");
    failSound = loadSound("assests/lost_game.wav");
    gameSound = loadSound("assests/game_sound.wav");


    pause_game_screen = loadImage("assests/pause_game_screen.png");
    characterImg = loadImage("assests/character.png");
    table = loadImage("assests/table.png");
    //img items
    imgObject.cucumber = loadImage("assests/Cucumber.png");
    imgObject.chopsticks = loadImage("assests/ChopSticks.png");
    imgObject.egg = loadImage("assests/Egg.png");
    imgObject.mushroom = loadImage("assests/Mushroom.png");
    imgObject.noodle = loadImage("assests/Noodles.png");
    imgObject.rice = loadImage("assests/Rice.png");
    imgObject.rice_two = loadImage("assests/Rice_TWO.png");
    imgObject.shrimp = loadImage("assests/Shrimp.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    character.x = windowWidth / 2;
    character.y = windowHeight / 2;
    timer = 60
        ;
    //items recogibles iniciales
    for (let index = 0; index < 3; index++) {
        arrayIngredients.push(new Ingredients(this, "assests/Egg.png", Math.random() * windowWidth, -500, Math.random() * 5, 20, "egg"));
        arrayIngredients.push(new Ingredients(this, "assests/Chopsticks.png", Math.random() * windowWidth, -500, Math.random() * 5, 5, "chopsticks"));
        arrayIngredients.push(new Ingredients(this, "assests/Mushroom.png", Math.random() * windowWidth, -500, Math.random() * 5, 15, "mushroom"));
        arrayIngredients.push(new Ingredients(this, "assests/Noodles.png", Math.random() * windowWidth, -500, Math.random() * 5, 20, "noodle"));
        arrayIngredients.push(new Ingredients(this, "assests/Cucumber.png", Math.random() * windowWidth, -500, Math.random() * 5, 5, "cucumber"));
        arrayIngredients.push(new Ingredients(this, "assests/Rice.png", Math.random() * windowWidth, -500, Math.random() * 5, 15, "rice"));
        arrayIngredients.push(new Ingredients(this, "assests/Rice_TWO.png", Math.random() * windowWidth, -500, Math.random() * 5, 15, "rice_two"));
        arrayIngredients.push(new Ingredients(this, "assests/Shrimp.png", Math.random() * windowWidth, -500, Math.random() * 5, 15, "shrimp"));
    }

    userStartAudio();

}

function draw() {

    background(0, 10);
    fill(255);
    noStroke();
    //pintar las pantallas
    image(screenBg[screenStatus], 0, 0, windowWidth, windowHeight);
    //pintar el juego
    if (!pauseGame && isGame && screenStatus === 5) {

        if (!isSoundGame) {
            gameSound.play();
            gameSound.loop();
            isSoundGame = true;
        }

        arrayIngredients.forEach(ingre => {
            ingre.paint();
            ingre.move();
        })

        if (Object.values(itemsAdquired).every(el => el === true)) {
            image(topScreen[1], 0, 0, windowWidth, windowHeight);
        } else {
            image(topScreen[0], 0, 0, windowWidth, windowHeight);

        }


        image(characterImg, character.x, character.y, 90, 90);

        //pinta la barra de completadso
        fill(255);
        rect(230, 27, 8 * 50 + 0, 71, 35)
        fill(255, 0, 0);
        rect(230, 27, completed * 50 + 0, 71, 35);


        image(table, 230, 10, 100, 100)

        fill(255);
        textSize(40);
        text(timer, windowWidth - (windowWidth / 6), 95);



        ingredientsWithTakes();

        deletedItemsAndScore();

        timerGone();
        //mover objetos

    }
    //imagen de pausa
    if (pauseGame && isGame && screenStatus === 5) {
        image(pause_game_screen, 0, 0, windowWidth, windowHeight);

    }







    gameOver();

    hardMode();
}

//permite mover el personake
socket.on('positions', (positions) => {

    character.x = map(positions.x, 0, 1023, 100, windowWidth - 100);
    character.y = map(positions.y, 0, 1023, windowHeight - 400, windowHeight - 100);
});

//literal aqui se hacen todas las funciones con el boton
socket.on('nextScreen', (nextScreen) => {
    //pasar pantallas
    if (nextScreen === 1 && screenStatus > 0 && screenStatus < 5) {
        screenStatus += nextScreen
    }



});

socket.on('startScreen', (startsScreen) => {
    if (startsScreen === 1 && screenStatus === 0) {
        screenStatus += startsScreen
    }

    if (startsScreen === 1 && screenStatus === 2) {
        screenStatus += startsScreen
    }

    //inicar el juego
    if (screenStatus === 5) {
        isGame = true;


    }
    //quitar la pausa
    if (screenStatus === 5 && pauseGame && startsScreen === 1) {
        pauseGame = false;
    }
})



function ingredientsWithTakes() {
    //pinta la lista de ingredietes faltantes por tomar
    for (const key in itemsAdquired) {
        if (!itemsAdquired[key]) {
            image(imgObject[key], 250, 20, 80, 80);
        }
    }
}

function deletedItemsAndScore() {
    arrayIngredients.forEach((item, index) => {
        //valida si el item no ha sido escogido y suma un puntaje
        if (dist(character.x, character.y, item.posX, item.posY) < 70) {
            //item no tomado antes
            if (!itemsAdquired[item.name]) {
                itemsAdquired[item.name] = true;
                completed++;

                arrayIngredients.splice(index, 1);
            } else {
                //item ya tomado

                arrayIngredients.splice(index, 1);
            }



        }
    })
}

function timerGone() {
    //hace que el contador baje y suma puntaje por sobrevivir
    if (frameCount % 60 === 0) {
        timer -= 1;
        result.timeplay +=1
    }

}

function gameOver() {
    if (timer <= 0) {
        //evalua los posibles finales
        if (Object.values(itemsAdquired).every(el => el === true) && score > 0) {
            //gano el jugador
            screenStatus = 6;
            result.isWin = true;
            window.location.href = "/form";
            socket.emit('result',result)
            //gameSound.stop();
            //no funciona por el momento ya que se ejecuta en loop, probando arreglarlo
            if (!isSoundWin) {
                gameSound.stop();
                isSoundWin = true;
                winSound.play();
            }


        } else {
            //perdio el jugador
            screenStatus = 7;
            result.isWin = false;
            window.location.href = "/form";
            socket.emit('result',result)
            //gameSound.stop();
            //no funciona por el momento ya que se ejecuta en loop, probando arreglarlo
            if (!isSoundFail) {
                gameSound.stop();
                isSoundFail = true;
                failSound.play();
            }




        }
    }

}

//se activa cuando se recogen todos los items 


function hardMode() {
    //activa la pausa momentanea antes de lfinal
    if (Object.values(itemsAdquired).every(el => el === true) && !pause) {
        pauseGame = true;
        pause = true;
        timer = 15;
    }
    if (Object.values(itemsAdquired).every(el => el === true) && screenStatus === 5) {
        //despliega más iitems y la nueva velocidad de los items
        if (!pauseGame) {

            text("Sobrevive", 360, 65);
            if (frameCount % 240 === 0) {
                arrayIngredients.push(new Ingredients(this, "assests/Egg.png", Math.random() * windowWidth, -500, Math.random() * 5, 20, "egg"));
                arrayIngredients.push(new Ingredients(this, "assests/Chopsticks.png", Math.random() * windowWidth, -500, Math.random() * 5, 5, "chopsticks"));
                arrayIngredients.push(new Ingredients(this, "assests/Mushroom.png", Math.random() * windowWidth, -500, Math.random() * 5, 15, "mushroom"));
                arrayIngredients.push(new Ingredients(this, "assests/Noodles.png", Math.random() * windowWidth, -500, Math.random() * 5, 20, "noodle"));
            }
            arrayIngredients.forEach(item => item.vel = 8);
            arrayIngredients.forEach(item => item.value = 5);
            for (let index = 0; index < score; index++) {
                ellipse(windowWidth - (windowWidth / 5) + (index * 45), 205, 40, 40);

            }
            arrayIngredients.forEach((item, index) => {
                if (dist(character.x, character.y, item.posX, item.posY) < 40) {

                    arrayIngredients.splice(index, 1);
                    score = -1;

                }
            });


        }

    }
}

