import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';


const item = {
  title: 'Electronics Box',
  category: 'Electronics',
  weight: '2.5kg',
  price: '$45.00',
  location: 'Terminal 4 (2km away)',
  status: 'NEW',
  urgencyText: 'Expiring soon',
  urgencyType: 'urgent',
  image: 'https://w7.pngwing.com/pngs/820/850/png-transparent-ipkg-packaging-and-labeling-box-parcel-box-miscellaneous-freight-transport-service-thumbnail.png',
};

const IncomingRequestBlock = () => {
  const navigation = useNavigation();
  const isUrgent = item.urgencyType === 'urgent';

  return (
    <View>

      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Incoming Requests</Text>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={16} color="#7AA2C5" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('RequestDetails')}
       style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>

              {item.status && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              )}
            </View>

            <Text style={styles.itemSubtext}>
              {item.category} • {item.weight}
            </Text>

            <View style={styles.urgencyRow}>
              <Ionicons
                name={isUrgent ? 'flame' : 'time-outline'}
                size={14}
                color={isUrgent ? '#FF8C00' : '#7AA2C5'}
              />
              <Text
                style={[
                  styles.urgencyText,
                  isUrgent ? styles.textUrgent : styles.textTime,
                ]}
              >
                {item.urgencyText}
              </Text>
            </View>
          </View>

          {/* <Text style={styles.priceText}>{item.price}</Text> */}
        </View>

        {/* <View style={styles.locationBar}>
          <Ionicons name="location-outline" size={14} color="#7AA2C5" />
          <Text style={styles.locationText}>
            Pickup: {item.location}
          </Text>
        </View> */}

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.navigate('RequestRejected')}
          style={styles.rejectButton}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RequestAccepted')}
          style={styles.acceptButton}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

    </View>
  );
};

export default IncomingRequestBlock;

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3F50',
  },
  filterText: {
    color: '#7AA2C5',
    marginLeft: 6,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#16222F',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#233242',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#003366',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#3399FF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemSubtext: {
    color: '#7AA2C5',
    fontSize: 14,
    marginTop: 4,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  urgencyText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  textUrgent: { color: '#FF8C00' },
  textTime: { color: '#7AA2C5' },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1520',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3F50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    color: '#7AA2C5',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
