import { IsIndexHeader } from "./types"

export const isTableHeader: IsIndexHeader = (rowIndex: number, columnIndex: number) => {
	return rowIndex === 0 || columnIndex === 0
}
