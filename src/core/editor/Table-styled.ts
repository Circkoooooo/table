import styled, { css } from "styled-components"

export interface CellStyledProps {
	top?: boolean
	right?: boolean
	bottom?: boolean
	left?: boolean
	dark?: boolean
	lineRight?: boolean
	lineBottom?: boolean
}

export interface HintBorderProps {
	rowIndex: number
	columnIndex: number
	isNeedShow: boolean
}

//layout z-index level :  TableFrame:3 -> TableColumnHeader,TableRowAndDataFrame,TableRowHeader:2 -> TableDataRow:1 -> Cell:0

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ top, right, bottom, left, dark }) => {
	const DEFAULT_BORDER_WIDTH = 1
	const CLEAR_BORDER_WIDTH = 0
	const borderWidth = [
		`${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
	]

	const HEIGHT = `${top && bottom ? "31px" : "30px"}`
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
	white-space: nowrap;
	display: flex;
	flex-direction: column;
	overflow: auto;
`

export const TableColumnHeader = styled.div`
	position: sticky;
	top: 0;
	z-index: 2;
`

export const TableRowAndDataFrame = styled.div`
	display: flex;
	flex: 1;
	z-index: 2;
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

export const HintBorderStyled = styled.div<HintBorderProps>(({ rowIndex, columnIndex, isNeedShow }) => {
	return css`
		position: absolute;
		border: 2px solid blue;
		left: ${columnIndex * 100}px;
		top: ${rowIndex * 30}px;
		transition-property: left, top, width, height;
		transition: ease-in-out 0.15s;
		zindex: 1;
		width: 101px;
		height: 31px;
		pointerevents: none;
		display: ${isNeedShow ? "block" : "none"};
	`
})
