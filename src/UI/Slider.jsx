// NecessitySlider.js
import React, { useRef, useState } from 'react';
import {
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const NecessitySlider = ({ value, onValueChange, min = 0, max = 5 }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const pan = useRef(new Animated.Value(value)).current;
  const isSliding = useRef(false);

  const getNecessityDescription = (level) => {
    const descriptions = [
      'Unnecessary',
      'Low Priority',
      'Moderate',
      'Important',
      'Very Important',
      'Essential'
    ];
    return descriptions[level] || 'Unrated';
  };

  // Initialize pan value when component mounts or value changes externally
  React.useEffect(() => {
    if (!isSliding.current) {
      pan.setValue(value);
    }
  }, [value, pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        isSliding.current = true;
        updateValueFromGesture(gestureState.x0);
      },
      onPanResponderMove: (evt, gestureState) => {
        updateValueFromGesture(gestureState.moveX);
      },
      onPanResponderRelease: () => {
        isSliding.current = false;
      },
    })
  ).current;

  const updateValueFromGesture = (xPosition) => {
    if (containerWidth === 0) return;

    const relativeX = Math.max(0, Math.min(xPosition, containerWidth));
    const percentage = relativeX / containerWidth;
    const rawValue = min + percentage * (max - min);
    const newValue = Math.round(rawValue);

    pan.setValue(newValue);
    
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const handleThumbPress = (level) => {
    pan.setValue(level);
    onValueChange(level);
  };

  const thumbPosition = pan.interpolate({
    inputRange: [min, max],
    outputRange: [0, containerWidth - 36], // 36 is thumb width
    extrapolate: 'clamp',
  });

  const activeTrackWidth = pan.interpolate({
    inputRange: [min, max],
    outputRange: [0, containerWidth],
    extrapolate: 'clamp',
  });

  const getThumbColor = (level) => {
    return level <= value ? '#007bff' : '#e0e0e0';
  };

  const getTrackColor = (index) => {
    return index < value ? '#007bff' : '#e0e0e0';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        {getNecessityDescription(value)}
      </Text>
      
      <View 
        style={styles.sliderContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
        {...panResponder.panHandlers}
      >
        {/* Background Track */}
        <View style={styles.trackBackground} />
        
        {/* Active Track */}
        <Animated.View 
          style={[
            styles.trackActive,
            { width: activeTrackWidth }
          ]} 
        />
        
        {/* Thumb */}
        <Animated.View
          style={[
            styles.sliderThumb,
            {
              left: thumbPosition,
              backgroundColor: value === min ? '#e0e0e0' : '#007bff',
              borderColor: value === min ? '#e0e0e0' : '#007bff',
            }
          ]}
        >
          <Text style={[
            styles.thumbText,
            value === min ? styles.thumbTextInactive : styles.thumbTextActive
          ]}>
            {value}
          </Text>
        </Animated.View>

        {/* Discrete Points */}
        <View style={styles.discretePointsContainer}>
          {[...Array(max - min + 1)].map((_, index) => {
            const level = min + index;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.discretePoint,
                  { 
                    backgroundColor: getThumbColor(level),
                    left: `${(index / (max - min)) * 100}%`
                  }
                ]}
                onPress={() => handleThumbPress(level)}
              />
            );
          })}
        </View>
      </View>
      
      <View style={styles.labelsContainer}>
        {[...Array(max - min + 1)].map((_, index) => {
          const level = min + index;
          return (
            <Text 
              key={level} 
              style={[
                styles.label,
                level === value && styles.labelActive
              ]}
            >
              {level}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  trackBackground: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    left: 0,
    right: 0,
  },
  trackActive: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#007bff',
    borderRadius: 3,
    left: 0,
  },
  sliderThumb: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007bff',
    borderWidth: 3,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  thumbTextActive: {
    color: '#fff',
  },
  thumbTextInactive: {
    color: '#999',
  },
  discretePointsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
  },
  discretePoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007bff',
    marginLeft: -10, // Center the points
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    minWidth: 20,
  },
  labelActive: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NecessitySlider;