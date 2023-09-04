import styled, { css } from "styled-components"
import { BorderProperty } from "../calcBorderProperty"

export interface CellStyledProps {
	$borderProperty: BorderProperty
}

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ $borderProperty }) => {
	const { top, right, bottom, left } = $borderProperty

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
	const BACKGROUND_COLOR = "#ffffff"

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
