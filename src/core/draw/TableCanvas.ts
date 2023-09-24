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

	const { drawLine, updateSize, drawText, getDpr, updateStrokeColor, updateCanvasLineWidth } = CustomCanvas(canvas)

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
		const { beginPath, markLine, strokeLine, closePath } = drawLine()

		const drawTableState = {
			offsetTop: 0,
			offsetLeft: 0,
		}

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

		// 对其起始位置
		const offset = drawLineWidth / 2

		const startMark = () => {
			beginPath()
		}

		const closeMarkAndDraw = () => {
			strokeLine()
			closePath()
		}

		const drawHorizonHeader = () => {
			const startY = drawLineWidth

			for (let i = 0; i < height; i++) {
				if (i === 0) {
					markLine(
						{
							x: offset,
							y: startY,
						},
						{
							x: width,
							y: startY,
						}
					)
				} else if (i === cellHeight + drawLineWidth) {
					markLine(
						{
							x: offset,
							y: cellHeight + drawLineWidth,
						},
						{
							x: width,
							y: cellHeight + drawLineWidth,
						}
					)
				} else if (i % (cellHeight + drawLineWidth) === 0) {
					markLine(
						{
							x: offset,
							y: i,
						},
						{
							x: cellWidth + drawLineWidth,
							y: i,
						}
					)
				}
			}
		}

		const drawVerticalHeader = () => {
			const startX = drawLineWidth

			for (let i = 0; i < width; i++) {
				if (i === 0) {
					markLine(
						{
							x: startX,
							y: offset,
						},
						{
							x: startX,
							y: height,
						}
					)
				} else if (i === cellWidth + drawLineWidth) {
					markLine(
						{
							x: cellWidth + drawLineWidth,
							y: offset,
						},
						{
							x: cellWidth + drawLineWidth,
							y: height,
						}
					)
				} else if (i % (cellWidth + drawLineWidth) === 0) {
					markLine(
						{
							x: i,
							y: offset,
						},
						{
							x: i,
							y: cellHeight + drawLineWidth,
						}
					)
				}
			}
		}

		const drawBodyHorizon = () => {
			for (let i = 0; i < height; i++) {
				if (i !== 0 && i % (cellHeight + drawLineWidth) === 0) {
					markLine(
						{
							x: offset + cellWidth,
							y: i,
						},
						{
							x: width,
							y: i,
						}
					)
					continue
				}
			}
		}

		const drawBodyVertical = () => {
			for (let i = 0; i < width; i++) {
				if (i !== 0 && i % (cellWidth + drawLineWidth) === 0) {
					markLine(
						{
							x: i,
							y: offset + cellHeight,
						},
						{
							x: i,
							y: height,
						}
					)
					continue
				}
			}
		}

		const drawAll = (offsetTop?: number, offsetLeft?: number) => {
			offsetTop && (drawTableState.offsetTop = offsetTop)
			offsetLeft && (drawTableState.offsetLeft = offsetLeft)

			updateCanvasLineWidth(drawLineProperty.lineWidth)

			startMark()
			updateStrokeColor("#E0E0E0")
			drawBodyHorizon()
			drawBodyVertical()
			closeMarkAndDraw()

			startMark()
			updateStrokeColor(drawLineProperty.lineColor)
			drawHorizonHeader()
			drawVerticalHeader()
			closeMarkAndDraw()
		}

		return {
			drawAll,
			drawHorizonHeader,
			drawVerticalHeader,
			drawBodyHorizon,
			drawBodyVertical,
		}
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
