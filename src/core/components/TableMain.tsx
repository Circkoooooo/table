import { useState } from "react"
import { createEmptyCellData, createRulerCellData } from "../cellDataHandler"
import TableBorder, { BorderProps } from "./TableBorder"
import TableRenderer from "./TableRenderer"
import { TableMouseItemCallback } from "../types/types"

type InteractionInfo = {
	isMousedown: boolean
	isMousemove: boolean
	mousedownIndex: {
		rowIndex: number
		columnIndex: number
	} | null
	mousemoveIndex: {
		rowIndex: number
		columnIndex: number
	} | null
}

const TableMain = () => {
	const [interactionInfoRecord, setInteractionInfoRecord] = useState<InteractionInfo>({
		isMousedown: false,
		isMousemove: false,
		mousedownIndex: null,
		mousemoveIndex: null,
	})
	const emptyRulerCellData = createEmptyCellData({
		rowNum: 26,
		columnNum: 26,
	})

	const withRulerCellData = createRulerCellData(emptyRulerCellData)

	/**
	 * mouse down on cells, record the index.
	 *
	 * when mousedown, set mousedown and mousemove index.
	 */
	const handleMousedown = ({ rowIndex, columnIndex }: TableMouseItemCallback.TableMousedownItemCallbackParams) => {
		setInteractionInfoRecord({
			...interactionInfoRecord,
			isMousedown: true,
			mousedownIndex: {
				rowIndex,
				columnIndex,
			},
			mousemoveIndex: {
				rowIndex,
				columnIndex,
			},
		})
	}

	//mouse moves over cells, record index.
	const handleMousemove = ({ rowIndex, columnIndex }: TableMouseItemCallback.TableMousemoveItemCallbackParams) => {
		if (!interactionInfoRecord.isMousedown) return

		setInteractionInfoRecord({
			...interactionInfoRecord,
			isMousemove: true,
			mousemoveIndex: {
				rowIndex,
				columnIndex,
			},
		})
	}

	const handleMouseup = () => {
		if (!interactionInfoRecord.isMousedown) return

		setInteractionInfoRecord({
			...interactionInfoRecord,
			isMousedown: false,
			isMousemove: false,
		})
	}

	const resolveBorderProperty = (): BorderProps => {
		const { mousedownIndex, mousemoveIndex } = interactionInfoRecord
		const { rowLength, columnLength } = withRulerCellData.info

		const noBorder = {
			isRender: false,
		} as { isRender: false }

		if (mousedownIndex === null || mousemoveIndex === null) return noBorder

		//Exclude the unexpected index.
		if (mousedownIndex.rowIndex < 0 || mousedownIndex.rowIndex > rowLength || mousedownIndex.columnIndex < 0 || mousedownIndex.columnIndex > columnLength) return noBorder

		const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
		const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

		const rowIndexOffset = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1
		const columnIndexOffset = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
		const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
		const columnStartIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

		//Click on a table head, render a border covers a row or column.
		if (mousedownColumnIndex === 0 || mousedownRowIndex === 0) {
			if (mousedownColumnIndex === 0 && mousedownRowIndex === 0) {
				return {
					isRender: true,
					borderWidth: (withRulerCellData.data.length - 1) * 100,
					borderHeight: withRulerCellData.data[0] && (withRulerCellData.data[0].length - 1) * 30,
					offsetLeft: 100,
					offsetTop: 30,
				}
			}

			if (mousedownColumnIndex === 0) {
				return {
					isRender: true,
					borderWidth: (withRulerCellData.data.length - 1) * 100,
					borderHeight: rowIndexOffset * 30,
					offsetLeft: 100,
					offsetTop: rowStartIndex * 30,
				}
			} else if (mousedownRowIndex === 0) {
				return {
					isRender: true,
					borderWidth: columnIndexOffset * 100,
					borderHeight: withRulerCellData.data[0] && (withRulerCellData.data[0].length - 1) * 30,
					offsetLeft: columnStartIndex * 100,
					offsetTop: 30,
				}
			}
		}

		// Click on a element is not the head.
		if (mousedownRowIndex === mousemoveRowIndex && mousedownColumnIndex === mousemoveColumnIndex) {
			return {
				isRender: true,
				borderWidth: 100,
				borderHeight: 30,
				offsetLeft: mousedownIndex.columnIndex * 100,
				offsetTop: mousedownIndex.rowIndex * 30,
			}
		}

		// Different click-element and move-element, trigger the multiple selections.
		return {
			isRender: true,
			borderWidth: columnIndexOffset * 100,
			borderHeight: rowIndexOffset * 30,
			offsetLeft: columnStartIndex * 100,
			offsetTop: rowStartIndex * 30,
		}
	}

	return (
		<>
			<TableBorder {...{ ...resolveBorderProperty() }} />
			<TableRenderer
				cellData={withRulerCellData.data}
				mousedownItemCallback={(params) => handleMousedown(params)}
				mousemoveItemCallback={(params) => handleMousemove(params)}
				mouseupItemCallback={() => handleMouseup()}
			/>
		</>
	)
}

export { TableMain }
