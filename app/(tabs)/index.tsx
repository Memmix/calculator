import React, { useRef, useState } from 'react'
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'

export default function Calculator() {
	const [input, setInput] = useState('0')
	const [result, setResult] = useState('')
	const scaleAnim = useRef(new Animated.Value(1)).current
	const equalAnim = useRef(new Animated.Value(0)).current
	const colorAnim = useRef(new Animated.Value(0)).current // Animation for color

	const handlePress = (value: string) => {
		if (value === 'AC') {
			setInput('0')
			setResult('')
		} else if (value === '⌫') {
			setInput(input.length > 1 ? input.slice(0, -1) : '0')
		} else if (value === '=') {
			animateEqual()
			try {
				setResult(safeEval(input).toString())
			} catch (error) {
				setResult('Ошибка')
			}
		} else if (value === '%') {
			setInput((parseFloat(input) / 100).toString())
		} else if (value === '^') {
			setInput(input + '**')
		} else {
			if (/[-+*/.^%]$/.test(input) && /[-+*/.^%]/.test(value)) {
				return // Prevent multiple operators in a row
			}
			setInput(input === '0' ? value : input + value)
		}

		animatePress()
		animateColor() // Trigger color animation
	}

	// Safe evaluation function
	const safeEval = (expression: string) => {
		// Only allow valid characters
		const sanitized = expression.replace(/[^0-9+\-*/^().%]/g, '')
		try {
			return eval(sanitized) // Evaluate sanitized input
		} catch (error) {
			return 'Ошибка' // Return error if invalid calculation
		}
	}

	// Handle button press animation
	const animatePress = () => {
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.9,
				duration: 100,
				useNativeDriver: true // Only use native driver for scale animation
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true
			})
		]).start()
	}

	// Handle equals button animation
	const animateEqual = () => {
		Animated.sequence([
			Animated.timing(equalAnim, {
				toValue: 360,
				duration: 300,
				useNativeDriver: true // Use native driver for rotation
			}),
			Animated.timing(equalAnim, {
				toValue: 0,
				duration: 0,
				useNativeDriver: true
			})
		]).start()
	}

	// Handle color animation (triggered on each button press)
	const animateColor = () => {
		Animated.sequence([
			Animated.timing(colorAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true // Do not use native driver for color animation
			}),
			Animated.timing(colorAnim, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true // Reset color after animation
			})
		]).start()
	}

	// Render a calculator button
	const renderButton = (value: string) => {
		const animatedStyle =
			value === '='
				? {
						transform: [
							{
								rotate: equalAnim.interpolate({
									inputRange: [0, 360],
									outputRange: ['0deg', '360deg']
								})
							}
						]
				  }
				: { transform: [{ scale: scaleAnim }] }

		// Color animation for button
		const backgroundColor = colorAnim.interpolate({
			inputRange: [0, 1],
			outputRange: ['#FF0000', '#00FF00'] // Red to Green for a noticeable effect
		}) as unknown as string

		return (
			<TouchableOpacity
				key={value}
				onPress={() => handlePress(value)}
				style={[styles.button, { backgroundColor }]}
			>
				<Animated.Text style={[styles.buttonText, animatedStyle]}>
					{value}
				</Animated.Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.input}>{input}</Text>
			<Text style={styles.result}>{result}</Text>
			<View style={styles.row}>{['AC', '⌫', '%', '/'].map(renderButton)}</View>
			<View style={styles.row}>{['7', '8', '9', '*'].map(renderButton)}</View>
			<View style={styles.row}>{['4', '5', '6', '-'].map(renderButton)}</View>
			<View style={styles.row}>{['1', '2', '3', '+'].map(renderButton)}</View>
			<View style={styles.row}>{['0', '.', '=', '^'].map(renderButton)}</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#222'
	},
	input: { fontSize: 36, color: '#fff', marginBottom: 10 },
	result: { fontSize: 24, color: '#888', marginBottom: 20 },
	row: { flexDirection: 'row' },
	button: { padding: 20, margin: 5, borderRadius: 10 },
	buttonText: { fontSize: 24, color: '#fff' }
})
