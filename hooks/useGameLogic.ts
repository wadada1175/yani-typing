// hooks/useGameLogic.ts
"use client";
import { useState, useEffect } from "react";

const initialWords = ["tabacco", "smoke", "lighter", "test"]; // 初期単語リスト
const initialTime = 10; // 初期時間

const useGameLogic = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [limitTime, setLimitTime] = useState<number>(0);
  const [mistakeMade, setMistakeMade] = useState<boolean>(false);
  const [totalWordsTyped, setTotalWordsTyped] = useState<number>(0);
  const [trueTotalTypes, setTrueTotalTypes] = useState<number>(0);
  const [mistakeTotalTypes, setMistakeTotalTypes] = useState<number>(0);
  const [totalSpentTime, setTotalSpentTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [averageTypes, setAverageTypes] = useState<number>(0);
  const [startScreen, setStartScreen] = useState<boolean>(false);

  // ゲームが終了したときに平均キータイプ数を計算する
  useEffect(() => {
    if (gameOver) {
      setTotalSpentTime(totalTime - limitTime);
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      setAverageTypes(parseFloat((trueTotalTypes / totalSpentTime).toFixed(1)));
    }
  }, [gameOver, totalSpentTime]);

  // 何単語打てたかを記録する
  useEffect(() => {
    if (completed) {
      setTotalWordsTyped((prevTotal) => prevTotal + 1);
    }
  }, [completed]);


  // キーボードイベントを処理する
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || !currentWord || !gameStarted) return;
      const nextChar = currentWord.charAt(currentPosition);
      if (event.key === nextChar) {
        const nextPosition = currentPosition + 1;
        setCurrentPosition(nextPosition);
        // 正しく入力された文字数を記録する
        setTrueTotalTypes((prevTotal) => prevTotal + 1);
        if (nextPosition === currentWord.length) {
          setCompleted(true);
          // ミスが無かった場合に時間を追加する
          if (!mistakeMade) {
            setLimitTime((prevTime) => prevTime + 5);
            setTotalTime((prevTime) => prevTime + 5);
          }
        }
      } else {
        setMistakeMade(true);
        // 間違った文字数を記録する
        setMistakeTotalTypes((prevTotal) => prevTotal + 1);
      }

      // ESCキーを押すとゲームをリセットする
      if (event.key === "Escape") {
        readyGame();
      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentWord, gameOver, gameStarted, mistakeMade]);

  // ゲームの残り時間を管理する
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // timerの型を正しく定義
    if (gameStarted && !gameOver) {
      timer = setTimeout(() => {
        setLimitTime((prevTime) => prevTime - 1);
        if (limitTime <= 0) {
          setGameOver(true);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer); // clearTimeoutを呼び出して、適切なクリーンアップを提供
    };
  }, [limitTime, gameStarted, gameOver]);

  // 単語が正しく入力されたときに次の単語を表示する
  useEffect(() => {
    if (completed && gameStarted) {
      startNextWord();
    }
  }, [completed, gameStarted]);

  // ゲームが開始されたときに単語リストをリセットする
  useEffect(() => {
    if (!gameStarted) {
      setWords([...initialWords]);
    }
  }, [gameStarted]);

  // スタート画面を表示する
  const goToStartScreen = () => {
    setStartScreen(true);
  }
  // 初期画面に戻る
  const goToInitScreen = () => {
    setStartScreen(false);
    setGameStarted(false);
    setGameOver(false);
    setWords([...initialWords]); // ゲームを再開する準備として単語リストをリセット
  }

  // 
  useEffect(() => {
    const handleEnterOrSpace = (event: KeyboardEvent) => {
      if (!startScreen && gameStarted) return;
      if (event.key === "Enter" || event.key === " ") {
        startGame();
      }
    };

    window.addEventListener("keydown", handleEnterOrSpace);
    return () => window.removeEventListener("keydown", handleEnterOrSpace);
  }, [startScreen, gameStarted]);


  // ゲームを開始する(初期化)
  const startGame = () => {
    setWords(initialWords.slice());
    setCurrentWord(initialWords[0]);
    setWords(words.slice(1));
    setCurrentPosition(0);
    setCompleted(false);
    setGameOver(false);
    setGameStarted(true);
    setLimitTime(initialTime);
    setMistakeMade(false);
    setTotalWordsTyped(0);
    setTrueTotalTypes(0);
    setMistakeTotalTypes(0);
    setTotalSpentTime(initialTime);
    setTotalTime(initialTime);
  };

  // ゲームを再開する
  const readyGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setWords([...initialWords]); // ゲームを再開する準備として単語リストをリセット
  };

  // 次の単語を表示する
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
    limitTime,
    startGame,
    readyGame,
    totalWordsTyped,
    trueTotalTypes,
    mistakeTotalTypes,
    averageTypes,
    startScreen,
    goToStartScreen,
    goToInitScreen,
  };
};

export default useGameLogic;
