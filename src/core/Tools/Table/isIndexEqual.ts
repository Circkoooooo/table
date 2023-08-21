import { IndexType } from "../../types/table"

const isIndexEqual = (index?: IndexType, targetIndex?: IndexType) => {
	if (!index || !targetIndex) return false

	return index.rowIndex === targetIndex.rowIndex && index.columnIndex === targetIndex.columnIndex
}

export default isIndexEqual
