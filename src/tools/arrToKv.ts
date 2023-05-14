//["right","top"..] -> {right:true,top:true...}
export function arrToKv(arr: any[]) {
  return arr
    .map((item) => {
      return {
        [item]: true,
      };
    })
    .reduce((pre, val) => {
      return {
        ...pre,
        ...val,
      };
    });
}
