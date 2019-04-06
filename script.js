//CLASSES

class Austin {
  constructor (hs) {
    this._toastersCollected = 0; //Amount of Toasters Collected
    this._highScore = hs; //High Score
    this._x = 250; //X-Coordinate
    this._y = 250; //Y-Coordinate
    this._r = 10; //Radius
    this._speedX = 5; //X-Speed
    this._speedY = this._speedX; //Y-Speed
    this._color = "blue"; //Color
    this._defenderAmountIncrease = 5; //New defender spawns every 5 rounds
    //While one of the arrow keys are being pressed, this becomes true & when let go, it becomes false
      this._movingLeft = false;
      this._movingUp = false;
      this._movingRight = false;
      this._movingDown = false;

  }

  draw () { //Draws Austin
    CTX.beginPath();
    CTX.arc(this._x, this._y, this._r, 0, 2 * Math.PI);
    CTX.stroke();
    CTX.fillStyle = this._color;
    CTX.fill();
  }

  updateMove (direction, beingPressed) { //updates moving variables
    switch (direction) {
      case Key.LEFT:
        this._movingLeft = beingPressed;
        break;
      case Key.UP:
        this._movingUp = beingPressed;
        break;
      case Key.RIGHT:
        this._movingRight = beingPressed;
        break;
      case Key.DOWN:
        this._movingDown = beingPressed;
        break;
    }
  }

  move () { //Moves Austin based off of move variables
    if (this._movingLeft) { //Moves Left
      this._x -= this._speedX;
      if (this._x - this._r - this._speedX < 0) //Went out of bounds
        this._x = 0 + this._r; //Keeps in bounds
    }
    if (this._movingUp) { //Moves Up
      this._y -= this._speedY;
      if (this._y - this._r - this._speedY < 0) //Went out of bounds
        this._y = 0 + this._r; //Keeps in bounds
    }
    if (this._movingRight) { //Moves Right
      this._x += this._speedX;
      if (this._x + this._r + this._speedX > GAME_WIDTH) //Went out of bounds
        this._x = GAME_WIDTH - this._r; //Keeps in bounds
    }
    if (this._movingDown) { //Moves Down
      this._y += this._speedY;
      if (this._y + this._r + this._speedY > GAME_HEIGHT) //Went out of bounds
        this._y = GAME_HEIGHT - this._r; //Keeps in bounds
    }
  }
}

class Toaster {
  constructor () {
    this._width = 40; //width
    this._height = this._width; //Height
    this._x = Math.floor((Math.random() * (GAME_WIDTH - this._width)) + 1);; //X-Coordinate
    this._y = Math.floor((Math.random() * (GAME_HEIGHT - this._height)) + 1);; //Y-Coordinate
    this._imgSource = "toaster.png"; //location of the toaster
  }

  draw () { //Draws the toaster
    let img = new Image();
    img.src = this._imgSource;
    CTX.drawImage(img, this._x, this._y, this._width, this._height);
  }

  static spawn (n) { //Spawns n amount of toasters in the area
    for (let i = 0; i < n; i++) {
      toasters.push(new Toaster()); //Creates toaster
    }
  }

  static collect (n) { //Collects
    toasters.splice(n, 1); //Deletes toaster at position n
    player._toastersCollected++; //Increases Austin's toaster count
    Toaster.spawn(1); //Spawns another toaster
    if (player._toastersCollected % 5 == 0) { //Every 5 toasters, a new defender spawns
      Defender.spawn(1);
    }
    document.getElementById("scoreboard").innerHTML = player._toastersCollected;
  }
}

class Defender {
  constructor () {
    this._r = 7; //Radius
    this._x = Math.floor((Math.random() * (GAME_WIDTH - 2*this._r)) + this._r);; //X-Coordinate
    this._y = Math.floor((Math.random() * (GAME_HEIGHT - 2*this._r)) + this._r);; //Y-Coordinate
    this._speedX = Math.floor((Math.random() * 2) + 3); //X-Speed
    this._speedY = Math.floor((Math.random() * 2) + 3); //Y-Speed
    this._color = "red"; //color
  }

  draw () { //Draws Defender
    CTX.beginPath();
    CTX.arc(this._x, this._y, this._r, 0, 2 * Math.PI);
    CTX.stroke();
    CTX.fillStyle = this._color;
    CTX.fill();
  }

