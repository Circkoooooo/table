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
	z-index: 1;
	pointer-events: none;
`

export const LineFlexibleContainer = styled.div<LineFlexibleContainerProps>(({ $cellLogicHeight, $cellLogicWidth, $ofsLeft, $ofsTop, $borderWidth, $rowIndex, $columnIndex }) => {
	const width = $cellLogicWidth
	const height = $cellLogicHeight

	return css`
		position: absolute;
		width: 100%;
		height: ${height}px;
		transform: translate(${$rowIndex === 0 ? $ofsLeft : 0}px, ${$columnIndex === 0 ? $ofsTop : 0}px);
	`
})

/**
 * 触发尺寸调整的交互控件
 */
export const LineFlexibleControls = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	box-sizing: border-box;
	width: calc(100% - 1px);
	height: 14%;
	border-width: 0 0 2px 0;
	background: linear-gradient(#fff, #9999ff);
	opacity: 0.4;

	pointer-events: all;
	user-select: none;
	/* 配合上面pointer-event,面案在最顶层,但其他所有地方的交互时间都要隐藏,除了这个拖动条 */
	&:hover {
		cursor: row-resize;
	}
`

interface LineFlexibleTipsBarProps {
	$isTipsBarShow: boolean
	$ofsLeft: number
	$ofsTop: number
}

export const LineFlexibleTipsBar = styled.div<LineFlexibleTipsBarProps>(({ $isTipsBarShow, $ofsLeft, $ofsTop }) => {
	return css`
		position: absolute;
		display: ${$isTipsBarShow ? "" : "none"};
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		pointer-events: none;
		left: 0;
		top: 0;
		border-top: 2px dotted red;
		transform: translate(${$ofsLeft}px, ${$ofsTop}px);
	`
})
