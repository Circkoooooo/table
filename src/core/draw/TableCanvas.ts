import { CustomCanvas, DrawLineProperty } from "."
import { getColumnLabel, getRowLabel } from "../ruler"

const TableCanvas = (canvas: HTMLCanvasElement) => {
	const canvasState = {
		currentCanvasSize: {
			width: 0,
			height: 0,
		},
		dpr: 1,
	}

	const { drawLine, updateSize, drawText, getDpr, measureText, getTextHeight } = CustomCanvas(canvas)

	// 更新画布尺寸
	const updateCanvasSize = (width: number, height: number) => {
		canvasState.currentCanvasSize = {
			width,
			height,
		}
		updateSize(canvasState.currentCanvasSize.width, canvasState.currentCanvasSize.height)
	}

	/**
	 * 绘制表格的框架整体
	 * @param cellWidth
	 * @param cellHeight
	 * @param drawLineProperty
	 */
	const drawTableFrame = (_cellWidth: number, _cellHeight: number, _drawLineProperty?: DrawLineProperty) => {
		const { width, height } = canvasState.currentCanvasSize
		const { beginPath, markLine, strokeLine } = drawLine()

		let dpr = getDpr()

		const drawLineProperty = {
			..._drawLineProperty,
		}

		// 线条宽度，适配dpr缩放
		const drawLineWidth = (drawLineProperty && drawLineProperty.lineWidth && Math.round(drawLineProperty.lineWidth * dpr)) || Math.round(dpr)
		drawLineProperty && (drawLineProperty.lineWidth = drawLineWidth)

		// 单元格宽高，适配dpr缩放
		const cellWidth = Math.round(_cellWidth * dpr)
		const cellHeight = Math.round(_cellHeight * dpr)

		const beforeDraw = () => {
			beginPath()
		}

		const onDraw = () => {
			const offset = drawLineWidth / 2

			// render horizon
			for (let i = 0; i < height; i++) {
				if (i === 0) {
					markLine(
						{
							x: offset,
							y: drawLineWidth,
						},
						{
							x: width,
							y: drawLineWidth,
						},
						drawLineProperty
					)
					continue
				}

				if (i % (cellHeight + drawLineWidth) === 0) {
					markLine(
						{
							x: offset,
							y: i,
						},
						{
							x: width,
							y: i,
						},
						drawLineProperty
					)
					continue
				}
			}

			// render vertical
			for (let i = 0; i < width; i++) {
				if (i === 0) {
					markLine(
						{
							x: drawLineWidth,
							y: offset,
						},
						{
							x: drawLineWidth,
							y: height,
						},
						drawLineProperty
					)
					continue
				}

				if (i % (cellWidth + drawLineWidth) === 0) {
					markLine(
						{
							x: i,
							y: offset,
						},
						{
							x: i,
							y: height,
						},
						drawLineProperty
					)
					continue
				}
			}
		}

		const afterDraw = () => {
			strokeLine()
		}

		beforeDraw()
		onDraw()
		afterDraw()
	}

	/**
	 * 渲染表格中的文字
	 * @param _cellWidth 1dpr缩放宽度
	 * @param _cellHeight 1dpr高度
	 * @param lineWidth 1dpr线条像素
	 */
	const drawCellText = (_cellWidth: number, _cellHeight: number, lineWidth: number) => {
		const { fillText } = drawText()
		const { width, height } = canvasState.currentCanvasSize
		const dpr = getDpr()

		const cellWidth = Math.round(_cellWidth * dpr)
		const cellHeight = Math.round(_cellHeight * dpr)
		const drawLineWidth = Math.round(lineWidth * dpr)
		const drawFontsize = 16 * dpr

		const columnLabels = getColumnLabel(Math.ceil(width / cellWidth))
		let columnCount = 0
		for (let i = 0; i < width; i++) {
			if (i !== 0 && i % (cellWidth + drawLineWidth) === 0) {
				const positionX = i + drawLineWidth + cellWidth / 2
				const positionY = cellHeight / 2 + drawLineWidth
				fillText(columnLabels[columnCount], positionX, positionY, drawFontsize, "center", "middle")
				columnCount++
			}
		}

		const rowLabels = getRowLabel(Math.ceil(height / cellHeight))
		let rowCount = 0
		for (let i = 0; i < height; i++) {
			if (i !== 0 && i % (cellHeight + drawLineWidth) === 0) {
				const positionX = drawLineWidth + cellWidth / 2
				const positionY = i + cellHeight / 2 + drawLineWidth
				fillText(rowLabels[rowCount], positionX, positionY, drawFontsize, "center", "middle")
				rowCount++
			}
		}
	}

	return {
		updateCanvasSize,
		drawTableFrame,
		drawCellText,
	}
}

export default TableCanvas
