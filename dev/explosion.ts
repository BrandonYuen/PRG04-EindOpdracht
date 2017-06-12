/// <reference path="effect.ts" />

class Explosion extends Effect {

    constructor(g:Game, rect:ClientRect, angle:number) {
        super(g, rect, angle, "explosion");

        //Timer to remove smoke after animation
        setTimeout(() => this.kill(), 800);
        
        //Explosion sound
        let explodeSound = new Audio();
        explodeSound.autoplay = true;
        explodeSound.src = explodeSound.canPlayType('audio/mp3') ? 'media/explosion.wav': '';
        explodeSound.volume=.5;
    }

    public kill():void{
        super.kill();
        this.game.removeExplosion(this);
    }
}