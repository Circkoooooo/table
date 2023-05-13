import styled from "styled-components";

interface CellProps {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  transparent?: boolean;
}

// 表格最外层容器
export const TableFrame = styled.div``;

// 单元格
export const Cell = styled.div<CellProps>(({ top, right, bottom, left }) => {
  const DEFAULT_BORDER_WIDTH = 1;
  const CLEAR_BORDER_WIDTH = 0;

  const borderWidth = [
    `${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
    `${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
    `${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
    `${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
  ];

  return {
    width: "100px",
    height: "30px",
    lineHeight: "30px",
    display: "inline-block",
    "border-color": "rgba(0,0,0,0.15)",
    "border-width": borderWidth.join(" "),
    "border-style": "solid",
    textAlign: "center",
    "vertical-align": "top",
  };
});
