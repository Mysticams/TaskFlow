import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const [tasks, setTasks] = useState<Task[]>([
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
    if (!taskTitle.trim()) {
      Toast.show({
        type: "error",
        text1: "Task Required",
        text2: "Please enter a task title.",
      });
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      completed: false,
    };

    setTasks([newTask, ...tasks]);

    Toast.show({
      type: "success",
      text1: "Task Added",
      text2: `"${newTask.title}" added successfully`,
    });

    setTaskTitle("");
    setModalVisible(false);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));

    Toast.show({
      type: "success",
      text1: "Task Deleted",
      text2: "Task removed successfully",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back 👋</Text>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>Stay productive and organized</Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsNumber}>{tasks.length}</Text>
          <Text style={styles.statsLabel}>Total Tasks</Text>
        </View>

        <MaterialIcons name="task-alt" size={42} color="#4F46E5" />
      </View>

      {/* Task List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>
              Tap the button below to add your first task.
            </Text>
          </View>
        ) : (
          tasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.taskCard}
              onPress={() => toggleTask(item.id)}
              onLongPress={() => deleteTask(item.id)}
            >
              <MaterialIcons
                name={
                  item.completed ? "check-circle" : "radio-button-unchecked"
                }
                size={28}
                color={item.completed ? "#22C55E" : "#9CA3AF"}
              />

              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Create New Task</Text>

                <TextInput
                  style={styles.input}
                  placeholder="What needs to be done?"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  autoFocus
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setTaskTitle("");
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleAddTask}
                  >
                    <Text style={styles.addBtnText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 4,
  },

  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
    marginBottom: 20,
  },

  statsNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  statsLabel: {
    color: "#6B7280",
    marginTop: 4,
  },

  listContainer: {
    flex: 1,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  taskText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#4F46E5",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
  },

  cancelBtnText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  addBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  addBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
