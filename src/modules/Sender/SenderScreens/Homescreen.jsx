import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import DashboardHeader from '../../../components/DashboardHeader';
import GuaranteeCard from '../../../components/Cards/GuaranteeCard';
import TravelerSearchCard from '../../../components/Cards/TravelerSearchCard';

const Homescreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <DashboardHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <TravelerSearchCard />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            My Parcels
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}>
            <Text style={styles.viewAllText}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No Parcels Yet
          </Text>

          <Text style={styles.emptyDescription}>
            Your parcel requests will appear here.
          </Text>
        </View>

        <GuaranteeCard
          title="Safe & Verified"
          description="Learn how Ezan Express insures every parcel up to"
          amountText="$500."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },

  emptyContainer: {
    width: '100%',
    minHeight: 170,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,

    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  emptyTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  emptyDescription: {
    marginTop: 6,

    fontSize: 13,
    color: '#7F8A99',

    textAlign: 'center',
  },
});