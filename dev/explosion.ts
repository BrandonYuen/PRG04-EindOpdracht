/// <reference path="gameObject.ts" />

class Explosion extends GameObject {

    constructor(g:Game, rect:ClientRect, angle:number) {
        super(g, rect.left, rect.top)
        
        this._div = document.createElement("explosion");
        document.body.appendChild(this._div);
        this.rect = this._div.getBoundingClientRect();
        
        //Get x and y coordinates of center of player
        let middleCoords = Util.getMiddleOfRect(rect, angle);
        console.log("middleCoords = "+middleCoords);
        this.x = middleCoords[0] - this.rect.width/2
        this.y = middleCoords[1] - this.rect.height/2
        console.log("x = "+this.x);
        console.log("y = "+this.y);
        
        //Explosion effect
        let explodeSound = new Audio();
        explodeSound.autoplay = true;
        explodeSound.src = explodeSound.canPlayType('audio/mp3') ? 'media/explosion.wav': '';
        explodeSound.volume=.5;

        //Timer to remove smoke after animation
        setTimeout(() => this.kill(), 800);

        this.update();
    }

    public update():void {
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px)";
    }

    public kill():void{
        document.body.removeChild(this._div);
        this.game.removeExplosion(this);
    }

}