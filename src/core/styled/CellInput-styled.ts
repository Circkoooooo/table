import { css, styled } from "styled-components"

interface CellInputContainerProps {
	$width: number
	$height: number
	$offsetLeft: number
	$offsetTop: number
}
export const CellInputItem = styled.div<CellInputContainerProps>(({ $width, $height, $offsetLeft, $offsetTop }) => {
	return css`
		position: absolute;
		width: ${$width}px;
		height: ${$height}px;
		background-color: red;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
	`
})
