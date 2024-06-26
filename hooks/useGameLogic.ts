"use client";
import { useState, useEffect } from "react";
import {
  japaneseWordsList,
  romanWordsList,
  initialTime,
} from "@/utils/initializeData";

const useGameLogic = () => {
  const [japaneseWords, setJapaneseWords] = useState<string[]>([]);
  const [currentJapaneseWord, setCurrentJapaneseWord] = useState<string>("");
  const [romanWords, setRomanWords] = useState<string[][][]>([]);
  const [currentRomanWord, setCurrentRomanWord] = useState<string[][]>([]);
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
  const [currentInput, setCurrentInput] = useState<string>("");
  const [correctlyTypedCharacters, setCorrectlyTypedCharacters] = useState<string>("");

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
      setCompleted(false);
      startNextWord();
    }
  }, [completed]);

  // キーボードイベントを処理する
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || !currentRomanWord || !gameStarted) return;

      const nextCharOptions = currentRomanWord[currentPosition];
      const newInput = currentInput + event.key;
      
      if (nextCharOptions.some((option) => option.startsWith(newInput))) {
        setCorrectlyTypedCharacters((prev) => prev + event.key);
        setCurrentInput(newInput);
        if (nextCharOptions.includes(newInput)) {
          const nextPosition = currentPosition + 1;
          setCurrentPosition(nextPosition);
          setCurrentInput(''); // 正しく入力されたら入力をリセット
          setMistakeMade(false);
          // 正しく入力された文字数を記録する
          setTrueTotalTypes((prevTotal) => prevTotal + 1);
          if (nextPosition === currentRomanWord.length) {
            setCompleted(true);
            // ミスが無かった場合に時間を追加する
            if (!mistakeMade) {
              setLimitTime((prevTime) => prevTime + 5);
              setTotalTime((prevTime) => prevTime + 5);
            }
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
  }, [
    currentPosition,
    currentJapaneseWord,
    currentRomanWord,
    gameOver,
    gameStarted,
    mistakeMade,
    currentInput, // currentInputを依存配列に追加
  ]);

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
  const startNextWord = () => {
    if (japaneseWords.length > 0) {
      setCurrentJapaneseWord(japaneseWords[0]);
      setCurrentRomanWord(romanWords[0]);
      setJapaneseWords(japaneseWords.slice(1));
      setRomanWords(romanWords.slice(1));
      setCurrentPosition(0);
      setMistakeMade(false);
      setCorrectlyTypedCharacters("");
    } else {
      setGameOver(true);
    }
  };

  // ゲームが開始されたときに単語リストをリセットする
  useEffect(() => {
    if (!gameStarted) {
      setJapaneseWords([...japaneseWordsList]);
      setRomanWords([...romanWordsList]);
    }
  }, [gameStarted]);

  // スタート画面を表示する
  const goToStartScreen = () => {
    setStartScreen(true);
  };
  // 初期画面に戻る
  const goToInitScreen = () => {
    setStartScreen(false);
    setGameStarted(false);
    setGameOver(false);
    setJapaneseWords([...japaneseWordsList]);
    setRomanWords([...romanWordsList]); // ゲームを再開する準備として単語リストをリセット
  };

  //
  useEffect(() => {
    const handleEnterOrSpace = (event: KeyboardEvent) => {
      if (!startScreen && gameStarted) return;
      if (gameOver) return;
      if (gameStarted) return;
      if (!startScreen && !gameOver && !gameStarted) return;
      if (event.key === "Enter" || event.key === " ") {
        startGame();
      }
    };

    window.addEventListener("keydown", handleEnterOrSpace);
    return () => window.removeEventListener("keydown", handleEnterOrSpace);
  }, [startScreen, gameStarted, gameOver]);

  // ゲームを開始する(初期化)
  const startGame = () => {
    setJapaneseWords(japaneseWordsList.slice());
    setRomanWords(romanWordsList.slice());
    setCurrentJapaneseWord(japaneseWordsList[0]);
    setCurrentRomanWord(romanWordsList[0]);
    setJapaneseWords(japaneseWords.slice(1));
    setRomanWords(romanWords.slice(1));
    setCurrentPosition(0);
    setCurrentInput(""); // ゲーム開始時にリセット
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
    setCorrectlyTypedCharacters("");
  };

  // ゲームを再開する
  const readyGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setJapaneseWords([...japaneseWordsList]);
    setRomanWords([...romanWordsList]); // ゲームを再開する準備として単語リストをリセット
  };

  return {
    currentJapaneseWord,
    currentRomanWord,
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
    currentInput, // currentInputをここで返す
    correctlyTypedCharacters
  };
};

export default useGameLogic;
