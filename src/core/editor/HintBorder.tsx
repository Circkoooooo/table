import React, { useEffect, useImperativeHandle, useState } from "react"
import { HintBorderStyled } from "./Table-styled"

interface HintBorderProps {
	maxRowIndex: number
	maxColumnIndex: number
}

export interface HintBorderRef {
	changeIndex: (rowIndex: number, columnIndex: number) => void
}

const HintBorder = React.forwardRef<HintBorderRef, HintBorderProps>(({ maxRowIndex, maxColumnIndex }, ref) => {
	const [index, setIndex] = useState({
		rowIndex: -1,
		columnIndex: -1,
	})
	const [isNeedShow, setIsNeedShow] = useState<boolean>(false)

	const changeIndex = (rowIndex: number, columnIndex: number) => {
		setIndex({
			rowIndex,
			columnIndex,
		})
	}

	useImperativeHandle(ref, () => {
		return {
			changeIndex,
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
			}}
		/>
	)
})

export default HintBorder
