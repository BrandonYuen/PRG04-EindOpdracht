

class GameObject {
    
    protected _div: HTMLElement;
    protected game:Game;
    public x:number;
    public y:number;
    public midx:number;
    public midy:number;
    public angle:number;
    public rect:ClientRect;

    constructor(g:Game, x:number, y:number) {
        this.game = g;
        this.x = x;
        this.y = y;
    }
}