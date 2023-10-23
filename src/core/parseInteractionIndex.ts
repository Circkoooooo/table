import isIndexEqual from "./tools/isIndexEqual"
import { isTableHeader } from "./tools/isIndexHeader"
import { IndexType } from "./types/table.types"

/**
 *
 * @param mousedownIndex 鼠标点击状态所处单元格的索引
 * @param mousemoveIndex 鼠标点击后移动到的单元格的索引
 * @param containerMaxWidth 画布容器最大的渲染宽度
 * @param containerMaxHeight
 * @param cellLogicWidth 每一个单元格默认情况下的包含边框的宽度
 * @param cellLogicHeight
 * @returns
 */
export const parseInteractionIndex = (mousedownIndex: IndexType | null, mousemoveIndex: IndexType | null, rowNumber: number, columnNumber: number) => {
	if (!mousedownIndex || !mousemoveIndex) return null

	//记录的初始的点击索引
	let startColumnIndex = mousedownIndex.columnIndex
	let startRowIndex = mousedownIndex.rowIndex
	let endColumnIndex = mousedownIndex.columnIndex
	let endRowIndex = mousedownIndex.rowIndex
	let rowCellCount = 1
	let columnCellCount = 1
	const bodyStartIndex = 1
	let isRowColumnHeader = false

	//判断是否是拖动状态
	const isMulti = !isIndexEqual(mousedownIndex, mousemoveIndex)
	const isHeader = isTableHeader(mousedownIndex.rowIndex, mousedownIndex.columnIndex)

	const { rowIndex, columnIndex } = mousedownIndex

	// 判断是否点击的选中所有行列的单元格
	if (rowIndex === 0 && columnIndex === 0) {
		isRowColumnHeader = true
	} else {
		isRowColumnHeader = false
	}

	if (isHeader) {
		//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

		if (columnIndex === 0) {
			columnCellCount += endRowIndex - startRowIndex
			rowCellCount = columnNumber
		}

		if (rowIndex === 0) {
			rowCellCount += endColumnIndex - startColumnIndex
			columnCellCount = rowNumber
		}

		// 判断是否点击的选中所有行列的单元格
		if (rowIndex === 0 && columnIndex === 0) {
			rowCellCount = columnNumber
			columnCellCount = rowNumber
		}
	} else if (isMulti && !isRowColumnHeader) {
		//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

		columnCellCount += endRowIndex - startRowIndex
		rowCellCount += endColumnIndex - startColumnIndex
	}

	return {
		startRowIndex: startRowIndex - bodyStartIndex,
		startColumnIndex: startColumnIndex - bodyStartIndex,
		rowCellCount,
		columnCellCount,
	}
}
