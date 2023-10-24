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
		width: ${width}px;
		height: ${height}px;
		transform: translate(${$rowIndex === 0 ? $ofsLeft : $borderWidth}px, ${$columnIndex === 0 ? $ofsTop : $borderWidth}px);
	`
})

interface LineFlexibleControlsProps {
	$currentIndexType: "row" | "column" | null
}
/**
 * 触发尺寸调整的交互控件
 */
export const LineFlexibleControls = styled.div<LineFlexibleControlsProps>(({ $currentIndexType }) => {
	const controlsBarWidth = 4

	return css`
		position: absolute;
		${$currentIndexType === "column"
			? `
				left: 0;
				bottom: 0;
			`
			: `
				right: 0;
				top: 0;
			`}

		box-sizing: border-box;

		width: ${$currentIndexType === "column" ? `calc(100% - 1px)` : `${controlsBarWidth}px`};
		height: ${$currentIndexType === "column" ? `${controlsBarWidth}px` : `calc(100% - 1px)`};

		background: linear-gradient(${($currentIndexType === "row" && 90) || 180}deg, #fff, #9999ff);

		opacity: 0.4;

		pointer-events: all;
		user-select: none;

		/* 配合上面pointer-event,面案在最顶层,但其他所有地方的交互时间都要隐藏,除了这个拖动条 */
		&:hover {
			cursor: ${$currentIndexType === "column" ? `row-resize` : `col-resize`};
		}
	`
})
interface LineFlexibleTipsBarProps {
	$ofsLeft: number
	$ofsTop: number
	$flexibleActiveIndexType: "row" | "column"
}

export const LineFlexibleTipsBar = styled.div<LineFlexibleTipsBarProps>(({ $ofsLeft, $ofsTop, $flexibleActiveIndexType }) => {
	return css`
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		pointer-events: none;
		left: 0;
		top: 0;

		${$flexibleActiveIndexType === "row" && `border-left: 2px dotted red;`}
		${$flexibleActiveIndexType === "column" && `border-top: 2px dotted red;`}

		transform: translate(${$ofsLeft}px, ${$ofsTop}px);

		& > span {
			position: absolute;
			top: 0;
			left: 0;
		}
	`
})
