import { useEffect, useRef } from "react"
import { TableCanvasContainer, TableRowContainer, TableMenu, TableVerticalScrollbarContainer, TableMainContainer } from "../styled/TableMain-styled"
import TableCanvas from "../draw/TableCanvas"
import { debounce } from "../../tools/debounce"
import TableMenuScrollbar from "./TableMenuScrollbar"
import { useDispatch } from "react-redux"
import { updateContainerSizeDispatch } from "../redux/canvas/canvasSlice"

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const dispatch = useDispatch()

	const updateStoreContainerSize = () => {
		dispatch(
			updateContainerSizeDispatch({
				containerWidth: canvasRef.current?.clientWidth ?? 0,
				containerHeight: canvasRef.current?.clientHeight ?? 0,
			})
		)
	}

	function draw() {
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

		canvas.drawCellText(cellWidth, cellHeight, lineWidth)

		drawAll()
	}

	const handleResize = debounce(() => {
		draw()
		updateStoreContainerSize()
	}, 0)

	useEffect(() => {
		if (!tableMainContainerRef || !canvasRef) return

		handleResize()
		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [handleResize])

	return (
		<>
			<TableMainContainer>
				<TableRowContainer>
					<TableCanvasContainer ref={tableMainContainerRef}>
						<canvas ref={canvasRef}></canvas>
					</TableCanvasContainer>
					<TableVerticalScrollbarContainer>
						<TableMenuScrollbar direction="vertical" scrollCallback={(param) => console.log(param)} />
					</TableVerticalScrollbarContainer>
				</TableRowContainer>

				<TableMenu>
					<TableMenuScrollbar direction="horizontal" scrollCallback={(param) => console.log(param)} />
				</TableMenu>
			</TableMainContainer>
		</>
	)
}

export { TableMain }
