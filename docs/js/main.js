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
var Bullet = (function () {
    function Bullet(g, p) {
        this.angle = p.angle;
        this.speed = 10;
        this.x = Util.getMidPointX(p.rect.left, p.rect.top, p.rect.width, p.rect.height, p.angle);
        this.y = Util.getMidPointY(p.rect.left, p.rect.top, p.rect.width, p.rect.height, p.angle);
        this._div = document.createElement("bullet");
        document.body.appendChild(this._div);
        this.move();
    }
    Bullet.prototype.move = function () {
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px)  rotate(" + this.angle + "deg)";
    };
    return Bullet;
}());
var Game = (function () {
    function Game() {
        var _this = this;
        this.player = new Player(this, 50, 50);
        this.bullets = new Array();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player.update();
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.addBullet = function (b) {
        this.bullets.push(b);
        console.log(this.bullets);
    };
    return Game;
}());
var GameObject = (function () {
    function GameObject(g, x, y) {
        this.game = g;
        this.x = x;
        this.y = y;
    }
    return GameObject;
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
        _this.update();
        return _this;
    }
    Player.prototype.shoot = function () {
        this.game.addBullet(new Bullet(this.game, this));
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
var Util = (function () {
    function Util() {
    }
    Util.getMidPointX = function (x, y, width, height, angle_degrees) {
        var angle_rad = angle_degrees * Math.PI / 180;
        var cosa = Math.cos(angle_rad);
        var sina = Math.sin(angle_rad);
        var wp = width / 2;
        var hp = height / 2;
        return (x + wp * cosa - hp * sina);
    };
    Util.getMidPointY = function (x, y, width, height, angle_degrees) {
        var angle_rad = angle_degrees * Math.PI / 180;
        var cosa = Math.cos(angle_rad);
        var sina = Math.sin(angle_rad);
        var wp = width / 2;
        var hp = height / 2;
        return (y + wp * sina + hp * cosa);
    };
    return Util;
}());
//# sourceMappingURL=main.js.map