// components/Game.tsx
import React, { useState } from "react";
import useGameLogic from "../../../hooks/useGameLogic";

const GameDisplay = () => {
  const {
    currentJapaneseWord,
    currentRomanWord,
    currentPosition,
    gameOver,
    gameStarted,
    limitTime,
    readyGame,
    totalWordsTyped,
    trueTotalTypes,
    mistakeTotalTypes,
    averageTypes,
    startScreen,
    goToStartScreen,
    goToInitScreen,
  } = useGameLogic();

  return (
    <div>
      <h1>タイピングゲーム</h1>

      {!startScreen ? (
        <button onClick={goToStartScreen}>Start Game</button>
      ) : !gameStarted ? (
        <>
          <p>スペースかEnterキーを押すとスタートします</p>
          <p>ESCキーを押すとすぐにタイピングをやり直すことができます。</p>
        </>
      ) : !gameOver ? (
        <div style={{ fontSize: "24px" }}>
          <span>{currentJapaneseWord}</span>
          <br />
          {currentRomanWord.map((charOptions, i) => (
            <span key={i}>
              {charOptions[0].split("").map((char, j) => (
                <span
                  key={j}
                  style={{ color: j < currentPosition ? "orange" : "black" }}
                >
                  {char}
                </span>
              ))}
              {/* charOptionsは複数のオプションを含む配列 */}
            </span>
          ))}
          <p>残り時間: {limitTime} 秒</p>
        </div>
      ) : (
        <div>
          <p>ゲーム終了！一服しよう！！</p>
          <p>吸ったタバコ: {totalWordsTyped}本</p>
          <p>正しく打ったキーの数: {trueTotalTypes}回</p>
          <p>平均キータイプ数: {averageTypes}</p>
          <p>ミスタイプ数: {mistakeTotalTypes}回</p>
          <button onClick={readyGame}>再びプレイ</button>
          <br />
          <button onClick={goToInitScreen}>戻る</button>
        </div>
      )}
    </div>
  );
};

export default GameDisplay;
