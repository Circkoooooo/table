import "./App.css"
import Background from "./layout/Background"

function App() {
	const contextMenuListenerCallback = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault()
	}

	return (
		<Background
			{...{
				onContextMenu: contextMenuListenerCallback,
			}}
		/>
	)
}

export default App
