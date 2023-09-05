import { CellData } from "../cellDataHandler"

/**
 * indexes should not be 0 or out of the max indexes.
 * @param cellData
 * @param rowIndex
 * @param columnIndex
 * @returns
 */
const isIndexTableBody = (cellData: CellData, rowIndex: number, columnIndex: number) => {
	if (rowIndex === 0 || columnIndex === 0) return false
	if (rowIndex > cellData.length - 1 || (cellData[0] && columnIndex > cellData[0].length - 1)) return false
	return true
}

export default isIndexTableBody
