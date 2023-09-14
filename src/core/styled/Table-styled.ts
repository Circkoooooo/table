import styled, { css } from "styled-components"
import { BorderProperty } from "../calcBorderProperty"
import { TABLE_CONFIG } from "../configs/table_config"
import { SizeProperty } from "../types/table.type"
export interface CellStyledProps {
	$borderProperty: BorderProperty
	$isIndexTableBody: boolean
	$isEditable: boolean
	$columnSizeProperty: SizeProperty.ColumnSizeProperty | null
}

// 单元格
export const CellStyled = styled.div<CellStyledProps>(({ $borderProperty, $isIndexTableBody, $isEditable, $columnSizeProperty }) => {
	const { top, right, bottom, left } = $borderProperty

	const DEFAULT_BORDER_WIDTH = 1
	const CLEAR_BORDER_WIDTH = 0
	const borderWidth = [
		`${top ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${right ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${bottom ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
		`${left ? DEFAULT_BORDER_WIDTH : CLEAR_BORDER_WIDTH}px`,
	]

	const BORDER_COLOR = `rgba(0, 0, 0, 0.15)`
	const BORDER_WIDTH = `${borderWidth.join(" ")}`
	const BACKGROUND_COLOR = "#ffffff"

	return css`
		z-index: 0;
		position: relative;
		width: ${$columnSizeProperty ? `${$columnSizeProperty.width}px` : `${TABLE_CONFIG.DEFAULT_CELL_WIDTH}px`};
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
			border-width: ${BORDER_WIDTH};
			border-color: ${BORDER_COLOR};
			border-style: solid;
			position: absolute;
		}
	`
})

interface CellRowProps {
	$rowSizeProperty: SizeProperty.RowSizeProperty | null
	$rowIndex: number
}

export const CellRow = styled.div<CellRowProps>(({ $rowSizeProperty, $rowIndex }) => {
	// row which in header.
	if ($rowIndex === 0) {
		return css`
			height: ${TABLE_CONFIG.DEFAULT_CELL_HEIGHT}px;
		`
	}

	return css`
		height: ${$rowSizeProperty ? `${$rowSizeProperty.height}px` : `${TABLE_CONFIG.DEFAULT_CELL_HEIGHT}px`};
	`
})

interface CellContentWrapperProps {
	$isTableBody?: boolean
	$isEditable?: boolean
}

export const CellContentWrapper = styled.div<CellContentWrapperProps>(({ $isTableBody, $isEditable }) => {
	const afterCSS = css`
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
		border: ${$isEditable ? "2px solid blue" : "none"};
	`

	if ($isEditable) {
		afterCSS.push({
			border: "2px solid blue",
		})
	}

	return css`
		padding: 5px;
		outline: none;
		position: absolute;
		top: 0;
		left: 0;
		min-width: 100%;
		max-width: 400px;
		white-space: break-spaces;
		background: ${$isEditable ? "#fff" : "none"};
		min-height: 100%;
		text-align: ${!$isTableBody ? "center" : "left"};
		display: block;

		&::after {
			${afterCSS}
		}
	`
})
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
