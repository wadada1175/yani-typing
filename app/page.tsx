"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const initialWords = ["tabacco", "smoke", "lighter", "タバコ"]; // 初期単語リスト
  const [words, setWords] = useState<string[]>([]); // ゲームの進行中の単語リスト
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false); // ゲームオーバー状態
  const [gameStarted, setGameStarted] = useState<boolean>(false); // ゲーム開始状態
  const [totalTime, setTotalTime] = useState<number>(60); // 全体の時間制限
  const [mistakeMade, setMistakeMade] = useState<boolean>(false); // ミスがあったかどうかの状態

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || !currentWord || !gameStarted) return;
      const nextChar = currentWord.charAt(currentPosition);
      if (event.key === nextChar) {
        const nextPosition = currentPosition + 1;
        setCurrentPosition(nextPosition);
        if (nextPosition === currentWord.length) {
          setCompleted(true);
          if (!mistakeMade) {
            // ミスがなければ時間を5秒追加
            setTotalTime((prevTime) => prevTime + 5);
          }
        }
      } else {
        setMistakeMade(true); // ミスがあった場合、フラグを設定
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentWord, gameOver, gameStarted]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // timerの型を正しく定義
    if (gameStarted && !gameOver) {
      timer = setTimeout(() => {
        setTotalTime((prevTime) => prevTime - 1);
        if (totalTime <= 0) {
          setGameOver(true);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer); // clearTimeoutを呼び出して、適切なクリーンアップを提供
    };
  }, [totalTime, gameStarted, gameOver]);

  useEffect(() => {
    if (completed && gameStarted) {
      startNextWord();
    }
  }, [completed, gameStarted]);

  useEffect(() => {
    if (!gameStarted) {
      setWords([...initialWords]);
    }
  }, [gameStarted]);

  const startGame = () => {
    setWords(initialWords.slice());
    setCurrentWord(initialWords[0]);
    setWords(words.slice(1));
    setCurrentPosition(0);
    setCompleted(false);
    setGameOver(false);
    setGameStarted(true);
    setTotalTime(60);
    setMistakeMade(false); // ゲームをリセットする際にミスフラグもリセット
  };

  const startNextWord = () => {
    if (words.length > 0) {
      setCurrentWord(words[0]);
      setWords(words.slice(1));
      setCurrentPosition(0);
      setCompleted(false);
      setMistakeMade(false); // 新しい単語のためにミスフラグをリセット
    } else {
      setGameOver(true);
    }
  };

  return (
    <div>
      <h1>タイピングゲーム</h1>
      {!gameStarted ? (
        <button onClick={startGame}>Start Game</button>
      ) : !gameOver ? (
        <div>
          <div style={{ fontSize: "24px" }}>
            {currentWord.split("").map((char, i) => (
              <span
                key={i}
                style={{ color: i < currentPosition ? "orange" : "black" }}
              >
                {char}
              </span>
            ))}
          </div>
          <p>残り時間: {totalTime} 秒</p> {/* 時間制限の表示 */}
        </div>
      ) : (
        <div>
          <p>ゲーム終了！一服しよう！</p>
          <button
            onClick={() => {
              setGameStarted(false);
              setGameOver(false);
              setWords([...initialWords]); // ゲームを再開する準備として単語リストをリセット
            }}
          >
            再びプレイ
          </button>
        </div>
      )}
    </div>
  );
}
