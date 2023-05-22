import styled, { css } from "styled-components"

export interface CellStyledProps {
	top?: boolean
	right?: boolean
	bottom?: boolean
	left?: boolean
	dark?: boolean
	isFocus?: boolean
}

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ top, right, bottom, left, dark, isFocus }) => {
	const DEFAULT_BORDER_WIDTH = 1
	const CLEAR_BORDER_WIDTH = 0
	const borderWidth = [
		`${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
	]

	return css`
		z-index: 0;
		position: relative;
		width: 100px;
		height: 30px;
		line-height: 30px;
		display: inline-block;
		border-width: ${borderWidth.join(" ")};
		border-color: rgba(0, 0, 0, 0.15);
		background-color: ${dark ? "#f0f0f0" : "#fff"};
		border-style: solid;
		text-align: center;
		vertical-align: top;
		user-select: none;

		&:focus {
			outline: none;
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
`
export const TableRowAndDataRowFlex = styled.div`
	display: flex;
`

export const TableRowHeader = styled.div`
	display: inline-flex;
	flex-direction: column;
	position: sticky;
	left: 0;

	z-index: 1;
`

export const TableDataFrame = styled.div`
	display: inline-block;
`

export const TableDataRow = styled.div`
	display: flex;
`
