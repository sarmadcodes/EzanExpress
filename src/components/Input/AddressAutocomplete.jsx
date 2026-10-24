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
import { BASE_API_URI } from '../../constant/API';

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 400;

const AddressAutocomplete = ({
  label = 'Full Address',
  placeholder = 'Street, City, Postcode',
  value,
  onChangeText,
  required = false,
  error,
  // Called with false while a chosen street still needs a house number, so the
  // parent form can keep its submit button disabled.
  onValidityChange,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [searched, setSearched] = useState(false);

  // Set only when the chosen suggestion had no house number of its own.
  const [baseAddress, setBaseAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const selectedRef = useRef('');
  const requestRef = useRef(0);

  useEffect(() => {
    const query = String(value || '').trim();

    if (query === selectedRef.current) {
      return;
    }

    if (query.length < MIN_QUERY_LENGTH) {
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
        // Proxied through our backend; the Geoapify key stays server side.
        const url =
          `${BASE_API_URI}/address/autocomplete` +
          `?text=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Address lookup failed: ${response.status}`);
        }

        const result = await response.json();

        if (requestRef.current !== requestId) {
          return;
        }

        const results = Array.isArray(result?.suggestions)
          ? result.suggestions
          : [];

        setSuggestions(results.filter(item => item?.formatted));

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

  // Geoapify returns a street-level result ("Viking Close, London, E3 5RL")
  // whenever the user has not typed a number into the search box, and there is
  // no house number anywhere in it. For a delivery app that address is not
  // usable, so when the result has no housenumber we ask for it separately and
  // prepend it ourselves.
  const handleSelect = properties => {
    const formatted = properties?.formatted || '';
    const hasNumber = Boolean(properties?.housenumber);

    setBaseAddress(hasNumber ? '' : formatted);
    setHouseNumber('');

    selectedRef.current = formatted;

    onChangeText(formatted);

    setSuggestions([]);
    setVisible(false);
    setSearched(false);
  };

  const handleHouseNumberChange = text => {
    setHouseNumber(text);

    const trimmed = text.trim();
    const composed = trimmed ? `${trimmed} ${baseAddress}` : baseAddress;

    // Keep the ref in step so composing does not re-trigger the lookup.
    selectedRef.current = composed;

    onChangeText(composed);
  };

  const needsHouseNumber = Boolean(baseAddress) && !houseNumber.trim();

  useEffect(() => {
    onValidityChange?.(!needsHouseNumber);
  }, [needsHouseNumber, onValidityChange]);

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

      {baseAddress && !showPanel ? (
        <View style={styles.houseNumberBlock}>
          <Input
            type="text"
            label="House / flat number or name"
            placeholder="e.g. 12, Flat 3B, Rose Cottage"
            icon="home-outline"
            required
            value={houseNumber}
            error={
              houseNumber.trim()
                ? undefined
                : 'Add your house or flat number so couriers can find you.'
            }
            onChangeText={handleHouseNumberChange}
          />

          <Text style={styles.houseNumberHint} numberOfLines={2}>
            {houseNumber.trim()
              ? `${houseNumber.trim()} ${baseAddress}`
              : baseAddress}
          </Text>
        </View>
      ) : null}

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

  houseNumberBlock: {
    marginTop: -6,
    marginBottom: 14,
  },

  houseNumberHint: {
    marginTop: -8,
    marginBottom: 2,
    color: '#718399',
    fontSize: 12,
    lineHeight: 17,
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
