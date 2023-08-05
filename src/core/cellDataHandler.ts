import { getColumnLabel, getRowLabel } from "./ruler"

interface FullTableEmptyDataParams {
	rowNum: number
	columnNum: number
}

export type CellDataElement = string | number | null

export type CellData = CellDataElement[][]

/**
 * 根据row column数目返回一个矩阵 r * c
 * @param params
 */
export const createEmptyCellData = (params: FullTableEmptyDataParams): CellData => {
	const { rowNum, columnNum } = params

	return Array.from(Array(rowNum), () => new Array(columnNum).fill(null))
}

/**
 * 将数组处理成带label的
 * @param emptyRulerCellData
 */
export const createRulerCellData = (emptyRulerCellData: CellData) => {
	const result = {
		data: emptyRulerCellData,
		info: {
			rowLength: emptyRulerCellData.length,
			columnLength: emptyRulerCellData[0] && emptyRulerCellData[0].length,
		},
	}

	if (emptyRulerCellData.length === 0) return result

	const rowLength = emptyRulerCellData.length
	const columnLength = emptyRulerCellData[0].length

	const columnLabels = getColumnLabel(columnLength, 65, 90)
	const rowLabels = getRowLabel(rowLength, 0)

	const resolvedColumnCellData = [...emptyRulerCellData].map((item, i) => {
		item.unshift(rowLabels[i])
		return item
	})

	const rulerCellData = [[null, ...columnLabels], ...resolvedColumnCellData]

	return {
		data: rulerCellData,
		info: {
			rowLength: rulerCellData.length,
			columnLength: rulerCellData[0].length,
		},
	}
}
