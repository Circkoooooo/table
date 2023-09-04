import { CellDataElement } from "../cellDataHandler"

export type AbstractTableElementType = string | number | undefined | null

export type CurrentSelectCellInfo = {
	selectRowIndex: number
	selectColumnIndex: number
	pointerRowIndex?: number
	pointerColumnIndex?: number
	oldSelectSell?: HTMLDivElement
	newTargetTable?: AbstractTableElementType[][]
}

export type TableAddition = {
	rowLabels: string[]
	columnLabels: string[]
}

export namespace TableMouseItemCallback {
	export type TableMousedownItemCallbackParams = {
		rowIndex: number
		columnIndex: number
	}

	export type TableMousemoveItemCallbackParams = {
		rowIndex: number
		columnIndex: number
	}

	export type TableInputItemCallbackParams = {
		rowIndex: number
		columnIndex: number
		oldValue: CellDataElement
		newValue: CellDataElement
	}
}
