import { TextInput, TextInputProps } from 'react-native'

export function CustomInput(props: TextInputProps) {
	return (
		<TextInput
			style={{
				borderRadius: 20,
				backgroundColor: 'black',
				color: 'white',
				height: 40,
				width: '100%',
				textAlign: 'center'
			}}
			{...props}
		/>
	)
}
