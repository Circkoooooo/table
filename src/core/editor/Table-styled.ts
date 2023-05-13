import styled from "styled-components";

interface CellProps {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  dark?: boolean;
}

// 单元格
export const Cell = styled.div<CellProps>(({ top, right, bottom, left, dark }) => {
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
    "background-color": dark ? "#f0f0f0" : "#fff",
    textAlign: "center",
    "vertical-align": "top",
    "user-select": "none",
  };
});

// data最外层容器
export const TableFrame = styled.div`
  white-space: nowrap;
`;

export const TableRowHeader = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: sticky;
  left: 0;
`;

export const TableColumnHeader = styled.div`
  position: sticky;
  top: 0;
`;

export const TableRowAndDataFrame = styled.div`
  display: flex;
`;

export const TableDataFrame = styled.div`
  display: inline-block;
`;

export const TableDataRow = styled.div`
  display: flex;
`;
