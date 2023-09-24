import { useEffect, useRef } from "react"
import { TableCanvasContainer, TableRowContainer, TableMainContainer, TableMenu, TableVerticalScrollbarContainer } from "../styled/TableMain-styled"
import TableCanvas from "../draw/TableCanvas"
import { debounce } from "../../tools/debounce"
import TableMenuScrollbar from "./TableMenuScrollbar"

const TableMain = () => {
	const tableMainContainerRef = useRef<HTMLDivElement>(null)

	const canvasRef = useRef(null)
	useEffect(() => {
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
		draw()

		window.onresize = debounce(() => {
			draw()
		}, 100)
	}, [])

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
