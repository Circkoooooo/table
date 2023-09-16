import React, { useMemo } from "react"
import calcBorderProperty from "../calcBorderProperty"
import { IndexType, SizeProperty } from "../types/table.type"
import TableCellRow from "./TableCellRow"
import { WithRulerCellData } from "../cellDataHandler"

interface TableCellWrapperProps {
	withRulerCellData: WithRulerCellData
	sizeProperty: SizeProperty.RowColumnSizeProperty | null
	editIndex: IndexType | null
	renderingIndexRange: SizeProperty.RenderingIndexRange
}

const TableCellWrapper: React.FC<TableCellWrapperProps> = ({ withRulerCellData, editIndex, sizeProperty, renderingIndexRange }) => {
	const cellData = withRulerCellData.data

	const borderProperty = useMemo(() => cellData && calcBorderProperty(cellData, cellData.length, cellData[0] && cellData[0].length), [cellData])

	return (
		<>
			{cellData &&
				cellData.map((row, rowIndex) => {
					if (rowIndex <= renderingIndexRange.endRowIndex && rowIndex >= renderingIndexRange.startRowIndex) {
						return (
							<TableCellRow
								key={rowIndex}
								rowData={row}
								sizeProperty={sizeProperty}
								rowIndex={rowIndex}
								renderingEndColumnIndex={renderingIndexRange.endColumnIndex}
								renderingStartColumnIndex={renderingIndexRange.startColumnIndex}
								borderPropertyRow={borderProperty && borderProperty[rowIndex]}
								maxRowLength={withRulerCellData.info.rowLength}
								maxColumnLength={withRulerCellData.info.columnLength}
								editIndex={editIndex}
							/>
						)
					}

					return null
				})}
		</>
	)
}

export default TableCellWrapper
