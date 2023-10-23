import styled, { css } from "styled-components"

interface HighlightBorderItemProps {
	$rowIndex?: number
	$columnIndex?: number
	$offsetLeft: number
	$offsetTop: number
	$width: number
	$height: number
	$borderWidth: number
	$isRender: boolean
	$cellLogicWidth: number
	$cellLogicHeight: number
}

export const HighlightBorderContainer = styled.div<{
	$offsetLeft: number
	$offsetTop: number
}>(({ $offsetLeft, $offsetTop }) => {
	return css`
		position: absolute;
		width: calc(100% - 18px - ${$offsetLeft}px);
		height: calc(100% - ${$offsetTop}px);
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
		overflow: hidden;
	`
})

export const HighlightBorderItem = styled.div<HighlightBorderItemProps>(({ $rowIndex, $columnIndex, $offsetLeft, $offsetTop, $height, $width, $borderWidth, $isRender }) => {
	if (!$isRender) return null

	return css`
		position: absolute;
		width: ${$width}px;
		height: ${$height}px;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
		overflow: hidden;

		&:after {
			box-sizing: border-box;
			position: absolute;
			content: "";
			border: ${$borderWidth}px solid blue;
			height: 100%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.1);
			opacity: 0.4;
		}
	`
})
