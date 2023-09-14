import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createEmptyCellData, createRulerCellData } from "../cellDataHandler"
import TableBorder, { BorderProps } from "./TableBorder"
import { TableMouseItemCallback } from "../types/types.type"
import { IndexType, SizeProperty } from "../types/table.type"
import TableCellWrapper from "./TableCellWrapper"
import { isTableHeader } from "../tools/isIndexHeader"
import { calcSizeOfSizeProperty } from "../tools/calcSizeOfSizeProperty"
import { TABLE_CONFIG } from "../configs/table_config"
import { TableMainContainer } from "../styled/TableMain-styled"

type InteractionInfo = {
	isMousedown: boolean
	isMousemove: boolean
	isEdit: boolean
	mousedownIndex: IndexType | null
	mousemoveIndex: IndexType | null
	editIndex: IndexType | null
}

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)

	const [interactionInfoRecord, setInteractionInfoRecord] = useState<InteractionInfo>({
		isMousedown: false,
		isMousemove: false,
		isEdit: false,
		mousedownIndex: null,
		mousemoveIndex: null,
		editIndex: null,
	})

	const emptyRulerCellData = createEmptyCellData({
		rowNum: 100,
		columnNum: 100,
	})

	const [withRulerCellData, setWithRulerCellData] = useState(createRulerCellData(emptyRulerCellData))

	const [sizeProperty, setSizeProperty] = useState<SizeProperty.RowColumnSizeProperty>({
		rowSizeProperty: [
			{
				isSingleItem: false,
				startRowIndex: 2,
				endRowIndex: 3,
				height: 300,
			},
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

	const [renderingIndexRange, setRenderingIndexRange] = useState<SizeProperty.RenderingIndexRange>({
		startRowIndex: 0,
		startColumnIndex: 0,
		endRowIndex: 30,
		endColumnIndex: 30,
	})

	/************************************************* Event handler ********************************************************************/
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

	/************************************************* Recalculating ********************************************************************/
	const fullContainerHeight = useMemo(() => {
		const rowLength = withRulerCellData.info.rowLength
		const columnLength = withRulerCellData.info.columnLength
		const heightArr = Array.from({
			length: rowLength,
		}).fill(TABLE_CONFIG.DEFAULT_CELL_HEIGHT) as number[]
		const widthArr = Array.from({
			length: columnLength,
		}).fill(TABLE_CONFIG.DEFAULT_CELL_WIDTH) as number[]

		const rowSingleItemProperty = sizeProperty.rowSizeProperty.filter((item) => item.isSingleItem) as SizeProperty.RowSizeSingleItemProperty[]
		const rowRangeItemProperty = sizeProperty.rowSizeProperty.filter((item) => !item.isSingleItem) as SizeProperty.RowSizeRangeItemProperty[]
		const columnSingleItemProperty = sizeProperty.columnSizeProperty.filter((item) => item.isSingleItem) as SizeProperty.ColumnSizeSingleItemProperty[]
		const columnRangeItemProperty = sizeProperty.columnSizeProperty.filter((item) => !item.isSingleItem) as SizeProperty.ColumnSizeRangeItemProperty[]

		// rowRangeItems
		rowRangeItemProperty.forEach((rangeRangeItem) => {
			for (let i = rangeRangeItem.startRowIndex; i <= rangeRangeItem.endRowIndex; i++) {
				heightArr[i] = rangeRangeItem.height
			}
		})

		rowSingleItemProperty.forEach((singleItem) => {
			heightArr[singleItem.rowIndex] = singleItem.height
		})

		// columnRangeItems
		columnRangeItemProperty.forEach((rangeRangeItem) => {
			for (let i = rangeRangeItem.startColumnIndex; i <= rangeRangeItem.endColumnIndex; i++) {
				heightArr[i] = rangeRangeItem.width
			}
		})

		columnSingleItemProperty.forEach((singleItem) => {
			widthArr[singleItem.columnIndex] = singleItem.width
		})

		const sumHeight = heightArr.reduce((pre: number, cur: number) => pre + cur)
		const sumWidth = widthArr.reduce((pre: number, cur: number) => pre + cur)

		return {
			sumHeight,
			sumWidth,
			heightArr,
			widthArr,
		}
	}, [sizeProperty.rowSizeProperty, sizeProperty.columnSizeProperty, withRulerCellData])

	// virtual list datas
	const virtualListItemsRange = useCallback(
		(tableMainContainerRef: React.RefObject<HTMLDivElement>) => {
			const containerRef = tableMainContainerRef.current || null

			if (containerRef === null) throw new Error("Cannot find the container of table.")

			const { heightArr, widthArr } = fullContainerHeight

			const startIndex = {
				startRowIndex: 0,
				startColumnIndex: 0,
			}

			const endIndex = {
				endRowIndex: heightArr.length - 1,
				endColumnIndex: widthArr.length - 1,
			}

			const containerScrollTop = containerRef.scrollTop
			const containerScrollLeft = containerRef.scrollLeft
			const containerSumClientHeight = containerRef.offsetHeight
			const containerSumClientWidth = containerRef.offsetWidth

			const overflowTopHeight = () => {
				let sumHeight = 0
				for (let i = 0; i <= endIndex.endRowIndex; i++) {
					if (sumHeight >= containerScrollTop) break

					startIndex.startRowIndex = i
					sumHeight += heightArr[i]
				}
			}

			const overflowLeftWidth = () => {
				let sumWidth = 0
				for (let i = 0; i <= endIndex.endColumnIndex; i++) {
					if (sumWidth >= containerScrollLeft) break
					startIndex.startColumnIndex = i
					sumWidth += heightArr[i]
				}
			}
			overflowTopHeight()
			overflowLeftWidth()

			// The maximum indexes that exclude the overflowing parts.
			const containableMaximumIndexesRange = () => {
				let sumHeight = 0
				let endRowIndex = 0

				let sumWidth = 0
				let endColumnIndex = 0

				for (let i = startIndex.startRowIndex; i <= endIndex.endRowIndex; i++) {
					if (sumHeight >= containerSumClientHeight) break

					endRowIndex = i
					sumHeight += heightArr[i]
				}

				for (let i = startIndex.startColumnIndex; i <= endIndex.endColumnIndex; i++) {
					if (sumWidth >= containerSumClientWidth) break

					endColumnIndex = i
					sumWidth += widthArr[i]
				}

				return {
					endRowIndex,
					endColumnIndex,
				}
			}

			const { endRowIndex, endColumnIndex } = containableMaximumIndexesRange()

			return {
				startRowIndex: startIndex.startRowIndex,
				endRowIndex,
				startColumnIndex: startIndex.startColumnIndex,
				endColumnIndex,
			}
		},
		[fullContainerHeight]
	)

	useEffect(() => {
		// const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = virtualListItemsRange(tableMainContainerRef)
		// setRenderingIndexRange({
		// 	startRowIndex,
		// 	startColumnIndex,
		// 	endRowIndex,
		// 	endColumnIndex,
		// })
		// ;["scroll"].forEach((eventName) => {
		// 	tableMainContainerRef.current &&
		// 		tableMainContainerRef.current.addEventListener(eventName, () => {
		// 			const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = virtualListItemsRange(tableMainContainerRef)
		// 			setRenderingIndexRange({
		// 				startRowIndex,
		// 				startColumnIndex,
		// 				endRowIndex,
		// 				endColumnIndex,
		// 			})
		// 		})
		// })
	}, [])

	return (
		<>
			<TableMainContainer ref={tableMainContainerRef} data-testid="table-scroll-container">
				<TableBorder {...resolveBorderProperty} />
				<TableCellWrapper
					cellData={withRulerCellData.data}
					mousedownItemCallback={(params) => handleMousedown(params)}
					mousemoveItemCallback={(params) => handleMousemove(params)}
					mouseupItemCallback={() => handleMouseup()}
					inputItemCallback={(params) => handleInput(params)}
					{...{
						editIndex: interactionInfoRecord.editIndex ?? null,
						sizeProperty,
						renderingIndexRange: renderingIndexRange,
					}}
				/>
			</TableMainContainer>
		</>
	)
}

export { TableMain }
