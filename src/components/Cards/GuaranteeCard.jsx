import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuaranteeCard = ({
  title,
  description,
  amountText,
}) => {
  return (
    <View style={styles.card}>
      {/* Left Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {description}
          <Text style={styles.amount}> {amountText}</Text>
        </Text>
      </View>

      {/* Right Icon */}
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>🛡️</Text>
      </View>
    </View>
  );
};

export default GuaranteeCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,

    // Gradient-like effect using solid fallback
    backgroundColor: '#2563EB',
  },

  textContainer: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  description: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 18,
  },

  amount: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});
