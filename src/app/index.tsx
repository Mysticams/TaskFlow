import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ⭐ NEW: edit states
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // FETCH TASKS
  const fetchTasks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to load tasks",
      });
    } else {
      setTasks((data as Task[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const handleAddTask = async () => {
    const trimmed = taskTitle.trim();

    if (!trimmed) {
      Toast.show({
        type: "error",
        text1: "Task required",
      });
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title: trimmed, completed: false }])
      .select()
      .single();

    setSubmitting(false);

    if (error || !data) {
      Toast.show({
        type: "error",
        text1: "Failed to add task",
      });
      return;
    }

    setTasks((prev) => [data as Task, ...prev]);
    setTaskTitle("");
    setModalVisible(false);

    Toast.show({ type: "success", text1: "Task added" });
  };

  // ⭐ UPDATE TASK (NEW)
  const handleUpdateTask = async () => {
    if (!editingId) return;

    const trimmed = taskTitle.trim();

    if (!trimmed) {
      Toast.show({ type: "error", text1: "Task required" });
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("tasks")
      .update({ title: trimmed })
      .eq("id", editingId)
      .select()
      .single();

    setSubmitting(false);

    if (error || !data) {
      Toast.show({
        type: "error",
        text1: "Update failed",
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === editingId ? (data as Task) : t)),
    );

    setTaskTitle("");
    setEditingId(null);
    setEditMode(false);
    setModalVisible(false);

    Toast.show({ type: "success", text1: "Task updated" });
  };

  // TOGGLE TASK
  const toggleTask = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !current })
      .eq("id", id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Update failed",
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !current } : t)),
    );
  };

  // DELETE TASK
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Delete failed",
      });
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));

    Toast.show({ type: "success", text1: "Task deleted" });
  };

  // ⭐ OPEN EDIT MODE
  const openEdit = (task: Task) => {
    setEditMode(true);
    setEditingId(task.id);
    setTaskTitle(task.title);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back 👋</Text>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>Stay productive & organized</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsNumber}>{tasks.length}</Text>
          <Text style={styles.statsLabel}>Total Tasks</Text>
        </View>

        <MaterialIcons name="task-alt" size={42} color="#6366F1" />
      </View>

      {/* TASK LIST */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading tasks...</Text>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>Tap + to add your first task</Text>
          </View>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskLeft}
                onPress={() => toggleTask(item.id, item.completed)}
              >
                <MaterialIcons
                  name={
                    item.completed ? "check-circle" : "radio-button-unchecked"
                  }
                  size={26}
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

              {/* ⭐ EDIT BUTTON */}
              <TouchableOpacity onPress={() => openEdit(item)}>
                <MaterialIcons name="edit" size={22} color="#3B82F6" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditMode(false);
          setTaskTitle("");
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MODAL (ADD + UPDATE) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  {editMode ? "Update Task" : "Create Task"}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter task..."
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={editMode ? handleUpdateTask : handleAddTask}
                    disabled={submitting}
                  >
                    <Text style={styles.addBtnText}>
                      {submitting ? "Saving..." : editMode ? "Update" : "Add"}
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

/* ================= UI ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: { marginBottom: 20 },
  greeting: { fontSize: 14, color: "#8B8FA3" },
  title: { fontSize: 36, fontWeight: "900", color: "#141824" },
  subtitle: { color: "#9AA3B2" },

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
    marginBottom: 15,
  },

  statsNumber: { fontSize: 30, fontWeight: "900" },
  statsLabel: { color: "#9AA3B2" },

  listContainer: { flex: 1 },

  loadingText: { textAlign: "center", marginTop: 30, color: "#888" },

  taskCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },

  taskLeft: { flexDirection: "row", alignItems: "center", flex: 1 },

  taskText: { marginLeft: 10, fontSize: 15, color: "#141824" },

  completedText: {
    textDecorationLine: "line-through",
    color: "#B0B6C6",
  },

  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: "800" },
  emptyText: { color: "#9AA3B2" },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    backgroundColor: "#6366F1",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 10 },

  input: {
    backgroundColor: "#F3F5F9",
    borderRadius: 12,
    padding: 12,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },

  cancelText: {
    marginRight: 15,
    color: "#888",
    fontWeight: "600",
  },

  addBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addBtnText: { color: "#fff", fontWeight: "700" },
});
