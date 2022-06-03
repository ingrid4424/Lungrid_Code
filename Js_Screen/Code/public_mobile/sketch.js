let socket = io();


let screens = [];
let screenChange = 0;

let userName;

let input = {
    bodyElement: document.querySelector('body'),

    getInput: function () {
        //Create a HTML element
        let div = document.createElement('div');
        div.className = "controls-container"
        //fill it up
        div.innerHTML = `
            <input id="input_name"></button>`;


        return div;

    },

    render: function () {
        this.bodyElement.appendChild(this.getInput());
    }

};

let button = {
    bodyElement: document.querySelector('body'),

    getButton: function () {
        //Create a HTML element
        let div = document.querySelector('body');
        //fill it up
        let btnCreate = document.createElement('button');
        btnCreate.innerHTML = 'Continuar'
        btnCreate.id = 'btn_putName';

        div.appendChild(btnCreate)
        let btn = document.querySelector('#btn_putName');

        btn.addEventListener('click', (e) => {
            console.log("Hello from button");
            this.onButton();
        });

        return div;

    },

 

};

(function controller (button){

    button.onButton = () => {
        console.log("Hello from controler");
        let input = document.getElementById('input_name');
        let btn = document.getElementById('btn_putName');
        
        sendPlayer(input.value);
        input.style.display = 'none';
        btn.style.display = 'none';
       
    }


    if(screenChange === 0){
        button.getButton();
    }


    

})(button);

(function controller (input){

    if(screenChange === 0){
        input.render();
        console.log('Hello from controller');
        
    }

})(input);

function sendPlayer(userNa){
    
    socket.emit('user',userNa);
    userName = userNa;
    screenChange = 1;
}


function preload(){
    screens[0] = loadImage("assets/screen0.png");
    screens[1] = loadImage("assets/screen1.png");
}

function setup(){
     createCanvas(windowWidth, windowHeight);
}

function draw(){
    background(0);

    
    image(screens[screenChange],0,0,windowWidth, windowHeight);

    if(screenChange === 1){
        fill(0);
        textSize(40);
        text(userName, innerWidth/2-40, 150);
    }
}
