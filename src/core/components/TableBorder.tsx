import React from "react"
import styled, { css } from "styled-components"

interface BorderWrapperProps {
	width: number
	height: number
	$offsetLeft: number
	$offsetTop: number
}

export const BorderWrapper = styled.div<BorderWrapperProps>(({ width, height, $offsetLeft, $offsetTop }) => {
	return css`
		border: 2px solid red;
		position: absolute;
		width: ${width}px;
		height: ${height}px;
		z-index: 3;
		pointer-events: none;
		transform: translate(${$offsetLeft}px, ${$offsetTop}px);
	`
})

type BaseBorderProps = {
	isRender: true
	borderWidth: number
	borderHeight: number
	offsetLeft: number
	offsetTop: number
}

export type BorderProps =
	| ({
			isRender: false
	  } & Omit<Partial<BaseBorderProps>, "isRender">)
	| BaseBorderProps

const TableBorder: React.FC<BorderProps> = ({ isRender, borderWidth, borderHeight, offsetLeft, offsetTop }) => {
	if (!isRender) return null

	return <BorderWrapper data-testid="cell-highlight" height={borderHeight} width={borderWidth} $offsetLeft={offsetLeft} $offsetTop={offsetTop} />
}

export default TableBorder
