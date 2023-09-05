import { useMemo, useState } from "react"
import { createEmptyCellData, createRulerCellData } from "../cellDataHandler"
import TableBorder, { BorderProps } from "./TableBorder"
import { TableMouseItemCallback } from "../types/types.type"
import { IndexType } from "../types/table.type"
import TableCellWrapper from "./TableCellWrapper"

type InteractionInfo = {
	isMousedown: boolean
	isMousemove: boolean
	isEdit: boolean
	mousedownIndex: IndexType | null
	mousemoveIndex: IndexType | null
	editIndex: IndexType | null
}

const TableMain = () => {
	const [interactionInfoRecord, setInteractionInfoRecord] = useState<InteractionInfo>({
		isMousedown: false,
		isMousemove: false,
		isEdit: false,
		mousedownIndex: null,
		mousemoveIndex: null,
		editIndex: null,
	})

	const emptyRulerCellData = createEmptyCellData({
		rowNum: 26,
		columnNum: 26,
	})

	const [withRulerCellData, setWithRulerCellData] = useState(createRulerCellData(emptyRulerCellData))

	/**
	 * mouse down on cells, record the index.
	 *
	 * when mousedown, set mousedown and mousemove index.
	 */
	const handleMousedown = ({ rowIndex, columnIndex }: TableMouseItemCallback.TableMousedownItemCallbackParams) => {
		const tempInteractionInfo = {
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
		}

		const { mousedownIndex } = interactionInfoRecord
		if (mousedownIndex && mousedownIndex.rowIndex === rowIndex && mousedownIndex.columnIndex === columnIndex) {
			tempInteractionInfo.isEdit = true
			tempInteractionInfo.editIndex = {
				rowIndex,
				columnIndex,
			}
		} else {
			tempInteractionInfo.isEdit = false
			tempInteractionInfo.editIndex = null
		}

		setInteractionInfoRecord(tempInteractionInfo)
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

	const handleInput = ({ rowIndex, columnIndex, oldValue, newValue }: TableMouseItemCallback.TableInputItemCallbackParams) => {
		const newRulerCellData = withRulerCellData.data.map((row, rowIdx) => {
			if (rowIdx === rowIndex) {
				return row.map((column, columnIdx) => {
					if (columnIdx === columnIndex) {
						return newValue
					}
					return column
				})
			}
			return row
		})

		setWithRulerCellData({
			data: newRulerCellData,
			info: { ...withRulerCellData.info },
		})
	}

	const resolveBorderProperty = useMemo((): BorderProps => {
		const { mousedownIndex, mousemoveIndex } = interactionInfoRecord

		const noBorder = {
			isRender: false,
		} as { isRender: false }

		if (mousedownIndex === null || mousemoveIndex === null) return noBorder

		const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
		const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

		const rowIndexOffset = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1
		const columnIndexOffset = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
		const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
		const columnStartIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

		//Click on a table head, render a border covers a row or column.
		if (mousedownColumnIndex === 0 || mousedownRowIndex === 0) {
			let borderWidth = columnIndexOffset * 100,
				borderHeight = rowIndexOffset * 30,
				offsetLeft = columnStartIndex * 100,
				offsetTop = rowStartIndex * 30

			if (mousedownColumnIndex === 0 && mousedownRowIndex === 0) {
				borderWidth = (withRulerCellData.data.length - 1) * 100
				borderHeight = withRulerCellData.data[0] && (withRulerCellData.data[0].length - 1) * 30
				offsetLeft = 100
				offsetTop = 30
			} else {
				//fill a row
				if (mousedownColumnIndex === 0) {
					borderWidth = (withRulerCellData.data.length - 1) * 100
					borderHeight = (mousemoveRowIndex === 0 ? rowIndexOffset - 1 : rowIndexOffset) * 30
					offsetLeft = 100
					offsetTop = (mousemoveRowIndex === 0 ? rowStartIndex + 1 : rowStartIndex) * 30
				}

				if (mousedownRowIndex === 0) {
					//fill a column
					borderWidth = (mousemoveColumnIndex === 0 ? columnIndexOffset - 1 : columnIndexOffset) * 100
					borderHeight = withRulerCellData.data[0] && (withRulerCellData.data[0].length - 1) * 30
					offsetLeft = (mousemoveColumnIndex === 0 ? columnStartIndex + 1 : columnStartIndex) * 100
					offsetTop = 30
				}
			}

			return {
				isRender: true,
				borderWidth,
				borderHeight,
				offsetLeft,
				offsetTop,
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
		let borderWidth = columnIndexOffset * 100,
			borderHeight = rowIndexOffset * 30,
			offsetLeft = columnStartIndex * 100,
			offsetTop = rowStartIndex * 30

		if (mousemoveRowIndex === 0) {
			borderHeight = (rowIndexOffset - 1) * 30
			offsetTop = (rowStartIndex + 1) * 30
		}

		if (mousemoveColumnIndex === 0) {
			borderWidth = (columnIndexOffset - 1) * 100
			offsetLeft = (columnStartIndex + 1) * 100
		}

		return {
			isRender: true,
			borderWidth,
			borderHeight,
			offsetLeft,
			offsetTop,
		}
	}, [interactionInfoRecord, withRulerCellData])

	return (
		<>
			<TableBorder {...resolveBorderProperty} />
			<TableCellWrapper
				cellData={withRulerCellData.data}
				mousedownItemCallback={(params) => handleMousedown(params)}
				mousemoveItemCallback={(params) => handleMousemove(params)}
				mouseupItemCallback={() => handleMouseup()}
				inputItemCallback={(params) => handleInput(params)}
				{...{
					editIndex: interactionInfoRecord.editIndex ?? undefined,
				}}
			/>
		</>
	)
}

export { TableMain }
