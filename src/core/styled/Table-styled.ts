import styled, { css } from "styled-components"
import { TABLE_CONFIG } from "../configs/table_config"

export interface CellStyledProps {
	$borderWidthCSS: string
	$isIndexTableBody: boolean
	$isEditable: boolean
	width: number
}

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ $isEditable, $isIndexTableBody, $borderWidthCSS, width }) => {
	const BORDER_COLOR = `rgba(0, 0, 0, 0.15)`
	const BACKGROUND_COLOR = "#ffffff"

	return css`
		z-index: 0;
		position: relative;
		width: ${`${width}px` || `${TABLE_CONFIG.DEFAULT_CELL_WIDTH}px`};
		height: 100%;
		display: inline-block;
		z-index: ${$isEditable ? 1 : 0};

		background-color: ${BACKGROUND_COLOR};
		text-align: ${$isIndexTableBody ? "left" : "center"};
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
			border-width: ${$borderWidthCSS};
			border-color: ${BORDER_COLOR};
			border-style: solid;
			position: absolute;
		}
	`
})

interface CellRowProps {
	$rowHeight: string
}

export const CellRow = styled.div<CellRowProps>(({ $rowHeight }) => {
	return css`
		height: ${$rowHeight};
	`
})

interface CellContentWrapperProps {
	$isTableBody?: boolean
	$isEditable?: boolean
}

export const CellContentWrapper = styled.div<CellContentWrapperProps>`
	padding: 5px;
	outline: none;
	position: absolute;
	top: 0;
	left: 0;
	min-width: 100%;
	max-width: 400px;
	white-space: break-spaces;
	background: ${(props) => (props.$isEditable ? "#fff" : "none")};
	min-height: 100%;
	text-align: ${(props) => (!props.$isTableBody ? "center" : "left")};
	display: block;

	&::after {
		content: " ";
		position: absolute;
		box-sizing: border-box;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		// background-color: red;
		z-index: 1000;
		pointer-events: none;
		border: ${(props) => (props.$isEditable ? "2px solid blue" : "none")};
	}
`

// data最外层容器
export const TableFrame = styled.div`
	position: relative;
	white-space: nowrap;
	flex-direction: column;
	height: 100%;
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
