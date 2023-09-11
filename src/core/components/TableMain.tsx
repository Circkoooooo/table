import { useMemo, useState } from "react"
import { createEmptyCellData, createRulerCellData } from "../cellDataHandler"
import TableBorder, { BorderProps } from "./TableBorder"
import { TableMouseItemCallback } from "../types/types.type"
import { IndexType, SizeProperty } from "../types/table.type"
import TableCellWrapper from "./TableCellWrapper"
import { isTableHeader } from "../tools/isIndexHeader"
import { calcSizeOfSizeProperty } from "../tools/calcSizeOfSizeProperty"
import { TABLE_CONFIG } from "../configs/table_config"

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

	const [sizeProperty, setSizeProperty] = useState<SizeProperty.RowColumnSizeProperty>({
		rowSizeProperty: [
			// {
			// 	isSingleItem: false,
			// 	startRowIndex: 2,
			// 	endRowIndex: 3,
			// 	height: 300,
			// },
		],
		columnSizeProperty: [
			// {
			// 	isSingleItem: false,
			// 	startColumnIndex: 2,
			// 	endColumnIndex: 3,
			// 	width: 300,
			// },
		],
	})

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
			if (!isTableHeader(rowIndex, columnIndex)) {
				tempInteractionInfo.isEdit = true
				tempInteractionInfo.editIndex = {
					rowIndex,
					columnIndex,
				}
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

		if (interactionInfoRecord.editIndex !== null) return

		setInteractionInfoRecord({
			...interactionInfoRecord,
			isMousemove: true,
			editIndex: null,
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

	// Recalculate border info when bound events on cell was trigger.
	const resolveBorderProperty = useMemo((): BorderProps => {
		const { mousedownIndex, mousemoveIndex } = interactionInfoRecord

		const noBorder = {
			isRender: false,
		} as { isRender: false }

		if (interactionInfoRecord.editIndex !== null || mousedownIndex === null || mousemoveIndex === null) return noBorder

		const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
		const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

		const rowIndexOffset = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1
		const columnIndexOffset = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
		const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
		const columnStartIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

		//all cells propertyes
		const cellSizeProperty = calcSizeOfSizeProperty(sizeProperty, mousedownIndex, mousemoveIndex, withRulerCellData)

		const sizeRecord = {
			sumWidth: 0,
			sumHeight: 0,
			offsetLeft: 0,
			offsetTop: 0,
			isRowHeaderLogicStart: false, // the row-index after calcuating equals 0.
			isColumnHeaderLogicStart: false,
			isRowHeaderMousedownStart: false, // mouse down on cell header.
			isColumnHeaderMousedownStart: false,
		}

		sizeRecord.sumWidth = cellSizeProperty.sumWidthArr
			.filter((_, index) => {
				return index !== 0 && index >= columnStartIndex && index <= columnStartIndex + columnIndexOffset - 1
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.sumHeight = cellSizeProperty.sumHeightArr
			.filter((_, index) => {
				return index !== 0 && index >= rowStartIndex && index <= rowIndexOffset + rowStartIndex - 1
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr
			.filter((_, index) => {
				return index < columnStartIndex
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.offsetTop = cellSizeProperty.sumHeightArr
			.filter((_, index) => {
				return index < rowStartIndex
			})
			.reduce((pre, val) => pre + val, 0)

		if (sizeRecord.sumWidth !== 0 && rowStartIndex === 0) {
			sizeRecord.isRowHeaderLogicStart = true
		}
		if (sizeRecord.sumHeight !== 0 && columnStartIndex === 0) {
			sizeRecord.isColumnHeaderLogicStart = true
		}

		// mousedown on header
		if (mousedownRowIndex === 0) {
			sizeRecord.sumHeight = cellSizeProperty.sumHeightArr.filter((item, index) => index !== 0).reduce((pre, val) => pre + val)
			sizeRecord.offsetTop = cellSizeProperty.sumHeightArr[0]
			sizeRecord.isColumnHeaderMousedownStart = true
		}
		if (mousedownColumnIndex === 0) {
			sizeRecord.sumWidth = cellSizeProperty.sumWidthArr.filter((item, index) => index !== 0).reduce((pre, val) => pre + val)
			sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr[0]
			sizeRecord.isRowHeaderMousedownStart = true
		}

		// mousemove on header
		if (mousemoveRowIndex === 0) {
			sizeRecord.offsetTop = cellSizeProperty.sumHeightArr[0]
		}
		if (mousemoveColumnIndex === 0) {
			sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr[0]
		}

		const { sumWidth, sumHeight, offsetLeft, offsetTop, isRowHeaderLogicStart, isColumnHeaderLogicStart } = sizeRecord
		const { DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT } = TABLE_CONFIG

		if (sizeRecord.sumWidth === 0 || sizeRecord.sumHeight === 0) return noBorder

		return {
			isRender: true,
			borderWidth: sumWidth,
			borderHeight: sumHeight,
			offsetLeft: isColumnHeaderLogicStart && offsetLeft === 0 ? DEFAULT_CELL_WIDTH : offsetLeft,
			offsetTop: isRowHeaderLogicStart && offsetTop === 0 ? DEFAULT_CELL_HEIGHT : offsetTop,
		}
	}, [interactionInfoRecord, withRulerCellData, sizeProperty])

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
					sizeProperty,
				}}
			/>
		</>
	)
}

export { TableMain }
