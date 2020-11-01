import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import * as constants from "./constants";
import "semantic-ui-css/semantic.min.css";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(constants.SNAKE_START);
  const [apple, setApple] = useState(constants.APPLE_START);
  const [direction, setDirection] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(constants.SCALE, 0, 0, constants.SCALE, 0, 0);
    context.clearRect(0, 0, constants.CANVAS_SIZE[0], constants.CANVAS_SIZE[1]);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => {
      context.fillRect(x, y, 1, 1);
    });
    context.fillStyle = "lightblue";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  const startGame = () => {
    setSnake(constants.SNAKE_START);
    setApple(constants.APPLE_START);
    setDirection([0, -1]);
    setSpeed(constants.SPEED);
    setGameOver(false);
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 &&
      keyCode <= 40 &&
      setDirection(constants.DIRECTIONS[keyCode]);
  };

  const createApple = () => {
    return apple.map((_, i) =>
      Math.floor((Math.random() * constants.CANVAS_SIZE[i]) / constants.SCALE)
    );
  };

  const checkCollision = (piece) => {
    if (
      piece[0] * constants.SCALE >= constants.CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * constants.SCALE >= constants.CANVAS_SIZE[1] ||
      piece[1] < 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      if (checkCollision(newApple)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    } else {
      return false;
    }
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + direction[0],
      snakeCopy[0][1] + direction[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      endGame();
    } else if (!checkAppleCollision(snakeCopy)) {
      snakeCopy.pop();
    }
    setSnake(snakeCopy);
  };

  useInterval(() => gameLoop(), speed);

  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={(e) => moveSnake(e)}
      style={{ margin: "5px" }}
    >
      <canvas
        style={{
          border: "1px solid black",
          display: "block",
          marginBottom: "10px",
        }}
        ref={canvasRef}
        width={`${constants.CANVAS_SIZE[0]}px`}
        height={`${constants.CANVAS_SIZE[1]}px`}
      />
      {gameOver && (
        <div>
          <h2 class="ui header">GAME OVER</h2>
        </div>
      )}
      <button class="ui button secondary" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
};

export default App;
