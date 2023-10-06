import styled, { css } from "styled-components"

interface HighlightBorderItemProps {
	$rowIndex?: number
	$columnIndex?: number
	$offsetLeft: number
	$offsetTop: number
	$width: number
	$height: number
	$borderWidth: number
}

export const HighlightBorderContainer = styled.div<{
	$offsetLeft: number
	$offsetTop: number
	$isRender: boolean
}>(({ $offsetLeft, $offsetTop, $isRender }) => {
	return css`
		display: ${$isRender ? "" : "none"};
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
	`
})

export const HighlightBorderItem = styled.div<HighlightBorderItemProps>(({ $rowIndex, $columnIndex, $offsetLeft, $offsetTop, $height, $width, $borderWidth }) => {
	if (!$rowIndex || !$columnIndex) return null

	return css`
		position: absolute;
		width: ${$width}px;
		height: ${$height}px;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);

		&:after {
			box-sizing: border-box;
			position: absolute;
			content: "";
			border: ${$borderWidth}px solid red;
			height: 100%;
			width: 100%;
		}
	`
})
