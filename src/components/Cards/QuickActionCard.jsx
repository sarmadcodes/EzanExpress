import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'

const QuickActionCard = () => {
  return (
    <View style={{marginVertical:10}}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:5}}>
        <View style={styles.card}>
            <Ionicons name="aperture-outline" size={33} color="#ffffffde" />
            <Text style={styles.text}>Get Quote</Text>
        </View>
        <View style={styles.card}>
            <Ionicons name="search" size={33} color="#ffffffde" />
            <Text style={styles.text}>Search</Text>
        </View>
        <View style={styles.card}>
            <Ionicons name="calculator-outline" size={33} color="#ffffffde" />
            <Text style={styles.text}>Price Calc</Text>
        </View>
      </View>
    </View>
  )
}

export default QuickActionCard

const styles = StyleSheet.create({
    title: {
        fontSize:16,
        color:'#fff',
        fontWeight:'600',
        marginVertical:5
    },
    card: {
        justifyContent:'center',
        alignItems:'center',
        gap:5,
        padding:10,
        backgroundColor:'#55555569',
        borderRadius:15,
        width:'31%',
        height:110,
    },
    text: {
        fontSize:14, 
        color:'#ffffffde',
        textAlign:'center',
        fontWeight:'600'
    }
})