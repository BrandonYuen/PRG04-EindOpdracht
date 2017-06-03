

class Game {
    
    private player:Player;
    private bullets:Array<Bullet>;
 
    constructor() {
        this.player = new Player(this,50,50);
        this.bullets = new Array<Bullet>();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    private gameLoop(){

        this.player.update();

        for (let b of this.bullets){
            //b.move();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    public addBullet(b:Bullet){
        this.bullets.push(b);
        console.log(this.bullets);
    }
} 

