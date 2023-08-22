import "./App.css"
import Background from "./layout/Background"
import Table from "./core/Table"

function App() {
	const contextMenuListenerCallback = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault()
	}

	return (
		<Background
			{...{
				HeaderSlot: <div>header</div>,
				MainSlot: <Table />,
				// AsideSlot: <div>aside</div>,
				onContextMenu: contextMenuListenerCallback,
			}}
		/>
	)
}

export default App
