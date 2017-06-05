

class Game {
    
    private player1:Player;
    private player2:Player;
    private bullets:Array<Bullet>;
    private smokes:Array<Smoke>;
 
    constructor() {
        this.player1 = new Player(this,1,150,window.innerHeight/2);
        this.player2 = new Player(this,2,window.innerWidth-150,window.innerHeight/2);
        this.bullets = new Array<Bullet>();
        this.smokes = new Array<Smoke>();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    private gameLoop(){
        //Update all game objects
        this.player1.update();
        this.player2.update();

        //Loop all bullets
        for (let b of this.bullets){
            b.update();
            
            //If bullet collides with player 1
            if (Util.doPolygonsIntersect(b._div, this.player1._div)){
                //If bullet is not from same player
                if (b.player.ID != this.player1.ID){
                    b.explode();
                }
            }
            
            //If bullet collides with player 2
            if (Util.doPolygonsIntersect(b._div, this.player2._div)){
                //If bullet is not from same player
                if (b.player.ID != this.player2.ID){
                    b.explode();
                }
            }
            
            //If bullet collides with another bullet
            for (let b2 of this.bullets){
                if (Util.doPolygonsIntersect(b._div, b2._div)){
                    //If bullet is not self
                    if ( this.bullets.indexOf(b) != this.bullets.indexOf(b2)){
                        b.explode();
                        b2.explode();
                    }
                }
            }
        }

        //Loop all smokes
        for (let s of this.smokes){
            s.update();
        }

        //TODO: Collision of players
        let collision = false;
        if (Util.doPolygonsIntersect(this.player1._div, this.player2._div)){
            collision = true;
        }

        console.log("collision = "+collision);

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

