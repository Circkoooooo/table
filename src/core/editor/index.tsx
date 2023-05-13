import { Cell, TableColumnHeader, TableDataFrame, TableDataRow, TableFrame, TableRowAndDataFrame, TableRowHeader } from "./Table-styled";
import React, { useEffect, useState } from "react";
import { getLabel, getRowLabel } from "./Ruler";

interface ColumnRulerProps {
  columnCount?: number;
}

const tables = [
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [4, 5, 6, 7, 8, 8],
];

const Table: React.FC<ColumnRulerProps> = ({ columnCount = tables[0].length || 26 }) => {
  const [tableAddition, setTableAddition] = useState({
    rowLabels: getRowLabel(26 < tables.length ? tables.length : 26, 0),
    columnLables: getLabel(26 < columnCount ? columnCount : 26, "A", "Z"),
  });

  const [targetTables, setTargetTables] = useState<(number | undefined)[][]>(tables);

  const buildMaskTables = () => {
    return Array.from({ length: tableAddition.rowLabels.length }, (v, row) => {
      return Array.from({ length: tableAddition.columnLables.length }, (v, column) => {
        if (row < tables.length && column < tables[row].length) {
          return tables[row][column];
        }
      });
    });
  };

  useEffect(() => {
    setTargetTables(buildMaskTables());
  }, []);

  //列表头
  const RenderColumnHeader = () => {
    return (
      <>
        <Cell top left right transparent></Cell>
        {tableAddition.columnLables.map((value, index) => {
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
        {targetTables.map((item, row) => {
          return (
            <TableDataRow key={tableAddition.rowLabels[row]}>
              {item.map((value, column) => {
                const key = `${tableAddition.columnLables[column]}-${tableAddition.rowLabels[row]}`;
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
