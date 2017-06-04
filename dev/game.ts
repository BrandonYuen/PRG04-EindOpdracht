

class Game {
    
    private player:Player;
    private bullets:Array<Bullet>;
    private smokes:Array<Smoke>;
 
    constructor() {
        this.player = new Player(this,0,0);
        this.bullets = new Array<Bullet>();
        this.smokes = new Array<Smoke>();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    private gameLoop(){
        //Update all game objects
        this.player.update();

        for (let b of this.bullets){
            b.update();
        }

        for (let s of this.smokes){
            s.update();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    public addBullet(b:Bullet){
        this.bullets.push(b);
    }

    public removeBullet(b:Bullet){
        let i:number = this.bullets.indexOf(b);
        if(i != -1) {
            this.bullets.splice(i, 1);
        }
    }

    public addSmoke(s:Smoke){
        this.smokes.push(s);
    }

    public removeSmoke(s:Smoke){
        let i:number = this.smokes.indexOf(s);
        if(i != -1) {
            this.smokes.splice(i, 1);
        }
    }
} 

