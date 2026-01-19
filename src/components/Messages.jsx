
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Messages = () => {
  const messages = [
    {
      id: 1,
      name: 'John Doe',
      message: 'Hey, how are you? I was just checking in to see how things are going with your project progress.',
      time: '12:15',
      count: 0,
      image: require('../assets/logo1.jpg'),
    },
    {
      id: 2,
      name: 'Sarah Khan',
      message: 'Project update: all tasks completed successfully!',
      time: '10:09',
      // count: 1,
      image: require('../assets/logo1.jpg'),
    },
    {
      id: 3,
      name: 'Michael Lee',
      message: 'Let’s meet tomorrow at the office to finalize the proposal.',
      time: '09:41',
      // count: 2,
      image: require('../assets/logo1.jpg'),
    },
    {
      id: 4,
      name: 'Ayesha Ahmed',
      message: 'Thanks for your help! Really appreciate your support on this.',
      time: 'Yesterday',
      // count: 3,
      image: require('../assets/logo1.jpg'),
    },
    
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {messages.map((item) => (
        <TouchableOpacity activeOpacity={0.75} key={item.id} style={styles.msgcard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <Image source={item.image} style={styles.msgimg} />
            <View style={{ maxWidth: '65%', maxHeight: 100 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text
                style={styles.message}
                numberOfLines={1}
                ellipsizeMode="tail" 
              >
                {item.message}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.time}>{item.time}</Text>
            {item.count > 0 && (
              <View style={styles.countbox}>
                <Text style={styles.countText}>{item.count}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  msgcard: {
    width: '100%',
    height: 80,
    backgroundColor: '#2D3F50',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  msgimg: {
    borderRadius: 100,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
  },
  name: {
    fontSize: 16,
    color: '#ffffffde',
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: '#7D7F88',
    fontWeight: '400',
  },
  time: {
    color: '#7D7F88',
    fontSize: 12,
    marginBottom: 4,
  },
  countbox: {
    backgroundColor: '#C4D600',
    borderRadius: 100,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#03257E',
  },
});
