import React, { useMemo } from "react"
import { parseInteractionIndex } from "../../parseInteractionIndex"
import { useAppSelector } from "../../redux/hooks"
import { HighlightBorderContainer, HighlightBorderItem } from "../../styled/HighlightBorder-styled"

interface HighlightBorderProps {
	cellLogicWidth: number
	cellLogicHeight: number
	children?: React.ReactNode
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

const HighlightBorder: React.FC<HighlightBorderProps> = ({ cellLogicWidth, cellLogicHeight, children }) => {
	const canvasStore = useAppSelector((state) => state.canvas)
	const interactionStore = useAppSelector((state) => state.interaction)
	const tableDataStore = useAppSelector((state) => state.tableData)

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

		const interactionIndex = parseInteractionIndex(mousedownIndex, mousemoveIndex, tableDataStore.cellDataInfo.rowNum, tableDataStore.cellDataInfo.columnNum)

		if (interactionIndex) {
			const { startRowIndex, startColumnIndex, rowCellCount, columnCellCount } = interactionIndex

			if (interactionStore.isEdit) {
				property.isRender = false
			} else {
				property.isRender = true
			}

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
	}, [canvasStore, cellLogicHeight, cellLogicWidth, interactionStore, tableDataStore])

	return (
		<HighlightBorderContainer $offsetLeft={cellLogicWidth} $offsetTop={cellLogicHeight}>
			{children}
			<HighlightBorderItem
				$isRender={borderProperty.isRender}
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
