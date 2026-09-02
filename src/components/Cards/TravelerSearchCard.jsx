import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {BASE_API_URI} from '../../constant/API';

const TravelerSearchCard = () => {
  const navigation = useNavigation();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const [fromAirports, setFromAirports] = useState([]);
  const [toAirports, setToAirports] = useState([]);

  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);

  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Airport Search
  |--------------------------------------------------------------------------
  */

  const searchAirports = async (query, type) => {
    const value = query.trim();

    if (value.length < 2) {
      if (type === 'from') {
        setFromAirports([]);
        setFromLoading(false);
      } else {
        setToAirports([]);
        setToLoading(false);
      }

      return;
    }

    try {
      if (type === 'from') {
        setFromLoading(true);
      } else {
        setToLoading(true);
      }

      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${BASE_API_URI}/airports/search`,
        {
          params: {
            q: value,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const airports =
        response?.data?.airports ||
        response?.data?.data?.airports ||
        [];

      if (type === 'from') {
        setFromAirports(airports);
      } else {
        setToAirports(airports);
      }
    } catch (error) {
      console.log(
        'SENDER AIRPORT SEARCH ERROR:',
        error?.response?.data || error?.message || error,
      );

      if (type === 'from') {
        setFromAirports([]);
      } else {
        setToAirports([]);
      }
    } finally {
      if (type === 'from') {
        setFromLoading(false);
      } else {
        setToLoading(false);
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | From Debounce
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      selectedFrom &&
      from === selectedFrom.displayValue
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (from.trim().length >= 2) {
        searchAirports(from, 'from');
        setShowFromSuggestions(true);
      } else {
        setFromAirports([]);
        setShowFromSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [from]);

  /*
  |--------------------------------------------------------------------------
  | To Debounce
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      selectedTo &&
      to === selectedTo.displayValue
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (to.trim().length >= 2) {
        searchAirports(to, 'to');
        setShowToSuggestions(true);
      } else {
        setToAirports([]);
        setShowToSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [to]);

  /*
  |--------------------------------------------------------------------------
  | Display Helpers
  |--------------------------------------------------------------------------
  */

  const getAirportCode = airport => {
    return (
      airport?.iata ||
      airport?.code ||
      airport?.icao ||
      ''
    );
  };

  const getDisplayValue = airport => {
    return [airport?.city, airport?.country]
      .filter(Boolean)
      .join(', ');
  };

  /*
  |--------------------------------------------------------------------------
  | Selection
  |--------------------------------------------------------------------------
  */

  const selectFromAirport = airport => {
    const displayValue = getDisplayValue(airport);

    setFrom(displayValue);

    setSelectedFrom({
      ...airport,
      displayValue,
    });

    setFromAirports([]);
    setShowFromSuggestions(false);
  };

  const selectToAirport = airport => {
    const displayValue = getDisplayValue(airport);

    setTo(displayValue);

    setSelectedTo({
      ...airport,
      displayValue,
    });

    setToAirports([]);
    setShowToSuggestions(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const isDisabled =
    !selectedFrom ||
    !selectedTo;

  const handleSearch = () => {
    if (isDisabled) {
      return;
    }

    const fromCode =
      getAirportCode(selectedFrom);

    const toCode =
      getAirportCode(selectedTo);

    if (
      fromCode &&
      toCode &&
      fromCode === toCode
    ) {
      return;
    }

    navigation.navigate('PassengerSearch', {
      from: selectedFrom,
      to: selectedTo,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Airport Suggestions
  |--------------------------------------------------------------------------
  */

  const renderSuggestions = (
    airports,
    loading,
    onSelect,
  ) => {
    return (
      <View style={styles.suggestions}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator
              size="small"
              color="#55A9FF"
            />

            <Text style={styles.loadingText}>
              Searching airports...
            </Text>
          </View>
        ) : airports.length > 0 ? (
          airports.map((airport, index) => {
            const code =
              getAirportCode(airport);

            return (
              <TouchableOpacity
                key={
                  airport?.id ||
                  airport?._id ||
                  airport?.icao ||
                  airport?.iata ||
                  `${airport?.name}-${index}`
                }
                activeOpacity={0.75}
                onPress={() => onSelect(airport)}
                style={[
                  styles.suggestionItem,

                  index !== airports.length - 1 &&
                    styles.suggestionBorder,
                ]}>
                <View style={styles.suggestionIcon}>
                  <Ionicons
                    name="airplane-outline"
                    size={17}
                    color="#55A9FF"
                  />
                </View>

                <View style={styles.suggestionInfo}>
                  <Text
                    numberOfLines={1}
                    style={styles.suggestionCity}>
                    {[airport?.city, airport?.country]
                      .filter(Boolean)
                      .join(', ') || 'Airport'}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.suggestionAirport}>
                    {airport?.name || ''}
                  </Text>
                </View>

                {code ? (
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeText}>
                      {code}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.loadingRow}>
            <Text style={styles.loadingText}>
              No airports found
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/ezan-globe.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover">

      {/* Dark Overlay */}
      <View
        pointerEvents="none"
        style={styles.backgroundOverlay}
      />

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.topLabel}>
          <Ionicons
            name="airplane-outline"
            size={13}
            color="#60A5FA"
          />

          <Text style={styles.topLabelText}>
            EZAN EXPRESS
          </Text>
        </View>

        <Text style={styles.heading}>
          Search for a Traveler
        </Text>

        <Text style={styles.subHeading}>
          Find verified travelers for fast delivery.
        </Text>

        <View style={styles.searchBox}>

          {/* FROM */}

          <View style={styles.fieldContainer}>
            <View style={styles.inputRow}>

              <View style={styles.inputIconBox}>
                <Ionicons
                  name="navigate-outline"
                  size={19}
                  color="#60A5FA"
                />
              </View>

              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>
                  FROM
                </Text>

                <TextInput
                  value={from}
                  onChangeText={value => {
                    setFrom(value);
                    setSelectedFrom(null);

                    setShowFromSuggestions(
                      value.trim().length >= 2,
                    );
                  }}
                  placeholder="Select City"
                  placeholderTextColor="#64748B"
                  style={styles.inputText}
                />
              </View>
            </View>

            {showFromSuggestions
              ? renderSuggestions(
                  fromAirports,
                  fromLoading,
                  selectFromAirport,
                )
              : null}
          </View>

          {/* Divider */}

          <View style={styles.routeDivider}>
            <View style={styles.dividerLine} />

            <View style={styles.routeIcon}>
              <Ionicons
                name="swap-vertical"
                size={15}
                color="#60A5FA"
              />
            </View>

            <View style={styles.dividerLine} />
          </View>

          {/* TO */}

          <View style={styles.fieldContainer}>
            <View style={styles.inputRow}>

              <View style={styles.inputIconBox}>
                <Ionicons
                  name="location-outline"
                  size={19}
                  color="#60A5FA"
                />
              </View>

              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>
                  TO
                </Text>

                <TextInput
                  value={to}
                  onChangeText={value => {
                    setTo(value);
                    setSelectedTo(null);

                    setShowToSuggestions(
                      value.trim().length >= 2,
                    );
                  }}
                  placeholder="Select City"
                  placeholderTextColor="#64748B"
                  style={styles.inputText}
                />
              </View>
            </View>

            {showToSuggestions
              ? renderSuggestions(
                  toAirports,
                  toLoading,
                  selectToAirport,
                )
              : null}
          </View>

          {/* SEARCH */}

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isDisabled}
            onPress={handleSearch}
            style={[
              styles.button,
              isDisabled &&
                styles.disabledButton,
            ]}>
            <Ionicons
              name="search"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default TravelerSearchCard;

const styles = StyleSheet.create({
  /*
  |--------------------------------------------------------------------------
  | Main Background
  |--------------------------------------------------------------------------
  */

  container: {
    width: '100%',

    borderRadius: 18,
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.12)',
  },

  backgroundImage: {
    borderRadius: 18,
  },

  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(3, 9, 18, 0.52)',

    borderRadius: 18,
  },

  content: {
    padding: 20,
  },

  /*
  |--------------------------------------------------------------------------
  | Heading
  |--------------------------------------------------------------------------
  */

  topLabel: {
    alignSelf: 'flex-start',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: 'rgba(7,17,31,0.72)',

    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.20)',

    marginBottom: 10,
  },

  topLabelText: {
    color: '#60A5FA',

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 0.8,
  },

  heading: {
    color: '#FFFFFF',

    fontSize: 27,
    fontWeight: '800',

    lineHeight: 34,

    marginBottom: 5,
  },

  subHeading: {
    color: '#CBD5E1',

    fontSize: 13,
    lineHeight: 20,

    marginBottom: 18,

    maxWidth: '88%',
  },

  /*
  |--------------------------------------------------------------------------
  | Search Box
  |--------------------------------------------------------------------------
  */

  searchBox: {
    backgroundColor: 'rgba(7,17,31,0.90)',

    borderRadius: 16,
    padding: 11,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },

  fieldContainer: {
    width: '100%',
  },

  inputRow: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 4,
  },

  inputIconBox: {
    width: 39,
    height: 39,

    borderRadius: 11,

    backgroundColor: 'rgba(37,99,235,0.15)',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  inputContent: {
    flex: 1,
  },

  inputLabel: {
    color: '#8292A8',

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 1,

    marginBottom: 1,
  },

  inputText: {
    width: '100%',

    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: '600',

    paddingVertical: 3,
    paddingHorizontal: 0,
  },

  /*
  |--------------------------------------------------------------------------
  | Route Divider
  |--------------------------------------------------------------------------
  */

  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 5,
  },

  dividerLine: {
    flex: 1,
    height: 1,

    backgroundColor: 'rgba(148,163,184,0.15)',
  },

  routeIcon: {
    width: 26,
    height: 26,

    marginHorizontal: 8,

    borderRadius: 8,

    backgroundColor: 'rgba(37,99,235,0.14)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
  |--------------------------------------------------------------------------
  | Search Button
  |--------------------------------------------------------------------------
  */

  button: {
    minHeight: 52,

    backgroundColor: '#2563EB',

    borderRadius: 12,

    marginTop: 13,

    flexDirection: 'row',

    gap: 8,

    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#263445',
    opacity: 0.85,
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '700',
  },

  /*
  |--------------------------------------------------------------------------
  | Suggestions
  |--------------------------------------------------------------------------
  */

  suggestions: {
    backgroundColor: '#0D1929',

    borderWidth: 1,
    borderColor: '#1D334D',

    borderRadius: 12,

    overflow: 'hidden',

    marginBottom: 8,
  },

  suggestionItem: {
    minHeight: 64,

    paddingHorizontal: 10,
    paddingVertical: 9,

    flexDirection: 'row',
    alignItems: 'center',
  },

  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#172A40',
  },

  suggestionIcon: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: 'rgba(39,142,245,0.10)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  suggestionInfo: {
    flex: 1,

    marginLeft: 10,
    marginRight: 7,
  },

  suggestionCity: {
    color: '#EEF4FB',

    fontSize: 12,
    fontWeight: '700',
  },

  suggestionAirport: {
    color: '#718399',

    fontSize: 10,

    marginTop: 3,
  },

  codeBadge: {
    minWidth: 43,
    height: 27,

    paddingHorizontal: 6,

    borderRadius: 8,

    backgroundColor: 'rgba(39,142,245,0.11)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  codeText: {
    color: '#65B1FF',

    fontSize: 10,
    fontWeight: '800',
  },

  loadingRow: {
    minHeight: 55,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 12,
  },

  loadingText: {
    color: '#7D91A8',

    fontSize: 11,

    marginLeft: 8,
  },
});