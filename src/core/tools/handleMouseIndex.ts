import { IndexType } from "../types/table.types"
import { CalcIndexFromMouseIndex } from "./types"

/**
 * 根据点击的索引和鼠标移动到的索引，来计算形成的矩形行列开始结束索引。
 * @param mousedownIndex
 * @param mousemoveIndex
 * @returns
 */
export const calcIndexFromMouseIndex: CalcIndexFromMouseIndex = (mousedownIndex: IndexType, mousemoveIndex: IndexType) => {
	const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
	const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

	const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
	const rowEndIndex = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1

	const columnStartIndex = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
	const columnEndIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

	return {
		rowStartIndex,
		rowEndIndex,
		columnStartIndex,
		columnEndIndex,
	}
}
