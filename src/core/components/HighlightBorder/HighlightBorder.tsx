import React, { useMemo } from "react"
import { parseInteractionIndex } from "../../parseInteractionIndex"
import { useAppSelector } from "../../redux/hooks"
import { HighlightBorderContainer, HighlightBorderItem } from "../../styled/HighlightBorder-styled"

interface HighlightBorderProps {
	cellLogicWidth: number
	cellLogicHeight: number
}

type BorderProperty = {
	isRender: boolean
	borderOffsetLeft: number
	borderOffsetTop: number
	borderWidth: number
	offsetLeftIndex: number
	offsetTopIndex: number
	width: number
	height: number
}

const HighlightBorder: React.FC<HighlightBorderProps> = ({ cellLogicWidth, cellLogicHeight }) => {
	const canvasStore = useAppSelector((state) => state.canvas)
	const interactionStore = useAppSelector((state) => state.interaction)

	const borderProperty = useMemo<BorderProperty>(() => {
		const lineWidth = 1
		const borderWidth = 2

		let property: BorderProperty = {
			isRender: false,
			borderOffsetLeft: 0,
			borderOffsetTop: 0,
			borderWidth: 0,
			offsetLeftIndex: 0,
			offsetTopIndex: 0,
			width: 0,
			height: 0,
		}

		const { mousedownIndex, mousemoveIndex } = interactionStore
		const { containerMaxWidth, containerMaxHeight } = canvasStore

		const interactionIndex = parseInteractionIndex(mousedownIndex, mousemoveIndex, containerMaxWidth, containerMaxHeight, cellLogicWidth, cellLogicHeight)

		if (interactionIndex) {
			const { startRowIndex, startColumnIndex, rowCellCount, columnCellCount } = interactionIndex

			property.isRender = true
			property.offsetLeftIndex = startRowIndex * (cellLogicWidth - lineWidth) - canvasStore.containerOffsetLeft
			property.offsetTopIndex = startColumnIndex * (cellLogicHeight - lineWidth) - canvasStore.containerOffsetTop
			property.width = rowCellCount * (cellLogicWidth - lineWidth)
			property.height = columnCellCount * (cellLogicHeight - lineWidth)
		}

		const newProperty = Object.assign(property, {
			borderOffsetLeft: cellLogicWidth,
			borderOffsetTop: cellLogicHeight,
			borderWidth: borderWidth,
		})

		return newProperty
	}, [canvasStore, cellLogicHeight, cellLogicWidth, interactionStore])

	return (
		<HighlightBorderContainer $isRender={borderProperty.isRender} $offsetLeft={cellLogicWidth} $offsetTop={cellLogicHeight}>
			<HighlightBorderItem
				$borderWidth={borderProperty.borderWidth}
				$rowIndex={1}
				$columnIndex={4}
				$width={borderProperty.width}
				$height={borderProperty.height}
				$offsetLeft={borderProperty.offsetLeftIndex}
				$offsetTop={borderProperty.offsetTopIndex}
			/>
		</HighlightBorderContainer>
	)
}

export { HighlightBorder }
