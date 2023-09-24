import { TableFrame } from "./styled/Table-styled"
import { TableMain } from "./components/TableMain"
import { Provider } from "react-redux"
import store from "./redux/store"

const Table = () => {
	return (
		<Provider store={store}>
			<TableMain />
		</Provider>
	)
}

export default Table
