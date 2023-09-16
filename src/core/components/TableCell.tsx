import React, { memo, useContext, useMemo, useState } from "react"
import { CellDataElement } from "../cellDataHandler"
import { CellContentWrapper, CellStyled } from "../styled/Table-styled"
import useDebounce from "../../hooks/useDebounce"
import { EventContext } from "../context/eventContext"

type CellStyledProperty = {
	contentEditable?: boolean
}

interface TableCellProps {
	cellValue: CellDataElement
	rowIndex: number
	columnIndex: number
	width: number
	isTableBody: boolean
	isEditable: boolean
	isRenderTop: boolean
	isRenderRight: boolean
	isRenderBottom: boolean
	isRenderLeft: boolean
}

const TableCell = memo<TableCellProps>(
	({ cellValue, rowIndex, columnIndex, width, isTableBody, isEditable, isRenderTop, isRenderRight, isRenderBottom, isRenderLeft }) => {
		const [currentValue, setCurrentValue] = useState<CellDataElement>(null)

		const eventContext = useContext(EventContext)

		const eventContextMemo = useMemo(() => eventContext, [eventContext])

		const isContextEditableMemo = useMemo(() => isTableBody && isEditable, [isTableBody, isEditable])

		const borderRenderMemo = useMemo(() => {
			return {
				isRenderTop,
				isRenderBottom,
				isRenderLeft,
				isRenderRight,
			}
		}, [isRenderBottom, isRenderLeft, isRenderRight, isRenderTop])

		// Property of CellStyled Component.
		const cellStyledProperty = (rowIndex: number, columnIndex: number): CellStyledProperty => {
			let contentEditable = undefined

			if (isContextEditableMemo) {
				contentEditable = true
			}

			const property: CellStyledProperty = {}

			contentEditable && (property.contentEditable = contentEditable)

			return property
		}

		const excuteUpdateValue = () => {
			const inputCallback = eventContext && eventContext.inputItemCallback

			inputCallback &&
				inputCallback({
					rowIndex,
					columnIndex,
					oldValue: cellValue,
					newValue: currentValue === "" ? null : currentValue,
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

			if (!isTableBody) return
			setCurrentValue(`${target.innerText}` || null)
		}, 10)

		return (
			<>
				<CellStyled
					{...{
						$isIndexTableBody: isTableBody,
						$isEditable: isEditable,
						width,
						$borderProperty: {
							top: borderRenderMemo.isRenderTop,
							left: borderRenderMemo.isRenderLeft,
							bottom: borderRenderMemo.isRenderBottom,
							right: borderRenderMemo.isRenderRight,
						},
					}}
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
						$isTableBody={isTableBody}
						$isEditable={isEditable}
						onInput={(event) => handleInput(event)}
						onBlur={(event) => {
							handleBlur(event)
						}}
						onMouseDown={() => {
							const mousedownCallback = eventContextMemo && eventContextMemo.mousedownItemCallback
							mousedownCallback &&
								mousedownCallback({
									rowIndex,
									columnIndex,
								})
						}}
						onMouseMove={() => {
							const mousemoveCallback = eventContextMemo && eventContextMemo.mousemoveItemCallback
							mousemoveCallback &&
								mousemoveCallback({
									rowIndex,
									columnIndex,
								})
						}}
						onMouseUp={() => {
							const mouseupCallback = eventContextMemo && eventContextMemo.mouseupItemCallback
							mouseupCallback &&
								mouseupCallback({
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
	},
	(preProps, curProps) => {
		if (curProps.isEditable !== preProps.isEditable) return false

		return true
	}
)

export default TableCell
