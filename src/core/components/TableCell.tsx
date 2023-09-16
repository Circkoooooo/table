import React, { memo, useMemo, useState } from "react"
import { CellDataElement } from "../cellDataHandler"
import { CellContentWrapper, CellStyled } from "../styled/Table-styled"
import { useAppDispatch, useAppSelector } from "../redux/hooks"

import { mousedownDispatch, mousemoveDispatch, mouseupDispatch } from "../features/interaction/interactionSlice"
import { inputDispatch } from "../features/table-data/tableDataSlice"

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
	borderRender: {
		isRenderTop: boolean
		isRenderRight: boolean
		isRenderBottom: boolean
		isRenderLeft: boolean
	}
}

const TableCell = memo<TableCellProps>(({ cellValue, rowIndex, columnIndex, width, isTableBody, isEditable, borderRender }) => {
	const [currentValue, setCurrentValue] = useState<CellDataElement>(null)

	const interactionState = useAppSelector((state) => state.interaction)
	const dispatch = useAppDispatch()

	const isContextEditableMemo = useMemo(() => isTableBody && isEditable, [isTableBody, isEditable])

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
		dispatch(
			inputDispatch({
				cellIndex: {
					rowIndex,
					columnIndex,
				},
				newValue: currentValue === "" ? null : currentValue,
			})
		)
	}

	const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement

		if (!target && !currentValue) return
		if ((target.innerText as string) === cellValue) return

		excuteUpdateValue()
	}

	const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
		//remove the content of CellContentWrapper
		const target = event.target as HTMLDivElement

		if (!isTableBody) return
		setCurrentValue(`${target.innerText}` || null)
	}

	// script properties
	const datasetId = useMemo(() => {
		if (rowIndex === 0 && columnIndex === 0) {
			return "cell-row-column-head"
		} else if (rowIndex === 0 && columnIndex !== 0) {
			return "cell-row-head"
		} else if (columnIndex === 0 && rowIndex !== 0) {
			return "cell-column-head"
		}
		return "cell-body"
	}, [columnIndex, rowIndex])

	const borderWidthCSS = useMemo(() => {
		const top = borderRender.isRenderTop
		const left = borderRender.isRenderLeft
		const bottom = borderRender.isRenderBottom
		const right = borderRender.isRenderRight

		const DEFAULT_BORDER_WIDTH = 1
		const CLEAR_BORDER_WIDTH = 0

		const borderWidth = [
			`${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
			`${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
			`${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
			`${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		]

		return borderWidth.join(" ")
	}, [borderRender])

	return (
		<>
			<CellStyled
				{...{
					$isIndexTableBody: isTableBody,
					$isEditable: isEditable,
					width,
					$borderWidthCSS: borderWidthCSS,
				}}
			>
				<CellContentWrapper
					tabIndex={parseInt(`${rowIndex}${columnIndex}`)}
					suppressContentEditableWarning
					data-testid={datasetId}
					{...cellStyledProperty(rowIndex, columnIndex)}
					$isTableBody={isTableBody}
					$isEditable={isEditable}
					onInput={(event) => handleInput(event)}
					onBlur={(event) => {
						handleBlur(event)
					}}
					onMouseDown={() => {
						dispatch(
							mousedownDispatch({
								cellIndex: {
									rowIndex,
									columnIndex,
								},
							})
						)
					}}
					onMouseMove={() => {
						if (!interactionState.isMousedown) return
						dispatch(
							mousemoveDispatch({
								cellIndex: {
									rowIndex,
									columnIndex,
								},
							})
						)
					}}
					onMouseUp={() => {
						dispatch(mouseupDispatch())
					}}
				>
					{cellValue}
				</CellContentWrapper>
			</CellStyled>
		</>
	)
})

export default TableCell
