import React, { useMemo } from "react"
import calcBorderProperty from "../calcBorderProperty"
import { CellData } from "../cellDataHandler"
import { TableMouseItemCallback } from "../types/types.type"
import { IndexType } from "../types/table.type"
import TableCell from "./TableCell"
import { CellRow } from "../styled/Table-styled"

interface TableCellWrapperProps {
	cellData: CellData
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	inputItemCallback?: (params: TableMouseItemCallback.TableInputItemCallbackParams) => void
	editIndex?: IndexType
}

const TableCellWrapper: React.FC<TableCellWrapperProps> = ({ cellData, mousedownItemCallback, mousemoveItemCallback, mouseupItemCallback, inputItemCallback, editIndex }) => {
	const borderProperty = useMemo(() => calcBorderProperty(cellData, cellData.length, cellData[0] && cellData[0].length), [cellData])

	return (
		<>
			{cellData.map((item, rowIndex) => (
				<CellRow key={`${rowIndex}`}>
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
