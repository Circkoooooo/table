import React, { useMemo } from "react"
import calcBorderProperty from "../calcBorderProperty"
import { CellData } from "../cellDataHandler"
import { TableMouseItemCallback } from "../types/types.type"
import { IndexType, SizeProperty } from "../types/table.type"
import TableCell from "./TableCell"
import { CellRow } from "../styled/Table-styled"

interface TableCellWrapperProps {
	cellData: CellData
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	inputItemCallback?: (params: TableMouseItemCallback.TableInputItemCallbackParams) => void
	sizeProperty?: SizeProperty.RowColumnSizeProperty
	editIndex?: IndexType
}

const TableCellWrapper: React.FC<TableCellWrapperProps> = ({ cellData, mousedownItemCallback, mousemoveItemCallback, mouseupItemCallback, inputItemCallback, editIndex, sizeProperty }) => {
	const borderProperty = useMemo(() => calcBorderProperty(cellData, cellData.length, cellData[0] && cellData[0].length), [cellData])

	//Parse single items and contained items from the data that is SizeProperty type.
	const resolveRowSizeProperty = (rowIndex: number): SizeProperty.RowSizeProperty | null => {
		if (!sizeProperty) return null

		const rowSizeProperty = sizeProperty.rowSizeProperty
		const singleItems = rowSizeProperty.filter((item) => item.isSingleItem && item.rowIndex === rowIndex && item.rowIndex === rowIndex)

		if (singleItems.length !== 0) {
			return singleItems[0] as SizeProperty.RowSizeProperty
		}

		// filter the items that in the size between item.row->startIndex and item->endIndex
		const containedItems = rowSizeProperty.filter((item) => !item.isSingleItem && item.startRowIndex <= rowIndex && item.endRowIndex >= rowIndex)

		if (containedItems.length !== 0) {
			return containedItems[containedItems.length - 1]
		}

		return null
	}

	const resolveColumnSizeProperty = (columnIndex: number): SizeProperty.ColumnSizeProperty | null => {
		if (!sizeProperty) return null

		const columnSizeProperty = sizeProperty.columnSizeProperty
		const singleItems = columnSizeProperty.filter((item) => item.isSingleItem && item.columnIndex === columnIndex && item.columnIndex === columnIndex)

		if (singleItems.length !== 0) {
			return singleItems[0] as SizeProperty.ColumnSizeProperty
		}

		const containedItems = columnSizeProperty.filter((item) => !item.isSingleItem && item.startColumnIndex <= columnIndex && item.endColumnIndex >= columnIndex)

		if (containedItems.length !== 0) {
			return containedItems[containedItems.length - 1]
		}

		return null
	}

	return (
		<>
			{cellData.map((item, rowIndex) => (
				<CellRow key={`${rowIndex}`} $rowSizeProperty={resolveRowSizeProperty(rowIndex)} $rowIndex={rowIndex}>
					{item.map((item, columnIndex) => {
						return (
							<TableCell
								{...{
									key: `${rowIndex}-${columnIndex}`,
									rowIndex,
									columnIndex,
									cellValue: item,
									cellData,
									borderProperty,
									mousedownItemCallback,
									mousemoveItemCallback,
									mouseupItemCallback,
									inputItemCallback,
									editIndex,
									columnSizeProperty: resolveColumnSizeProperty(columnIndex),
								}}
							/>
						)
					})}
				</CellRow>
			))}
		</>
	)
}

export default TableCellWrapper
