import { CustomCanvas, DrawLineProperty } from "."
import { CellData } from "../cellDataHandler"
import { getColumnLabel, getRowLabel } from "../ruler"

const TableCanvas = (canvas: HTMLCanvasElement) => {
	const canvasState = {
		currentCanvasSize: {
			width: 0,
			height: 0,
		},
		dpr: 1,
	}

	const { drawLine, updateSize, drawText, getDpr, updateStrokeColor, updateCanvasLineWidth, clipRect, restoreClip } = CustomCanvas(canvas)

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
	const drawTableFrame = (_cellWidth: number, _cellHeight: number, tableCellData: CellData, _drawLineProperty?: DrawLineProperty) => {
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

		const getOfs = (scrollLeft: number, scrollTop: number) => {
			return {
				ofsLeft: Math.round((scrollLeft ?? 0) * dpr),
				ofsTop: Math.round((scrollTop ?? 0) * dpr),
			}
		}

		const startMark = () => {
			beginPath()
		}

		const closeMarkAndDraw = () => {
			strokeLine()
			closePath()
		}

		const drawHorizontalHeader = (offsetTop?: number) => {
			const startY = drawLineWidth

			const { ofsTop } = getOfs(0, offsetTop ?? 0)

			for (let i = 0; i < height + ofsTop; i++) {
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
					if (i < ofsTop + drawLineWidth + cellHeight) continue
					markLine(
						{
							x: offset,
							y: i - ofsTop,
						},
						{
							x: cellWidth + drawLineWidth,
							y: i - ofsTop,
						}
					)
				}
			}
		}

		const drawVerticalHeader = (offsetLeft?: number) => {
			const startX = drawLineWidth

			const { ofsLeft } = getOfs(offsetLeft ?? 0, 0)

			for (let i = 0; i < width + ofsLeft; i++) {
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
					if (i < ofsLeft + drawLineWidth + cellWidth) continue

					markLine(
						{
							x: i - ofsLeft,
							y: offset,
						},
						{
							x: i - ofsLeft,
							y: cellHeight + drawLineWidth,
						}
					)
				}
			}
		}

		const drawBodyHorizontal = (scrollTop?: number) => {
			const ofs = Math.round((scrollTop ?? 0) * dpr)

			for (let i = 0; i < height + ofs; i += cellHeight + drawLineWidth) {
				if (i < ofs + drawLineWidth + cellHeight) continue

				markLine(
					{
						x: offset + cellWidth,
						y: i - ofs,
					},
					{
						x: width,
						y: i - ofs,
					}
				)
			}
		}

		const drawBodyVertical = (scrollLeft?: number) => {
			const ofs = Math.round((scrollLeft ?? 0) * dpr)

			for (let i = 0; i < width + ofs; i += cellWidth + drawLineWidth) {
				if (i < ofs + drawLineWidth + cellWidth) continue

				markLine(
					{
						x: i - ofs,
						y: offset + cellHeight,
					},
					{
						x: i - ofs,
						y: height,
					}
				)
			}
		}
		/**
		 * 渲染表格中的文字
		 */
		const drawHeaderText = (scrollLeft: number = 0, scrollTop: number = 0) => {
			const { fillText } = drawText()
			const { width, height } = canvasState.currentCanvasSize
			const dpr = getDpr()

			const drawFontsize = 16 * dpr

			const { ofsLeft, ofsTop } = getOfs(scrollLeft, scrollTop)

			const columnLabels = getColumnLabel(Math.ceil(width + ofsLeft / cellWidth))
			let columnCount = 0

			// clip
			clipRect(cellWidth + drawLineWidth, 0, width, cellHeight + drawLineWidth)
			// render columnLabels
			for (let i = 0; i < width + ofsLeft; i += cellWidth + drawLineWidth) {
				if (i === 0) continue
				const positionX = i + drawLineWidth + cellWidth / 2 - ofsLeft
				const positionY = cellHeight / 2 + drawLineWidth
				fillText(columnLabels[columnCount] ?? 0, positionX, positionY, drawFontsize, "center", "middle")
				columnCount++
			}
			restoreClip()

			clipRect(0, cellHeight + dpr, cellWidth + dpr, height)
			// render rowLabels
			const rowLabels = getRowLabel(Math.ceil(height + ofsTop / cellHeight))
			let rowCount = 0
			for (let i = 0; i < height + ofsTop; i += cellHeight + drawLineWidth) {
				if (i === 0) continue
				const positionX = drawLineWidth + cellWidth / 2
				const positionY = i + cellHeight / 2 + drawLineWidth - ofsTop
				fillText(rowLabels[rowCount], positionX, positionY, drawFontsize, "center", "middle")
				rowCount++
			}
			restoreClip()
		}

		const drawBodyText = (scrollLeft: number = 0, scrollTop: number = 0, cellData?: CellData) => {
			const { fillText } = drawText()
			const { ofsLeft, ofsTop } = getOfs(scrollLeft, scrollTop)

			const drawFontsize = 16 * dpr

			let row = 0
			let column = 0
			clipRect(cellWidth + drawLineWidth, cellHeight + drawLineWidth, width, height)
			for (let j = 0; j < height + ofsTop; j += cellHeight + drawLineWidth) {
				if (j === 0) continue

				for (let i = 0; i < width + ofsLeft; i += cellWidth + drawLineWidth) {
					if (i === 0) continue

					const positionX = i + drawLineWidth + cellWidth / 2 - ofsLeft
					const positionY = j + cellHeight / 2 + drawLineWidth - ofsTop

					const currentColumn = column
					const currentRow = row
					const currentValue = (cellData && cellData[currentRow] && cellData[currentRow][currentColumn]) ?? ""

					fillText(`${currentValue}`, positionX, positionY, drawFontsize, "center", "middle")
					column++
				}
				row++
			}
			restoreClip()
		}

		const drawAll = (offsetLeft?: number, offsetTop?: number) => {
			offsetLeft && (drawTableState.offsetLeft = offsetLeft)
			offsetTop && (drawTableState.offsetTop = offsetTop)

			updateCanvasLineWidth(drawLineProperty.lineWidth)
			drawHeaderText(offsetLeft, offsetTop)

			startMark()
			updateStrokeColor("#E0E0E0")
			drawBodyHorizontal(offsetTop)
			drawBodyVertical(offsetLeft)
			closeMarkAndDraw()

			startMark()
			updateStrokeColor(drawLineProperty.lineColor)
			drawHorizontalHeader(offsetTop)
			drawVerticalHeader(offsetLeft)
			closeMarkAndDraw()

			drawBodyText(offsetLeft, offsetTop, tableCellData)
		}

		return {
			drawAll,
			drawHorizontalHeader,
			drawVerticalHeader,
			drawBodyHorizontal,
			drawBodyVertical,
			drawHeaderText,
			drawBodyText,
		}
	}

	return {
		updateCanvasSize,
		drawTableFrame,
	}
}

export type TableCanvasType = ReturnType<typeof TableCanvas>

export default TableCanvas
