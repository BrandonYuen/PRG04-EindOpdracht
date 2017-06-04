
class Player extends GameObject {

    private ID:number;
    private moveSpeed:number;
    private rotateSpeed:number;
    private keyLeft:boolean;
    private keyRight:boolean;
    private keyDown:boolean;
    private keyUp:boolean;
    private forwardSpeed:number;
    private backwardSpeed:number;

    constructor(g:Game, x:number, y:number) {
        super(g, x, y);

        //Values
        this.angle = 0;
        this.moveSpeed = 3;
        this.rotateSpeed = 1;
        this.keyLeft = false;
        this.keyRight = false;
        this.keyDown = false;
        this.keyUp = false;
        this.forwardSpeed = 0;
        this.backwardSpeed = 0;

        //Listeners
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e));

        //Element
        this._div = document.createElement("player");
        document.body.appendChild(this._div);
        this.rect = this._div.getBoundingClientRect();      

        //Set middle coordinations
        this.midx = this.x + this.rect.width / 2;
        this.midy = this.y + this.rect.height / 2;
        console.log("middle = "+this.midx+", "+this.midy);

        this.update();
    }

    public shoot():void{
        this.game.addBullet(new Bullet(this.game, this));
        this.game.addSmoke(new Smoke(this.game, this));
        this.backwardSpeed = 3;
        console.log("shoot()");
    }
    
    public update():void {
        //Update rectangle
        this.rect = this._div.getBoundingClientRect();    

        //Rotate right
        if (this.keyRight == true){
            this.angle += this.rotateSpeed;
        }
        
        //Rotate left
        if (this.keyLeft == true){
            this.angle -= this.rotateSpeed;
        }

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
        this.x += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.midx += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.midy += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);

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
        this.x -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.midx -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.midy -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);


        //Update (transform) of element
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px) rotate("+this.angle+"deg)";
    }
    
    private onKeyDown(event:KeyboardEvent):void {

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
        case 32:
            this.shoot();
            break;
        }
    }
    
    private onKeyUp(event:KeyboardEvent):void {

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