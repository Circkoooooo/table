import { CellDataElement } from "../../tools/types"
import { IndexType } from "../../types/table.types"

export type DispatchInput = {
	cellIndex: IndexType
	newValue: CellDataElement
}

export type DispatchCellData = {
	cellDataRow: number
	cellDataColumn: number
}
