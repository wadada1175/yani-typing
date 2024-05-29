import parseSentence from "@/utils/parseSentence";
import JapaneseSentences from "@/app/data/JapaneseSentencesData";

export const japaneseWordsList: string[] = [];
export const romanWordsList: string[][][] = [];
export const initialTime = 10;
const initRomanWordsList: string[][] = [];

// JapaneseSentencesのhiraganaをparseして、romanWordsListに追加する
JapaneseSentences.forEach((item) => {
  japaneseWordsList.push(item.sentence);
  const parsed = parseSentence(item.hiragana);
  romanWordsList.push(parsed);
});

// 初期値の設定
romanWordsList.forEach((item) => {
  const word: string[] = [];
  item.forEach((el) => {
    const char: string = el[0];
    word.push(char);
  });
  initRomanWordsList.push(word);
});
