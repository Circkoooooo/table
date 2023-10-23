import { useDispatch } from "react-redux"
import { useAppSelector } from "../../redux/hooks"
import { HeaderItem } from "../../styled/header/Header-styled"
import { Select } from "antd"
import { updateDrawConfigFontSize } from "../../redux/canvas/canvasSlice"

const options = () => {
	const value: number[] = []
	const start = 1
	let current = start
	const max = 72
	while (current <= max) {
		if (current < 12) {
			current += 1
		} else if (current < 48) {
			current += 2
		} else {
			current += 4
		}
		value.push(current)
	}

	return value.map((item) => {
		return {
			value: item,
			label: item,
		}
	})
}

export const ItemFontsize = () => {
	const canvasStore = useAppSelector((state) => state.canvas)

	const dispatch = useDispatch()

	return (
		<HeaderItem onWheel={(e) => e.stopPropagation()}>
			<Select
				onChange={(value) =>
					dispatch(
						updateDrawConfigFontSize({
							value,
						})
					)
				}
				defaultValue={canvasStore.drawConfig.fontSize}
				style={{ width: 40, textAlign: "center" }}
				suffixIcon={null}
				popupMatchSelectWidth={80}
				options={options()}
			/>
		</HeaderItem>
	)
}
