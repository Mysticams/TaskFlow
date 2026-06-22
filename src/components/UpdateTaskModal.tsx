import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type UpdateTaskModalProps = {
  visible: boolean;
  taskTitle: string;
  onClose: () => void;
  onUpdate: (updatedTitle: string) => void;
};

export default function UpdateTaskModal({
  visible,
  taskTitle,
  onClose,
  onUpdate,
}: UpdateTaskModalProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(taskTitle);
  }, [taskTitle, visible]);

  const handleUpdate = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onUpdate(trimmedTitle);
    onClose();
  };

  const handleClose = () => {
    setTitle(taskTitle);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text style={styles.heading}>Update Task</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
                autoFocus
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handleUpdate}
                >
                  <Text style={styles.buttonText}>Update</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: "#999",
  },

  updateButton: {
    backgroundColor: "#34C759",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
