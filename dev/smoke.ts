/// <reference path="effect.ts" />

class Smoke extends Effect {

    constructor(g:Game, rect:ClientRect, angle:number) {
        super(g, rect, angle, "smoke");

        //Timer to remove smoke after animation
        setTimeout(() => this.kill(), 600);
    }

    public kill():void{
        super.kill();
        this.game.removeExplosion(this);
    }
}