  move () { //Randomly moves defender
    //Moves them
    this._x -= this._speedX;
    this._y -= this._speedY;
    if (this._x - this._r - this._speedX < 0) { //Went out of bounds
      this._x = 0 + this._r; //Keeps in bounds
      this._speedX *= -1;
    }
    if (this._y - this._r - this._speedY < 0) { //Went out of bounds
      this._y = 0 + this._r; //Keeps in bounds
      this._speedY *= -1;
    }
    if (this._x + this._r + this._speedX > GAME_WIDTH) { //Went out of bounds
      this._x = GAME_WIDTH - this._r; //Keeps in bounds
      this._speedX *= -1;
    }
    if (this._y + this._r + this._speedY > GAME_HEIGHT) { //Went out of bounds
      this._y = GAME_HEIGHT - this._r; //Keeps in bounds
      this._speedY *= -1;
    }
  }

  static spawn(n) { //Spawns n amount of enemies
    for (let i = 0; i < n; i++) {
      defenders.push(new Defender()); //Creates toaster
    }
  }

}

//CONSTANTS

const C = document.getElementById("gameArea");
const CTX = C.getContext("2d");
const GAME_HEIGHT = "500";
const GAME_WIDTH = "500";
const Key = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};

//VARIABLES

let gameOver = false; //When you lose, this turns true & stops movement
let player = new Austin(0); //player variable
let toasters = []; //Array for all toaster entities
let defenders = []; //Array for all defenders
  //Keyboard detections
  document.addEventListener("keydown", keyboardDown);
  document.addEventListener("keyup", keyboardUp);

Toaster.spawn(1); //Starting Toast
Defender.spawn(1); //Starting Defender
draw();

//FUNCTIONS

function gameLoop() { //Runs the game
  update(); //Updates positions & collisions
  draw(); //Redraws the map
  if (!gameOver) {
    window.requestAnimationFrame(gameLoop); //Repeats the gameloop
  }
}

function update() { //Updates game data
  player.move();

  for (t in toasters) { //Tests collision for all toasters w/ player
    if (collision(player._x - player._r, player._y - player._r, player._r *2, player._r*2,
      toasters[t]._x, toasters[t]._y, toasters[t]._height, toasters[t]._width)) { //Tests to see if they have collided
        Toaster.collect(t);
      }
  }
  for (d in defenders) { //Moves & Tests collisions for all defenders
    defenders[d].move(); //Moves defenders
    //Tests collision for all defenders w/ player
    if (collision(player._x - player._r, player._y - player._r, player._r *2, player._r*2,
      defenders[d]._x - defenders[d]._r, defenders[d]._y - defenders[d]._r, defenders[d]._r*2, defenders[d]._r*2)) { //Tests to see if they have collided
        gameOver = true;
        console.log("Game Over");
      }
  }
}

function draw() { //Draws everything in the game
  CTX.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); //Clears the canvas
  for (t in toasters) { //Draws all the toasters
    toasters[t].draw();
  }
  for (d in defenders) { //Draws all the defenders
    defenders[d].draw();
  }
  player.draw(); //Draws Austin
}

function keyboardDown(event) { //When key is pressed down
  player.updateMove(event.key, true);
}

function keyboardUp(event) { //When key is let go
  player.updateMove(event.key, false);
}

function collision (X1, Y1, height1, Width1, X2, Y2, height2, Width2) { //Collision function
  if (X1 <= X2 + Width2 && Y1 <= Y2 + height2 && X1 + Width1 >= X2 && Y1 + height1 >= Y2) {
    return true; //Has collided
  }
  return false; //Hasn't collided
}

function restartGame() { //restartsGame
  let hs = 0;
  if (player._toastersCollected > player._highScore) {//Sees if no high score was reached
    hs = player._toastersCollected;
    document.getElementById("highScoreboard").innerHTML = hs;
  }
  document.getElementById("scoreboard").innerHTML = 0;
  gameOver = false;
  player = new Austin(hs);
  toasters = [];
  defenders = [];
  Toaster.spawn(1); //Starting Toast
  Defender.spawn(1); //Starting Defender

  gameLoop(); //Starts game
}
