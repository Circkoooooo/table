import React from "react"
import { HighlightLineFlexibleContainer, HighlightLineFlexibleItem } from "../../styled/highlight/HighlightLineFlexible-styled"
import { IndexType } from "../../types/table"

interface LineFlexibleHighLightProps {
	index: IndexType | null
	cellLogicWidth: number
	cellLogicHeight: number
	ofsLeft: number
	ofsTop: number
	borderWidth: number
}

const LineFlexibleHighlight: React.FC<LineFlexibleHighLightProps> = ({ index, cellLogicHeight, cellLogicWidth, ofsLeft, ofsTop, borderWidth }) => {
	return (
		<>
			{index && (
				<HighlightLineFlexibleContainer
					{...{
						$rowIndex: index.rowIndex,
						$columnIndex: index.columnIndex,
						$cellLogicHeight: cellLogicHeight,
						$cellLogicWidth: cellLogicWidth,
						$borderWidth: borderWidth,
						$ofsLeft: ofsLeft,
						$ofsTop: ofsTop,
					}}
				>
					<HighlightLineFlexibleItem />
				</HighlightLineFlexibleContainer>
			)}
		</>
	)
}

export { LineFlexibleHighlight }
