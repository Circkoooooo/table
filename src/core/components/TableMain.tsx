import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { TableCanvasContainer, TableRowContainer, TableMenu, TableVerticalScrollbarContainer, TableMainContainer } from "../styled/TableMain-styled"
import TableCanvas, { TableCanvasType, calcLogicSize } from "../draw/TableCanvas"
import TableMenuScrollbar from "./TableMenuScrollbar"
import { updateContainerMaxSizeDispatch, updateContainerSizeDispatch } from "../redux/canvas/canvasSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { HighlightBorder, HighlightBorderProperty } from "./HighlightBorder/HighlightBorder"
import { InteractionPanel } from "./InteractionPanel"
import { CellInput } from "./CellInput/CellInput"
import { parseInteractionIndex } from "../parseInteractionIndex"

const lineWidth = 1
const cellWidth = 100
const cellHeight = 30

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const tableCanvasOperate = useRef<TableCanvasType | null>(null)

	const interactionStore = useAppSelector((state) => state.interaction)

	const dispatch = useAppDispatch()
	const canvasStore = useAppSelector((state) => state.canvas)
	const tableDataStore = useAppSelector((state) => state.tableData)

	const [tableCanvasInfo] = useState(() => {
		const { cellLogicWidth, cellLogicHeight } = calcLogicSize(cellWidth, cellHeight, lineWidth)
		return {
			cellLogicWidth,
			cellLogicHeight,
		}
	})

	// 初始化画布
	const initTableCanvas = () => {
		if (tableMainContainerRef.current === null || canvasRef.current === null) return
		tableCanvasOperate.current = TableCanvas(canvasRef.current)
	}

	// 更新画布尺寸
	const updateTableCanvasSize = () => {
		if (!tableCanvasOperate.current || !tableMainContainerRef.current) return
		const canvasOperate = tableCanvasOperate.current
		canvasOperate.updateCanvasSize(tableMainContainerRef.current.clientWidth * window.devicePixelRatio, tableMainContainerRef.current.clientHeight * window.devicePixelRatio)
	}

	//重新绘制所有页面
	const flushTable = useCallback(() => {
		if (!tableCanvasOperate.current || !tableMainContainerRef.current) return
		const canvasOperate = tableCanvasOperate.current
		const { drawAll } = canvasOperate.drawTableFrame(cellWidth, cellHeight, tableDataStore.cellData, canvasStore.tableStaticConfig, canvasStore.tableRowColumnCellConfig, {
			lineWidth,
			lineColor: "#bebfb9",
			maxRenderRowCount: tableDataStore.cellDataInfo.rowNum,
			maxRenderColumnCount: tableDataStore.cellDataInfo.columnNum,
		})

		const offsetLeft = canvasStore.containerOffsetLeft
		const offsetTop = canvasStore.containerOffsetTop

		drawAll(canvasStore.drawConfig, offsetLeft, offsetTop)
	}, [canvasStore, tableDataStore])

	//更新滚动内容的尺寸
	const handleResize = useCallback(() => {
		dispatch(
			updateContainerSizeDispatch({
				containerWidth: tableMainContainerRef.current?.clientWidth ?? 0,
				containerHeight: tableMainContainerRef.current?.clientHeight ?? 0,
			})
		)
		dispatch(
			updateContainerMaxSizeDispatch({
				maxWidth: 102 * tableDataStore.cellDataInfo.columnNum + 102, //100为额外渲染长度，TODO:提取为变量
				maxHeight: 32 * tableDataStore.cellDataInfo.rowNum + 32,
			})
		)
	}, [dispatch, tableDataStore])

	//cell input
	const isEditing = useMemo(() => {
		return interactionStore.isEdit
	}, [interactionStore])

	useEffect(() => {
		if (!tableMainContainerRef || !canvasRef) return

		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [handleResize])

	//初始化，渲染初始页面
	useEffect(() => {
		initTableCanvas()
		updateTableCanvasSize()
		handleResize()
		flushTable()
	}, [flushTable, handleResize])

	/**
	 * 在mousedownIndex更改之后，更新最新的当前单元格显示的内容。
	 *
	 * 如果是点击的头部行或者列 ，则返回空字符串。
	 */
	const cellInputCurrentValue = useMemo(() => {
		const cellData = tableDataStore.cellData
		const mousedownIndex = interactionStore.mousedownIndex

		if (!cellData || !mousedownIndex) return null
		const { rowIndex, columnIndex } = mousedownIndex
		if (rowIndex === 0 || columnIndex === 0) return null

		const bodyRowIndex = rowIndex - 1
		const bodyColumnIndex = columnIndex - 1
		return cellData[bodyRowIndex] && cellData[bodyRowIndex][bodyColumnIndex]
	}, [interactionStore.mousedownIndex, tableDataStore.cellData])

	/**
	 * 记录高亮边框所在位置和尺寸
	 */
	const highlightBorderProperty = useMemo<HighlightBorderProperty>(() => {
		const lineWidth = 1
		const borderWidth = 2

		const { cellLogicHeight, cellLogicWidth } = tableCanvasInfo

		let property: HighlightBorderProperty = {
			borderOffsetLeft: 0,
			borderOffsetTop: 0,
			borderWidth: 0,
			offsetLeft: 0,
			offsetTop: 0,
			width: 0,
			height: 0,
		}

		const { mousedownIndex, mousemoveIndex } = interactionStore

		const interactionIndex = parseInteractionIndex(mousedownIndex, mousemoveIndex, tableDataStore.cellDataInfo.rowNum, tableDataStore.cellDataInfo.columnNum)

		if (interactionIndex) {
			const { startRowIndex, startColumnIndex, rowCellCount, columnCellCount } = interactionIndex

			/****** 根据索引获取额外的尺寸和偏移 ******/
			const rowHeightArrs = canvasStore.tableRowColumnCellConfig.rowHeight
			const columnWidthArrs = canvasStore.tableRowColumnCellConfig.columnWidth
			let extraHeight = 0
			let extraWidth = 0

			//额外的上方偏移。选中单元格上方非默认高度的额外高度之和。
			let extraOffsetTop = rowHeightArrs
				.filter(({ index }) => index < startRowIndex)
				.map((item) => item.value)
				.reduce((pre, cur) => pre + cur, 0)

			let extraOffsetLeft = columnWidthArrs
				.filter(({ index }) => index < startColumnIndex)
				.map((item) => item.value)
				.reduce((pre, cur) => pre + cur, 0)

			rowHeightArrs
				.filter(({ index }) => index >= startRowIndex && index < startRowIndex + columnCellCount)
				.forEach(({ value }) => {
					extraHeight += value
				})

			columnWidthArrs
				.filter(({ index }) => index >= startColumnIndex && index < startColumnIndex + rowCellCount)
				.forEach(({ value }) => {
					extraWidth += value
				})

			property.offsetLeft = startColumnIndex * (cellLogicWidth - lineWidth) - canvasStore.containerOffsetLeft + extraOffsetLeft
			property.offsetTop = startRowIndex * (cellLogicHeight - lineWidth) - canvasStore.containerOffsetTop + extraOffsetTop
			property.width = rowCellCount * (cellLogicWidth - lineWidth) + extraWidth
			property.height = columnCellCount * (cellLogicHeight - lineWidth) + extraHeight
		}

		const newProperty = Object.assign(property, {
			borderOffsetLeft: cellLogicWidth,
			borderOffsetTop: cellLogicHeight,
			borderWidth: borderWidth,
		})

		return newProperty
	}, [canvasStore, interactionStore, tableDataStore, tableCanvasInfo])

	return (
		<>
			<TableMainContainer>
				<TableRowContainer>
					<HighlightBorder
						isRender={!isEditing}
						highlightBorderProperty={highlightBorderProperty}
						cellLogicWidth={tableCanvasInfo.cellLogicWidth}
						cellLogicHeight={tableCanvasInfo.cellLogicHeight}
					>
						<CellInput
							editIndex={interactionStore.editIndex}
							isRender={isEditing}
							highlightBorderProperty={highlightBorderProperty}
							fontSize={canvasStore.drawConfig.fontSize}
							initialValue={cellInputCurrentValue}
						/>
					</HighlightBorder>

					<TableCanvasContainer ref={tableMainContainerRef}>
						<InteractionPanel />
						<canvas ref={canvasRef}></canvas>
					</TableCanvasContainer>
					<TableVerticalScrollbarContainer>
						<TableMenuScrollbar direction="vertical" />
					</TableVerticalScrollbarContainer>
				</TableRowContainer>

				<TableMenu>
					<TableMenuScrollbar direction="horizontal" />
				</TableMenu>
			</TableMainContainer>
		</>
	)
}

export { TableMain }
