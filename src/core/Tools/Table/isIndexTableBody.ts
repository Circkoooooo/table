import { CellData } from "../../cellDataHandler"

const isIndexTableBody = (cellData: CellData, rowIndex: number, columnIndex: number) => {
	if (rowIndex === 0 || columnIndex === 0) return false
	if (rowIndex > cellData.length - 1 || (cellData[0] && columnIndex > cellData[0].length - 1)) return false
	return true
}

export default isIndexTableBody
