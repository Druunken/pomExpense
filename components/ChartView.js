import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Svg, Path, Circle, G, Text as SvgText } from "react-native-svg";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";


import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

import numberValidation from '../services/numberInputValidation'

const AnimatedPath = Animated.createAnimatedComponent(Path);

function enforceMinAngle(pieData, minAngle) {
  const totalAngle = 2 * Math.PI;
  const angles = pieData.map((d) => d.endAngle - d.startAngle);
  const smallSlices = angles.map((angle) => angle < minAngle);

  const extraAngleNeeded = smallSlices.reduce(
    (sum, isSmall, i) => sum + (isSmall ? minAngle - angles[i] : 0),
    0
  );

  const totalLargeAngle = angles.reduce(
    (sum, angle, i) => sum + (smallSlices[i] ? 0 : angle),
    0
  );

  const adjustedAngles = angles.map((angle, i) => {
    if (smallSlices[i]) {
      return minAngle;
    } else {
      return angle - (angle / totalLargeAngle) * extraAngleNeeded;
    }
  });

  let currentAngle = 0;
  return pieData.map((slice, i) => {
    const newStartAngle = currentAngle;
    const newEndAngle = currentAngle + adjustedAngles[i];
    currentAngle = newEndAngle;
    return {
      ...slice,
      startAngle: newStartAngle,
      endAngle: newEndAngle,
    };
  });
}

const ChartView = ({
  data = [],
  width = 300,
  height = 300,
  onSlicePress = () => {},
}) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const radius = Math.min(width, height) / 2 - 10;
  const innerRadius = radius * 0.6;

  const rawPieData = pie()
    .value((d) => d.amount)
    .sort(null)(data);

  const MIN_ANGLE = 0.3;
  const pieData = enforceMinAngle(rawPieData, MIN_ANGLE);

  const arcGenerator = arc().outerRadius(radius).innerRadius(innerRadius);

  const colorScale = scaleOrdinal()
    .domain(pieData.map((slice) => slice.data.date))
    .range(["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]);

  const strokeWidths = pieData.map(() => useSharedValue(6));
  const fontSizes = pieData.map(() => useSharedValue(8));

  const handlePress = (index, slice) => {
    setSelectedSlice(index);
    setSelectedAmount(slice.data.amount); // Show this inside the center circle
    onSlicePress(data[index]);

    strokeWidths.forEach((strokeWidth, i) => {
      strokeWidth.value = withTiming(i === index ? 2 : 6, { duration: 500 });
    });
    fontSizes.forEach((fontSize, i) => {
      fontSize.value = withTiming(i === index ? 12 : 8, { duration: 500 });
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <G x={width / 2} y={height / 2}>
          {pieData.map((slice, index) => {
            const path = arcGenerator(slice);
            const animatedPathProps = useAnimatedProps(() => ({
              strokeWidth: strokeWidths[index].value,
            }));

            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => handlePress(index, slice)}
              >
                <AnimatedPath
                  animatedProps={animatedPathProps}
                  d={path}
                  fill={colorScale(slice.data.date)}
                  stroke="white"
                />
              </TouchableWithoutFeedback>
            );
          })}

          <Circle cx={0} cy={0} r={innerRadius} fill="white" />

          {selectedAmount !== null && (
            <SvgText
              x={0}
              y={5}
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#333"
            >
              {numberValidation.converToString(Number(selectedAmount.toFixed(2)))}
            </SvgText>
          )}
        </G>
      </Svg>

      {pieData.map((slice, index) => {
        const [labelX, labelY] = arcGenerator.centroid(slice);
        const labelOffset = 1.3;
        const adjustedLabelX = labelX * labelOffset + width / 2;
        const adjustedLabelY = labelY * labelOffset + height / 2;

        const animatedFontSizeStyle = useAnimatedStyle(() => ({
          fontSize: fontSizes[index].value,
        }));

        return (
          <Animated.Text
            key={`label-${index}`}
            onPress={() => handlePress(index, slice)}
            style={[
              styles.label,
              {
                left: adjustedLabelX,
                top: adjustedLabelY,
              },
              animatedFontSizeStyle,
            ]}
          >
            {slice.data.date}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    position: "absolute",
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    transform: [{ translateX: -25 }, { translateY: -10 }],
  },
});

export default ChartView;
