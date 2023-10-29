import { IsIndexTableBody } from "./types"

/**
 * indexes should not be 0 or out of the max indexes.
 * @param cellData
 * @param rowIndex
 * @param columnIndex
 * @returns
 */
const isIndexTableBody: IsIndexTableBody = (rowIndex: number, columnIndex: number, maxRowLength: number, maxColumnlength: number) => {
	if (rowIndex === 0 || columnIndex === 0) return false
	if (rowIndex > maxRowLength - 1 || columnIndex > maxColumnlength - 1) return false
	return true
}

export default isIndexTableBody
