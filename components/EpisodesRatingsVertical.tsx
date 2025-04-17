import { FlatList, Text, View, ScrollView, StyleSheet } from "react-native";
interface EachEpisodeRatingProps {
  rating: number;
}

const getColorByRating = (rating: number): string => {
  if (rating >= 9) return "#19693e"; // awesome
  if (rating >= 8) return "#28b562"; // great
  if (rating >= 7) return "#f3cf3d"; // good
  if (rating >= 6) return "#f19d1d"; // regular
  if (rating >= 5) return "#e94e3b"; // bad
  return "#623972"; // garbage
};

export const EachEpisodeRating: React.FC<EachEpisodeRatingProps> = ({
  rating,
}) => {
  const backgroundColor = getColorByRating(rating);

  return (
    <View style={[styles.box, { backgroundColor }]}>
      <Text style={styles.text}>{rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});
export const EpisodesRatingsVertical = ({ episodes }) => {
  return (
    <>
      <ScrollView>
        <FlatList
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          data={episodes}
          renderItem={({ item }) => <EachEpisodeRating rating={item.rating} />}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </>
  );
};
