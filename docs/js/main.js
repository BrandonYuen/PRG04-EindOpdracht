var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = (function () {
    function GameObject(g, x, y) {
        this.game = g;
        this.x = x;
        this.y = y;
    }
    return GameObject;
}());
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(g, p) {
        var _this = _super.call(this, g, p.x, p.y) || this;
        _this.angle = p.angle;
        _this.speed = 10;
        _this._div = document.createElement("bullet");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        var middleCoords = Util.getMiddleOfRect(p.rect, p.angle);
        _this.x = middleCoords[0] - _this.rect.width / 2;
        _this.y = middleCoords[1] - _this.rect.height / 2;
        var shootSound = new Audio();
        shootSound.autoplay = true;
        shootSound.src = shootSound.canPlayType('audio/mp3') ? 'media/tankShoot.wav' : '';
        _this.update();
        return _this;
    }
    Bullet.prototype.update = function () {
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.angle + "deg)";
        if (this.x > window.innerWidth - 30 || this.x < 0) {
            this.explode();
        }
        else if (this.y > window.innerHeight - 30 || this.y < 0) {
            this.explode();
        }
    };
    Bullet.prototype.explode = function () {
        var explodeSound = new Audio();
        explodeSound.autoplay = true;
        explodeSound.src = explodeSound.canPlayType('audio/mp3') ? 'media/explosion.wav' : '';
        this.delete();
    };
    Bullet.prototype.delete = function () {
        this.game.removeBullet(this);
        document.body.removeChild(this._div);
    };
    return Bullet;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.player = new Player(this, 0, 0);
        this.bullets = new Array();
        this.smokes = new Array();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player.update();
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
        }
        for (var _b = 0, _c = this.smokes; _b < _c.length; _b++) {
            var s = _c[_b];
            s.update();
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.addBullet = function (b) {
        this.bullets.push(b);
    };
    Game.prototype.removeBullet = function (b) {
        var i = this.bullets.indexOf(b);
        if (i != -1) {
            this.bullets.splice(i, 1);
        }
    };
    Game.prototype.addSmoke = function (s) {
        this.smokes.push(s);
    };
    Game.prototype.removeSmoke = function (s) {
        var i = this.smokes.indexOf(s);
        if (i != -1) {
            this.smokes.splice(i, 1);
        }
    };
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
});
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(g, x, y) {
        var _this = _super.call(this, g, x, y) || this;
        _this.angle = 0;
        _this.moveSpeed = 3;
        _this.rotateSpeed = 1;
        _this.keyLeft = false;
        _this.keyRight = false;
        _this.keyDown = false;
        _this.keyUp = false;
        _this.forwardSpeed = 0;
        _this.backwardSpeed = 0;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        _this._div = document.createElement("player");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        _this.midx = _this.x + _this.rect.width / 2;
        _this.midy = _this.y + _this.rect.height / 2;
        console.log("middle = " + _this.midx + ", " + _this.midy);
        _this.update();
        return _this;
    }
    Player.prototype.shoot = function () {
        this.game.addBullet(new Bullet(this.game, this));
        this.game.addSmoke(new Smoke(this.game, this));
        this.backwardSpeed = 3;
        console.log("shoot()");
    };
    Player.prototype.update = function () {
        this.rect = this._div.getBoundingClientRect();
        if (this.keyRight == true) {
            this.angle += this.rotateSpeed;
        }
        if (this.keyLeft == true) {
            this.angle -= this.rotateSpeed;
        }
        if (this.keyUp == true) {
            if (this.forwardSpeed < 1) {
                this.forwardSpeed = 1;
            }
            if (this.forwardSpeed < this.moveSpeed) {
                this.forwardSpeed += 0.05 * this.forwardSpeed;
            }
        }
        else {
            this.forwardSpeed *= 0.98;
        }
        this.x += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.midx += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.midy += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);
        if (this.keyDown == true) {
            if (this.backwardSpeed < 1) {
                this.backwardSpeed = 1;
            }
            if (this.backwardSpeed < this.moveSpeed) {
                this.backwardSpeed += 0.05 * this.backwardSpeed;
            }
        }
        else {
            this.backwardSpeed *= 0.98;
        }
        this.x -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.midx -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.midy -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.angle + "deg)";
    };
    Player.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
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
    };
    Player.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
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
    };
    return Player;
}(GameObject));
var Smoke = (function (_super) {
    __extends(Smoke, _super);
    function Smoke(g, p) {
        var _this = _super.call(this, g, p.x, p.y) || this;
        _this._div = document.createElement("smoke");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        var middleCoords = Util.getMiddleOfRect(p.rect, p.angle);
        _this.x = middleCoords[0] - _this.rect.width / 2;
        _this.y = middleCoords[1] - _this.rect.height / 2;
        console.log("this.x = " + _this.x);
        console.log("this.y = " + _this.y);
        setTimeout(function () { return _this.delete(); }, 600);
        _this.update();
        return _this;
    }
    Smoke.prototype.update = function () {
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Smoke.prototype.delete = function () {
        console.log("hihi");
        this.game.removeSmoke(this);
        document.body.removeChild(this._div);
    };
    return Smoke;
}(GameObject));
var Util = (function () {
    function Util() {
    }
    Util.getMiddleOfRect = function (rect, angle) {
        var middle = new Array();
        var x0 = rect.left + rect.width / 2;
        var y0 = rect.top + rect.height / 2;
        var newX1 = x0 + (rect.left - x0) * Math.cos(angle * Math.PI / 180) + (rect.top - y0) * Math.sin(angle * Math.PI / 180);
        var newY1 = y0 - (rect.left - x0) * Math.sin(angle * Math.PI / 180) + (rect.top - y0) * Math.cos(angle * Math.PI / 180);
        var newX2 = x0 + (rect.left + rect.width - x0) * Math.cos(angle * Math.PI / 180) + (rect.top + rect.height - y0) * Math.sin(angle * Math.PI / 180);
        var newY2 = y0 - (rect.left + rect.width - x0) * Math.sin(angle * Math.PI / 180) + (rect.top + rect.height - y0) * Math.cos(angle * Math.PI / 180);
        var newX3 = x0 + (rect.left - x0) * Math.cos(angle * Math.PI / 180) + (rect.top + rect.height - y0) * Math.sin(angle * Math.PI / 180);
        var newY3 = y0 - (rect.left - x0) * Math.sin(angle * Math.PI / 180) + (rect.top + rect.height - y0) * Math.cos(angle * Math.PI / 180);
        var newX4 = x0 + (rect.left + rect.width - x0) * Math.cos(angle * Math.PI / 180) + (rect.top - y0) * Math.sin(angle * Math.PI / 180);
        var newY4 = y0 - (rect.left + rect.width - x0) * Math.sin(angle * Math.PI / 180) + (rect.top - y0) * Math.cos(angle * Math.PI / 180);
        var allX = new Array();
        allX.push(Math.round(newX1));
        allX.push(Math.round(newX2));
        allX.push(Math.round(newX3));
        allX.push(Math.round(newX4));
        var allY = new Array();
        allY.push(Math.round(newY1));
        allY.push(Math.round(newY2));
        allY.push(Math.round(newY3));
        allY.push(Math.round(newY4));
        var smallX = allX[0];
        for (var i = 1; i < 4; i++) {
            if (allX[i] < smallX) {
                smallX = allX[i];
            }
        }
        var smallY = allY[0];
        for (var i = 1; i < 4; i++) {
            if (allY[i] < smallY) {
                smallY = allY[i];
            }
        }
        var bigX = allX[0];
        for (var i = 1; i < 4; i++) {
            if (allX[i] > bigX) {
                bigX = allX[i];
            }
        }
        var bigY = allY[0];
        for (var i = 1; i < 4; i++) {
            if (allY[i] > bigY) {
                bigY = allY[i];
            }
        }
        var x = (smallX + ((bigX - smallX) / 2));
        var y = (smallY + ((bigY - smallY) / 2));
        console.log("middle: " + x + ", " + y);
        console.log("-----------------------");
        console.log(" ");
        middle.push(x);
        middle.push(y);
        return middle;
    };
    return Util;
}());
//# sourceMappingURL=main.js.map