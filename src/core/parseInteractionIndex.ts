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
export const parseInteractionIndex = (
	mousedownIndex: IndexType | null,
	mousemoveIndex: IndexType | null,
	containerMaxWidth: number,
	containerMaxHeight: number,
	cellLogicWidth: number,
	cellLogicHeight: number
) => {
	if (!mousedownIndex || !mousemoveIndex) return null

	//记录的初始的点击索引
	let startRowIndex = mousedownIndex.rowIndex
	let startColumnIndex = mousedownIndex.columnIndex
	let endRowIndex = mousedownIndex.rowIndex
	let endColumnIndex = mousedownIndex.columnIndex
	let rowCellCount = 1
	let columnCellCount = 1
	const bodyStartIndex = 1

	//判断是否是拖动状态
	const isMulti = !isIndexEqual(mousedownIndex, mousemoveIndex)

	const isHeader = isTableHeader(mousedownIndex.rowIndex, mousedownIndex.columnIndex)

	if (isHeader) {
		//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

		if (mousedownIndex.rowIndex === 0) {
			rowCellCount = Math.floor(containerMaxWidth / cellLogicWidth)
			columnCellCount += endColumnIndex - startColumnIndex
		}
		if (mousedownIndex.columnIndex === 0) {
			columnCellCount = Math.floor(containerMaxHeight / cellLogicHeight)
			rowCellCount += endRowIndex - startRowIndex
		}
	} else if (isMulti) {
		//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
		startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
		startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
		endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
		endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

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
