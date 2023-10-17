import { css, styled } from "styled-components"

interface CellInputContainerProps {
	$width: number
	$height: number
	$offsetLeft: number
	$offsetTop: number
	$fontSize: number
}
export const CellInputItem = styled.div<CellInputContainerProps>(({ $width, $height, $offsetLeft, $offsetTop, $fontSize = 16 }) => {
	return css`
		position: absolute;
		min-width: ${$width}px;
		min-height: ${$height}px;
		max-width: 400px;
		text-align: left;
		outline: none;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
		padding: 6px;
		font-size: ${$fontSize}px;

		&:after {
			z-index: -1;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			content: "";
			box-sizing: border-box;
			border: 2px solid blue;
			background-color: #fff;
		}
	`
})
