import React, { useState } from 'react'
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { CustomInput } from './CustomInput'

type Task = {
	text: string
	completed: boolean
}

export default function HomeScreen() {
	const [task, setTask] = useState('')
	const [tasks, setTasks] = useState<Task[]>([])
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [editedText, setEditedText] = useState('')

	const handleAddTask = () => {
		if (task.trim().length > 0) {
			setTasks([...tasks, { text: task.trim(), completed: false }])
			setTask('')
		}
	}

	const handleDeleteTask = (index: number) => {
		const updatedTasks = tasks.filter((_, i) => i !== index)
		setTasks(updatedTasks)
	}

	const toggleTaskCompletion = (index: number) => {
		const updatedTasks = tasks.map((item, i) =>
			i === index ? { ...item, completed: !item.completed } : item
		)
		setTasks(updatedTasks)
	}

	const handleEditTask = (index: number, text: string) => {
		setEditingIndex(index)
		setEditedText(text)
	}

	const handleSaveEdit = (index: number) => {
		const updatedTasks = tasks.map((item, i) =>
			i === index ? { ...item, text: editedText } : item
		)
		setTasks(updatedTasks)
		setEditingIndex(null)
		setEditedText('')
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<CustomInput
					style={styles.input}
					placeholder='Enter a task'
					value={task}
					onChangeText={setTask}
				/>
				<Button title='Add Task' onPress={handleAddTask} />
			</View>
			<FlatList
				data={tasks}
				renderItem={({ item, index }) => (
					<View style={styles.taskContainer}>
						{editingIndex === index ? (
							<TextInput
								style={styles.input}
								value={editedText}
								onChangeText={setEditedText}
							/>
						) : (
							<TouchableOpacity
								onPress={() => toggleTaskCompletion(index)}
								style={[
									styles.taskTextContainer,
									item.completed && styles.completedTask
								]}
							>
								<Text style={styles.taskText}>
									{item.completed ? ' ✓ ' : ''}
									{item.text}
								</Text>
							</TouchableOpacity>
						)}

						{editingIndex === index ? (
							<Button title='Save' onPress={() => handleSaveEdit(index)} />
						) : (
							<>
								<TouchableOpacity
									onPress={() => handleEditTask(index, item.text)}
									style={styles.editButton}
								>
									<Text style={styles.editText}>Edit</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleDeleteTask(index)}
									style={styles.deleteButton}
								>
									<Text style={styles.deleteText}>Delete</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginRight: 10
	},
	taskContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc'
	},
	taskTextContainer: {
		flex: 1
	},
	taskText: {
		fontSize: 16
	},
	completedTask: {
		backgroundColor: '#d4edda',
		borderRadius: 5,
		padding: 5
	},
	editButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
		marginRight: 5
	},
	editText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	deleteButton: {
		backgroundColor: '#ff5252',
		padding: 10,
		borderRadius: 5
	},
	deleteText: {
		color: '#fff',
		fontWeight: 'bold'
	}
})
