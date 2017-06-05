

class Game {
    
    public players:Array<Player>;
    public scores:Array<HTMLElement>;
    private bullets:Array<Bullet>;
    private smokes:Array<Smoke>;
    private explosions:Array<Explosion>;
 
    constructor() {
        this.players = new Array<Player>();
        this.bullets = new Array<Bullet>();
        this.smokes = new Array<Smoke>();
        this.explosions = new Array<Explosion>();
        this.scores = new Array<HTMLElement>();
        
        //Place start screen overlay (shadow)
        let startscreen = document.createElement("startscreen");
        document.body.appendChild(startscreen);

        //Place start button and add event listener
        let controls = document.createElement("controls");
        document.body.appendChild(controls);

        //Place footer text (credits)
        let footer = document.createElement("footer");
        document.body.appendChild(footer);
        footer.innerHTML = "Created By: Brandon Yuen";

        //Place start button and add event listener
        let startButton = document.createElement("startbutton");
        document.body.appendChild(startButton);
        startButton.innerHTML = "START";
        startButton.addEventListener("click", () => this.startGame(startscreen, controls, startButton, footer));
    }

    private startGame(startscreen:HTMLElement, controls:HTMLElement, startButton:HTMLElement, footer:HTMLElement){
        document.body.removeChild(startscreen);
        document.body.removeChild(controls);
        document.body.removeChild(startButton);
        document.body.removeChild(footer);

        //Place scoreboard for player 1
        this.scores[0] = document.createElement("scoreboard");
        document.body.appendChild(this.scores[0]);
        this.scores[0].classList.add("p1score");

        //Place scoreboard for player 2
        this.scores[1] = document.createElement("scoreboard");
        document.body.appendChild(this.scores[1]);
        this.scores[1].classList.add("p2score");

        //Create players
        this.players.push(new Player(this,1,150,window.innerHeight/2));
        this.players.push(new Player(this,2,window.innerWidth-150,window.innerHeight/2));
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    private gameLoop(){

        //Loop all bullets
        for (let b of this.bullets){
            b.update();

            //Loop all players
            for (let p of this.players){
                //If bullet collides with a player
                if (Util.doPolygonsIntersect(b._div, p._div)){
                    //If bullet is not from same player
                    if (b.player.ID != p.ID){
                        b.kill();
                        this.addExplosion(new Explosion(this, p.rect, p.angle));
                        p.respawn();
                        b.player.succesfullHit();
                    }
                }
            }
            
            //If bullet collides with another bullet
            for (let b2 of this.bullets){
                if (Util.doPolygonsIntersect(b._div, b2._div)){
                    //If bullet is not self
                    if ( this.bullets.indexOf(b) != this.bullets.indexOf(b2)){
                        console.log("2 bullets collide");
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

        //Loop all smokes
        for (let e of this.explosions){
            e.update();
        }

        //Loop all players
        for (let p of this.players){
            p.update();

            //Check if winner
            if (p.score >= 10){
                this.showWinner(p);
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    //Show a winner on screen
    private showWinner(p:Player){
        //Kill all players
        for (let p of this.players){
            p.kill();
        }
        //Kill all bullets
        for (let b of this.bullets){
            b.kill();
        }
        
        //Place start screen overlay (shadow)
        let winner = document.createElement("winner");
        document.body.appendChild(winner);
        winner.innerHTML = "THE WINNER IS:<br>Player "+p.ID;
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

    public addExplosion(e:Explosion){
        this.explosions.push(e);
    }

    public removeExplosion(e:Explosion){
        let i:number = this.explosions.indexOf(e);
        if(i != -1) {
            this.explosions.splice(i, 1);
        }
    }

    public removePlayer(p:Player){
        let i:number = this.players.indexOf(p);
        if(i != -1) {
            this.players.splice(i, 1);
        }
    }
} 

