import { TableColumnHeader, TableDataFrame, TableDataRow, TableFrame, TableRowAndDataFrame, TableRowAndDataRowFlex, TableRowHeader } from "./Table-styled"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { getLabel, getRowLabel } from "./Ruler"
import { arrToObject } from "../../tools/arrToObject"
import Cell from "./Cell"
import HintBorder, { HintBorderRef } from "./HintBorder"

interface ColumnRulerProps {
	columnCount?: number
}

interface CurrentSelectCellInfo {
	selectRowIndex: number
	selectColumnIndex: number
	oldSelectSell?: HTMLDivElement
	newTargetTable?: AbstractTableElementType[][]
}

type AbstractTableElementType = string | number | undefined | null

const [EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_VALUE] = ["contentEditable", "true"]

const tables: AbstractTableElementType[][] = [
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[4, 5, 6, 7, 8, 8],
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[4, 5, 6, 7, 8, 8],
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[4, 5, 6, 7, 8, 8],
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[4, 5, 6, 7, 8, 8],
	[1, 2, 3, 4, 5, 6],
	[3, 4, 5, 6, 7, 8],
	[4, 5, 6, 7, 8, 8],
	[1, 2, 3, 4, 5, 6],
]

const Table: React.FC<ColumnRulerProps> = () => {
	const [tableAddition, setTableAddition] = useState<{
		rowLabels: string[]
		columnLabels: string[]
	}>({ rowLabels: [], columnLabels: [] })

	const [targetTables, setTargetTables] = useState<AbstractTableElementType[][]>()
	const currentSelectCell = useRef<CurrentSelectCellInfo | null>(null) //click后记录
	const hintBorder = useRef<HintBorderRef>(null)

	/**
	 * 获取当前数据状态下的的label
	 */
	const getCurrentTableAddition = () => {
		return {
			rowLabels: getRowLabel(26 < tables.length ? tables.length : 26, 0),
			columnLabels: tables[0] !== undefined ? getLabel(26 < tables[0].length ? tables[0].length : 26, "A", "Z") : [],
		}
	}

	/**
	 * 根据table的行数和列数生成填充0的表格，然后把table中的内容复制过来
	 */
	const buildMaskTables = useCallback(() => {
		return Array.from({ length: tableAddition.rowLabels.length }, (v, row) => {
			return Array.from({ length: tableAddition.columnLabels.length }, (v, column) => {
				if (row < tables.length && column < tables[row].length) {
					return tables[row][column]
				}
				return undefined
			})
		})
	}, [tableAddition.rowLabels.length, tableAddition.columnLabels.length])

	const { handleCellMouseDown, handleCellBlur, handleCellInput } = (function () {
		return {
			handleCellMouseDown: ({ event, row, column }: { event: React.MouseEvent<HTMLDivElement>; row: number; column: number }) => {
				event.preventDefault()
				if (!targetTables || targetTables.length <= row || targetTables[row].length <= column) {
					throw new Error("Error, it seems that the table has not been rendered.")
				}

				//focus target
				const target = event.currentTarget
				target.setAttribute(EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_VALUE)
				currentSelectCell.current?.oldSelectSell?.blur()
				currentSelectCell.current && (currentSelectCell.current.oldSelectSell = target)

				if (currentSelectCell.current?.selectRowIndex === row && currentSelectCell.current.selectColumnIndex === column) {
					target.focus()
				}

				//record current selected target cell without updating.
				currentSelectCell.current = {
					...currentSelectCell.current,
					selectRowIndex: row,
					selectColumnIndex: column,
				}

				hintBorder.current?.changeIndex(row, column)
			},
			handleCellBlur: (event: React.FocusEvent<HTMLDivElement>) => {
				const target = event.currentTarget

				if (target.hasAttribute(EDIT_ATTRIBUTE)) {
					const target = event.currentTarget

					target.removeAttribute(EDIT_ATTRIBUTE)
				}

				currentSelectCell.current?.newTargetTable && updateTargetTable(currentSelectCell.current.newTargetTable)
			},
			handleCellInput: (target: HTMLElement) => {
				if (!currentSelectCell.current || !targetTables) return

				const { selectRowIndex, selectColumnIndex } = currentSelectCell.current
				const tempTargetTables = [...targetTables] //对所有数组重新改变引用，引起useState的更新

				tempTargetTables[selectRowIndex][selectColumnIndex] = target.innerText
				currentSelectCell.current.newTargetTable = tempTargetTables //记录最新修改的值
			},
		}
	})()

	/**
	 * 对表格内容进行更新
	 * 1. 更新state
	 * 2. 清除ref为null
	 */
	const updateTargetTable = (newTargetTable: AbstractTableElementType[][]) => {
		setTargetTables(newTargetTable)
		currentSelectCell.current = null
		console.log("update", newTargetTable)
	}

	useEffect(() => {
		setTargetTables(buildMaskTables())

		if (tableAddition.rowLabels.length !== tables.length || tableAddition.columnLabels.length !== tables[0].length) {
			setTableAddition(getCurrentTableAddition())
		}
	}, [buildMaskTables, tableAddition.columnLabels.length, tableAddition.rowLabels.length])

	//列表头
	const RenderColumnHeader = useCallback(() => {
		return (
			<>
				<Cell attrs={{ ...arrToObject(["top", "left", "lineRight"]) }}></Cell>
				{tableAddition.columnLabels.map((value, index) => {
					const props = ["left", "rop", "top", "dark", "lineRight"]

					if (index === tableAddition.columnLabels.length - 1) {
						props.push("right")
					}

					return (
						<Cell attrs={{ ...arrToObject(props) }} key={value}>
							{value}
						</Cell>
					)
				})}
			</>
		)
	}, [tableAddition.columnLabels])

	//行表头和行列功能格
	const RenderRowHeader = useCallback(() => {
		return (
			<>
				{tableAddition.rowLabels.map((value, index) => {
					const props = []
					if (index !== tableAddition.rowLabels.length - 1) {
						props.push("left", "dark")
					} else {
						props.push("left", "bottom", "dark")
					}

					props.push("top")

					return (
						<Cell attrs={{ ...arrToObject(props) }} key={value}>
							{value}
						</Cell>
					)
				})}
			</>
		)
	}, [tableAddition.rowLabels])

	const RenderTableData = () => {
		if (!targetTables) return null

		return (
			<>
				{/* {targetTables && */}
				{targetTables.map((item, row) => {
					return (
						<TableDataRow key={tableAddition.rowLabels[row]}>
							{item.map((value, column) => {
								const key = `${tableAddition.columnLabels[column]}${tableAddition.rowLabels[row]}`
								const props = []

								const eventProps = {
									onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
										handleCellMouseDown({
											event,
											row,
											column,
										})
									},
									onInput: (event: React.FormEvent<HTMLDivElement>) => handleCellInput(event.currentTarget),
									onBlur: (event: React.FocusEvent<HTMLDivElement>) => handleCellBlur(event),
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

	return (
		<>
			<TableFrame>
				<TableColumnHeader>
					<RenderColumnHeader />
				</TableColumnHeader>

				<TableRowAndDataFrame>
					<TableRowAndDataRowFlex>
						<TableRowHeader>
							<RenderRowHeader />
						</TableRowHeader>
						<TableDataFrame>
							<RenderTableData />
							<HintBorder
								ref={hintBorder}
								{...{
									maxRowIndex: tableAddition.rowLabels.length,
									maxColumnIndex: tableAddition.columnLabels.length,
								}}
							/>
						</TableDataFrame>
					</TableRowAndDataRowFlex>
				</TableRowAndDataFrame>
			</TableFrame>
		</>
	)
}

export default Table
