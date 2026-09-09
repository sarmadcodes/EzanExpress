import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';

const PaymentSlip = () => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
        <BackBar title='Reciept' />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image style={{width:100, height:80}} source={require('../assets/logo1.jpg')} />
            <Text style={styles.thankYouText}>Thank you for using our services</Text>
          </View>

          <View style={styles.codeBanner}>
            <Text style={styles.codeBannerText}>Your Parcel Code: [CODE_HERE]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.labelLine}>Transaction Number: _________________</Text>
            <Text style={styles.labelLine}>Transaction Date & Time: ______________</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sender’ Details</Text>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>Name: ______________________</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>Mobile: _____________________</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>City & Country: ___________________</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>Type of Parcel: <Text style={styles.underlineText}>Cultural foods</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>Weight of Parcel: <Text style={styles.underlineText}>10kg</Text></Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passenger’s Details</Text>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>Name: ______________________</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>Mobile: _____________________</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>Address: <Text style={styles.underlineText}>Wood Green, London, UK</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>Flight from/to: <Text style={styles.underlineText}>London to New Delhi</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>
                Flight Date: <Text style={styles.underlineText}>London Sat. 20 Dec. 2025, 5pm. New Delhi Sun 21 Dec 2025, 3am</Text>
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment and Code</Text>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.infoText}>Amount Paid: <Text style={styles.boldText}>£38</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.labelLine}>Parcel Code: _______________</Text>
            </View>
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              Please do not give the parcel code to the passenger prior to delivering your parcel to the receiver.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
    paddingHorizontal:15,
  },
  scrollContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    minHeight: 600,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  thankYouText: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  codeBanner: {
    backgroundColor: '#000',
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    lineHeight: 22,
  },
  labelLine: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    lineHeight: 20,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  boldText: {
    fontWeight: 'bold',
  },
  footerNote: {
    marginTop: 10,
    borderTopWidth: 0.5,
    paddingTop: 15,
  },
  footerNoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default PaymentSlip;
