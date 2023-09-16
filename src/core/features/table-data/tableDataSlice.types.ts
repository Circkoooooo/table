import { CellDataElement } from "../../cellDataHandler"
import { IndexType } from "../../types/table.type"

export type DispatchInput = {
	cellIndex: IndexType
	newValue: CellDataElement
}
