import styled from "styled-components";

interface CellProps {
  cellColumnIndex: number;
}

// 表格最外层容器
export const TableFrame = styled.div`
  /* min-width: 100%; */
  /* min-height: 100%; */
  padding: 5px;
`;

// 单元格
export const Cell = styled.div<CellProps>`
  width: 100px;
  display: inline-block;
  border-color: rgba(0, 0, 0, 0.15);
  border-width: 2px 2px 2px ${(props) => (props.cellColumnIndex === 0 ? "2px" : "0px")};
  border-style: solid;
`;
