import React from "react"
import { arrToObject } from "../../tools/arrToObject"
import Cell from "./Cell"
import { TableDataRow } from "./Table-styled"
import { AbstractTableElementType, TableAddition } from "./types"

interface RenderTableDataProps {
	targetTables?: AbstractTableElementType[][]
	tableAddition: TableAddition
	handleCellEvent: () => {
		handleCellMouseDown: ({ event, row, column, isContinue }: { event: React.MouseEvent<HTMLDivElement>; row: number; column: number; isContinue?: boolean | undefined }) => void
		handleCellBlur: (event: React.FocusEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => void
		handleCellInput: (target: HTMLElement) => void
		handleCellMouseEnter: (row: number, column: number) => void
	}
}

const RenderTableData: React.FC<RenderTableDataProps> = ({ targetTables, tableAddition, handleCellEvent }) => {
	if (!targetTables) return null
	const { handleCellMouseDown, handleCellMouseEnter, handleCellInput, handleCellBlur } = handleCellEvent()

	return (
		<>
			{/* {targetTables && */}
			{targetTables.map((item, row) => {
				return (
					<TableDataRow key={tableAddition.rowLabels[row]}>
						{item.map((value, column) => {
							const key = `${tableAddition.columnLabels[column]}${tableAddition.rowLabels[row]}`
							const props = []

							//bind events to Cell
							const eventProps = {
								onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
									const { button, buttons, shiftKey } = event.nativeEvent
									let isShift = false

									//return if not is left mouse.
									if (button !== 0 && buttons !== 1) {
										return
									}

									if (shiftKey) {
										isShift = true
									}

									handleCellMouseDown({
										event,
										row,
										column,
										isContinue: isShift,
									})
								},

								onInput: (event: React.FormEvent<HTMLDivElement>) => handleCellInput(event.currentTarget),
								onBlur: (event: React.FocusEvent<HTMLDivElement>) => handleCellBlur(event, row, column),
								onMouseEnter: () => handleCellMouseEnter(row, column),
							}

							if (row !== tableAddition.rowLabels.length - 1) {
								props.push("left")
							} else {
								props.push("left", "bottom")
							}

							if (column === item.length - 1) {
								props.push("right")
							}

							props.push("top")

							return (
								<Cell
									attrs={{
										...arrToObject(props),
										...eventProps,
									}}
									key={key}
								>
									{value}
								</Cell>
							)
						})}
					</TableDataRow>
				)
			})}
		</>
	)
}

export default RenderTableData
