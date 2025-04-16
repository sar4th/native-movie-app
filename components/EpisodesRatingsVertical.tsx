import { FlatList, Text, View, ScrollView } from "react-native"
const EachEpisodeRating = ({ rating }) => {
  return (
    <View>
      <Text style={{ color: "white" }}>{rating}</Text>
    </View >
  )
}
export const EpisodesRatingsVertical = ({ episodes }) => {

  return (
    <>
      <ScrollView>


        <FlatList

          data={episodes}
          renderItem={({ item }) => <EachEpisodeRating rating={item.rating} />}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </>
  )
}
