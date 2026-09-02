import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const Button = ({
  text,
  icon,
  iconSize = 19,
  iconColor = '#FFFFFF',
  iconPosition = 'right',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  activeOpacity = 0.92,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;

    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 2,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          disabled && styles.disabledButton,
          style,
        ]}
        activeOpacity={activeOpacity}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={iconColor}
            style={text ? styles.leftIcon : undefined}
          />
        )}

        {text ? (
          <Text style={[styles.text, textStyle]}>
            {loading ? 'Please wait...' : text}
          </Text>
        ) : null}

        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={iconColor}
            style={text ? styles.rightIcon : undefined}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#1687F8',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',

    ...Platform.select({
      ios: {
        shadowColor: '#1687F8',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  disabledButton: {
    opacity: 0.55,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  leftIcon: {
    marginRight: 9,
  },

  rightIcon: {
    marginLeft: 9,
  },
});

export default Button;