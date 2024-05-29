import React from "react";
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
    currentInput, // currentInputをここで取得
    correctlyTypedCharacters
  } = useGameLogic();

  // currentRomanWordの表示をユーザーの入力に基づいて動的に変更
  const displayedRomanWord = currentRomanWord.flatMap((charOptions, index) => {
    const optionToShow =
      index < currentPosition
        ? charOptions[0]
        : index === currentPosition && currentInput.length > 0
        ? charOptions.find((option) => option.startsWith(currentInput)) ||
          charOptions[0]
        : charOptions[0];
    return optionToShow.split("").map((char, i) => {
      const isCorrect =
        index < currentPosition ||
        (index === currentPosition && i < currentInput.length);
      return { char, isCorrect };
    });
  });

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
          <div style={{ display: "flex" }}>
            <p style={{ color: 'orange'}}>{ correctlyTypedCharacters }</p>
            {displayedRomanWord.map(({ char, isCorrect }, i) => (
              <span key={i} style={{ display: isCorrect ? "none" : "" }}>
                {char}
              </span>
            ))}
          </div>
          <p>残り時間: {limitTime} 秒</p>
        </div>
      ) : (
        <div>
          <p>ゲーム終了！一服しよう！</p>
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
