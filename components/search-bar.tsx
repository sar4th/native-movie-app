import { icons } from "@/constants/icons";
import { View, Image, TextInput } from "react-native";

export const SearchBar = ({ onPress, handleSearch, searchQuery }) => {
  return (
    <View
      style={{
        height: 44,
        backgroundColor: "#0F0D23",
        borderRadius: 30,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Image
        source={icons.search}
        style={{ width: 20, height: 20, tintColor: "#ABB5DB", marginRight: 10 }}
      />

      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        onPress={onPress}
        placeholder="Search"
        placeholderTextColor="#ABB5DB"
        style={{
          flex: 1,
          color: "white",
          fontSize: 16,
        }}
      />
    </View>
  );
};
