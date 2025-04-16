import React, { ReactNode } from 'react';
import { StyleSheet, View, Button, LayoutChangeEvent, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { EpisodesRatingsVertical } from './EpisodesRatingsVertical';
import { fakeSeasons } from '@/constants/mock';

// -------------------------
// AccordionItem Props Type
// -------------------------
interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  duration?: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  isExpanded,
  children,
  duration = 500,
}) => {
  const contentHeight = useSharedValue(0);

  const animatedHeight = useDerivedValue(() =>
    withTiming(contentHeight.value * (isExpanded.value ? 1 : 0), {
      duration,
    })
  );

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    contentHeight.value = event.nativeEvent.layout.height;
  };

  return (
    <Animated.View style={[styles.accordionContainer, animatedStyle]}>
      <View onLayout={handleLayout} style={styles.accordionContent}>
        {children}
      </View>
    </Animated.View>
  );
};

// -------------------------
// AccordionBox
// -------------------------
const AccordionBox: React.FC = ({ season }) => {
  let arr = [1, 2, 3, 4]
  return (
    <>



      <View style={styles.box}>
        {
          arr.map((item) => (




            <Text style={{ color: "white" }}>{`s${item}`}</Text>

          ))
        }
      </View>
      < View style={styles.box} >

        {season?.map((seasons) => {
          return (<EpisodesRatingsVertical episodes={seasons?.episodes} />)
        })}
      </View >
    </>
  )
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
  buttonRow: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  accordionContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  accordionContent: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    //backgroundColor: '#b58df1',
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
});
