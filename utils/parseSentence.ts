import romanTypingParseDictionary from "@/app/data/romanTypingParseDictionary";

const parseSentence = (sentence: string) => {
    const result: string[][] = [];
    let pattern: string[] = [];
    let index = 0;
    while (index < sentence.length) {
        const uni = sentence[index];
        const next = sentence[index + 1];
        const next2 = sentence[index + 2];
        let findIndex = 0;
  
        if (romanTypingParseDictionary.some((item) => item.Pattern === uni + next + next2)) {
            findIndex = romanTypingParseDictionary.findIndex((item) => item.Pattern === uni + next + next2);
            romanTypingParseDictionary[findIndex].TypePattern.forEach((item) => {
                pattern.push(item);
            });
            result.push(pattern);
            pattern = [];
            index += 2;
        } else if (romanTypingParseDictionary.some((item) => item.Pattern === uni + next)) {
            findIndex = romanTypingParseDictionary.findIndex((item) => item.Pattern === uni + next);
            romanTypingParseDictionary[findIndex].TypePattern.forEach((item) => {
                pattern.push(item);
            });
            result.push(pattern);
            pattern = [];
            index += 1;
        } else if (romanTypingParseDictionary.some((item) => item.Pattern === uni)) {
            findIndex = romanTypingParseDictionary.findIndex((item) => item.Pattern === uni);
            romanTypingParseDictionary[findIndex].TypePattern.forEach((item) => {
                pattern.push(item);
            });
            result.push(pattern);
            pattern = [];
        } else {
            console.log("Not found");
        }
        index++;
    }
    return result;
  };
  export default parseSentence