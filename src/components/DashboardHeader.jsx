import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useNavigation } from '@react-navigation/native'

const DashboardHeader = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.header}>
      <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
        <Image source={require('../assets/logo1.jpg')} style={styles.profileicon} />
        <View>
            <Text style={styles.greeting}>Good Evening!</Text> 
            <Text style={styles.name}>Sahil</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications-circle-outline" size={25} color="#FFF" />
      </TouchableOpacity>
    </View>
  )
}

export default DashboardHeader

const styles = StyleSheet.create({
    header: {
        backgroundColor:'#0B121C',
        padding:15,
        borderBottomColor:'#777',
        borderBottomWidth:0.5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:10
    },
    profileicon: {
        width:50, 
        height:50, 
        borderRadius:50, 
        borderWidth:3, 
        borderColor:'#ddd'
    },
    greeting: {
        fontSize:15,
        color:'#ffffffde',

    },
    name: {
        fontSize:16,
        color:'#fff',
        fontWeight:'600'
    }
})