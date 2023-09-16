import { CellDataElement } from "../../cellDataHandler"
import { IndexType } from "../../types/table.type"

export type DispatchMousedown = {
	cellIndex: IndexType
}

export type DispatchMousemove = {
	cellIndex: IndexType
}

export type DispatchMouseup = {}

export type DispatchInput = {
	cellIndex: IndexType
	newValue: CellDataElement
}
