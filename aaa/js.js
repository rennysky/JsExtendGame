let GameObject = function (position, size, selector) {
    this.$el = $(selector);
    this.position = position;
    this.size = size;
    this.$el.css("position", "absolute");
    this.updateCss()
};
GameObject.prototype.updateCss = function () {
    this.$el.css("left", this.position.x + "px");
    this.$el.css("top", this.position.y + "px");
    this.$el.css("width", this.size.width + "px");
    this.$el.css("height", this.size.height + "px");
};
GameObject.prototype.collide = function (otherObject) {
    let inRangeX = otherObject.position.x > this.position.x &&
        otherObject.position.x < this.position.x + this.size.width;
    let inRangeY = otherObject.position.y > this.position.y &&
        otherObject.position.y < this.position.y + this.size.height;
    return inRangeX && inRangeY;
};

let Ball = function () {
    this.size = { width: 15, height: 15 };
    this.init();
    GameObject.call(this, this.position, { width: 15, height: 15 }, ".ball")
};

Ball.prototype = Object.create(GameObject.prototype);
Ball.prototype.constructor = Ball.constructor;
Ball.prototype.update = function () {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.updateCss();
    if (this.position.x < 0 || this.position.x > 500) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y < 0 || this.position.y > 500) {
        this.velocity.y = -this.velocity.y;
    }
};

Ball.prototype.init = function () {
    this.position = { x: 250, y: 250 };
    let randomDeg = Math.random() * 2 * Math.PI;
    this.velocity = {
        x: Math.cos(randomDeg) * 8,
        y: Math.sin(randomDeg) * 8
    }
};
let ball = new Ball();

let Board = function (position, sel) {
    this.size = {
        width: 100,
        height: 15
    };
    GameObject.call(this, position, this.size, sel);
};
Board.prototype = Object.create(GameObject.prototype);
Board.prototype.constructor = Board.constructor;
let board1 = new Board({ x: 0, y: 30 }, '.b1');
let board2 = new Board({ x: 0, y: 455 }, '.b2');
Board.prototype.update = function () {
    if (this.position.x < 0) {
        this.position.x = 0;
    }
    if (this.position.x + this.size.width > 500) {
        this.position.x = 500 - this.size.width;
    }
    this.updateCss();
};

let Game = function () {
    this.timer = null;
    this.grade = 0;
    this.initControl();
    this.control = {};
};
Game.prototype.initControl = function () {
    let _this = this;
    $(window).keydown(function (evt) {
        _this.control[evt.key] = true;
    });
    $(window).keyup(function (evt) {
        _this.control[evt.key] = false;
    })
};
Game.prototype.startGame = function () {
    let time = 3;
    let _this = this;
    this.grade = 0;
    ball.init();
    let timer = setInterval(function () {
        $(".infoText").text(time);
        time--;
        if (time < 0) {
            clearInterval(timer);
            $(".info").hide();
            _this.startGameMain();
        }
    }, 1000)
};
Game.prototype.startGameMain = function () {
    let _this = this;
    this.timer = setInterval(function () {
        if (board1.collide(ball)) {
            console.log("碰到了1号板子");
            ball.velocity.y = -ball.velocity.y;
        }
        if (board2.collide(ball)) {
            console.log("碰到了2号板子");
            _this.grade += 10;
            ball.velocity.y = -ball.velocity.y;
        }
        if (ball.position.y < 0) {
            console.log("第一个板子输了");
            _this.endGame("你赢了");
        }
        if (ball.position.y > 500) {
            console.log("第二个板子输了");
            _this.endGame("你输了");
        }

        if (_this.control["ArrowLeft"]) {
            board2.position.x -= 8;
        }

        if (_this.control["ArrowRight"]) {
            board2.position.x += 8;
        }
        board1.position.x += ball.position.x > board1.position.x + board1.size.width / 2 ? 12 : 0;
        board1.position.x += ball.position.x < board1.position.x + board1.size.width / 2 ? -12 : 0;
        board1.update();
        board2.update();
        ball.update();
        $(".grade").text(this.grade);
    }, 30)
};
Game.prototype.endGame = function (res) {
    clearInterval(this.timer);
    $(".infoText").html(res + '<br>分数：' + this.grade);
    $(".info").show();
};

let game = new Game();
$(".start").click(function () {
    game.startGame();
})
