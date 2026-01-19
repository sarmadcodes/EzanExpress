import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackBar from '../components/BackBar'

const Notifications = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C', paddingHorizontal:15}}>
        <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
        <BackBar title='Notifications' />
        <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:16, color:'#ffffffbe'}}>No Notifications!</Text>
        </View>

    </SafeAreaView>
  )
}

export default Notifications

const styles = StyleSheet.create({})