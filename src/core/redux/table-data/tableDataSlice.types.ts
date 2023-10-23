import { CellDataElement } from "../../cellDataHandler"
import { IndexType } from "../../types/table"

export type DispatchInput = {
	cellIndex: IndexType
	newValue: CellDataElement
}

export type DispatchCellData = {
	cellDataRow: number
	cellDataColumn: number
}
