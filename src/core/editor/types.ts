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
