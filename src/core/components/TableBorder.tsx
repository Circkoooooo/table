import React, { useMemo } from "react"
import styled, { css } from "styled-components"
import { useAppSelector } from "../redux/hooks"
import { calcSizeOfSizeProperty } from "../tools/calcSizeOfSizeProperty"
import { TABLE_CONFIG } from "../configs/table_config"
import { SizeProperty } from "../types/table.type"
import { WithRulerCellData } from "../cellDataHandler"
import { InteractionRecord } from "../redux/interaction/interactionSlice"

interface BorderWrapperProps {
	width: number
	height: number
	$offsetLeft: number
	$offsetTop: number
}

export const BorderWrapper = styled.div<BorderWrapperProps>(({ width, height, $offsetLeft, $offsetTop }) => {
	return css`
		border: 2px solid red;
		position: absolute;
		width: ${width}px;
		height: ${height}px;
		z-index: 3;
		pointer-events: none;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
	`
})

type BaseBorderProps = {
	isRender: true
	borderWidth: number
	borderHeight: number
	offsetLeft: number
	offsetTop: number
}

export type BorderProps =
	| ({
			isRender: false
	  } & Omit<Partial<BaseBorderProps>, "isRender">)
	| BaseBorderProps

const TableBorder: React.FC<{
	sizeProperty: SizeProperty.RowColumnSizeProperty
	withRulerCellData: WithRulerCellData
}> = ({ sizeProperty, withRulerCellData }) => {
	const { mousedownIndex, mousemoveIndex, editIndex } = useAppSelector((state) => state.interaction) as InteractionRecord

	// Recalculate border info when bound events on cell was trigger.
	const resolveBorderProperty = useMemo<BorderProps>((): BorderProps => {
		const noBorder = {
			isRender: false,
		} as { isRender: false }

		if (editIndex !== null || mousedownIndex === null || mousemoveIndex === null) return noBorder

		const { rowIndex: mousedownRowIndex, columnIndex: mousedownColumnIndex } = mousedownIndex
		const { rowIndex: mousemoveRowIndex, columnIndex: mousemoveColumnIndex } = mousemoveIndex

		const rowIndexOffset = Math.abs(mousemoveRowIndex - mousedownRowIndex) + 1
		const columnIndexOffset = Math.abs(mousemoveColumnIndex - mousedownColumnIndex) + 1
		const rowStartIndex = mousedownRowIndex < mousemoveRowIndex ? mousedownRowIndex : mousemoveRowIndex
		const columnStartIndex = mousedownColumnIndex < mousemoveColumnIndex ? mousedownColumnIndex : mousemoveColumnIndex

		//all cells propertyes
		const cellSizeProperty = calcSizeOfSizeProperty(sizeProperty, mousedownIndex, mousemoveIndex, withRulerCellData)

		const sizeRecord = {
			sumWidth: 0,
			sumHeight: 0,
			offsetLeft: 0,
			offsetTop: 0,
			isRowHeaderLogicStart: false, // the row-index after calcuating equals 0.
			isColumnHeaderLogicStart: false,
			isRowHeaderMousedownStart: false, // mouse down on cell header.
			isColumnHeaderMousedownStart: false,
		}

		sizeRecord.sumWidth = cellSizeProperty.sumWidthArr
			.filter((_, index) => {
				return index !== 0 && index >= columnStartIndex && index <= columnStartIndex + columnIndexOffset - 1
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.sumHeight = cellSizeProperty.sumHeightArr
			.filter((_, index) => {
				return index !== 0 && index >= rowStartIndex && index <= rowIndexOffset + rowStartIndex - 1
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr
			.filter((_, index) => {
				return index < columnStartIndex
			})
			.reduce((pre, val) => pre + val, 0)

		sizeRecord.offsetTop = cellSizeProperty.sumHeightArr
			.filter((_, index) => {
				return index < rowStartIndex
			})
			.reduce((pre, val) => pre + val, 0)

		if (sizeRecord.sumWidth !== 0 && rowStartIndex === 0) {
			sizeRecord.isRowHeaderLogicStart = true
		}
		if (sizeRecord.sumHeight !== 0 && columnStartIndex === 0) {
			sizeRecord.isColumnHeaderLogicStart = true
		}

		// mousedown on header
		if (mousedownRowIndex === 0) {
			sizeRecord.sumHeight = cellSizeProperty.sumHeightArr.filter((item, index) => index !== 0).reduce((pre, val) => pre + val)
			sizeRecord.offsetTop = cellSizeProperty.sumHeightArr[0]
			sizeRecord.isColumnHeaderMousedownStart = true
		}
		if (mousedownColumnIndex === 0) {
			sizeRecord.sumWidth = cellSizeProperty.sumWidthArr.filter((item, index) => index !== 0).reduce((pre, val) => pre + val)
			sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr[0]
			sizeRecord.isRowHeaderMousedownStart = true
		}

		// mousemove on header
		if (mousemoveRowIndex === 0) {
			sizeRecord.offsetTop = cellSizeProperty.sumHeightArr[0]
		}
		if (mousemoveColumnIndex === 0) {
			sizeRecord.offsetLeft = cellSizeProperty.sumWidthArr[0]
		}

		const { sumWidth, sumHeight, offsetLeft, offsetTop, isRowHeaderLogicStart, isColumnHeaderLogicStart } = sizeRecord
		const { DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT } = TABLE_CONFIG

		if (sizeRecord.sumWidth === 0 || sizeRecord.sumHeight === 0) return noBorder

		return {
			isRender: true,
			borderWidth: sumWidth,
			borderHeight: sumHeight,
			offsetLeft: isColumnHeaderLogicStart && offsetLeft === 0 ? DEFAULT_CELL_WIDTH : offsetLeft,
			offsetTop: isRowHeaderLogicStart && offsetTop === 0 ? DEFAULT_CELL_HEIGHT : offsetTop,
		}
	}, [sizeProperty, withRulerCellData, mousemoveIndex, mousedownIndex, editIndex])

	const { isRender, borderHeight, borderWidth, offsetLeft, offsetTop } = resolveBorderProperty
	if (!isRender) return null

	return <BorderWrapper data-testid="cell-highlight" height={borderHeight} width={borderWidth} $offsetLeft={offsetLeft} $offsetTop={offsetTop} />
}
export default TableBorder
