import React, { useEffect, useState } from "react";
import { getLabel, getRowLabel } from "./Ruler";
import { Cell } from "./Table-styled";

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

const ColumnRuler: React.FC<ColumnRulerProps> = ({ columnCount = tables[0].length || 26 }) => {
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
            <Cell right top key={value}>
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
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        {tableAddition.rowLabels.map((value, index) => {
          if (index !== tableAddition.rowLabels.length - 1) {
            return (
              <Cell right left top key={value}>
                {value}
              </Cell>
            );
          } else {
            return (
              <Cell right left top bottom key={value}>
                {value}
              </Cell>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {/* column */}
      <RenderColumnHeader />
      <div
        style={{
          display: "flex",
        }}
      >
        {/* row */}
        <RenderRowHeader />
        <div
          style={{
            display: "inline-block",
          }}
        >
          {/* row tables data */}
          {targetTables.map((item, row) => {
            return (
              <div
                key={tableAddition.rowLabels[row]}
                style={{
                  display: "flex",
                }}
              >
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColumnRuler;
