import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import countries from 'world-countries';
import {
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';

const CountryPicker = ({
  visible,
  onClose,
  onSelect,
  selectedCountryCode = 'US',
}) => {
  const [search, setSearch] = useState('');

  const countryList = useMemo(() => {
    const supportedCountries = new Set(
      getCountries(),
    );

    return countries
      .filter(country =>
        supportedCountries.has(country?.cca2),
      )
      .map(country => {
        let callingCode = '';

        try {
          callingCode =
            getCountryCallingCode(
              country.cca2,
            );
        } catch (error) {
          callingCode = '';
        }

        return {
          cca2: country.cca2,
          name:
            country?.name?.common ||
            country.cca2,
          flag:
            country?.flag || '🌐',
          callingCode,
        };
      })
      .filter(item => item.callingCode)
      .sort((a, b) =>
        a.name.localeCompare(b.name),
      );
  }, []);

  const filteredCountries =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return countryList;
      }

      const callingQuery =
        query.replace('+', '');

      return countryList.filter(
        country =>
          country.name
            .toLowerCase()
            .includes(query) ||
          country.cca2
            .toLowerCase()
            .includes(query) ||
          country.callingCode.includes(
            callingQuery,
          ),
      );
    }, [countryList, search]);

  const closePicker = () => {
    setSearch('');
    onClose?.();
  };

  const selectCountry = country => {
    onSelect?.(country);
    setSearch('');
    onClose?.();
  };

  const renderCountry = ({ item }) => {
    const selected =
      item.cca2 ===
      selectedCountryCode;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          selectCountry(item)
        }
        style={[
          styles.countryRow,
          selected &&
            styles.countryRowSelected,
        ]}
      >
        <View style={styles.flagBox}>
          <Text style={styles.flag}>
            {item.flag}
          </Text>
        </View>

        <View style={styles.countryInfo}>
          <Text
            numberOfLines={1}
            style={[
              styles.countryName,
              selected &&
                styles.selectedText,
            ]}
          >
            {item.name}
          </Text>

          <Text
            style={styles.countryIso}
          >
            {item.cca2}
          </Text>
        </View>

        <Text
          style={[
            styles.callingCode,
            selected &&
              styles.selectedCode,
          ]}
        >
          +{item.callingCode}
        </Text>

        {selected ? (
          <Ionicons
            name="checkmark-circle"
            size={21}
            color="#2A98FF"
            style={styles.check}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={closePicker}
    >
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.65)"
      />

      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={closePicker}
        />

        <SafeAreaView
          edges={['bottom']}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                Select country
              </Text>

              <Text
                style={styles.subtitle}
              >
                Choose your country and
                calling code
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={closePicker}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={22}
                color="#DCE6F3"
              />
            </TouchableOpacity>
          </View>

          <View
            style={styles.searchWrapper}
          >
            <Ionicons
              name="search-outline"
              size={19}
              color="#6F8095"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or code"
              placeholderTextColor="#5E6E82"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchInput}
            />

            {!!search && (
              <TouchableOpacity
                onPress={() =>
                  setSearch('')
                }
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#607187"
                />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={item =>
              item.cca2
            }
            renderItem={renderCountry}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContent
            }
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={
              <View
                style={styles.emptyState}
              >
                <Ionicons
                  name="globe-outline"
                  size={32}
                  color="#53657B"
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No country found
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(0,0,0,0.68)',
  },

  sheet: {
    height: '78%',
    backgroundColor: '#0B1422',

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#1E2D40',

    overflow: 'hidden',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -6,
        },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },

      android: {
        elevation: 24,
      },
    }),
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#2B3A4F',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F6F9FD',
    fontSize: 21,
    fontWeight: '700',
  },

  subtitle: {
    color: '#7F91A8',
    fontSize: 12,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: '#131F2F',

    borderWidth: 1,
    borderColor: '#223248',

    alignItems: 'center',
    justifyContent: 'center',
  },

  searchWrapper: {
    height: 50,

    marginHorizontal: 20,
    marginBottom: 10,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 13,

    borderWidth: 1,
    borderColor: '#1E2E42',

    backgroundColor: '#101B2B',
  },

  searchInput: {
    flex: 1,

    marginLeft: 9,

    paddingVertical: 0,

    color: '#F1F5F9',
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  countryRow: {
    minHeight: 64,

    marginVertical: 3,
    paddingHorizontal: 12,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: 'transparent',

    flexDirection: 'row',
    alignItems: 'center',
  },

  countryRowSelected: {
    backgroundColor:
      'rgba(30,144,255,0.08)',

    borderColor:
      'rgba(42,152,255,0.22)',
  },

  flagBox: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: '#142033',

    borderWidth: 1,
    borderColor: '#22334A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  flag: {
    fontSize: 24,
  },

  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },

  countryName: {
    color: '#DCE5F0',
    fontSize: 14,
    fontWeight: '600',
  },

  selectedText: {
    color: '#FFFFFF',
  },

  countryIso: {
    color: '#62748A',
    fontSize: 11,
    marginTop: 3,
  },

  callingCode: {
    color: '#98A9BC',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },

  selectedCode: {
    color: '#4BA5FF',
  },

  check: {
    marginLeft: 9,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
  },

  emptyTitle: {
    color: '#DDE6F1',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
});

export default CountryPicker;
