import React from "react"
import "./App.css"
import Background from "./layout/Background"
import Table from "./core/Table"

function App() {
	return (
		<Background
			{...{
				HeaderSlot: <div>header</div>,
				MainSlot: <Table />,
				// AsideSlot: <div>aside</div>,
			}}
		/>
	)
}

export default App
