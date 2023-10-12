import isIndexEqual from "./tools/isIndexEqual"
import { isTableHeader } from "./tools/isIndexHeader"
import { IndexType } from "./types/table.type"

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
	let startRowIndex = mousedownIndex.columnIndex
	let startColumnIndex = mousedownIndex.rowIndex
	let endRowIndex = mousedownIndex.columnIndex
	let endColumnIndex = mousedownIndex.rowIndex
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
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endColumnIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endRowIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

		if (rowIndex === 0) {
			columnCellCount = rowNumber
			rowCellCount += endRowIndex - startRowIndex
		}

		if (columnIndex === 0) {
			rowCellCount = columnNumber
			columnCellCount += endColumnIndex - startColumnIndex
		}

		// 判断是否点击的选中所有行列的单元格
		if (rowIndex === 0 && columnIndex === 0) {
			rowCellCount = columnNumber
			columnCellCount = rowNumber
		}
	} else if (isMulti && !isRowColumnHeader) {
		//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endColumnIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endRowIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

		rowCellCount += endRowIndex - startRowIndex
		columnCellCount += endColumnIndex - startColumnIndex
	}

	return {
		startRowIndex: startRowIndex - bodyStartIndex,
		startColumnIndex: startColumnIndex - bodyStartIndex,
		rowCellCount,
		columnCellCount,
	}
}
