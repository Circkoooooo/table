import React, { useState } from "react"
import { CellData, CellDataElement } from "../cellDataHandler"
import { CellStyled } from "../styled/Table-styled"
import { TableMouseItemCallback } from "../types/types.type"
import { BorderProperty } from "../calcBorderProperty"
import useDebounce from "../../hooks/useDebounce"
import isIndexTableBody from "../tools/isIndexTableBody"
import isIndexEqual from "../tools/isIndexEqual"
import { IndexType } from "../types/table.type"

type CellStyledProperty = {
	contentEditable?: boolean
}

interface TableCellProps {
	cellData: CellData
	cellValue: CellDataElement
	rowIndex: number
	columnIndex: number
	borderProperty: BorderProperty[][]
	editIndex?: IndexType
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	inputItemCallback?: (params: TableMouseItemCallback.TableInputItemCallbackParams) => void
}

const TableCell: React.FC<TableCellProps> = ({
	cellData,
	cellValue,
	rowIndex, 
	columnIndex,
	borderProperty,
	editIndex,
	mousedownItemCallback,
	mousemoveItemCallback,
	mouseupItemCallback,
	inputItemCallback,
}) => {
	const [currentValue, setCurrentValue] = useState<CellDataElement>("")

	const isEditable =
		isIndexTableBody(cellData, rowIndex, columnIndex) &&
		isIndexEqual(editIndex, {
			rowIndex,
			columnIndex,
		})

	// Property of CellStyled Component.
	const cellStyledProperty = (rowIndex: number, columnIndex: number): CellStyledProperty => {
		let contentEditable = undefined

		if (isEditable) {
			contentEditable = true
		}

		const property: CellStyledProperty = {}

		contentEditable && (property.contentEditable = contentEditable)

		return property
	}

	const excuteUpdateValue = () => {
		isEditable &&
			inputItemCallback &&
			inputItemCallback({
				rowIndex,
				columnIndex,
				oldValue: cellValue,
				newValue: currentValue,
			})
	}

	const handleInput = useDebounce((event: React.FormEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement

		setCurrentValue(`${target.innerText}`)
	}, 300)

	return (
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
				mousedownItemCallback &&
				mousedownItemCallback({
					rowIndex,
					columnIndex,
				})
			}
			onMouseMove={() => {
				mousemoveItemCallback &&
					mousemoveItemCallback({
						rowIndex,
						columnIndex,
					})
			}}
			onMouseUp={() => {
				mouseupItemCallback &&
					mouseupItemCallback({
						rowIndex,
						columnIndex,
					})
			}}
			onInput={(event) => handleInput(event)}
			onBlur={() => excuteUpdateValue()}
			tabIndex={parseInt(`${rowIndex}${columnIndex}`)}
		>
			{cellValue}
		</CellStyled>
	)
}

export default TableCell
