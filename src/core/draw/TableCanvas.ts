import { CustomCanvas, DrawLineProperty } from "."
import { CellData } from "../cellDataHandler"
import { CanvasDrawConfig, CanvasStaticConfig, TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { getColumnLabel, getRowLabel } from "../ruler"

export const calcLogicSize = (cellWidth: number, cellHeight: number, lineWidth: number) => {
	return {
		cellLogicWidth: Math.round(cellWidth + 2 * lineWidth),
		cellLogicHeight: Math.round(cellHeight + 2 * lineWidth),
	}
}

const TableCanvas = (canvas: HTMLCanvasElement) => {
	const canvasState = {
		currentCanvasSize: {
			width: 0,
			height: 0,
		},
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
	const drawTableFrame = (
		_cellWidth: number,
		_cellHeight: number,
		tableCellData: CellData,
		_staticConfig: CanvasStaticConfig,
		_tableRowColumnCellConfig: TableRowColumnCellConfig,
		_drawLineProperty?: DrawLineProperty
	) => {
		let dpr = getDpr()
		const { width, height } = canvasState.currentCanvasSize
		const { beginPath, markLine, strokeLine, closePath } = drawLine()

		const { headerFontSize } = _staticConfig

		const { rowHeight, columnWidth } = _tableRowColumnCellConfig

		const drawTableState = {
			offsetTop: 0,
			offsetLeft: 0,
			fontSize: 0,
		}

		const drawLineProperty = {
			..._drawLineProperty,
		}

		// 线条宽度，适配dpr缩放
		const drawLineWidth = (drawLineProperty && drawLineProperty.lineWidth && Math.round(drawLineProperty.lineWidth * dpr)) || Math.round(dpr)
		drawLineProperty && (drawLineProperty.lineWidth = drawLineWidth)

		// 单元格宽高，适配dpr缩放
		const cellWidth = Math.round(_cellWidth * dpr)
		const cellHeight = Math.round(_cellHeight * dpr)

		// 更新logicWidth
		const { cellLogicWidth, cellLogicHeight } = calcLogicSize(cellWidth, cellHeight, drawLineWidth)

		// 对其起始位置
		const offsetStart = Math.round(drawLineWidth / 2)

		//最大渲染尺寸
		const maxRenderRowCellCount = _drawLineProperty?.maxRenderRowCount ?? 0
		const maxRenderColumnCellCount = _drawLineProperty?.maxRenderColumnCount ?? 0
		const maxRenderWidth = offsetStart + cellLogicWidth + maxRenderColumnCellCount * (cellLogicWidth - drawLineWidth)
		const maxRenderHeight = offsetStart + cellLogicHeight + maxRenderRowCellCount * (cellLogicHeight - drawLineWidth)

		//表格渲染主体部分需要偏移的量 = 头部行数或者列数
		const startBodyOffset = {
			headerLength: 1,
		}
		// canvas渲染的起始渲染位置偏移
		const startPositionOffset = offsetStart + drawLineWidth

		const getStaticConfig = {
			headerFontSize: () => headerFontSize * dpr,
		}

		// 获取渲染偏移量，即滚动条滚动距离
		const getOfs = () => {
			return {
				ofsLeft: Math.round((drawTableState.offsetLeft ?? 0) * dpr),
				ofsTop: Math.round((drawTableState.offsetTop ?? 0) * dpr),
			}
		}

		// 获取渲染字体大小
		const getFontSize = () => {
			return drawTableState.fontSize * dpr
		}

		const startMark = () => {
			beginPath()
		}

		const closeMarkAndDraw = () => {
			strokeLine()
			closePath()
		}

		//TODO: 修复全屏线条绘制不完整

		const drawHorizontalHeader = () => {
			const { ofsLeft, ofsTop } = getOfs()

			let endLineOfCellIndex = 0
			let sumRenderDiff = 0
			let renderDiff = 0
			let currentRenderY = 0
			for (let i = 0, lineIndex = 0; i < maxRenderHeight; i += cellLogicHeight - drawLineWidth, lineIndex++) {
				if (lineIndex > 1) {
					// 额外偏移
					const currentCellIndex = endLineOfCellIndex
					const currentConfig = rowHeight.find((item) => item.index === currentCellIndex)
					if (currentConfig !== void 0) {
						renderDiff = Math.round(currentConfig.value * dpr)
						sumRenderDiff += renderDiff
					}
					currentRenderY = lineIndex * (cellLogicHeight - drawLineWidth) + offsetStart - ofsTop + sumRenderDiff
					endLineOfCellIndex++

					markLine(
						{
							x: offsetStart / 2,
							y: Math.max(cellLogicHeight, currentRenderY), //2个盒子之间有重叠的边框，所以逻辑宽度还要减去1个边框
						},
						{
							x: cellLogicWidth,
							y: Math.max(cellLogicHeight, currentRenderY),
						}
					)
				} else {
					markLine(
						{
							x: offsetStart / 2,
							y: lineIndex === 0 ? offsetStart : cellLogicHeight,
						},
						{
							x: maxRenderWidth - ofsLeft,
							y: lineIndex === 0 ? offsetStart : cellLogicHeight,
						}
					)
				}
			}
		}

		const drawVerticalHeader = () => {
			const { ofsLeft, ofsTop } = getOfs()

			let endLineOfCellIndex = 0
			let sumRenderDiff = 0
			let renderDiff = 0
			let currentRenderX = 0
			for (let i = 0, lineIndex = 0; i < maxRenderWidth; i += cellLogicWidth - drawLineWidth, lineIndex++) {
				if (lineIndex >= 2) {
					// 额外偏移
					const currentCellIndex = endLineOfCellIndex
					const currentConfig = columnWidth.find((item) => item.index === currentCellIndex)
					if (currentConfig !== void 0) {
						renderDiff = Math.round(currentConfig.value * dpr)
						sumRenderDiff += renderDiff
					}
					currentRenderX = Math.round(lineIndex * (cellLogicWidth - drawLineWidth) + offsetStart - ofsLeft + sumRenderDiff)
					endLineOfCellIndex++

					markLine(
						{
							x: Math.max(cellLogicWidth, currentRenderX),
							y: offsetStart / 2,
						},
						{
							x: Math.max(cellLogicWidth, currentRenderX),
							y: cellLogicHeight,
						}
					)
				} else {
					markLine(
						{
							x: lineIndex === 0 ? offsetStart : cellLogicWidth,
							y: offsetStart / 2,
						},
						{
							x: lineIndex === 0 ? offsetStart : cellLogicWidth,
							y: maxRenderHeight - offsetStart - ofsTop,
						}
					)
				}
			}
		}

		const drawBodyHorizontal = () => {
			const { ofsLeft, ofsTop } = getOfs()

			let endLineOfCellIndex = 0
			let sumRenderDiff = 0
			let renderDiff = 0
			let currentRenderY = 0
			clipRect(cellLogicWidth, cellLogicHeight, maxRenderWidth, maxRenderHeight - ofsTop)
			for (let i = 0, lineIndex = 0; i < maxRenderHeight; i += cellHeight + drawLineWidth, lineIndex++) {
				if (lineIndex >= 2) {
					const currentCellIndex = endLineOfCellIndex
					const currentConfig = rowHeight.find((item) => item.index === currentCellIndex)
					if (currentConfig !== void 0) {
						renderDiff = Math.round(currentConfig.value * dpr)
						sumRenderDiff += renderDiff
					}
					currentRenderY = lineIndex * (cellLogicHeight - drawLineWidth) + offsetStart - ofsTop + sumRenderDiff
					endLineOfCellIndex++
				}

				if (currentRenderY < cellLogicHeight) continue

				markLine(
					{
						x: cellLogicWidth,
						y: currentRenderY,
					},
					{
						x: maxRenderWidth - ofsLeft,
						y: currentRenderY,
					}
				)
			}
			restoreClip()
		}

		const drawBodyVertical = () => {
			const { ofsLeft, ofsTop } = getOfs()
			let endLineOfCellIndex = 0
			let sumRenderDiff = 0
			let renderDiff = 0
			let currentRenderX = 0
			for (let i = 0, lineIndex = 0; i < maxRenderWidth; i += cellLogicWidth - drawLineWidth, lineIndex++) {
				if (lineIndex >= 2) {
					const currentCellIndex = endLineOfCellIndex
					const currentConfig = columnWidth.find((item) => item.index === currentCellIndex)
					if (currentConfig !== void 0) {
						renderDiff = Math.round(currentConfig.value * dpr)
						sumRenderDiff += renderDiff
					}
					currentRenderX = Math.round(lineIndex * (cellLogicWidth - drawLineWidth) + offsetStart - ofsLeft + sumRenderDiff)
					endLineOfCellIndex++
				}

				if (currentRenderX < cellLogicWidth) continue

				markLine(
					{
						x: currentRenderX,
						y: offsetStart / 2 + cellLogicHeight,
					},
					{
						x: currentRenderX,
						y: maxRenderHeight - offsetStart - ofsTop,
					}
				)
			}
		}
		/**
		 * 渲染表格中的文字
		 */
		const drawHeaderText = () => {
			const { fillText } = drawText()
			const { width, height } = canvasState.currentCanvasSize

			const drawFontsize = getStaticConfig.headerFontSize()

			const { ofsLeft, ofsTop } = getOfs()

			const rowNum = 26
			const columnNum = 26
			const rowLabels = getRowLabel(rowNum)
			const columnLabels = getColumnLabel(Math.ceil(width + ofsLeft / cellWidth))

			// 每个单元格左边所需偏移量
			let currentSumRenderLeft = 0
			let currentSumRenderTop = 0
			const leftOffsetArr: number[] = new Array(columnNum).fill(0).map((item, index) => {
				currentSumRenderLeft += Math.round((columnWidth.find((item) => item.index === index - 1)?.value || 0) * dpr)
				return currentSumRenderLeft
			})

			const topOffsetArr: number[] = new Array(rowNum).fill(0).map((item, index) => {
				currentSumRenderTop += Math.round((rowHeight.find((item) => item.index === index - 1)?.value || 0) * dpr)
				return currentSumRenderTop
			})

			clipRect(startPositionOffset, cellLogicHeight + startPositionOffset, cellLogicWidth + startPositionOffset, height)
			for (let row = 0; row < rowNum; row++) {
				const currentOffsetTop = topOffsetArr[row]
				const currentRowOffsetTop = topOffsetArr[row + 1] - topOffsetArr[row]
				const positionX = cellLogicWidth / 2 - startPositionOffset
				const positionY = (cellLogicHeight + currentRowOffsetTop) / 2 + (row + startBodyOffset.headerLength) * (cellLogicHeight - drawLineWidth) + currentOffsetTop - ofsTop
				fillText(rowLabels[row], positionX, positionY, drawFontsize, "center", "middle")
			}
			restoreClip()

			clipRect(cellLogicWidth + startPositionOffset, startPositionOffset, width, cellLogicHeight + startPositionOffset)
			for (let column = 0; column < columnNum; column++) {
				const currentOffsetLeft = leftOffsetArr[column]
				const currentRowOffsetLeft = leftOffsetArr[column + 1] - leftOffsetArr[column]
				const positionX = (cellLogicWidth + currentRowOffsetLeft) / 2 + (column + startBodyOffset.headerLength) * (cellLogicWidth - drawLineWidth) + currentOffsetLeft - ofsLeft
				const positionY = cellLogicHeight / 2 - startPositionOffset
				fillText(columnLabels[column], positionX, positionY, drawFontsize, "center", "middle")
			}
			restoreClip()
		}

		// 渲染body部分的字体
		const drawBodyText = (cellData?: CellData) => {
			const { fillText } = drawText()
			const { ofsLeft, ofsTop } = getOfs()
			const drawFontsize = getFontSize()

			const rowNum = 26
			const columnNum = 26

			// 每个单元格左边所需偏移量
			let currentSumRenderLeft = 0
			let currentSumRenderTop = 0
			const leftOffsetArr: number[] = new Array(columnNum).fill(0).map((item, index) => {
				currentSumRenderLeft += Math.round((columnWidth.find((item) => item.index === index - 1)?.value || 0) * dpr)
				return currentSumRenderLeft
			})

			const topOffsetArr: number[] = new Array(rowNum).fill(0).map((item, index) => {
				currentSumRenderTop += Math.round((rowHeight.find((item) => item.index === index - 1)?.value || 0) * dpr)
				return currentSumRenderTop
			})

			clipRect(cellLogicWidth, cellLogicHeight, width, height)

			for (let row = 0; row < rowNum; row++) {
				//diff值是每一个单元格相对于上一个单元格起始渲染位置的偏移量
				const diffY = cellLogicHeight - drawLineWidth
				const diffYMultiple = row + startBodyOffset.headerLength
				const currentPositionY = Math.round(drawLineWidth + diffYMultiple * diffY + topOffsetArr[row] - ofsTop)

				for (let column = 0; column < columnNum; column++) {
					const diffX = cellLogicWidth - drawLineWidth
					const diffXMultiple = column + startBodyOffset.headerLength
					const currentPositionX = Math.round(diffXMultiple * diffX + leftOffsetArr[column] - ofsLeft)

					clipRect(currentPositionX, currentPositionY, ofsLeft + cellLogicWidth + currentPositionX - startPositionOffset, ofsTop + cellLogicHeight + currentPositionY - startPositionOffset)

					const currentValue = `${(cellData && cellData[row][column]) || ""}`
					fillText(currentValue, currentPositionX + offsetStart, currentPositionY + offsetStart, drawFontsize, "left", "top")
					restoreClip()
				}
			}
			restoreClip()
		}

		const drawAll = (drawConfig: CanvasDrawConfig, offsetLeft?: number, offsetTop?: number) => {
			const { fontSize } = drawConfig
			offsetLeft && (drawTableState.offsetLeft = offsetLeft)
			offsetTop && (drawTableState.offsetTop = offsetTop)
			drawTableState.fontSize = fontSize

			updateCanvasLineWidth(drawLineProperty.lineWidth)
			drawHeaderText()

			startMark()
			updateStrokeColor("#E0E0E0")
			drawBodyHorizontal()
			drawBodyVertical()
			closeMarkAndDraw()

			startMark()
			updateStrokeColor(drawLineProperty.lineColor)
			drawHorizontalHeader()
			drawVerticalHeader()
			closeMarkAndDraw()

			drawBodyText(tableCellData)
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
