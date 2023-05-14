import { Cell, TableColumnHeader, TableDataFrame, TableDataRow, TableFrame, TableRowAndDataFrame, TableRowHeader } from "./Table-styled";
import React, { useCallback, useEffect, useState } from "react";
import { getLabel, getRowLabel } from "./Ruler";

interface ColumnRulerProps {
  columnCount?: number;
}

const tables = [
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
];

const Table: React.FC<ColumnRulerProps> = () => {
  const [tableAddition, setTableAddition] = useState<{
    rowLabels: string[];
    columnLabels: string[];
  }>({ rowLabels: [], columnLabels: [] });

  const [targetTables, setTargetTables] = useState<(number | undefined)[][]>();

  /**
   * 获取当前数据状态下的的label
   */
  const getCurrentTableAddition = () => {
    return {
      rowLabels: getRowLabel(26 < tables.length ? tables.length : 26, 0),
      columnLabels: tables[0] !== undefined ? getLabel(26 < tables[0].length ? tables[0].length : 26, "A", "Z") : [],
    };
  };

  /**
   * 根据table的行数和列数生成填充0的表格，然后把table中的内容复制过来
   */
  const buildMaskTables = useCallback(() => {
    return Array.from({ length: tableAddition.rowLabels.length }, (v, row) => {
      return Array.from({ length: tableAddition.columnLabels.length }, (v, column) => {
        if (row < tables.length && column < tables[row].length) {
          return tables[row][column];
        }
        return undefined;
      });
    });
  }, [tableAddition.rowLabels.length, tableAddition.columnLabels.length]);

  useEffect(() => {
    setTargetTables(buildMaskTables());

    if (tableAddition.rowLabels.length !== tables.length || tableAddition.columnLabels.length !== tables[0].length) {
      setTableAddition(getCurrentTableAddition());
    }
  }, [buildMaskTables, tableAddition.columnLabels.length, tableAddition.rowLabels.length]);

  //列表头
  const RenderColumnHeader = () => {
    return (
      <>
        <Cell top left right></Cell>
        {tableAddition.columnLabels.map((value, index) => {
          return (
            <Cell right top dark key={value}>
              {value}
            </Cell>
          );
        })}
      </>
    );
  };

  //行表头和行列功能格
  const RenderRowHeader = () => {
    return (
      <TableRowHeader>
        {tableAddition.rowLabels.map((value, index) => {
          if (index !== tableAddition.rowLabels.length - 1) {
            return (
              <Cell right left top dark key={value}>
                {value}
              </Cell>
            );
          } else {
            return (
              <Cell right left top bottom dark key={value}>
                {value}
              </Cell>
            );
          }
        })}
      </TableRowHeader>
    );
  };

  const RenderTableData = () => {
    return (
      <>
        {targetTables &&
          targetTables.map((item, row) => {
            return (
              <TableDataRow key={tableAddition.rowLabels[row]}>
                {item.map((value, column) => {
                  const key = `${tableAddition.columnLabels[column]}-${tableAddition.rowLabels[row]}`;
                  if (row !== tableAddition.rowLabels.length - 1) {
                    return (
                      <Cell right top key={key}>
                        {value}
                      </Cell>
                    );
                  } else {
                    return (
                      <Cell right top bottom key={key}>
                        {value}
                      </Cell>
                    );
                  }
                })}
              </TableDataRow>
            );
          })}
      </>
    );
  };

  return (
    <TableFrame>
      <TableColumnHeader>
        <RenderColumnHeader />
      </TableColumnHeader>
      <TableRowAndDataFrame>
        <TableRowHeader>
          <RenderRowHeader />
        </TableRowHeader>
        <TableDataFrame>
          <RenderTableData />
        </TableDataFrame>
      </TableRowAndDataFrame>
    </TableFrame>
  );
};

export default Table;
