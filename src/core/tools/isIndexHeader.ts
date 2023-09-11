export const isTableHeader = (rowIndex: number, columnIndex: number) => {
	return rowIndex === 0 || columnIndex === 0
}
