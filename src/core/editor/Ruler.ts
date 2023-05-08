/**
 * 在min和max中循环，根据currentIndex来返回对应索引的ascii字符。例如asciiMin为65，当索引为0的时候也就是返回ascii65所对应的字符。超过asciiMax的时候
 * 会从asciiMin开始循环。
 * @param currentIndex
 * @param asciiLMin
 * @param asciiMax
 * @returns
 */
export function getLoopValue(currentIndex: number, asciiLMin: number, asciiMax: number) {
  asciiMax = asciiMax + 1;
  const loopValue = (currentIndex - asciiMax) % (asciiMax - asciiLMin);

  return String.fromCharCode((loopValue < 0 ? loopValue + asciiMax - asciiLMin : loopValue) + asciiLMin);
}

/**
 * 获取列编号
 *
 */
export const getColumnLabel = (columnCount: number): string[] => {
  const asciiLimit = [65, 90];
  const result: string[] = [];

  const previousPrefixCode = {
    isNextLoopPrefixAdd: false, //在下一轮的时候增加前缀索引的值的变量
    isCountAdd: false, //前缀数量增加的锁，自增完就变true，直到下一次需要再次使用
    count: 0,
    prefixes: [] as number[],
  };

  // 遍历columnCount次，push的内容为 A B .... Z AA AB AC .... AAA ...
  for (let i = asciiLimit[0]; i < asciiLimit[0] + columnCount; i++) {
    const tempArr: number[] = [];
    const limitCount = asciiLimit[1] - asciiLimit[0] + 1;
    const currentLoopCode = getLoopValue(i, asciiLimit[0], asciiLimit[1]).charCodeAt(0);

    tempArr.push(i);

    // 判断条件成立的时候，意味着需要前缀数目要多一位。也就是从 A 变成 AA
    if (Math.floor((i - asciiLimit[0]) / limitCount) >= previousPrefixCode.count + 1) {
      const currentIndex = Math.floor(previousPrefixCode.count / limitCount) % limitCount; //当前前缀位置对应的索引。0-26循环，count每26次currentIndex加一

      if (previousPrefixCode.isNextLoopPrefixAdd) {
        previousPrefixCode.isNextLoopPrefixAdd = false;
        previousPrefixCode.prefixes[currentIndex] = previousPrefixCode.prefixes[currentIndex] + 1;
      }

      //如果当前索引位置没有值，则设置一个初始的值
      if (!previousPrefixCode.prefixes[currentIndex]) {
        previousPrefixCode.prefixes[currentIndex] = asciiLimit[0];
      } else {
        previousPrefixCode.isCountAdd = false;

        //为了在这一轮不立即自增前缀，用isNextLoopPrefixAdd来保留自增轮次
        if (currentLoopCode === asciiLimit[1]) {
          previousPrefixCode.isNextLoopPrefixAdd = true;
        }
      }

      //TODO:实现当前缀有2个以上的时候，前面的ZA 通过计算变成恰当的值

      //在当前位置的值到循环最后的时候，把前缀数目增加。这时候还要计算count前面所有的值的结果。
      if (!previousPrefixCode.isCountAdd && previousPrefixCode.prefixes[currentIndex] === asciiLimit[1]) {
        previousPrefixCode.isCountAdd = true;
        previousPrefixCode.count++;
      }
    }

    //组合前缀和当前索引
    result.push(...tempArr.map((item) => previousPrefixCode.prefixes.map((item) => String.fromCharCode(item)).join("") + getLoopValue(item, asciiLimit[0], asciiLimit[1])));
  }
  return result;
};

export const getRowLabel = (): string[] => {
  const result: string[] = [];

  return result;
};
