import React, { useMemo, useRef, useState } from "react"
import { parseInteractionIndex } from "../../parseInteractionIndex"
import { useAppSelector } from "../../redux/hooks"
import { CellInputItem } from "../../styled/CellInput-styled"

interface CellInputProps {
	cellLogicWidth: number
	cellLogicHeight: number
}

export const CellInput: React.FC<CellInputProps> = ({ cellLogicHeight, cellLogicWidth }) => {
	const interactionStore = useAppSelector((state) => state.interaction)
	const canvasState = useAppSelector((state) => state.canvas)

	const inputItemRef = useRef<HTMLDivElement | null>(null)

	const [cellInputState, setCellInputState] = useState({
		isRender: false,
		renderIndex: {
			startRowIndex: 0,
			startColumnIndex: 0,
		},
		offset: {
			offsetLeft: 0,
			offsetTop: 0,
		},
	})

	const isRender = useMemo(() => {
		return interactionStore.isEdit
	}, [interactionStore])

	const offsetIndex = useMemo(() => {
		const bodyStartIndex = 1
		return {
			rowIndex: (interactionStore.editIndex?.rowIndex ?? 0) - bodyStartIndex,
			columnIndex: (interactionStore.editIndex?.columnIndex ?? 0) - bodyStartIndex,
		}
	}, [interactionStore])

	if (!isRender) return null
	return (
		<CellInputItem
			ref={inputItemRef}
			$width={cellLogicWidth}
			$height={cellLogicHeight}
			contentEditable
			$offsetLeft={offsetIndex.rowIndex * (cellLogicWidth - 1)}
			$offsetTop={offsetIndex.columnIndex * (cellLogicHeight - 1)}
		/>
	)
}
