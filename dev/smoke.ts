/// <reference path="gameObject.ts" />

class Smoke extends GameObject {

    constructor(g:Game, p:Player) {
        super(g, p.x, p.y)
        
        this._div = document.createElement("smoke");
        document.body.appendChild(this._div);
        this.rect = this._div.getBoundingClientRect();
        
        //Get x and y coordinates of center of player
        let middleCoords = Util.getMiddleOfRect(p.rect, p.angle);
        this.x = middleCoords[0] - this.rect.width/2
        this.y = middleCoords[1] - this.rect.height/2
        console.log("this.x = "+this.x);
        console.log("this.y = "+this.y);

        //Timer to remove smoke after animation
        setTimeout(() => this.delete(), 600);

        this.update();
    }

    public update():void {
        //Make smoke bigger and dissappear at certain size
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px)";
    }

    public delete():void{
        console.log("hihi");
        this.game.removeSmoke(this);
        document.body.removeChild(this._div);
    }

}