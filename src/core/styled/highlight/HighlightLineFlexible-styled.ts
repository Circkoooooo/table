import { styled, css } from "styled-components"

interface HighlightLineFlexibleContainerProps {
	$rowIndex: number
	$columnIndex: number
	$cellLogicWidth: number
	$cellLogicHeight: number
	$ofsLeft: number
	$ofsTop: number
	$borderWidth: number
}

const HighlightLineFlexibleContainer = styled.div<HighlightLineFlexibleContainerProps>(({ $cellLogicHeight, $cellLogicWidth, $ofsLeft, $ofsTop, $borderWidth, $rowIndex, $columnIndex }) => {
	const baseTranslateX = -($cellLogicWidth - $borderWidth)
	const baseTranslateY = -$cellLogicHeight

	const multipleTranslateX = $cellLogicWidth - $borderWidth
	const multipleTranslateY = $cellLogicHeight

	const width = $cellLogicWidth
	const height = $cellLogicHeight

	return css`
		position: absolute;
		width: ${width}px;
		height: ${height}px;
		transform: translate(${baseTranslateX + $ofsLeft}px, ${baseTranslateY + $ofsTop}px);
	`
})

const HighlightLineFlexibleItem = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	box-sizing: border-box;
	width: calc(100% - 1px);
	height: 30%;
	border-width: 0 0 2px 0;
	background: linear-gradient(#fff, #9999ff);
`
export { HighlightLineFlexibleContainer, HighlightLineFlexibleItem }
