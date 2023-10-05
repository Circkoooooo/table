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

		const cellRenderLogicWidth = Math.round(drawLineWidth * 2 + cellWidth) //逻辑高度 为盒子的总高度
		const cellRenderLogicHeight = Math.round(drawLineWidth * 2 + cellHeight)

		// 对其起始位置
		const offsetStart = Math.round(drawLineWidth / 2)

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

		const drawHorizontalHeader = (scrollTop?: number) => {
			const ofs = Math.round((scrollTop ?? 0) * dpr)

			for (let i = 0, lineIndex = 0; i < height + ofs; i += cellRenderLogicHeight - drawLineWidth, lineIndex++) {
				if (lineIndex > 1) {
					if (i - ofs < cellRenderLogicHeight) continue

					markLine(
						{
							x: offsetStart / 2,
							y: lineIndex * (cellRenderLogicHeight - drawLineWidth) + offsetStart - ofs, //2个盒子之间有重叠的边框，所以逻辑宽度还要减去1个边框
						},
						{
							x: cellRenderLogicWidth,
							y: lineIndex * (cellRenderLogicHeight - drawLineWidth) + offsetStart - ofs,
						}
					)
				} else {
					console.log(offsetStart, drawLineWidth)
					markLine(
						{
							x: offsetStart / 2,
							y: lineIndex === 0 ? offsetStart : cellRenderLogicHeight,
						},
						{
							x: width,
							y: lineIndex === 0 ? offsetStart : cellRenderLogicHeight,
						}
					)
				}
			}
		}

		const drawVerticalHeader = (scrollLeft?: number) => {
			const ofs = Math.round((scrollLeft ?? 0) * dpr)

			for (let i = 0, lineIndex = 0; i < width + ofs; i += cellRenderLogicWidth - drawLineWidth, lineIndex++) {
				if (lineIndex > 1) {
					if (i - ofs < cellRenderLogicWidth) continue

					markLine(
						{
							x: lineIndex * (cellRenderLogicWidth - drawLineWidth) + offsetStart - ofs,
							y: offsetStart / 2,
						},
						{
							x: lineIndex * (cellRenderLogicWidth - drawLineWidth) + offsetStart - ofs,
							y: cellRenderLogicHeight,
						}
					)
				} else {
					markLine(
						{
							x: lineIndex === 0 ? offsetStart : cellRenderLogicWidth,
							y: offsetStart / 2,
						},
						{
							x: lineIndex === 0 ? offsetStart : cellRenderLogicWidth,
							y: height,
						}
					)
				}
			}
		}

		const drawBodyHorizontal = (scrollTop?: number) => {
			const ofs = Math.round((scrollTop ?? 0) * dpr)

			for (let i = 0, lineIndex = 0; i < height + ofs; i += cellHeight + drawLineWidth, lineIndex++) {
				if (lineIndex < 2 || i < ofs + drawLineWidth + cellHeight) continue

				markLine(
					{
						x: cellRenderLogicWidth,
						y: lineIndex * (cellRenderLogicHeight - drawLineWidth) + offsetStart - ofs,
					},
					{
						x: width + offsetStart,
						y: lineIndex * (cellRenderLogicHeight - drawLineWidth) + offsetStart - ofs,
					}
				)
			}
		}

		const drawBodyVertical = (scrollLeft?: number) => {
			const ofs = Math.round((scrollLeft ?? 0) * dpr)

			for (let i = 0, lineIndex = 0; i < width + ofs; i += cellWidth + drawLineWidth, lineIndex++) {
				if (lineIndex < 2 || i < ofs + drawLineWidth + cellWidth) continue

				markLine(
					{
						x: lineIndex * (cellRenderLogicWidth - drawLineWidth) + offsetStart - ofs,
						y: cellRenderLogicHeight,
					},
					{
						x: lineIndex * (cellRenderLogicWidth - drawLineWidth) + offsetStart - ofs,
						y: height + offsetStart,
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
			clipRect(cellRenderLogicWidth - drawLineWidth, 0, width, cellRenderLogicHeight - drawLineWidth)
			// render columnLabels
			for (let i = 0, textIndex = 0; i < width + ofsLeft; i += cellWidth + drawLineWidth, textIndex++) {
				if (textIndex === 0) continue

				/**
				 * offsetStart为每个绘制都有的初始偏移
				 * cellRenderLogicWidth - drawLineWidth为除了第一个后，排除了cell边框的偏移量
				 */
				const positionX = offsetStart + textIndex * (cellRenderLogicWidth - drawLineWidth) + cellRenderLogicWidth / 2 - ofsLeft
				const positionY = offsetStart + cellRenderLogicHeight / 2
				fillText(columnLabels[columnCount] ?? 0, positionX, positionY, drawFontsize, "center", "middle")
				columnCount++
			}
			restoreClip()

			clipRect(0, cellRenderLogicHeight, cellRenderLogicWidth, height)
			// render rowLabels
			const rowLabels = getRowLabel(Math.ceil(height + ofsTop / cellHeight))
			let rowCount = 0
			for (let i = 0, textIndex = 0; i < height + ofsTop; i += cellHeight + drawLineWidth, textIndex++) {
				if (textIndex === 0) continue

				const positionX = offsetStart + cellRenderLogicWidth / 2
				const positionY = textIndex * (cellRenderLogicHeight - drawLineWidth) + cellRenderLogicHeight / 2 - ofsTop
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
