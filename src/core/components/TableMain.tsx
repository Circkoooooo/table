import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { TableCanvasContainer, TableRowContainer, TableMenu, TableVerticalScrollbarContainer, TableMainContainer } from "../styled/TableMain-styled"
import TableCanvas, { TableCanvasType, calcLogicSize } from "../draw/TableCanvas"
import TableMenuScrollbar from "./TableMenuScrollbar"
import { updateContainerMaxSizeDispatch, updateContainerSizeDispatch } from "../redux/canvas/canvasSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { HighlightBorder } from "./HighlightBorder/HighlightBorder"
import { InteractionPanel } from "./InteractionPanel"
import { CellInput } from "./CellInput/CellInput"

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

	const [tableCanvasInfo, setTableCanvasInfo] = useState(() => {
		const { cellLogicWidth, cellLogicHeight } = calcLogicSize(cellWidth, cellHeight, lineWidth)
		return {
			cellLogicWidth,
			cellLogicHeight,
		}
	})

	const initTableCanvas = () => {
		if (tableMainContainerRef.current === null || canvasRef.current === null) return
		tableCanvasOperate.current = TableCanvas(canvasRef.current)
	}

	const updateTableCanvasSize = () => {
		if (!tableCanvasOperate.current || !tableMainContainerRef.current) return
		const canvasOperate = tableCanvasOperate.current
		canvasOperate.updateCanvasSize(tableMainContainerRef.current.clientWidth * window.devicePixelRatio, tableMainContainerRef.current.clientHeight * window.devicePixelRatio)
	}

	//重新绘制所有页面
	const flushTable = useCallback(() => {
		if (!tableCanvasOperate.current || !tableMainContainerRef.current) return
		const canvasOperate = tableCanvasOperate.current

		const { drawAll } = canvasOperate.drawTableFrame(cellWidth, cellHeight, tableDataStore.cellData, {
			lineWidth,
			lineColor: "#bebfb9",
			maxRenderWidth: canvasStore.containerMaxWidth,
			maxRenderHeight: canvasStore.containerMaxHeight,
		})

		const offsetLeft = canvasStore.containerOffsetLeft
		const offsetTop = canvasStore.containerOffsetTop

		drawAll(offsetLeft, offsetTop)
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
				maxWidth: 3000,
				maxHeight: 1000,
			})
		)
	}, [dispatch])

	//cell input
	const isRender = useMemo(() => {
		return interactionStore.isEdit
	}, [interactionStore])

	const offsetIndex = useMemo(() => {
		const bodyStartIndex = 1
		return {
			rowIndex: (interactionStore.editIndex?.rowIndex ?? 0) - bodyStartIndex,
			columnIndex: (interactionStore.editIndex?.columnIndex ?? 0) - bodyStartIndex,
		}
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

	const cellInputCurrentValue = useMemo(() => {
		const cellData = tableDataStore.cellData
		const mousedownIndex = interactionStore.mousedownIndex

		if (!cellData || !mousedownIndex) return ""

		const { rowIndex, columnIndex } = mousedownIndex
		return cellData[rowIndex] && cellData[rowIndex][columnIndex] === null ? "" : `${cellData[rowIndex][columnIndex]}`
	}, [interactionStore.mousedownIndex, tableDataStore.cellData])

	return (
		<>
			<TableMainContainer>
				<TableRowContainer>
					<HighlightBorder cellLogicWidth={tableCanvasInfo.cellLogicWidth} cellLogicHeight={tableCanvasInfo.cellLogicHeight}>
						<CellInput
							isRender={isRender}
							offsetRowIndex={offsetIndex.rowIndex}
							offsetColumnIndex={offsetIndex.columnIndex}
							cellLogicWidth={tableCanvasInfo.cellLogicWidth}
							cellLogicHeight={tableCanvasInfo.cellLogicHeight}
							offsetLeft={canvasStore.containerOffsetLeft}
							offsetTop={canvasStore.containerOffsetTop}
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
