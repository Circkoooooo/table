import styled, { css } from "styled-components"

const DEFAULT_OFFSET = 0.5

interface HighlightBorderItemProps {
	$rowIndex?: number
	$columnIndex?: number
	$offsetLeft: number
	$offsetTop: number
}

export const HighlightBorderContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	transform: translate(${DEFAULT_OFFSET + 102}px, ${DEFAULT_OFFSET + 32}px);
	overflow: hidden;
`

export const HighlightBorderItem = styled.div<HighlightBorderItemProps>(({ $rowIndex, $columnIndex, $offsetLeft, $offsetTop }) => {
	if (!$rowIndex || !$columnIndex) return null

	return css`
		position: absolute;
		border: 1px solid red;
		width: 102px;
		height: 32px;
		left: ${101 * $rowIndex}px;
		top: ${$columnIndex * 31}px;
		transform: translate(${-$offsetLeft}px, ${-$offsetTop}px);
	`
})
