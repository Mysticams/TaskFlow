import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Study React Native",
      completed: false,
    },
    {
      id: "2",
      title: "Finish Assignment",
      completed: false,
    },
  ]);

  const handleAddTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={headerStyles.headerContainer}>
        <Text style={headerStyles.headerTitle}>TaskFlow</Text>
      </View>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          placeholderTextColor="#888"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <View style={styles.taskContainer}>
        {tasks.map((item) => (
          <View key={item.id} style={styles.taskRow}>
            <MaterialIcons
              name="check-box-outline-blank"
              size={24}
              color="#555"
            />
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },

  addButton: {
    backgroundColor: "#4A90E2",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  taskContainer: {
    marginTop: 10,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  taskText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});
