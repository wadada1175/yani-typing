// hooks/useGameLogic.ts
"use client";
import { useState, useEffect } from "react";

const initialWords = ["tabacco", "smoke", "lighter", "test"]; // 初期単語リスト

const useGameLogic = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(60);
  const [mistakeMade, setMistakeMade] = useState<boolean>(false);

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
            setTotalTime((prevTime) => prevTime + 5);
          }
        }
      } else {
        setMistakeMade(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentWord, gameOver, gameStarted, mistakeMade]);

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
    setTotalTime(10);
    setMistakeMade(false);
  };

  const readyGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setWords([...initialWords]); // ゲームを再開する準備として単語リストをリセット
  };

  const startNextWord = () => {
    if (words.length > 0) {
      setCurrentWord(words[0]);
      setWords(words.slice(1));
      setCurrentPosition(0);
      setCompleted(false);
      setMistakeMade(false);
    } else {
      setGameOver(true);
    }
  };

  return {
    currentWord,
    currentPosition,
    gameOver,
    gameStarted,
    totalTime,
    startGame,
    readyGame,
  };
};

export default useGameLogic;
