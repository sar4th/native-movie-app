import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
export const ServerDropdown = ({
  onSelect,
  movieId,
}: {
  onSelect: (url: string) => void;
  movieId: string;
}) => {
  const servers = [
    { id: "1", name: "Server 1", url: `https://vidlink.pro/movie/${movieId}` },
    {
      id: "2",
      name: "Server 2",
      url: ` https://player.videasy.net/movie/${movieId}`,
    },
    {
      id: "3",
      name: "Server 3",
      url: `https://111movies.com/movie/tt${movieId}`,
    },
  ];

  const [selected, setSelected] = useState(servers[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (server: (typeof servers)[0]) => {
    setSelected(server);
    setModalVisible(false);
    onSelect(server.url);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{selected.name}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={servers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1.5,
    borderColor: "#a855f7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#0f0a22",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modal: {
    backgroundColor: "#1b112f",
    marginHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#a855f7",
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});
