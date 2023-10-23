import React, { useEffect, useRef } from "react"
import { CellInputItem } from "../../styled/CellInput-styled"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { cancelEditDispatch } from "../../redux/interaction/interactionSlice"
import { HighlightBorderProperty } from "../HighlightBorder/HighlightBorder"
import { IndexType } from "../../types/table"
import { inputDispatch } from "../../redux/table-data/tableDataSlice"
import { CellDataElement } from "../../cellDataHandler"

interface CellInputProps {
	isRender: boolean
	fontSize: number
	highlightBorderProperty: HighlightBorderProperty
	initialValue: CellDataElement
	editIndex: IndexType | null
}

export const CellInput: React.FC<CellInputProps> = ({ highlightBorderProperty: { offsetLeft, offsetTop, width, height }, editIndex, isRender, initialValue }) => {
	const inputItemRef = useRef<HTMLDivElement | null>(null)

	const inputRecordRef = useRef({
		value: initialValue,
	})

	const canvasStore = useAppSelector((state) => state.canvas)
	const dispatch = useAppDispatch()

	useEffect(() => {
		inputItemRef.current?.focus()
	})

	// 提交修改
	const commitInput = (newValue: string) => {
		if (!editIndex) return
		const { rowIndex, columnIndex } = editIndex
		dispatch(
			inputDispatch({
				cellIndex: {
					rowIndex: rowIndex - 1,
					columnIndex: columnIndex - 1,
				},
				newValue: newValue.trim(),
			})
		)
	}

	// 控制输入，记录实时内容
	const handleInput = () => {
		inputRecordRef.current.value = inputItemRef.current?.innerText ?? ""
	}

	const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		commitInput(`${e.target.innerText}`)
		dispatch(cancelEditDispatch())
	}

	const handleFocus = () => {
		const input = inputItemRef.current
		if (!input) return

		input.innerText = initialValue === null ? "" : initialValue
		const range = window.getSelection()
		range?.selectAllChildren(input)
		range?.collapseToEnd()
	}

	if (!isRender) {
		inputItemRef.current?.blur()
		return null
	}

	return (
		<CellInputItem
			tabIndex={-1}
			ref={inputItemRef}
			$width={width}
			$height={height}
			contentEditable
			$offsetLeft={offsetLeft}
			$offsetTop={offsetTop}
			$fontSize={canvasStore.drawConfig.fontSize}
			onFocus={() => handleFocus()}
			onInput={() => handleInput()}
			onBlur={(e) => handleBlur(e)}
		/>
	)
}
