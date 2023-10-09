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
		min-width: ${$width}px;
		min-height: ${$height}px;
		max-width: 400px;
		max-height: 300px;
		text-align: left;
		outline: none;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
		padding: 6px;
		font-size: 16px;

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
