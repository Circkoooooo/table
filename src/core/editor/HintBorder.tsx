import React, { useEffect, useImperativeHandle, useState } from "react"
import { HintBorderStyled } from "./Table-styled"

interface HintBorderProps {
	maxRowIndex: number
	maxColumnIndex: number
}

export interface HintBorderRef {
	changeIndex: (rowIndex: number, columnIndex: number) => void
	changePointerIndex: (pointerRowIndex: number, pointerColumnIndex: number) => void
}

const HintBorder = React.forwardRef<HintBorderRef, HintBorderProps>(({ maxRowIndex, maxColumnIndex }, ref) => {
	const [index, setIndex] = useState({
		rowIndex: -1,
		columnIndex: -1,
		pointerRowIndex: -1,
		pointerColumnIndex: -1,
	})

	const [isNeedShow, setIsNeedShow] = useState<boolean>(false)

	const changeIndex = (rowIndex: number, columnIndex: number) => {
		setIndex({
			...index,
			rowIndex,
			columnIndex,
			pointerRowIndex: rowIndex,
			pointerColumnIndex: columnIndex,
		})
	}
	const changePointerIndex = (pointerRowIndex: number, pointerColumnIndex: number) => {
		setIndex({
			...index,
			pointerRowIndex,
			pointerColumnIndex,
		})
	}

	useImperativeHandle(ref, () => {
		return {
			changeIndex,
			changePointerIndex,
		}
	})

	useEffect(() => {
		if (index.rowIndex < maxRowIndex && index.columnIndex < maxColumnIndex && index.rowIndex >= 0 && index.columnIndex >= 0) {
			setIsNeedShow(true)
		} else {
			setIsNeedShow(false)
		}
	}, [index, maxRowIndex, maxColumnIndex])

	return (
		<HintBorderStyled
			{...{
				isNeedShow,
				rowIndex: index.rowIndex,
				columnIndex: index.columnIndex,
				pointerRowIndex: index.pointerRowIndex,
				pointerColumnIndex: index.pointerColumnIndex,
			}}
		/>
	)
})

export default HintBorder
