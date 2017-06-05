
class Player extends GameObject {

    public ID:number;
    private moveSpeed:number;
    private rotateSpeed:number;
    private keyLeft:boolean;
    private keyRight:boolean;
    private keyDown:boolean;
    private keyUp:boolean;
    private forwardSpeed:number;
    private backwardSpeed:number;
    private previousx:number;
    private previousy:number;
    private previousangle:number;
    public score:number;
    private canshoot:boolean;
    private respawnX:number;
    private respawnAngle:number;

    constructor(g:Game, id:number, x:number, y:number) {
        super(g, x, y);
        //ID
        this.ID = id;

        //Element
        this._div = document.createElement("player");
        document.body.appendChild(this._div);
        this.rect = this._div.getBoundingClientRect();    

        //Set in middle of screen with random y
        this.x = this.x - this.rect.width/2;
        this.y = Math.floor((Math.random() * window.innerHeight-300) + 200);

        //Set angle
        this.angle = 0;
        if (this.ID == 2){this.angle = 180;} // Player 2 angle

        //Other values
        this.moveSpeed = 3;
        this.rotateSpeed = 5;
        this.keyLeft = false;
        this.keyRight = false;
        this.keyDown = false;
        this.keyUp = false;
        this.forwardSpeed = 0;
        this.backwardSpeed = 0;
        this.score = 0;
        this.canshoot = true;
        this.respawnX = this.x;
        this.respawnAngle = this.angle;

        //Listeners
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e));

        //Corners
        Util.addCollisionCorners(this._div);

        //Difference between player 1 and 2
        if (this.ID == 1){
            this._div.classList.add('player1'); 
        }else{
            this._div.classList.add('player2'); 
        }

        this.update();
    }

    public shoot():void{
        //Disable shooting
        this.canshoot = false;

        this.game.addBullet(new Bullet(this.game, this));
        this.game.addSmoke(new Smoke(this.game, this.rect, this.angle));
        this.backwardSpeed = 3;

        //Enable shooting after x time
        setTimeout(() => this.canshoot=true, 1500);
    }

    public succesfullHit():void{
        this.score += 1;
        this.updateScore();
    }

    public updateScore():void{
        //Player 1
        if (this.ID == 1){
            this.game.scores[0].innerHTML = "<b>PLAYER 1</b><br>Score: "+this.score+"<br>Can Shoot: "+this.canshoot;
        }else{
            this.game.scores[1].innerHTML = "<b>PLAYER 2</b><br>Score: "+this.score+"<br>Can Shoot: "+this.canshoot;
        }
    }
    public respawn():void{
        this.x = this.respawnX;
        this.y = Math.floor((Math.random() * window.innerHeight-300) + 200);
        this.forwardSpeed = 0;
        this.backwardSpeed = 0;
        this.angle = this.respawnAngle;
    }
    
    public update():void {
        //Update rectangle
        this.rect = this._div.getBoundingClientRect();

        //Update forward/backward speed values
        this.updateSpeed();

        //Update score of player
        this.updateScore();

        //Save current position
        this.previousx = this.x;
        this.previousy = this.y;
        this.previousangle = this.angle;

        //New postion based on current foward/backward speed of player
        this.x += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.x -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);

        //New angle if rotating
        if (this.keyRight == true){
            this.angle += this.rotateSpeed;
        }
        if (this.keyLeft == true){
            this.angle -= this.rotateSpeed;
        }

        //Checking if this(p) is colliding with any OTHER player
        let collision = false;
        for (let p2 of this.game.players){
            if ( this.game.players.indexOf(this) != this.game.players.indexOf(p2)){
                if (Util.doPolygonsIntersect(this._div, p2._div)){
                    collision = true;
                }
            }
        }

        //If colliding with other player, move back
        if (collision == true){
            //Set forward/backspeed to 0 (make tank stand still on collision)
            this.forwardSpeed = 0;
            this.backwardSpeed = 0;
            this.x = this.previousx;
            this.y = this.previousy;
        }


        //Update (transform) of element
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px) rotate("+this.angle+"deg)";
    }

    private updateSpeed():void {    

        //Move forward
        if (this.keyUp == true){
            if (this.forwardSpeed < 1){
                this.forwardSpeed = 1;
            }

            if (this.forwardSpeed < this.moveSpeed){
                this.forwardSpeed += 0.05 * this.forwardSpeed;
            }
        }
        else{
            this.forwardSpeed *= 0.98;
        }

        //Move backwards
        if (this.keyDown == true){
            if (this.backwardSpeed < 1){
                this.backwardSpeed = 1;
            }

            if (this.backwardSpeed < this.moveSpeed){
                this.backwardSpeed += 0.05 * this.backwardSpeed;
            }
        }
        else{
            this.backwardSpeed *= 0.98;
        }
    }
    
    private onKeyDown(event:KeyboardEvent):void {

        //Player 1 controls
        if (this.ID == 1){
            switch(event.keyCode){
            case 65:
                this.keyLeft = true;
                break;
            case 68:
                this.keyRight = true;
                break;
            case 83:
                this.keyDown = true;
                break;
            case 87:
                this.keyUp = true;
                break;
            case 32:
                if (this.canshoot){
                    this.shoot();
                }
                break;
            }
        }

        //Player 2 controls
        else if (this.ID == 2){
            switch(event.keyCode){
            case 37:
                this.keyLeft = true;
                break;
            case 39:
                this.keyRight = true;
                break;
            case 40:
                this.keyDown = true;
                break;
            case 38:
                this.keyUp = true;
                break;
            case 80:
                if (this.canshoot){
                    this.shoot();
                }
                break;
            }
        }
    }
    
    private onKeyUp(event:KeyboardEvent):void {

        //Player 1 controls
        if (this.ID == 1){
            switch(event.keyCode){
            case 65:
                this.keyLeft = false;
                break;
            case 68:
                this.keyRight = false;
                break;
            case 83:
                this.keyDown = false;
                break;
            case 87:
                this.keyUp = false;
                break;
            }
        }

        //Player 2 controls
        else if (this.ID == 2){
            switch(event.keyCode){
            case 37:
                this.keyLeft = false;
                break;
            case 39:
                this.keyRight = false;
                break;
            case 40:
                this.keyDown = false;
                break;
            case 38:
                this.keyUp = false;
                break;
            }
        }
    }

    public kill():void{
        this.game.removePlayer(this);
        document.body.removeChild(this._div);
        window.removeEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));
        window.removeEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e));
    }
}