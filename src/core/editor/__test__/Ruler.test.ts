import { getLabel, getLoopValue } from "../Ruler"

test("loop value", () => {
	const arr = []
	for (let i = 65; i < 91; i++) {
		arr.push(getLoopValue(i, 65, 90))
	}
	expect(arr.join(" ")).toMatchSnapshot()
	expect(arr.join(" ")).toBe("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z")

	const arr2 = []
	for (let i = 65; i < 91 + 26 * 2; i++) {
		arr2.push(getLoopValue(i, 65, 90))
	}
	expect(arr2.join(" ")).toMatchSnapshot()
	expect(arr2.join(" ")).toBe("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z")
})

test("creating column label", () => {
	expect(getLabel(25000, "A", "Z")).toMatchSnapshot()
})

export {}
