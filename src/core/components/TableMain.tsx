import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import TableBorder from "./TableBorder"
import { SizeProperty } from "../types/table.type"
import TableCellWrapper from "./TableCellWrapper"
import { TABLE_CONFIG } from "../configs/table_config"
import { TableMainContainer } from "../styled/TableMain-styled"
import { useAppSelector } from "../redux/hooks"

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)

	const interactionState = useAppSelector((state) => state.interaction)
	const tableDataState = useAppSelector((state) => state.tableData)
	const { editIndex } = interactionState

	const withRulerCellData = tableDataState.cellData

	const [sizeProperty, setSizeProperty] = useState<SizeProperty.RowColumnSizeProperty>({
		rowSizeProperty: [
			// {
			// 	isSingleItem: false,
			// 	startRowIndex: 2,
			// 	endRowIndex: 3,
			// 	height: 100,
			// },
		],
		columnSizeProperty: [],
	})

	const [renderingIndexRange, setRenderingIndexRange] = useState<SizeProperty.RenderingIndexRange>({
		startRowIndex: 0,
		startColumnIndex: 0,
		endRowIndex: withRulerCellData.info.rowLength,
		endColumnIndex: withRulerCellData.info.columnLength,
	})

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
				<TableBorder sizeProperty={sizeProperty} withRulerCellData={withRulerCellData} />
				<TableCellWrapper
					{...{
						withRulerCellData,
						editIndex: editIndex ?? null,
						sizeProperty,
						renderingIndexRange: renderingIndexRange,
					}}
				/>
			</TableMainContainer>
		</>
	)
}

export { TableMain }
