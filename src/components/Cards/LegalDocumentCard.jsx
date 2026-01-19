import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LegalDocumentCard = ({
  title,
  status,
  documentId,
  fromCode,
  fromCity,
  toCode,
  toCity,
  postedTime,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ParcelStatus')}
    style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>📄</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.id}>ID: {documentId}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeRow}>
        <View>
          <Text style={styles.code}>{fromCode}</Text>
          <Text style={styles.city}>{fromCity}</Text>
        </View>

        <Text style={styles.arrow}>→</Text>

        <View>
          <Text style={styles.code}>{toCode}</Text>
          <Text style={styles.city}>{toCity}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.time}>🕒 {postedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LegalDocumentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2936',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2B3A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 18,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  id: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#3B2F12',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  code: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  city: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },

  arrow: {
    color: '#9CA3AF',
    fontSize: 18,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },

  time: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
