class Ingredients {
    constructor(app,imgItem, posX, posY, vel, value, name){
        this.app = app;
        this.imgItem = this.app.loadImage(imgItem);
        this.posX = posX;
        this.posY = posY;
        this.vel = vel;
        this.value = value;
        this.name = name;
    }

    paint(){
        this.app.image(this.imgItem,this.posX,this.posY);
    }

    move(){
        this.posY+=this.vel;

        if(this.posY>900){
            this.posY = 150;
        }
    }
}