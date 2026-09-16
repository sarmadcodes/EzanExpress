import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Input from './Input';
import { GEOAPIFY_API_KEY } from '../../constant/API';

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 400;
const RESULT_LIMIT = 5;

const AddressAutocomplete = ({
  label = 'Full Address',
  placeholder = 'Street, City, Postcode',
  value,
  onChangeText,
  required = false,
  error,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [searched, setSearched] = useState(false);

  const selectedRef = useRef('');
  const requestRef = useRef(0);

  useEffect(() => {
    const query = String(value || '').trim();

    if (query === selectedRef.current) {
      return;
    }

    if (query.length < MIN_QUERY_LENGTH || !GEOAPIFY_API_KEY) {
      setSuggestions([]);
      setVisible(false);
      setSearched(false);
      setSearchFailed(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      setSearching(true);
      setSearchFailed(false);
      setVisible(true);

      try {
        const url =
          'https://api.geoapify.com/v1/geocode/autocomplete' +
          `?text=${encodeURIComponent(query)}` +
          `&limit=${RESULT_LIMIT}` +
          `&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Address lookup failed: ${response.status}`);
        }

        const result = await response.json();

        if (requestRef.current !== requestId) {
          return;
        }

        const features = Array.isArray(result?.features) ? result.features : [];

        setSuggestions(
          features
            .map(feature => feature?.properties)
            .filter(properties => properties?.formatted),
        );

        setSearched(true);
      } catch (err) {
        if (requestRef.current !== requestId) {
          return;
        }

        setSuggestions([]);
        setSearchFailed(true);
      } finally {
        if (requestRef.current === requestId) {
          setSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleSelect = properties => {
    const formatted = properties?.formatted || '';

    selectedRef.current = formatted;

    onChangeText(formatted);

    setSuggestions([]);
    setVisible(false);
    setSearched(false);
  };

  const showPanel =
    visible && (searching || searchFailed || suggestions.length > 0 || searched);

  return (
    <View style={styles.wrapper}>
      <Input
        type="text"
        label={label}
        placeholder={placeholder}
        icon="location-outline"
        required={required}
        value={value}
        error={error}
        onChangeText={text => {
          selectedRef.current = '';
          onChangeText(text);
        }}
      />

      {showPanel ? (
        <View style={styles.panel}>
          {searching ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color="#1363C8" />

              <Text style={styles.statusText}>Searching addresses…</Text>
            </View>
          ) : searchFailed ? (
            <View style={styles.statusRow}>
              <Ionicons name="cloud-offline-outline" size={16} color="#F5B301" />

              <Text style={styles.statusText}>
                Could not load suggestions. You can type your address manually.
              </Text>
            </View>
          ) : suggestions.length === 0 ? (
            <View style={styles.statusRow}>
              <Ionicons name="search-outline" size={16} color="#718399" />

              <Text style={styles.statusText}>
                No matching addresses. Keep typing or enter it manually.
              </Text>
            </View>
          ) : (
            suggestions.map((properties, index) => (
              <TouchableOpacity
                key={properties?.place_id || `${properties?.formatted}-${index}`}
                activeOpacity={0.75}
                onPress={() => handleSelect(properties)}
                style={[
                  styles.item,
                  index !== suggestions.length - 1 && styles.itemBorder,
                ]}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name="location" size={15} color="#55A9FF" />
                </View>

                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {properties?.address_line1 || properties?.formatted}
                  </Text>

                  {properties?.address_line2 ? (
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {properties.address_line2}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      ) : null}
    </View>
  );
};

export default AddressAutocomplete;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 20,
  },

  panel: {
    marginTop: -6,
    marginBottom: 14,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  statusText: {
    flex: 1,
    color: '#93A6BD',
    fontSize: 13,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1B2739',
  },

  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#132840',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemBody: {
    flex: 1,
  },

  itemTitle: {
    color: '#F5F8FC',
    fontSize: 14,
    fontWeight: '600',
  },

  itemSubtitle: {
    color: '#718399',
    fontSize: 12,
    marginTop: 2,
  },
});
