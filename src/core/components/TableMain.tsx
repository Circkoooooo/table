import { useEffect, useRef } from "react"
import { TableCanvasContainer, TableRowContainer, TableMenu, TableVerticalScrollbarContainer, TableMainContainer } from "../styled/TableMain-styled"
import TableCanvas from "../draw/TableCanvas"
import TableMenuScrollbar from "./TableMenuScrollbar"
import { updateContainerMaxSizeDispatch, updateContainerSizeDispatch } from "../redux/canvas/canvasSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks"

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const dispatch = useAppDispatch()
	const canvasStore = useAppSelector((state) => state.canvas)

	const draw = () => {
		if (tableMainContainerRef.current === null || canvasRef.current === null) return
		const canvas = TableCanvas(canvasRef.current)
		canvas.updateCanvasSize(tableMainContainerRef.current.clientWidth * window.devicePixelRatio, tableMainContainerRef.current.clientHeight * window.devicePixelRatio)

		const lineWidth = 1
		const cellWidth = 100
		const cellHeight = 30

		const { drawAll } = canvas.drawTableFrame(cellWidth, cellHeight, {
			lineWidth: lineWidth,
			lineColor: "#bebfb9",
		})

		const offsetLeft = canvasStore.containerOffsetLeft
		const offsetTop = canvasStore.containerOffsetTop

		drawAll(offsetLeft, offsetTop)
	}

	const handleResize = () => {
		// resize 重绘内容
		draw()

		// store最新的尺寸和偏移
		dispatch(
			updateContainerSizeDispatch({
				containerWidth: tableMainContainerRef.current?.clientWidth ?? 0,
				containerHeight: tableMainContainerRef.current?.clientHeight ?? 0,
			})
		)
		dispatch(
			updateContainerMaxSizeDispatch({
				maxWidth: 3000,
				maxHeight: 3000,
			})
		)
	}

	useEffect(() => {
		if (!tableMainContainerRef || !canvasRef) return

		handleResize()
		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	})

	useEffect(() => {
		draw()
	})

	return (
		<>
			<TableMainContainer>
				<TableRowContainer>
					<TableCanvasContainer ref={tableMainContainerRef}>
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
