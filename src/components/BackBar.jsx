import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

const BackBar = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}
      >
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View>
              <Ionicons
                name="chevron-back"
                size={30}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 30, height: 30 }} />
        )}

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#fff',
              fontFamily: 'Inter',
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BackBar;
