import { CellDataElement } from "../../cellDataHandler"
import { IndexType } from "../../types/table"

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

export type DispatchMousemoveHeader = {
	cellIndex: IndexType | null
}
