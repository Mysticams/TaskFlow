import { size } from "@expo/ui/jetpack-compose/modifiers";
import { MaterialIcons } from "@expo/vector-icons";
import { create } from "axios";
import { useEffect, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Task,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../lib/supabase";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
};

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Load Failed",
        text2: "Unable to fetch tasks.",
      });

      return;
    }

    setTasks(data || []);
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      Toast.show({
        type: "error",
        text1: "Task Required",
        text2: "Please enter a task title.",
      });
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          title: taskTitle.trim(),
          completed: false,
        },
      ]);

    if (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Add Failed",
        text2: "Could not add task.",
      });

      return;
    }

    Toast.show({
      type: "success",
      text1: "Task Added",
      text2: "Task created successfully.",
    });

    setTaskTitle("");
    setModalVisible(false);

    loadTasks();
  };

  const toggleTask = async (item: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        completed: !item.completed,
      })
      .eq("id", item.id);

    if (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not update task.",
      });

      return;
    }

    loadTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Could not delete task.",
      });

      return;
    }

    Toast.show({
      type: "success",
      text1: "Task Deleted",
      text2: "Task removed successfully.",
    });

    loadTasks();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back 👋</Text>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>
          Stay productive and organized
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsNumber}>
            {tasks.length}
          </Text>
          <Text style={styles.statsLabel}>
            Total Tasks
          </Text>
        </View>

        <MaterialIcons
          name="task-alt"
          size={42}
          color="#4F46E5"
        />
      </View>

      {/* Tasks */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="assignment"
              size={80}
              color="#D1D5DB"
            />

            <Text style={styles.emptyTitle}>
              No Tasks Yet
            </Text>

            <Text style={styles.emptyText}>
              Tap the + button to create your
              first task.
            </Text>
          </View>
        ) : (
          tasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.taskCard}
              onPress={() => toggleTask(item)}
              onLongPress={() =>
                deleteTask(item.id)
              }
            >
              <MaterialIcons
                name={
                  item.completed
                    ? "check-circle"
                    : "radio-button-unchecked"
                }
                size={28}
                color={
                  item.completed
                    ? "#22C55E"
                    : "#9CA3AF"
                }
              />

              <Text
                style={[
                  styles.taskText,
                  item.completed &&
                    styles.completedText,
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
        <MaterialIcons
          name="add"
          size={30}
          color="#FFF"
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  Create New Task
                </Text>

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
                    <Text
                      style={styles.cancelBtnText}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleAddTask}
                  >
                    <Text
                      style={styles.addBtnText}
                    >
                      Add Task
                    </Text>
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