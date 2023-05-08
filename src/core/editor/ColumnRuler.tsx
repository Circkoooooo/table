import React, { useCallback, useEffect, useState } from "react";
import { getColumnLabel } from "./Ruler";
import { Cell } from "./Table-styled";

interface ColumnRulerProps {
  columnCount?: number;
}

type ColumnRulerConfigs = {
  columnCount: number;
  columnArr: string[];
};

const ColumnRuler: React.FC<ColumnRulerProps> = ({ columnCount = 10 }) => {
  const [config, setConfig] = useState<ColumnRulerConfigs | null>(null);

  //init
  const initConfig = useCallback(() => {
    const columnArr = getColumnLabel(1000);
    const tempConfig: ColumnRulerConfigs = {
      columnCount,
      columnArr,
    };

    setConfig(tempConfig);
  }, [columnCount]);

  useEffect(() => {
    initConfig();
  }, [initConfig]);

  return (
    <div
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {config?.columnArr.map((item, index) => (
        <Cell {...{ cellColumnIndex: index }}>{item}</Cell>
      ))}
    </div>
  );
};

export default ColumnRuler;
