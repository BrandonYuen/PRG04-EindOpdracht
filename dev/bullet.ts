
class Bullet {
    
    private speed:number;
    private angle:number;
    private _div:HTMLElement;
    private x:number;
    private y:number;

    constructor(g:Game, p:Player) {
        this.angle = p.angle;
        this.speed = 10;

        //let X0 = p.x + p.rect.width/4;
        //let Y0 = p.y + p.rect.height/4;
        //this.x = (X0 * Math.cos(this.angle)) - (Y0 * Math.sin(this.angle));
        //this.y = (X0 * Math.sin(this.angle)) + (Y0 * Math.cos(this.angle));

        this.x = Util.getMidPointX(p.rect.left, p.rect.top, p.rect.width, p.rect.height, p.angle);
        this.y = Util.getMidPointY(p.rect.left, p.rect.top, p.rect.width, p.rect.height, p.angle);
        
        this._div = document.createElement("bullet");
        document.body.appendChild(this._div);

        this.move();
    }

    public move():void {
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px)  rotate("+this.angle+"deg)";
    }

}