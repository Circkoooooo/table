import { IndexType } from "../types/table.types"
import { IsIndexEqual } from "./types"

const isIndexEqual: IsIndexEqual = (index: IndexType | null, targetIndex: IndexType | null) => {
	if (!index || !targetIndex) return false

	return index.rowIndex === targetIndex.rowIndex && index.columnIndex === targetIndex.columnIndex
}

export default isIndexEqual
