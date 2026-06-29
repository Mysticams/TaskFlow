import { supabase } from "../../lib/supabase";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  task: string;
  setTask: (text: string) => void;
  onAdd: () => void;
  onClose: () => void;
};

export default function TaskForm({
  visible,
  task,
  setTask,
  onAdd,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text style={styles.title}>Create Task</Text>

              <TextInput
                style={styles.input}
                placeholder="Task title..."
                value={task}
                onChangeText={setTask}
              />

              <View style={styles.actions}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  cancel: {
    marginRight: 15,
    color: "#666",
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: {
    color: "#fff",
    fontWeight: "600",
  },
});
