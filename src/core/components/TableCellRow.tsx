import { BorderProperty } from "../calcBorderProperty"
import { CellDataElement } from "../cellDataHandler"
import TableCell from "./TableCell"
import isIndexTableBody from "../tools/isIndexTableBody"
import { IndexType, SizeProperty } from "../types/table.type"
import { memo, useCallback, useMemo } from "react"
import isIndexEqual from "../tools/isIndexEqual"
import { CellRow } from "../styled/Table-styled"
import { TABLE_CONFIG } from "../configs/table_config"

interface TableCellRowProps {
	rowData: CellDataElement[]
	rowIndex: number
	renderingStartColumnIndex: number
	renderingEndColumnIndex: number
	borderPropertyRow: BorderProperty[] | null
	maxRowLength: number
	maxColumnLength: number
	sizeProperty: SizeProperty.RowColumnSizeProperty | null
	editIndex: IndexType | null
}

const TableCellRow = memo<TableCellRowProps>(({ rowData, rowIndex, renderingStartColumnIndex, renderingEndColumnIndex, borderPropertyRow, maxRowLength, maxColumnLength, sizeProperty, editIndex }) => {
	const rowDataMemo = useMemo(() => rowData, [rowData])

	// const eventContext = useContext(EventContext)

	//Parse single items and contained items from the data that is SizeProperty type.
	const resolveRowHeight = useCallback(
		(rowIndex: number): number => {
			if (!sizeProperty) return TABLE_CONFIG.DEFAULT_CELL_HEIGHT

			const rowSizeProperty = sizeProperty.rowSizeProperty
			const singleItems = rowSizeProperty.filter((item) => item.isSingleItem && item.rowIndex === rowIndex && item.rowIndex === rowIndex)

			if (singleItems.length !== 0) {
				return singleItems[0].height
			}

			// filter the items that in the size between item.row->startIndex and item->endIndex
			const containedItems = rowSizeProperty.filter((item) => !item.isSingleItem && item.startRowIndex <= rowIndex && item.endRowIndex >= rowIndex)

			if (containedItems.length !== 0) {
				return containedItems[containedItems.length - 1].height
			}

			return TABLE_CONFIG.DEFAULT_CELL_HEIGHT
		},
		[sizeProperty]
	)

	const resolveColumnWidth = useCallback(
		(columnIndex: number): number => {
			if (!sizeProperty) return TABLE_CONFIG.DEFAULT_CELL_WIDTH

			const columnSizeProperty = sizeProperty.columnSizeProperty
			const singleItems = columnSizeProperty.filter((item) => item.isSingleItem && item.columnIndex === columnIndex && item.columnIndex === columnIndex)

			if (singleItems.length !== 0) {
				return singleItems[0].width
			}

			const containedItems = columnSizeProperty.filter((item) => !item.isSingleItem && item.startColumnIndex <= columnIndex && item.endColumnIndex >= columnIndex)

			if (containedItems.length !== 0) {
				return containedItems[containedItems.length - 1].width
			}

			return TABLE_CONFIG.DEFAULT_CELL_WIDTH
		},
		[sizeProperty]
	)

	const rowHeightCSS = useMemo(() => {
		if (rowIndex === 0) return `${TABLE_CONFIG.DEFAULT_CELL_HEIGHT}px`
		return `${resolveRowHeight(rowIndex)}px`
	}, [resolveRowHeight, rowIndex])

	return (
		<>
			<CellRow $rowHeight={rowHeightCSS}>
				{rowDataMemo.map((value, columnIndex) => (
					<TableCell
						{...{
							key: `${rowIndex}-${columnIndex}`,
							rowIndex,
							columnIndex,
							cellValue: value,
							isTableBody: isIndexTableBody(rowIndex, columnIndex, maxRowLength, maxColumnLength),
							borderRender: {
								isRenderTop: borderPropertyRow ? borderPropertyRow[columnIndex].top : false,
								isRenderRight: borderPropertyRow ? borderPropertyRow[columnIndex].right : false,
								isRenderBottom: borderPropertyRow ? borderPropertyRow[columnIndex].bottom : false,
								isRenderLeft: borderPropertyRow ? borderPropertyRow[columnIndex].left : false,
							},
							width: resolveColumnWidth(columnIndex),
							isEditable: isIndexEqual(editIndex, {
								rowIndex,
								columnIndex,
							}),
						}}
					/>
				))}
			</CellRow>
		</>
	)
})

export default TableCellRow
