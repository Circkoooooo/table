import styled, { css } from "styled-components"
import { BorderProperty } from "../calcBorderProperty"

export interface CellStyledProps {
	borderProperty: BorderProperty
}

export interface HintBorderProps {
	rowIndex: number
	columnIndex: number
	pointerRowIndex: number
	pointerColumnIndex: number
	isNeedShow: boolean
}

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ borderProperty }) => {
	const { top, right, bottom, left } = borderProperty
	const dark = false
	const DEFAULT_BORDER_WIDTH = 1
	const CLEAR_BORDER_WIDTH = 0
	const borderWidth = [
		`${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
	]

	const HEIGHT = `${top && bottom ? "30px" : "30px"}`
	const BORDER_COLOR = `rgba(0, 0, 0, 0.15)`
	const BORDER_WIDTH = `${borderWidth.join(" ")}`
	const BACKGROUND_COLOR = `${dark ? "#f0f0f0" : "#fff"}`

	return css`
		z-index: 0;
		position: relative;
		width: 100px;
		height: ${HEIGHT};
		line-height: ${HEIGHT};
		display: inline-block;

		background-color: ${BACKGROUND_COLOR};
		text-align: center;
		vertical-align: top;
		user-select: none;

		box-sizing: content-box;
		&:focus {
			outline: none;
		}

		&::before {
			box-sizing: border-box;
			content: "";
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			border-width: ${BORDER_WIDTH};
			border-color: ${BORDER_COLOR};
			border-style: solid;
			position: absolute;
		}
	`
})

// data最外层容器
export const TableFrame = styled.div`
	position: relative;
	white-space: nowrap;
	display: flex;
	flex-direction: column;
	overflow: auto;
	width: 100%;
`

export const TableColumnHeader = styled.div`
	position: sticky;
	top: 0;
	z-index: 2;
`

export const TableRowAndDataFrame = styled.div`
	display: flex;
	flex: 1;
	z-index: 1;
`
export const TableRowAndDataRowFlex = styled.div`
	display: flex;
`

export const TableRowHeader = styled.div`
	display: inline-flex;
	flex-direction: column;
	position: sticky;
	left: 0;
	z-index: 2;
`

export const TableDataFrame = styled.div`
	display: inline-block;
	position: relative;
`

export const TableDataRow = styled.div`
	display: flex;
	z-index: 1;
`

export const HintBorderStyled = styled.div<HintBorderProps>(({ rowIndex, columnIndex, pointerRowIndex, pointerColumnIndex, isNeedShow }) => {
	const DEFAULT_WIDTH = 101
	const DEFAULT_HEIGHT = 31

	let offsetRowIndex = 0
	let offsetColumnIndex = 0
	let targetWidth = 0
	let targetHeight = 0

	if (pointerColumnIndex - columnIndex < 0) {
		offsetColumnIndex = pointerColumnIndex - columnIndex
	}
	targetWidth = pointerColumnIndex - columnIndex === 0 ? DEFAULT_WIDTH : (Math.abs(pointerColumnIndex - columnIndex) + 1) * (DEFAULT_WIDTH - 1) + 1

	if (pointerRowIndex - rowIndex < 0) {
		offsetRowIndex = pointerRowIndex - rowIndex
	}
	targetHeight = pointerRowIndex - rowIndex === 0 ? DEFAULT_HEIGHT : (Math.abs(pointerRowIndex - rowIndex) + 1) * (DEFAULT_HEIGHT - 1) + 1

	return css`
		position: absolute;
		border: 2px solid blue;
		left: ${(columnIndex + offsetColumnIndex) * 100}px;
		top: ${(rowIndex + offsetRowIndex) * 30}px;
		transition-property: left, top, width, height;
		transition-timing-function: ease-out;
		transition-duration: 0.05s;
		z-index: 1;
		width: ${targetWidth}px;
		height: ${targetHeight}px;
		pointer-events: none;
		display: ${isNeedShow ? "block" : "none"};
	`
})
