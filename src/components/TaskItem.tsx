import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

type TaskItemProps = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: number) => void;
};

export default function TaskItem({ item, onToggle, onDelete }: TaskItemProps) {
  return (
    <TouchableHighlight
      underlayColor="#f2f2f2"
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.completed ? "check-circle" : "radio-button-unchecked"}
          size={24}
          color={item.completed ? "green" : "#999"}
        />

        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },

  completedTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});
