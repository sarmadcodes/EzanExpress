import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HowItWorksScreen = ({ navigation }) => {
  const FlowStep = ({ icon, title, subtitle, accent = '#2A98FF' }) => (
    <View style={styles.flowStep}>
      <View
        style={[
          styles.flowIcon,
          {
            backgroundColor: `${accent}15`,
            borderColor: `${accent}35`,
          },
        ]}
      >
        <Ionicons name={icon} size={24} color={accent} />
      </View>

      <Text style={styles.flowTitle}>{title}</Text>

      {subtitle ? (
        <Text style={styles.flowSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );

  const FlowArrow = ({ color = '#42566F' }) => (
    <View style={styles.arrowContainer}>
      <View style={[styles.arrowLine, { backgroundColor: color }]} />

      <Ionicons
        name="chevron-forward"
        size={15}
        color={color}
        style={styles.arrowIcon}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#08111D"
      />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>How it works</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.intro}>
          <View style={styles.introBadge}>
            <Ionicons
              name="swap-horizontal"
              size={16}
              color="#63B2FF"
            />

            <Text style={styles.introBadgeText}>
              SIMPLE PEER-TO-PEER DELIVERY
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            Someone needs to send.
            {'\n'}
            <Text style={styles.mainTitleHighlight}>
              Someone is already travelling.
            </Text>
          </Text>

          <Text style={styles.mainDescription}>
            Ezan Express connects them.
          </Text>
        </View>

        <View style={styles.connectionCard}>
          <View style={styles.connectionTop}>
            <View style={styles.personSide}>
              <View style={styles.senderPersonIcon}>
                <Ionicons
                  name="cube-outline"
                  size={29}
                  color="#62B2FF"
                />
              </View>

              <Text style={styles.personLabel}>SENDER</Text>

              <Text style={styles.personAction}>
                Wants to send
              </Text>
            </View>

            <View style={styles.connectionMiddle}>
              <View style={styles.connectionLine} />

              <View style={styles.ezanConnection}>
                <Ionicons
                  name="swap-horizontal"
                  size={21}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.connectionLine} />
            </View>

            <View style={styles.personSide}>
              <View style={styles.travelerPersonIcon}>
                <Ionicons
                  name="airplane-outline"
                  size={29}
                  color="#B096FF"
                />
              </View>

              <Text style={[
                styles.personLabel,
                styles.travelerLabel,
              ]}>
                TRAVELER
              </Text>

              <Text style={styles.personAction}>
                Is already travelling
              </Text>
            </View>
          </View>

          <View style={styles.simpleEquation}>
            <View style={styles.equationItem}>
              <Ionicons
                name="cube-outline"
                size={17}
                color="#62B2FF"
              />
              <Text style={styles.equationText}>Parcel</Text>
            </View>

            <Ionicons
              name="add"
              size={17}
              color="#53677E"
            />

            <View style={styles.equationItem}>
              <Ionicons
                name="airplane-outline"
                size={17}
                color="#B096FF"
              />
              <Text style={styles.equationText}>Trip</Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#53677E"
            />

            <View style={styles.equationItem}>
              <Ionicons
                name="location"
                size={17}
                color="#62D6A7"
              />
              <Text style={styles.equationText}>Delivered</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.senderMiniIcon}>
            <Ionicons
              name="cube-outline"
              size={19}
              color="#62B2FF"
            />
          </View>

          <View>
            <Text style={styles.sectionEyebrow}>IF YOU ARE A</Text>
            <Text style={styles.sectionTitle}>Sender</Text>
          </View>
        </View>

        <View style={[styles.flowCard, styles.senderFlowCard]}>
          <View style={styles.flowRow}>
            <FlowStep
              icon="cube-outline"
              title="Add parcel"
              subtitle="What you need sent"
            />

            <FlowArrow />

            <FlowStep
              icon="location-outline"
              title="Destination"
              subtitle="Where it needs to go"
            />

            <FlowArrow />

            <FlowStep
              icon="person-outline"
              title="Traveler"
              subtitle="Find a matching trip"
            />
          </View>

          <View style={styles.roleSummary}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={19}
                color="#62B2FF"
              />
            </View>

            <Text style={styles.summaryText}>
              You <Text style={styles.senderHighlight}>pay to send</Text> your
              parcel with a traveler heading towards your destination.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.travelerMiniIcon}>
            <Ionicons
              name="airplane-outline"
              size={19}
              color="#B096FF"
            />
          </View>

          <View>
            <Text style={styles.sectionEyebrow}>IF YOU ARE A</Text>
            <Text style={styles.sectionTitle}>Traveler</Text>
          </View>
        </View>

        <View style={[styles.flowCard, styles.travelerFlowCard]}>
          <View style={styles.flowRow}>
            <FlowStep
              icon="airplane-outline"
              title="Add trip"
              subtitle="Where you're going"
              accent="#B096FF"
            />

            <FlowArrow />

            <FlowStep
              icon="cube-outline"
              title="Carry"
              subtitle="Use spare luggage"
              accent="#B096FF"
            />

            <FlowArrow />

            <FlowStep
              icon="wallet-outline"
              title="Earn"
              subtitle="Get paid to deliver"
              accent="#B096FF"
            />
          </View>

          <View style={styles.roleSummary}>
            <View style={styles.travelerSummaryIcon}>
              <Ionicons
                name="cash-outline"
                size={19}
                color="#B096FF"
              />
            </View>

            <Text style={styles.summaryText}>
              You <Text style={styles.travelerHighlight}>earn money</Text> by
              carrying parcels on a trip you're already taking.
            </Text>
          </View>
        </View>

        <View style={styles.differenceCard}>
          <Text style={styles.differenceHeading}>
            The simple difference
          </Text>

          <View style={styles.differenceRows}>
            <View style={styles.differenceItem}>
              <View style={styles.differenceSenderIcon}>
                <Ionicons
                  name="cube-outline"
                  size={22}
                  color="#62B2FF"
                />
              </View>

              <View style={styles.differenceContent}>
                <Text style={styles.differenceRole}>Sender</Text>
                <Text style={styles.differenceAction}>
                  Has something to send
                </Text>
              </View>

              <View style={styles.paysBadge}>
                <Text style={styles.paysBadgeText}>PAYS</Text>
              </View>
            </View>

            <View style={styles.differenceDivider} />

            <View style={styles.differenceItem}>
              <View style={styles.differenceTravelerIcon}>
                <Ionicons
                  name="airplane-outline"
                  size={22}
                  color="#B096FF"
                />
              </View>

              <View style={styles.differenceContent}>
                <Text style={styles.differenceRole}>Traveler</Text>
                <Text style={styles.differenceAction}>
                  Has a trip & spare space
                </Text>
              </View>

              <View style={styles.earnsBadge}>
                <Text style={styles.earnsBadgeText}>EARNS</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.trustStrip}>
          <View style={styles.trustItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#5DAEFF"
            />
            <Text style={styles.trustText}>Verified identity</Text>
          </View>

          <View style={styles.trustDot} />

          <View style={styles.trustItem}>
            <Ionicons
              name="lock-closed-outline"
              size={17}
              color="#5DAEFF"
            />
            <Text style={styles.trustText}>Secure process</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111D',
  },

  header: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#111D2B',
    borderWidth: 1,
    borderColor: '#213248',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#EDF3FA',
    fontSize: 16,
    fontWeight: '700',
  },

  headerPlaceholder: {
    width: 39,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  intro: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 24,
  },

  introBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(42,152,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(98,178,255,0.16)',
  },

  introBadgeText: {
    color: '#6DB7FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 6,
  },

  mainTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 35,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: -0.5,
  },

  mainTitleHighlight: {
    color: '#83BEFA',
  },

  mainDescription: {
    color: '#7E91A9',
    fontSize: 14,
    marginTop: 8,
  },

  connectionCard: {
    backgroundColor: '#111C2A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#203147',
    padding: 17,
    marginBottom: 27,
  },

  connectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  personSide: {
    width: '30%',
    alignItems: 'center',
  },

  senderPersonIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(42,152,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(98,178,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  travelerPersonIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(176,150,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  personLabel: {
    color: '#62B2FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 9,
  },

  travelerLabel: {
    color: '#B096FF',
  },

  personAction: {
    color: '#8597AD',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 3,
  },

  connectionMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  connectionLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#324860',
  },

  ezanConnection: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1687F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  simpleEquation: {
    minHeight: 47,
    marginTop: 17,
    borderRadius: 13,
    backgroundColor: '#0B1522',
    borderWidth: 1,
    borderColor: '#1C2B3E',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  equationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  equationText: {
    color: '#A7B5C6',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  senderMiniIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: 'rgba(42,152,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  travelerMiniIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.11)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionEyebrow: {
    color: '#667A92',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  sectionTitle: {
    color: '#F3F7FC',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 1,
  },

  flowCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 26,
    borderWidth: 1,
  },

  senderFlowCard: {
    backgroundColor: 'rgba(21,45,70,0.42)',
    borderColor: 'rgba(70,150,230,0.18)',
  },

  travelerFlowCard: {
    backgroundColor: 'rgba(42,30,71,0.38)',
    borderColor: 'rgba(155,120,240,0.18)',
  },

  flowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  flowStep: {
    width: '27%',
    alignItems: 'center',
  },

  flowIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  flowTitle: {
    color: '#EDF3F9',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },

  flowSubtitle: {
    color: '#71849A',
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 3,
  },

  arrowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },

  arrowLine: {
    height: 1,
    flex: 1,
  },

  arrowIcon: {
    marginLeft: -6,
  },

  roleSummary: {
    minHeight: 57,
    borderRadius: 13,
    backgroundColor: 'rgba(5,12,21,0.32)',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(42,152,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  travelerSummaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryText: {
    flex: 1,
    color: '#A0B0C1',
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 10,
  },

  senderHighlight: {
    color: '#67B4FF',
    fontWeight: '800',
  },

  travelerHighlight: {
    color: '#B59BFF',
    fontWeight: '800',
  },

  differenceCard: {
    backgroundColor: '#111C2A',
    borderWidth: 1,
    borderColor: '#203147',
    borderRadius: 18,
    padding: 15,
    marginBottom: 17,
  },

  differenceHeading: {
    color: '#F2F6FB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 13,
  },

  differenceRows: {
    backgroundColor: '#0B1522',
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  differenceItem: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
  },

  differenceSenderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(42,152,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  differenceTravelerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  differenceContent: {
    flex: 1,
    marginLeft: 11,
  },

  differenceRole: {
    color: '#EAF0F7',
    fontSize: 13,
    fontWeight: '700',
  },

  differenceAction: {
    color: '#718399',
    fontSize: 10,
    marginTop: 3,
  },

  differenceDivider: {
    height: 1,
    backgroundColor: '#1B2A3D',
  },

  paysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(42,152,255,0.11)',
  },

  paysBadgeText: {
    color: '#62B2FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  earnsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(139,92,246,0.13)',
  },

  earnsBadgeText: {
    color: '#B096FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  trustStrip: {
    minHeight: 51,
    borderRadius: 14,
    backgroundColor: '#0D1724',
    borderWidth: 1,
    borderColor: '#1D2C3F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trustText: {
    color: '#7F92A8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },

  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#3A4C61',
    marginHorizontal: 15,
  },
});

export default HowItWorksScreen;
