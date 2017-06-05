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
        _this.player = p;
        _this._div = document.createElement("bullet");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        Util.addCollisionCorners(_this._div);
        if (p.ID == 1) {
            _this._div.classList.add('bullet1');
        }
        else {
            _this._div.classList.add('bullet2');
        }
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
        this.kill();
    };
    Bullet.prototype.kill = function () {
        this.game.removeBullet(this);
        document.body.removeChild(this._div);
    };
    return Bullet;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.player1 = new Player(this, 1, 150, window.innerHeight / 2);
        this.player2 = new Player(this, 2, window.innerWidth - 150, window.innerHeight / 2);
        this.bullets = new Array();
        this.smokes = new Array();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player1.update();
        this.player2.update();
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
            if (Util.doPolygonsIntersect(b._div, this.player1._div)) {
                if (b.player.ID != this.player1.ID) {
                    b.explode();
                }
            }
            if (Util.doPolygonsIntersect(b._div, this.player2._div)) {
                if (b.player.ID != this.player2.ID) {
                    b.explode();
                }
            }
            for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
                var b2 = _c[_b];
                if (Util.doPolygonsIntersect(b._div, b2._div)) {
                    if (this.bullets.indexOf(b) != this.bullets.indexOf(b2)) {
                        b.explode();
                        b2.explode();
                    }
                }
            }
        }
        for (var _d = 0, _e = this.smokes; _d < _e.length; _d++) {
            var s = _e[_d];
            s.update();
        }
        var collision = false;
        if (Util.doPolygonsIntersect(this.player1._div, this.player2._div)) {
            collision = true;
        }
        console.log("collision = " + collision);
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
    var startscreen = document.createElement("startscreen");
    document.body.appendChild(startscreen);
    var controls = document.createElement("controls");
    document.body.appendChild(controls);
    var footer = document.createElement("footer");
    document.body.appendChild(footer);
    footer.innerHTML = "Created By: Brandon Yuen";
    var startButton = document.createElement("startbutton");
    document.body.appendChild(startButton);
    startButton.innerHTML = "START";
    startButton.addEventListener("click", function () {
        document.body.removeChild(startscreen);
        document.body.removeChild(controls);
        document.body.removeChild(startButton);
        document.body.removeChild(footer);
        startGame();
    });
});
function startGame() {
    new Game();
}
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(g, id, x, y) {
        var _this = _super.call(this, g, x, y) || this;
        _this.ID = id;
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
        Util.addCollisionCorners(_this._div);
        if (_this.ID == 1) {
            _this._div.classList.add('player1');
        }
        else {
            _this._div.classList.add('player2');
        }
        _this.x = _this.x - _this.rect.width / 2;
        _this.y = _this.y - _this.rect.height / 2;
        if (_this.ID == 2) {
            _this.angle = 180;
        }
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
        if (this.ID == 1) {
            switch (event.keyCode) {
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
                    this.shoot();
                    break;
            }
        }
        else if (this.ID == 2) {
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
                case 80:
                    this.shoot();
                    break;
            }
        }
    };
    Player.prototype.onKeyUp = function (event) {
        if (this.ID == 1) {
            switch (event.keyCode) {
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
        else if (this.ID == 2) {
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
        setTimeout(function () { return _this.kill(); }, 600);
        _this.update();
        return _this;
    }
    Smoke.prototype.update = function () {
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Smoke.prototype.kill = function () {
        console.log("hihi");
        this.game.removeSmoke(this);
        document.body.removeChild(this._div);
    };
    return Smoke;
}(GameObject));
var Util = (function () {
    function Util() {
    }
    Util.getCoords = function (elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return [Math.round(left), Math.round(top)];
    };
    Util.addCollisionCorners = function (_div) {
        var leftTop = document.createElement("div");
        leftTop.classList.add("left-top");
        _div.appendChild(leftTop);
        var rightTop = document.createElement("div");
        rightTop.classList.add("right-top");
        _div.appendChild(rightTop);
        var leftBottom = document.createElement("div");
        leftBottom.classList.add("left-bottom");
        _div.appendChild(leftBottom);
        var rightBottom = document.createElement("div");
        rightBottom.classList.add("right-bottom");
        _div.appendChild(rightBottom);
    };
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
    Util.doPolygonsIntersect = function (_div1, _div2) {
        function isUndefined(a) {
            return a === undefined;
        }
        var children1 = _div1.getElementsByTagName('div');
        var a = new Array();
        for (var i_1 = 0; i_1 < children1.length; i_1++) {
            a.push({ x: Util.getCoords(children1[i_1])[0], y: Util.getCoords(children1[i_1])[1] });
        }
        var children2 = _div2.getElementsByTagName('div');
        var b = new Array();
        for (var i_2 = 0; i_2 < children2.length; i_2++) {
            b.push({ x: Util.getCoords(children2[i_2])[0], y: Util.getCoords(children2[i_2])[1] });
        }
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;
        for (i = 0; i < polygons.length; i++) {
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = undefined;
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    };
    ;
    return Util;
}());
//# sourceMappingURL=main.js.map