import React from "react";
import { supabase } from "../../lib/supabase";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
};

type Props = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: number) => void;
};

export default function TaskItem({ item, onToggle, onDelete }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <MaterialIcons
        name={item.completed ? "check-circle" : "radio-button-unchecked"}
        size={26}
        color={item.completed ? "#22C55E" : "#999"}
      />

      <Text style={[styles.text, item.completed && styles.done]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
});
