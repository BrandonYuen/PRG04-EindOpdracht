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
        shootSound.volume = .5;
        _this.update();
        return _this;
    }
    Bullet.prototype.update = function () {
        this.rect = this._div.getBoundingClientRect();
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.angle + "deg)";
        if (this.x > window.innerWidth - 30 || this.x < 0) {
            this.kill();
        }
        else if (this.y > window.innerHeight - 30 || this.y < 0) {
            this.kill();
        }
    };
    Bullet.prototype.explode = function () {
        this.game.addExplosion(new Explosion(this.game, this.rect, this.angle));
        this.kill();
    };
    Bullet.prototype.kill = function () {
        document.body.removeChild(this._div);
        this.game.removeBullet(this);
    };
    return Bullet;
}(GameObject));
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(g, rect, angle) {
        var _this = _super.call(this, g, rect.left, rect.top) || this;
        _this._div = document.createElement("explosion");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        var middleCoords = Util.getMiddleOfRect(rect, angle);
        console.log("middleCoords = " + middleCoords);
        _this.x = middleCoords[0] - _this.rect.width / 2;
        _this.y = middleCoords[1] - _this.rect.height / 2;
        console.log("x = " + _this.x);
        console.log("y = " + _this.y);
        var explodeSound = new Audio();
        explodeSound.autoplay = true;
        explodeSound.src = explodeSound.canPlayType('audio/mp3') ? 'media/explosion.wav' : '';
        explodeSound.volume = .5;
        setTimeout(function () { return _this.kill(); }, 800);
        _this.update();
        return _this;
    }
    Explosion.prototype.update = function () {
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Explosion.prototype.kill = function () {
        document.body.removeChild(this._div);
        this.game.removeExplosion(this);
    };
    return Explosion;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.players = new Array();
        this.bullets = new Array();
        this.smokes = new Array();
        this.explosions = new Array();
        this.scores = new Array();
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
        startButton.addEventListener("click", function () { return _this.startGame(startscreen, controls, startButton, footer); });
    }
    Game.prototype.startGame = function (startscreen, controls, startButton, footer) {
        var _this = this;
        document.body.removeChild(startscreen);
        document.body.removeChild(controls);
        document.body.removeChild(startButton);
        document.body.removeChild(footer);
        this.scores[0] = document.createElement("scoreboard");
        document.body.appendChild(this.scores[0]);
        this.scores[0].classList.add("p1score");
        this.scores[1] = document.createElement("scoreboard");
        document.body.appendChild(this.scores[1]);
        this.scores[1].classList.add("p2score");
        this.players.push(new Player(this, 1, 150, window.innerHeight / 2));
        this.players.push(new Player(this, 2, window.innerWidth - 150, window.innerHeight / 2));
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
            for (var _b = 0, _c = this.players; _b < _c.length; _b++) {
                var p = _c[_b];
                if (Util.doPolygonsIntersect(b._div, p._div)) {
                    if (b.player.ID != p.ID) {
                        b.kill();
                        this.addExplosion(new Explosion(this, p.rect, p.angle));
                        p.respawn();
                        b.player.succesfullHit();
                    }
                }
            }
            for (var _d = 0, _e = this.bullets; _d < _e.length; _d++) {
                var b2 = _e[_d];
                if (Util.doPolygonsIntersect(b._div, b2._div)) {
                    if (this.bullets.indexOf(b) != this.bullets.indexOf(b2)) {
                        console.log("2 bullets collide");
                        b.explode();
                        b2.explode();
                    }
                }
            }
        }
        for (var _f = 0, _g = this.smokes; _f < _g.length; _f++) {
            var s = _g[_f];
            s.update();
        }
        for (var _h = 0, _j = this.explosions; _h < _j.length; _h++) {
            var e = _j[_h];
            e.update();
        }
        for (var _k = 0, _l = this.players; _k < _l.length; _k++) {
            var p = _l[_k];
            p.update();
            if (p.score >= 5) {
                this.showWinner(p);
            }
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.showWinner = function (p) {
        console.log("ALL PLAYERS:", this.players);
        for (var i = this.players.length - 1; i >= 0; i--) {
            this.players[i].kill();
            console.log("killed played with ID:" + p.ID);
        }
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.kill();
        }
        var winner = document.createElement("winner");
        document.body.appendChild(winner);
        winner.innerHTML = "THE WINNER IS:<br>Player " + p.ID;
        setTimeout(function () { location.reload(true); }, 5000);
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
    Game.prototype.addExplosion = function (e) {
        this.explosions.push(e);
    };
    Game.prototype.removeExplosion = function (e) {
        var i = this.explosions.indexOf(e);
        if (i != -1) {
            this.explosions.splice(i, 1);
        }
    };
    Game.prototype.removePlayer = function (p) {
        var i = this.players.indexOf(p);
        if (i != -1) {
            this.players.splice(i, 1);
            console.log("spliced player with ID:" + p.ID);
        }
    };
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
});
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(g, id, x, y) {
        var _this = _super.call(this, g, x, y) || this;
        _this.ID = id;
        _this._div = document.createElement("player");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        _this.x = _this.x - _this.rect.width / 2;
        _this.y = 0;
        while (_this.y < window.innerHeight * 0.1 || _this.y > window.innerHeight - window.innerHeight * 0.1) {
            _this.y = Math.floor((Math.random() * window.innerHeight));
            console.log("this.y is now: " + _this.y);
        }
        _this.angle = 0;
        if (_this.ID == 2) {
            _this.angle = 180;
        }
        _this.moveSpeed = 5;
        _this.rotateSpeed = 3;
        _this.keyLeft = false;
        _this.keyRight = false;
        _this.keyDown = false;
        _this.keyUp = false;
        _this.forwardSpeed = 0;
        _this.backwardSpeed = 0;
        _this.score = 0;
        _this.canshoot = true;
        _this.respawnX = _this.x;
        _this.respawnAngle = _this.angle;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        Util.addCollisionCorners(_this._div);
        if (_this.ID == 1) {
            _this._div.classList.add('player1');
        }
        else {
            _this._div.classList.add('player2');
        }
        _this.update();
        return _this;
    }
    Player.prototype.shoot = function () {
        var _this = this;
        this.canshoot = false;
        this.game.addBullet(new Bullet(this.game, this));
        this.game.addSmoke(new Smoke(this.game, this.rect, this.angle));
        this.backwardSpeed = 3;
        setTimeout(function () { return _this.canshoot = true; }, 1500);
    };
    Player.prototype.succesfullHit = function () {
        this.score += 1;
        this.updateScore();
    };
    Player.prototype.updateScore = function () {
        if (this.ID == 1) {
            this.game.scores[0].innerHTML = "<b>PLAYER 1</b><br>Score: " + this.score + "/5<br>Can Shoot: " + this.canshoot;
        }
        else {
            this.game.scores[1].innerHTML = "<b>PLAYER 2</b><br>Score: " + this.score + "/5<br>Can Shoot: " + this.canshoot;
        }
    };
    Player.prototype.respawn = function () {
        this.x = this.respawnX;
        this.y = 0;
        while (this.y < window.innerHeight * 0.1 || this.y > window.innerHeight - window.innerHeight * 0.1) {
            this.y = Math.floor((Math.random() * window.innerHeight));
            console.log("this.y is now: " + this.y);
        }
        this.forwardSpeed = 0;
        this.backwardSpeed = 0;
        this.angle = this.respawnAngle;
        console.log("respawned: " + this.ID);
    };
    Player.prototype.update = function () {
        this.rect = this._div.getBoundingClientRect();
        this.updateSpeed();
        this.updateScore();
        this.previousx = this.x;
        this.previousy = this.y;
        this.previousangle = this.angle;
        this.x += this.forwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y += this.forwardSpeed * Math.sin(this.angle * Math.PI / 180);
        this.x -= this.backwardSpeed * Math.cos(this.angle * Math.PI / 180);
        this.y -= this.backwardSpeed * Math.sin(this.angle * Math.PI / 180);
        if (this.keyRight == true) {
            this.angle += this.rotateSpeed;
        }
        if (this.keyLeft == true) {
            this.angle -= this.rotateSpeed;
        }
        var collision = false;
        for (var _i = 0, _a = this.game.players; _i < _a.length; _i++) {
            var p2 = _a[_i];
            if (this.game.players.indexOf(this) != this.game.players.indexOf(p2)) {
                if (Util.doPolygonsIntersect(this._div, p2._div)) {
                    collision = true;
                }
            }
        }
        if (collision == true) {
            this.forwardSpeed = 0;
            this.backwardSpeed = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.rect.width > window.innerWidth) {
            this.x = window.innerWidth - this.rect.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        else if (this.y + this.rect.height > window.innerHeight) {
            this.y = window.innerHeight - this.rect.height;
        }
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.angle + "deg)";
    };
    Player.prototype.updateSpeed = function () {
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
                    if (this.canshoot) {
                        this.shoot();
                    }
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
                    if (this.canshoot) {
                        this.shoot();
                    }
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
    Player.prototype.kill = function () {
        var _this = this;
        document.body.removeChild(this._div);
        this.game.removePlayer(this);
        window.removeEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.removeEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    };
    return Player;
}(GameObject));
var Smoke = (function (_super) {
    __extends(Smoke, _super);
    function Smoke(g, rect, angle) {
        var _this = _super.call(this, g, rect.left, rect.top) || this;
        _this._div = document.createElement("smoke");
        document.body.appendChild(_this._div);
        _this.rect = _this._div.getBoundingClientRect();
        var middleCoords = Util.getMiddleOfRect(rect, angle);
        _this.x = middleCoords[0] - _this.rect.width / 2;
        _this.y = middleCoords[1] - _this.rect.height / 2;
        setTimeout(function () { return _this.kill(); }, 600);
        _this.update();
        return _this;
    }
    Smoke.prototype.update = function () {
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Smoke.prototype.kill = function () {
        document.body.removeChild(this._div);
        this.game.removeSmoke(this);
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
    Util.isOutOfScreen = function (p) {
        var corners = p._div.getElementsByTagName('div');
        var coords = new Array();
        for (var i = 0; i < corners.length; i++) {
            coords.push({ x: Util.getCoords(corners[i])[0], y: Util.getCoords(corners[i])[1] });
        }
        for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
            var c = coords_1[_i];
            if (c.x > window.innerWidth || c.x < 0) {
                console.log("Collision Left/Right:");
                console.log("x: " + c.x);
                return true;
            }
            else if (c.y > window.innerHeight || c.y < 0) {
                console.log("Collision Top/Bottom:");
                console.log("y: " + c.y);
                return true;
            }
        }
        return false;
    };
    return Util;
}());
//# sourceMappingURL=main.js.map