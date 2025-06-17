"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState("RIGHT");
  const [snake, setSnake] = useState([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
  ]);
  const [food, setFood] = useState({ x: 12, y: 8 });
  const [eatAnim, setEatAnim] = useState(false);
  const [directionChanged, setDirectionChanged] = useState(false);
  const [gameOverTime, setGameOverTime] = useState(null);
  const [shake, setShake] = useState(false);
  const gridSize = 20;
  const tileSize = 24;

  // Focus canvas on mount and after game restart
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [gameOver]);

  const handleKeyDown = useCallback(
    (e) => {
      if (directionChanged) return;
      const key = e.key;
      // Debug log
      // console.log('Pressed key:', key);
      if (
        key === "ArrowUp" ||
        key === "w" ||
        key === "W" ||
        key === "ArrowDown" ||
        key === "s" ||
        key === "S" ||
        key === "ArrowLeft" ||
        key === "a" ||
        key === "A" ||
        key === "ArrowRight" ||
        key === "d" ||
        key === "D"
      ) {
        e.preventDefault();
      }
      if (
        (key === "ArrowUp" || key === "w" || key === "W") &&
        direction !== "DOWN"
      ) {
        setDirection("UP");
        setDirectionChanged(true);
      } else if (
        (key === "ArrowDown" || key === "s" || key === "S") &&
        direction !== "UP"
      ) {
        setDirection("DOWN");
        setDirectionChanged(true);
      } else if (
        (key === "ArrowLeft" || key === "a" || key === "A") &&
        direction !== "RIGHT"
      ) {
        setDirection("LEFT");
        setDirectionChanged(true);
      } else if (
        (key === "ArrowRight" || key === "d" || key === "D") &&
        direction !== "LEFT"
      ) {
        setDirection("RIGHT");
        setDirectionChanged(true);
      }
    },
    [direction, directionChanged]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (eatAnim) {
      const timeout = setTimeout(() => setEatAnim(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [eatAnim]);

  useEffect(() => {
    if (gameOver) {
      setGameOverTime(Date.now());
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    // Speed up as score increases, minimum interval 40ms
    const speed = Math.max(40, 100 - score * 5);
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }
        // Check collision
        if (
          head.x < 0 ||
          head.x >= gridSize ||
          head.y < 0 ||
          head.y >= gridSize ||
          prevSnake.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          // Margin from edge increases as score increases (up to 3)
          const margin = Math.min(3, Math.floor(score / 5));
          let newFood;
          do {
            newFood = {
              x: Math.floor(Math.random() * (gridSize - 2 * margin)) + margin,
              y: Math.floor(Math.random() * (gridSize - 2 * margin)) + margin,
            };
          } while (
            prevSnake.some((s) => s.x === newFood.x && s.y === newFood.y) ||
            (head.x === newFood.x && head.y === newFood.y)
          );
          setFood(newFood);
          setEatAnim(true); // trigger animation
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
      setDirectionChanged(false);
    }, speed);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, score]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, gridSize * tileSize, gridSize * tileSize);
    // Draw food as a simple, large pink heart filling the tile (not squished)
    ctx.save();
    ctx.translate(food.x * tileSize, food.y * tileSize);
    ctx.beginPath();
    const w = tileSize,
      h = tileSize;
    ctx.moveTo(w / 2, h * 0.82);
    ctx.bezierCurveTo(w * 0.95, h * 0.62, w * 0.95, h * 0.28, w / 2, h * 0.38);
    ctx.bezierCurveTo(w * 0.05, h * 0.28, w * 0.05, h * 0.62, w / 2, h * 0.82);
    ctx.closePath();
    ctx.fillStyle = "#FF3EA5";
    ctx.fill();
    ctx.restore();
    // Draw snake
    snake.forEach((s, i) => {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
      if (i === 0) {
        // Draw head with smiley face
        ctx.save();
        ctx.translate(
          s.x * tileSize + tileSize / 2,
          s.y * tileSize + tileSize / 2
        );
        // Eyes
        ctx.beginPath();
        ctx.arc(-5, -3, 2, 0, 2 * Math.PI);
        ctx.arc(5, -3, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#23251F";
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(0, 3, 5, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#23251F";
        ctx.stroke();
        ctx.restore();
      }
    });
    // Draw halo above the head (after snake, so it's on top)
    const head = snake[0];
    if (head) {
      ctx.save();
      ctx.translate(
        head.x * tileSize + tileSize / 2,
        head.y * tileSize + tileSize / 2
      );
      ctx.beginPath();
      ctx.ellipse(0, -tileSize / 2 - 8, 11, 4, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }, [snake, food]);

  useEffect(() => {
    if (!gameOver) return;
    const handleRestart = (e) => {
      if (e.key === "Tab" || e.metaKey) return;
      if (gameOverTime && Date.now() - gameOverTime < 500) return;
      setScore(0);
      setGameOver(false);
      setDirection("RIGHT");
      setSnake([
        { x: 8, y: 8 },
        { x: 7, y: 8 },
      ]);
      setFood({ x: 12, y: 8 });
    };
    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, [gameOver, gameOverTime]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.tabIndex = 0;
      canvasRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (gameOver) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [gameOver]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div
        className="glass p-8 flex flex-col items-center gap-4 shadow-xl"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(160,43,92,0.10), 0 1.5px 8px 0 rgba(208,90,42,0.08)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "#F4F7F7" }}
        >
          {" "}
          🐍 Snake Game
        </h2>
        <div style={{ minHeight: "2.5rem" }}>
          {gameOver && (
            <div
              className="font-bold mt-2"
              style={{ color: "#F4F7F7" }}
            >
              Game Over!
            </div>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={gridSize * tileSize}
          height={gridSize * tileSize}
          className={`rounded-lg border ${eatAnim ? 'snake-eat-anim' : ''} ${shake ? 'snake-shake' : ''}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ outline: 'none' }}
        />
        <div
          className="score-badge"
          style={{ color: "#A02B5C", background: "#fff" }}
        >
          Score: {score}
        </div>
        <div className="controls-info">
          <strong>Controls:</strong>
          <br />
          <span className="controls-keys">Arrow keys</span> or{" "}
          <span className="controls-keys">WASD</span> to move the snake.
          <br />
          <span className="controls-tip">
            Press any key after a game over to restart.
          </span>
        </div>
        <Link href="/" className="mt-2 back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
