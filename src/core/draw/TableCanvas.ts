import { CustomCanvas, DrawLineProperty } from "."
import { calcOffsetArr } from "../calcOffsetArr"
import { calcSumExtraSize } from "../calcSumExtraSize"
import { CellData } from "../cellDataHandler"
import { CanvasDrawConfig, CanvasStaticConfig, TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"
import { getColumnLabel, getRowLabel } from "../ruler"
import { CanvasRenderProperty } from "./types/tableCanvas"

const TableCanvas = (canvas: HTMLCanvasElement) => {
	const canvasState = {
		currentCanvasSize: {
			width: 0,
			height: 0,
		},
	}

	const { drawLine, updateSize, drawText, getDpr, updateStrokeColor, updateCanvasLineWidth, clipRect, restoreClip, fillRect } = CustomCanvas(canvas)

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
		_tableCellDataInfo: CellDataInfoNumConfig,
		_staticConfig: CanvasStaticConfig,
		_tableRowColumnCellConfig: TableRowColumnCellConfig,
		_canvasRenderProperty: CanvasRenderProperty,
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

		drawLineProperty && drawLineProperty.lineWidth && console.log(Math.round(drawLineProperty.lineWidth * dpr), drawLineProperty.lineWidth * dpr)
		/**
		 * 线条宽度；适配dpr，整数
		 */
		const drawLineWidth = (drawLineProperty && drawLineProperty.lineWidth && Math.round(drawLineProperty.lineWidth * dpr)) || Math.round(dpr)
		drawLineProperty && (drawLineProperty.lineWidth = drawLineWidth)

		// 获取配置中逻辑尺寸；适配dpr，整数
		const _cellDefaultLogicSize = _staticConfig.cellDefaultLogicSize
		const cellLogicWidth = _cellDefaultLogicSize.width * dpr
		const cellLogicHeight = _cellDefaultLogicSize.height * dpr

		/**
		 * 对其起始位置；整数
		 */
		const offsetStart = drawLineWidth / 2

		//最大渲染尺寸
		const maxRenderRowCellCount = _drawLineProperty?.maxRenderRowCount ?? 0
		const maxRenderColumnCellCount = _drawLineProperty?.maxRenderColumnCount ?? 0
		const maxRenderWidth = offsetStart + cellLogicWidth + maxRenderColumnCellCount * (cellLogicWidth - drawLineWidth)
		const maxRenderHeight = offsetStart + cellLogicHeight + maxRenderRowCellCount * (cellLogicHeight - drawLineWidth)

		// 可视区域渲染尺寸
		const { renderWidth, renderHeight } = _canvasRenderProperty

		/**
		 * 表格渲染主体部分需要偏移的量 = 头部行数或者列数。整数
		 */
		const startBodyOffset = {
			headerLength: 1,
		}

		/**
		 * canvas渲染的起始渲染位置偏移;整数
		 */
		const startRenderPositionOffset = offsetStart + drawLineWidth

		// table data的info
		const rowNum = _tableCellDataInfo.rowNum
		const columnNum = _tableCellDataInfo.columnNum

		const { sumLeftExtra, sumTopExtra } = calcSumExtraSize(
			{
				rowHeight,
				columnWidth,
			},
			dpr
		)
		const { leftOffsetArr, topOffsetArr } = calcOffsetArr(
			{
				rowNum,
				columnNum,
			},
			{
				rowHeight,
				columnWidth,
			},
			dpr
		)

		const getStaticConfig = {
			headerFontSize: () => headerFontSize * dpr,
		}

		/**
		 * 获取渲染偏移量，即滚动条滚动距离；适配dpr，整数
		 * @returns
		 */
		const getOfs = () => {
			return {
				ofsLeft: (drawTableState.offsetLeft ?? 0) * dpr,
				ofsTop: (drawTableState.offsetTop ?? 0) * dpr,
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

					// 如果设置了行的额外高度配置，则计算额外的高度
					if (currentConfig !== void 0) {
						renderDiff = currentConfig.value * dpr
						sumRenderDiff += renderDiff
					}
					// 最终计算应该渲染的Y
					currentRenderY = lineIndex * (cellLogicHeight - drawLineWidth) + offsetStart - ofsTop + sumRenderDiff
					endLineOfCellIndex++

					const positionY = Math.round(Math.max(cellLogicHeight, currentRenderY))
					markLine(
						{
							x: offsetStart / 2,
							y: positionY, //2个盒子之间有重叠的边框，所以逻辑宽度还要减去1个边框
						},
						{
							x: cellLogicWidth,
							y: positionY,
						}
					)
				} else {
					const positionY = Math.round(lineIndex === 0 ? offsetStart : cellLogicHeight)
					//线条索引为0和1的时候绘制，也就是第1，2条线
					markLine(
						{
							x: offsetStart / 2,
							y: positionY,
						},
						{
							x: Math.max(cellLogicWidth, maxRenderWidth - ofsLeft + sumLeftExtra),
							y: positionY,
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
						renderDiff = currentConfig.value * dpr
						sumRenderDiff += renderDiff
					}
					endLineOfCellIndex++

					currentRenderX = lineIndex * (cellLogicWidth - drawLineWidth) + offsetStart - ofsLeft + sumRenderDiff

					const positionX = Math.round(Math.max(cellLogicWidth, currentRenderX))
					markLine(
						{
							x: positionX,
							y: offsetStart / 2,
						},
						{
							x: positionX,
							y: cellLogicHeight,
						}
					)
				} else {
					const positionX = Math.round(lineIndex === 0 ? offsetStart : cellLogicWidth)
					markLine(
						{
							x: positionX,
							y: offsetStart / 2,
						},
						{
							x: positionX,
							y: maxRenderHeight - offsetStart - ofsTop + sumTopExtra,
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

			for (let i = 0, lineIndex = 0; i < maxRenderHeight; i += cellLogicHeight - drawLineWidth, lineIndex++) {
				//绘制线条的索引
				if (lineIndex >= 2) {
					const currentCellIndex = endLineOfCellIndex //当前绘制单元格的索引
					const currentConfig = rowHeight.find((item) => item.index === currentCellIndex)
					if (currentConfig !== void 0) {
						renderDiff = currentConfig.value * dpr
						sumRenderDiff += renderDiff
					}
					currentRenderY = lineIndex * (cellLogicHeight - drawLineWidth) + offsetStart - ofsTop + sumRenderDiff
					endLineOfCellIndex++
				}

				if (currentRenderY < cellLogicHeight) continue

				markLine(
					{
						x: cellLogicWidth + offsetStart,
						y: Math.round(currentRenderY),
					},
					{
						x: maxRenderWidth - offsetStart - ofsLeft + sumLeftExtra,
						y: Math.round(currentRenderY),
					}
				)
			}
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
						renderDiff = currentConfig.value * dpr
						sumRenderDiff += renderDiff
					}
					currentRenderX = lineIndex * (cellLogicWidth - drawLineWidth) + offsetStart - ofsLeft + sumRenderDiff
					endLineOfCellIndex++
				}

				if (currentRenderX < cellLogicWidth) continue

				markLine(
					{
						x: Math.round(currentRenderX),
						y: offsetStart / 2 + cellLogicHeight,
					},
					{
						x: Math.round(currentRenderX),
						y: maxRenderHeight - offsetStart - ofsTop + sumTopExtra,
					}
				)
			}
		}
		/**
		 * 渲染表格中的文字
		 */
		const drawHeaderText = () => {
			const { fillText } = drawText()
			const drawFontsize = getStaticConfig.headerFontSize()
			const { ofsLeft, ofsTop } = getOfs()
			const rowLabels = getRowLabel(rowNum)
			const columnLabels = getColumnLabel(columnNum)

			clipRect(startRenderPositionOffset, cellLogicHeight + startRenderPositionOffset, width, height)
			for (let row = 0; row < rowNum; row++) {
				const currentOffsetPreRow = topOffsetArr[row]
				const currentRowOffsetPreRow = topOffsetArr[row + 1] - topOffsetArr[row] //相对于上一行的额外偏移

				const positionX = cellLogicWidth / 2 - startRenderPositionOffset //最终实际渲染位置
				const positionY = (cellLogicHeight + currentRowOffsetPreRow) / 2 + (row + startBodyOffset.headerLength) * (cellLogicHeight - drawLineWidth) + currentOffsetPreRow - ofsTop

				fillText(rowLabels[row], positionX, positionY, drawFontsize, "center", "middle")
			}
			restoreClip()

			clipRect(cellLogicWidth + startRenderPositionOffset, startRenderPositionOffset, width, cellLogicHeight + startRenderPositionOffset)
			for (let column = 0; column < columnNum; column++) {
				const currentOffsetPreColumn = leftOffsetArr[column]
				const currentRowOffsetPreColumn = leftOffsetArr[column + 1] - leftOffsetArr[column]

				const positionX = (cellLogicWidth + currentRowOffsetPreColumn) / 2 + (column + startBodyOffset.headerLength) * (cellLogicWidth - drawLineWidth) + currentOffsetPreColumn - ofsLeft
				const positionY = cellLogicHeight / 2 - startRenderPositionOffset
				fillText(columnLabels[column], positionX, positionY, drawFontsize, "center", "middle")
			}
			restoreClip()
		}

		// 渲染body部分的字体
		const drawBodyText = (cellData?: CellData) => {
			const { fillText } = drawText()
			const { ofsLeft, ofsTop } = getOfs()
			const drawFontsize = getFontSize()

			// 每个单元格左边所需偏移量
			let currentSumRenderLeft = 0
			let currentSumRenderTop = 0
			const leftOffsetArr: number[] = new Array(columnNum).fill(0).map((item, index) => {
				currentSumRenderLeft += (columnWidth.find((item) => item.index === index - 1)?.value || 0) * dpr
				return currentSumRenderLeft
			})

			const topOffsetArr: number[] = new Array(rowNum).fill(0).map((item, index) => {
				currentSumRenderTop += (rowHeight.find((item) => item.index === index - 1)?.value || 0) * dpr
				return currentSumRenderTop
			})

			clipRect(cellLogicWidth + offsetStart, cellLogicHeight + offsetStart, width, 10000)

			for (let row = 0; row < rowNum; row++) {
				//diff值是每一个单元格相对于上一个单元格起始渲染位置的偏移量
				const diffY = cellLogicHeight - drawLineWidth
				const diffYMultiple = row + startBodyOffset.headerLength //当前渲染的行数
				//当前行在纵向距离上额外需要增加的偏移
				const currentExtraY = (topOffsetArr[row + 1] === void 0 ? topOffsetArr[row] : topOffsetArr[row + 1]) - topOffsetArr[row]

				const currentPositionY = drawLineWidth + diffYMultiple * diffY + topOffsetArr[row] - ofsTop
				// 最终计算单元格高度
				const currentCellHeight = cellLogicHeight - startRenderPositionOffset + currentExtraY

				for (let column = 0; column < columnNum; column++) {
					const diffX = cellLogicWidth - drawLineWidth
					const diffXMultiple = column + startBodyOffset.headerLength
					//当前列在横向距离上额外需要增加的偏移
					const currentExtraX = leftOffsetArr[column + 1] - leftOffsetArr[column]

					//当前单元格渲染的起始x值
					const currentPositionX = diffXMultiple * diffX + leftOffsetArr[column] - ofsLeft
					// 最终计算单元格宽度
					const currentCellWidth = cellLogicWidth - startRenderPositionOffset + currentExtraX

					clipRect(currentPositionX, currentPositionY, currentCellWidth, currentCellHeight)
					const currentValue = `${(cellData && cellData[row][column]) || ""}`
					fillText(currentValue, currentPositionX + offsetStart, currentPositionY + offsetStart, drawFontsize, "left", "top", currentCellWidth)
					restoreClip()
				}
			}
			restoreClip()
		}

		/**
		 * 渲染头部的背景颜色
		 */
		const fillHeaderBackground = (color: string) => {
			const { ofsLeft, ofsTop } = getOfs()
			const endX = cellLogicWidth + columnNum * (cellLogicWidth - drawLineWidth) - ofsLeft + sumLeftExtra
			const endY = cellLogicHeight + rowNum * (cellLogicHeight - drawLineWidth) - ofsTop + sumTopExtra
			fillRect(offsetStart, offsetStart, endX, cellLogicHeight, color)
			fillRect(offsetStart, offsetStart, cellLogicWidth, endY, color)
		}

		const drawAll = (drawConfig: CanvasDrawConfig, offsetLeft?: number, offsetTop?: number) => {
			const { fontSize } = drawConfig
			offsetLeft && (drawTableState.offsetLeft = offsetLeft)
			offsetTop && (drawTableState.offsetTop = offsetTop)
			drawTableState.fontSize = fontSize

			fillHeaderBackground("#f9fafb")

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
