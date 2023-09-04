import React, { useMemo } from "react"
import calcBorderProperty from "../calcBorderProperty"
import { CellData } from "../cellDataHandler"
import { CellStyled } from "../styled/Table-styled"
import { TableMouseItemCallback } from "../types/types"
import { IndexType } from "../types/table"
import isIndexEqual from "../Tools/Table/isIndexEqual"
import isIndexTableBody from "../Tools/Table/isIndexTableBody"

interface TableRendererProps {
	cellData: CellData
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	inputItemCallback?: (params: TableMouseItemCallback.TableInputItemCallbackParams) => void
	editIndex?: IndexType
}

type CellStyledProperty = {
	key: string
	contentEditable?: boolean
}

const TableRenderer: React.FC<TableRendererProps> = ({ cellData, mousedownItemCallback, mousemoveItemCallback, mouseupItemCallback, inputItemCallback, editIndex }) => {
	const borderProperty = useMemo(() => calcBorderProperty(cellData, cellData.length, cellData[0] && cellData[0].length), [cellData])

	const mousedownItem = (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => {
		mousedownItemCallback && mousedownItemCallback(params)
	}

	const mousemoveItem = (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => {
		mousemoveItemCallback && mousemoveItemCallback(params)
	}

	const mouseupItem = (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => {
		mouseupItemCallback && mouseupItemCallback(params)
	}

	const inputItem = (params: TableMouseItemCallback.TableInputItemCallbackParams) => {
		inputItemCallback && inputItemCallback(params)
	}

	// Property of CellStyled Component.
	const cellStyledProperty = (rowIndex: number, columnIndex: number): CellStyledProperty => {
		let contentEditable = undefined

		if (
			isIndexTableBody(cellData, rowIndex, columnIndex) &&
			isIndexEqual(editIndex, {
				rowIndex,
				columnIndex,
			})
		) {
			contentEditable = true
		}

		const property: CellStyledProperty = {
			key: `${rowIndex}-${columnIndex}`,
		}

		contentEditable && (property.contentEditable = contentEditable)

		return property
	}

	return (
		<>
			{cellData.map((item, rowIndex) => (
				<div key={`${rowIndex}`}>
					{item.map((item, columnIndex) => (
						<CellStyled
							suppressContentEditableWarning
							data-testid={(() => {
								if (rowIndex === 0 && columnIndex === 0) {
									return "cell-row-column-head"
								} else if (rowIndex === 0 && columnIndex !== 0) {
									return "cell-row-head"
								} else if (columnIndex === 0 && rowIndex !== 0) {
									return "cell-column-head"
								}
								return "cell-body"
							})()}
							{...cellStyledProperty(rowIndex, columnIndex)}
							$borderProperty={borderProperty[rowIndex][columnIndex]}
							onMouseDown={() =>
								mousedownItem({
									rowIndex,
									columnIndex,
								})
							}
							onMouseMove={() => {
								mousemoveItem({
									rowIndex,
									columnIndex,
								})
							}}
							onMouseUp={() => {
								mouseupItem({
									rowIndex,
									columnIndex,
								})
							}}
							onInput={(event) => {
								inputItem({
									rowIndex,
									columnIndex,
									oldValue: item,
									newValue: (event.target as HTMLDivElement).innerText,
								})
							}}
						>
							{item}
						</CellStyled>
					))}
				</div>
			))}
		</>
	)
}

export default TableRenderer
