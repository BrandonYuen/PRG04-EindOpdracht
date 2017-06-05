/// <reference path="gameObject.ts" />

class Bullet extends GameObject {
    
    private speed:number;
    public player:Player;

    constructor(g:Game, p:Player) {
        super(g, p.x, p.y)
        this.angle = p.angle;
        this.speed = 10;
        this.player = p;
        
        //Element
        this._div = document.createElement("bullet");
        document.body.appendChild(this._div);
        this.rect = this._div.getBoundingClientRect();      

        //Corners
        Util.addCollisionCorners(this._div);

        //Difference between player 1 and 2
        if (p.ID == 1){
            this._div.classList.add('bullet1'); 
        }else{
            this._div.classList.add('bullet2'); 
        }
        
        //Get x and y coordinates of center of player
        let middleCoords = Util.getMiddleOfRect(p.rect, p.angle);
        this.x = middleCoords[0] - this.rect.width/2
        this.y = middleCoords[1] - this.rect.height/2

        //Sound effect
        let shootSound = new Audio();
        shootSound.autoplay = true;
        shootSound.src = shootSound.canPlayType('audio/mp3') ? 'media/tankShoot.wav': '';

        this.update();
    }

    public update():void {
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px) rotate("+this.angle+"deg)";

        //Remove when bullet is out of screen
        if (this.x > window.innerWidth-30 || this.x < 0){
            this.explode();
        }else if (this.y > window.innerHeight-30 || this.y < 0){
            this.explode();
        }
    }

    public explode():void{
        //Explosion effect
        let explodeSound = new Audio();
        explodeSound.autoplay = true;
        explodeSound.src = explodeSound.canPlayType('audio/mp3') ? 'media/explosion.wav': '';
        this.kill();
    }

    public kill():void{
        this.game.removeBullet(this);
        document.body.removeChild(this._div);
    }

}