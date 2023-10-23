import { IndexType } from "../types/table.types"

/**
 * Parse the start and end index from mousedownIndex and mousemoveIndex.
 * @param mousedownIndex
 * @param mousemoveIndex
 * @returns
 */
export const calcIndexFromMouseIndex = (mousedownIndex: IndexType, mousemoveIndex: IndexType) => {
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
