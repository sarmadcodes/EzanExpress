import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TravelerSearchCard = () => {
  const navigation = useNavigation();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const isDisabled = !from.trim() || !to.trim();

  const handleSearch = () => {
    if (isDisabled) return;

    navigation.navigate('YOUR_NEXT_SCREEN', {
      from,
      to,
    });
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>
        Search for a Passenger
      </Text>

      <Text style={styles.subHeading}>
        Connect with verified travelers for fast delivery.
      </Text>

      {/* Search Box */}
      <View style={styles.searchBox}>
        {/* FROM */}
        <View style={styles.inputRow}>
          <Text style={styles.icon}>🎯</Text>
          <TextInput
            value={from}
            onChangeText={setFrom}
            placeholder="From: Select City"
            placeholderTextColor="#555"
            style={[
              styles.inputText,
              from && styles.activeText,
            ]}
          />
        </View>

        <View style={styles.divider} />

        {/* TO */}
        <View style={styles.inputRow}>
          <Text style={styles.icon}>📍</Text>
          <TextInput
            value={to}
            onChangeText={setTo}
            placeholder="To: Select City"
            placeholderTextColor="#555"
            style={[
              styles.inputText,
              to && styles.activeText,
            ]}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            isDisabled && styles.disabledButton,
          ]}
          onPress={() => navigation.navigate('PassengerSearch')}
          activeOpacity={0.8}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>
            Search Results
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TravelerSearchCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 20,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginVertical: 10,
  },

  subHeading: {
    color: '#ffffffde',
    fontSize: 14,
    marginBottom: 15,
  },

  searchBox: {
    backgroundColor: '#111827de',
    borderRadius: 15,
    padding: 12,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  icon: {
    fontSize: 18,
    marginRight: 12,
  },

  inputText: {
    flex: 1,
    color: '#555',
    fontSize: 15,
  },

  activeText: {
    color: '#ffffffde',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#1F2937',
  },

  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  disabledButton: {
    backgroundColor: '#334155',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
