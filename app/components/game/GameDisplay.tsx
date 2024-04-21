// components/Game.tsx
import React from "react";
import useGameLogic from "../../../hooks/useGameLogic";

const GameDisplay = () => {
  const {
    currentWord,
    currentPosition,
    gameOver,
    gameStarted,
    totalTime,
    startGame,
    readyGame,
  } = useGameLogic();

  return (
    <div>
      <h1>タイピングゲーム</h1>
      {!gameStarted ? (
        <button onClick={startGame}>Start Game</button>
      ) : !gameOver ? (
        <div style={{ fontSize: "24px" }}>
          {currentWord.split("").map((char, i) => (
            <span
              key={i}
              style={{ color: i < currentPosition ? "orange" : "black" }}
            >
              {char}
            </span>
          ))}
          <p>残り時間: {totalTime} 秒</p>
        </div>
      ) : (
        <div>
          <p>ゲーム終了！一服しよう！</p>
          <button onClick={readyGame}>再びプレイ</button>
        </div>
      )}
    </div>
  );
};
export default GameDisplay;
