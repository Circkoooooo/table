import React, { useEffect, useRef } from "react"
import { CellInputItem } from "../../styled/CellInput-styled"
import { useAppDispatch } from "../../redux/hooks"
import { inputDispatch } from "../../redux/table-data/tableDataSlice"

interface CellInputProps {
	cellLogicWidth: number
	cellLogicHeight: number
	isRender: boolean
	offsetRowIndex: number
	offsetColumnIndex: number
	offsetLeft: number
	offsetTop: number
	initialValue: string
}

export const CellInput: React.FC<CellInputProps> = ({ cellLogicHeight, cellLogicWidth, isRender, offsetRowIndex, offsetColumnIndex, initialValue, offsetLeft = 0, offsetTop = 0 }) => {
	const inputItemRef = useRef<HTMLDivElement | null>(null)

	const inputRecordRef = useRef({
		value: initialValue,
	})
	const dispatch = useAppDispatch()

	useEffect(() => {
		inputItemRef.current?.focus()
	})

	// 提交修改
	const commitInput = (newValue: string) => {
		dispatch(
			inputDispatch({
				cellIndex: {
					rowIndex: offsetRowIndex,
					columnIndex: offsetColumnIndex,
				},
				newValue: newValue.trim(),
			})
		)
	}

	// 控制输入，记录实时内容
	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		inputRecordRef.current.value = inputItemRef.current?.innerText ?? ""
	}

	const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		commitInput(`${e.target.innerText}`)
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
			$width={cellLogicWidth}
			$height={cellLogicHeight}
			contentEditable
			$offsetLeft={offsetColumnIndex * (cellLogicWidth - 1) - offsetLeft}
			$offsetTop={offsetRowIndex * (cellLogicHeight - 1) - offsetTop}
			onFocus={() => handleFocus()}
			onInput={(e) => handleInput(e)}
			onBlur={(e) => handleBlur(e)}
		/>
	)
}
