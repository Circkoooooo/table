import { useMemo } from "react"
import { useAppSelector } from "../../redux/hooks"
import { HighlightBorderContainer, HighlightBorderItem } from "../../styled/HighlightBorder-styled"

const HighlightBorder = () => {
	const stateCanvas = useAppSelector((state) => state.canvas)

	const borderProperty = useMemo(() => {
		const lineWidth = 1
		const borderWidth = 2

		let selectInfo = {
			selectStartLeftIndex: 1,
			selectStartTopIndex: 1,
			selectBottomCount: 1, //选中起始索引起，下方选中单元格的数量（包含本身）
			selectRightCount: 1,
		}

		const logicWidth = 100 + lineWidth * 2
		const logicHeight = 30 + lineWidth * 2

		return {
			borderOffsetLeft: logicWidth,
			borderOffsetTop: logicHeight,
			borderWidth: borderWidth,
			offsetLeft: selectInfo.selectStartLeftIndex * (logicWidth - lineWidth) - stateCanvas.containerOffsetLeft, //起始偏移量
			offsetTop: selectInfo.selectStartTopIndex * (logicHeight - lineWidth) - stateCanvas.containerOffsetTop,
			width: logicWidth + selectInfo.selectRightCount * (logicWidth - lineWidth),
			height: logicHeight + selectInfo.selectBottomCount * (logicHeight - lineWidth),
		}
	}, [stateCanvas])

	return (
		<HighlightBorderContainer $offsetLeft={borderProperty.borderOffsetLeft} $offsetTop={borderProperty.borderOffsetTop}>
			<HighlightBorderItem
				$borderWidth={borderProperty.borderWidth}
				$rowIndex={1}
				$columnIndex={4}
				$width={borderProperty.width}
				$height={borderProperty.height}
				$offsetLeft={borderProperty.offsetLeft}
				$offsetTop={borderProperty.offsetTop}
			/>
		</HighlightBorderContainer>
	)
}

export { HighlightBorder }
