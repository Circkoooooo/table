import React, { memo, useEffect, useMemo, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { HighlightBorderContainer, HighlightBorderItem, HightlightBorderEditInputItem } from "../../styled/HighlightBorder-styled"
import isIndexEqual from "../../tools/isIndexEqual"
import { isTableHeader } from "../../tools/isIndexHeader"
interface HighlightBorderProps {
	cellLogicWidth: number
	cellLogicHeight: number
}

type BorderProperty = {
	isRender: boolean
	borderOffsetLeft: number
	borderOffsetTop: number
	borderWidth: number
	offsetLeftIndex: number
	offsetTopIndex: number
	width: number
	height: number
}

const HighlightBorder: React.FC<HighlightBorderProps> = ({ cellLogicWidth, cellLogicHeight }) => {
	const canvasStore = useAppSelector((state) => state.canvas)
	const interactionStore = useAppSelector((state) => state.interaction)

	/**
	 * 根据mousedown和mousemove的索引来解析需要渲染的边框属性
	 */
	const parsedInteractionIndex = useMemo(() => {
		const { mousedownIndex, mousemoveIndex } = interactionStore

		if (!mousedownIndex || !mousemoveIndex) return null

		//记录的初始的点击索引
		let startRowIndex = mousedownIndex.rowIndex
		let startColumnIndex = mousedownIndex.columnIndex
		let endRowIndex = mousedownIndex.rowIndex
		let endColumnIndex = mousedownIndex.columnIndex
		let rowCellCount = 1
		let columnCellCount = 1
		const bodyStartIndex = 1

		//判断是否是拖动状态
		const isMulti = !isIndexEqual(mousedownIndex, mousemoveIndex)

		const isHeader = isTableHeader(mousedownIndex.rowIndex, mousedownIndex.columnIndex)

		if (isHeader) {
			//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
			startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
			startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
			endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
			endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

			if (mousedownIndex.rowIndex === 0) {
				rowCellCount = Math.floor(canvasStore.containerMaxWidth / cellLogicWidth)
				columnCellCount += endColumnIndex - startColumnIndex
			}
			if (mousedownIndex.columnIndex === 0) {
				columnCellCount = Math.floor(canvasStore.containerMaxHeight / cellLogicHeight)
				rowCellCount += endRowIndex - startRowIndex
			}
		} else if (isMulti) {
			//判断拖动尾位置和首位置的索引哪个靠前，靠前的为起始索引
			startRowIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.rowIndex, mousemoveIndex.rowIndex))
			startColumnIndex = Math.max(bodyStartIndex, Math.min(mousedownIndex.columnIndex, mousemoveIndex.columnIndex))
			endRowIndex = Math.max(mousedownIndex.rowIndex, mousemoveIndex.rowIndex)
			endColumnIndex = Math.max(mousedownIndex.columnIndex, mousemoveIndex.columnIndex)

			rowCellCount += endRowIndex - startRowIndex
			columnCellCount += endColumnIndex - startColumnIndex
		}

		return {
			startRowIndex: startRowIndex - bodyStartIndex,
			startColumnIndex: startColumnIndex - bodyStartIndex,
			rowCellCount,
			columnCellCount,
		}
	}, [interactionStore, canvasStore, cellLogicHeight, cellLogicWidth])

	const borderProperty = useMemo<BorderProperty>(() => {
		const lineWidth = 1
		const borderWidth = 2

		let property: BorderProperty = {
			isRender: false,
			borderOffsetLeft: 0,
			borderOffsetTop: 0,
			borderWidth: 0,
			offsetLeftIndex: 0,
			offsetTopIndex: 0,
			width: 0,
			height: 0,
		}

		// 如果有鼠标交互信息，则记录isRender为true和起始索引和长度，否则isRender为false不渲染
		if (parsedInteractionIndex !== null) {
			property.isRender = true
			const { startRowIndex, startColumnIndex, rowCellCount, columnCellCount } = parsedInteractionIndex

			property.offsetLeftIndex = startRowIndex * (cellLogicWidth - lineWidth) - canvasStore.containerOffsetLeft
			property.offsetTopIndex = startColumnIndex * (cellLogicHeight - lineWidth) - canvasStore.containerOffsetTop
			property.width = rowCellCount * (cellLogicWidth - lineWidth)
			property.height = columnCellCount * (cellLogicHeight - lineWidth)
		}

		const newProperty = Object.assign(property, {
			borderOffsetLeft: cellLogicWidth,
			borderOffsetTop: cellLogicHeight,
			borderWidth: borderWidth,
		})

		return newProperty
	}, [canvasStore, cellLogicHeight, cellLogicWidth, parsedInteractionIndex])

	return (
		<HighlightBorderContainer $isRender={borderProperty.isRender} $offsetLeft={cellLogicWidth} $offsetTop={cellLogicHeight}>
			<HighlightBorderItem
				$borderWidth={borderProperty.borderWidth}
				$rowIndex={1}
				$columnIndex={4}
				$width={borderProperty.width}
				$height={borderProperty.height}
				$offsetLeft={borderProperty.offsetLeftIndex}
				$offsetTop={borderProperty.offsetTopIndex}
			/>
		</HighlightBorderContainer>
	)
}

export { HighlightBorder }
