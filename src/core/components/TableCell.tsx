import React, { useState } from "react"
import { CellData, CellDataElement } from "../cellDataHandler"
import { CellContentWrapper, CellStyled } from "../styled/Table-styled"
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
		inputItemCallback &&
			inputItemCallback({
				rowIndex,
				columnIndex,
				oldValue: cellValue,
				newValue: currentValue,
			})
	}

	const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement

		if (!target && !currentValue) return
		if ((target.innerText as string) === cellValue) return

		excuteUpdateValue()
	}

	const handleInput = useDebounce((event: React.FormEvent<HTMLDivElement>) => {
		//remove the content of CellContentWrapper
		const target = event.target as HTMLDivElement

		if (!isIndexTableBody(cellData, rowIndex, columnIndex)) return
		setCurrentValue(`${target.innerText}`)
	}, 100)

	return (
		<>
			<CellStyled
				{...{
					$isIndexTableBody: isIndexTableBody(cellData, rowIndex, columnIndex),
					$isEditable: isEditable,
				}}
				$borderProperty={borderProperty[rowIndex][columnIndex]}
			>
				<CellContentWrapper
					tabIndex={parseInt(`${rowIndex}${columnIndex}`)}
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
					$isTableBody={isIndexTableBody(cellData, rowIndex, columnIndex)}
					onInput={(event) => handleInput(event)}
					onBlur={(event) => {
						handleBlur(event)
					}}
					onMouseDown={() => {
						mousedownItemCallback &&
							mousedownItemCallback({
								rowIndex,
								columnIndex,
							})
					}}
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
				>
					{cellValue}
				</CellContentWrapper>
			</CellStyled>
		</>
	)
}

export default TableCell
