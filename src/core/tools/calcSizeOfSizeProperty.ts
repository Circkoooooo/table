import { WithRulerCellData } from "../cellDataHandler"
import { TABLE_CONFIG } from "../configs/table_config"
import { IndexType, SizeProperty } from "../types/table.type"

export const calcSizeOfSizeProperty = (index: SizeProperty.RowColumnSizeProperty, mousedownIndex: IndexType, mousemoveIndex: IndexType, withRulerCellData: WithRulerCellData) => {
	const { DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT } = TABLE_CONFIG

	const {
		info: { rowLength, columnLength },
	} = withRulerCellData

	// sum all cell's length in default size
	const sumHeight = Array.from({ length: rowLength }).fill(DEFAULT_CELL_HEIGHT) as number[]
	const sumWidth = Array.from({ length: columnLength }).fill(DEFAULT_CELL_WIDTH) as number[]

	// replace
	const { rowSizeProperty, columnSizeProperty } = index
	const rowSizeRangeItemProperty = rowSizeProperty.filter((item) => !item.isSingleItem) as Array<SizeProperty.RowSizeRangeItemProperty>
	const rowSizeSingleItemProperty = rowSizeProperty.filter((item) => item.isSingleItem) as Array<SizeProperty.RowSizeSingleItemProperty>
	const columnSizeRangeItemProperty = columnSizeProperty.filter((item) => !item.isSingleItem) as Array<SizeProperty.ColumnSizeRangeItemProperty>
	const columnSizeSingleItemProperty = columnSizeProperty.filter((item) => item.isSingleItem) as Array<SizeProperty.ColumnSizeSingleItemProperty>

	// sum height
	const sumHeightArr = sumHeight.map((item, index) => {
		const heightItems = [] as number[]

		// const rowSizeRangeLastItem = rowSizeRangeItemProperty.findLast(() => true)
		const rowSizeRangeItems = rowSizeRangeItemProperty.filter(({ startRowIndex, endRowIndex, height }) => {
			return startRowIndex <= index && endRowIndex >= index
		})

		const rowSizeSingleItems = rowSizeSingleItemProperty.filter((item) => {
			return item.rowIndex === index
		})

		if (rowSizeRangeItems.length !== 0) {
			heightItems.push(rowSizeRangeItems[rowSizeRangeItems.length - 1].height)
		}

		if (rowSizeSingleItems.length !== 0) {
			heightItems.push(rowSizeSingleItems[rowSizeSingleItems.length - 1]?.height)
		}

		if (heightItems.length === 0) return DEFAULT_CELL_HEIGHT
		return heightItems[heightItems.length - 1]
	})

	// sum width
	const sumWidthArr = sumWidth.map((item, index) => {
		const widthItems = [] as number[]

		// const rowSizeRangeLastItem = rowSizeRangeItemProperty.findLast(() => true)
		const columnSizeRangeItems = columnSizeRangeItemProperty.filter(({ startColumnIndex, endColumnIndex, width }) => {
			return startColumnIndex <= index && endColumnIndex >= index
		})

		const columnSizeSingleItems = columnSizeSingleItemProperty.filter((item) => {
			return item.columnIndex === index
		})

		if (columnSizeRangeItems.length !== 0) {
			widthItems.push(columnSizeRangeItems[columnSizeRangeItems.length - 1].width)
		}

		if (columnSizeSingleItems.length !== 0) {
			widthItems.push(columnSizeSingleItems[columnSizeSingleItems.length - 1]?.width)
		}

		if (widthItems.length === 0) return DEFAULT_CELL_WIDTH
		return widthItems[widthItems.length - 1]
	})

	return {
		sumWidthArr,
		sumHeightArr,
	}
}
