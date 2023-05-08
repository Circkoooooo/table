import { TableFrame } from "./Table-styled";
import ColumnRuler from "./ColumnRuler";

const Table = () => {
  return (
    <TableFrame>
      <ColumnRuler />

      {/* <RowRuler></RowRuler> */}
    </TableFrame>
  );
};

export default Table;
