import { TableFrame } from "../styled/Table-styled"
import { TableMain } from "./TableMain"
import { useEffect } from "react"

const Table = () => {
	useEffect(() => {
		const contextMenuListenerCallback = (event: MouseEvent) => {
			event.preventDefault()
		}

		window.addEventListener("contextmenu", contextMenuListenerCallback)

		return () => {
			window.removeEventListener("contextmenu", contextMenuListenerCallback)
		}
	}, [])

	return (
		<>
			<TableFrame>
				<TableMain />
			</TableFrame>
		</>
	)
}

export default Table
