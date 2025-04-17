import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  Button,
  LayoutChangeEvent,
  Text,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { EpisodesRatingsVertical } from "./EpisodesRatingsVertical";
import { fakeSeasons } from "@/constants/mock";

// -------------------------
// AccordionItem Props Type
// -------------------------
interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  duration?: number;
}

const CELL_W = 60;
const CELL_H = 40;
const GAP = 4;
const AccordionItem: React.FC<AccordionItemProps> = ({
  isExpanded,
  children,
  duration = 500,
}) => {
  const contentHeight = useSharedValue(0);

  const animatedHeight = useDerivedValue(() =>
    withTiming(contentHeight.value * (isExpanded.value ? 1 : 0), {
      duration,
    }),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    contentHeight.value = event.nativeEvent.layout.height;
  };

  return (
    <Animated.View style={[styles.accordionContainer, animatedStyle]}>
      <Animated.ScrollView
        onLayout={handleLayout}
        style={[styles.accordionContent]}
        contentContainerStyle={{ alignItems: "flex-start" }}
        horizontal
      >
        {children}
      </Animated.ScrollView>
    </Animated.View>
  );
};

// -------------------------
// AccordionBox
// -------------------------

const AccordionBox: React.FC<any> = ({ season }) => {
  const maxEps = Math.max(...season.map((s) => s.episodes.length));

  return (
    <View>
      {/* Header Row: blank corner + S1, S2, ... */}
      <View style={{ flexDirection: "row" }}>
        <View style={[styles.cell, styles.corner]} />
        {season.map((_, sIndex) => (
          <View key={sIndex} style={[styles.cell, styles.headerCell]}>
            <Text style={styles.headerText}>{`S${sIndex + 1}`}</Text>
          </View>
        ))}
      </View>

      {/* Episode Rows: E1, E2... + rating cells */}
      <View style={{ flexDirection: "row" }}>
        {/* Episode Labels Column */}
        <View>
          {Array.from({ length: maxEps }).map((_, epIndex) => (
            <View key={epIndex} style={[styles.cell, styles.episodeCell]}>
              <Text style={styles.episodeText}>{`E${epIndex + 1}`}</Text>
            </View>
          ))}
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          horizontal
          showsHorizontalScrollIndicator={true}
        >
          {season.map((seasons, i) => (
            <EpisodesRatingsVertical key={i} episodes={seasons.episodes} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// -------------------------
// AccordionParent Props Type
// -------------------------
interface AccordionParentProps {
  open: SharedValue<boolean>;
}

const AccordionParent: React.FC<AccordionParentProps> = ({ open }) => (
  <View style={styles.fullWidth}>
    <AccordionItem isExpanded={open}>
      <AccordionBox season={fakeSeasons} />
    </AccordionItem>
  </View>
);

// -------------------------
// Main Component
// -------------------------
const Accordion: React.FC = () => {
  const open = useSharedValue(false);
  const toggleAccordion = () => {
    open.value = !open.value;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button onPress={toggleAccordion} title="See Episode Wise Ratings" />
      </View>
      <AccordionParent open={open} />
    </View>
  );
};

export default Accordion;

// -------------------------
// Styles
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: GAP,
  },
  cell: {
    width: CELL_W,
    height: CELL_H,
    marginHorizontal: GAP / 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    backgroundColor: "transparent",
  },
  headerCell: {
    backgroundColor: "transparent",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  episodeCell: {
    backgroundColor: "transparent",
  },
  episodeText: {
    color: "#fff",
    fontWeight: "600",
  },
  ratingText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonRow: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
    alignItems: "flex-start",
  },
  accordionContainer: {
    width: "100%",
    overflow: "hidden",
    alignItems: "flex-start",
  },
  accordionContent: {
    width: "100%",
    position: "absolute",
  },
  box: {
    width: "100%",
    gap: 10,
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  scrollContainer: {
    flexGrow: 0,
  }, // just horizontal scroll container

  scrollContentContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingRight: 30,
    minWidth: "100%", // ensures scrollability
  },
});
