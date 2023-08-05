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

	const emptyCellData = createEmptyCellData({
		rowNum: 26,
		columnNum: 26,
	})

	const withRulerCellData = createRulerCellData(emptyCellData)

	/**
	 * mouse down on cells, record the index.
	 *
	 * when mousedown, set mousedown and mousemove index.
	 */
	const handleMousedown = ({ rowIndex, columnIndex }: TableMouseItemCallback.TableMousedownItemCallbackParams) => {
		//exclude the table head
		if (rowIndex === 0 || columnIndex === 0) return

		setInteractionInfoRecord({
			...interactionInfoRecord,
			isMousedown: true,
			mousedownIndex: {
				rowIndex,
				columnIndex,
			},
			mousemoveIndex: null,
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

		if (mousedownIndex === null) return noBorder

		if (mousemoveIndex === null) {
			return {
				isRender: true,
				borderWidth: 100,
				borderHeight: 30,
				offsetLeft: mousedownIndex.columnIndex * 100,
				offsetTop: mousedownIndex.rowIndex * 30,
			}
		}

		if (mousedownIndex.rowIndex < 0 || mousedownIndex.rowIndex > rowLength || mousedownIndex.columnIndex < 0 || mousedownIndex.columnIndex > columnLength) return noBorder
		if (mousemoveIndex.rowIndex < 0 || mousemoveIndex.rowIndex > rowLength || mousemoveIndex.columnIndex < 0 || mousemoveIndex.columnIndex > columnLength) return noBorder

		const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
		const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

		const rowIndexOffset = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1
		const columnIndexOffset = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
		const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
		const columnStartIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

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
