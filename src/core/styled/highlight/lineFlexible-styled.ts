import { styled, css } from "styled-components"

interface LineFlexibleContainerProps {
	$rowIndex: number
	$columnIndex: number
	$cellLogicWidth: number
	$cellLogicHeight: number
	$ofsLeft: number
	$ofsTop: number
	$borderWidth: number
}

export const LineFlexiblePanel = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	backgorund: red;
	z-index: 100;
	pointer-events: none;
`

export const LineFlexibleContainer = styled.div<LineFlexibleContainerProps>(({ $cellLogicHeight, $cellLogicWidth, $ofsLeft, $ofsTop, $borderWidth, $rowIndex, $columnIndex }) => {
	const width = $cellLogicWidth
	const height = $cellLogicHeight

	return css`
		position: absolute;
		width: ${width}px;
		height: ${height}px;
		transform: translate(${$columnIndex === 0 ? 0 : $ofsLeft}px, ${$rowIndex === 0 ? $ofsTop : 0}px);
	`
})

export const LineFlexibleItem = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	box-sizing: border-box;
	width: calc(100% - 1px);
	height: 18%;
	border-width: 0 0 2px 0;
	background: linear-gradient(#fff, #9999ff);

	pointer-events: all;
	user-select: none;
	/* 配合上面pointer-event,面案在最顶层,但其他所有地方的交互时间都要隐藏,除了这个拖动条 */
	&:hover {
		cursor: row-resize;
	}
`
