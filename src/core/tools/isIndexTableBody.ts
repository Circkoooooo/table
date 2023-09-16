import { CellData } from "../cellDataHandler"

/**
 * indexes should not be 0 or out of the max indexes.
 * @param cellData
 * @param rowIndex
 * @param columnIndex
 * @returns
 */
const isIndexTableBody = (rowIndex: number, columnIndex: number, maxRowLength: number, maxColumnlength: number) => {
	if (rowIndex === 0 || columnIndex === 0) return false
	if (rowIndex > maxRowLength || columnIndex > maxColumnlength) return false
	return true
}

export default isIndexTableBody
