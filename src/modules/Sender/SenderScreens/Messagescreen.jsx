import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackBar from '../../../components/BackBar'
import Messages from '../../../components/Messages'

const Messagescreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C', paddingHorizontal:15}}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <BackBar title='Messages' />
      <Messages />
    </SafeAreaView>
  )
}

export default Messagescreen

const styles = StyleSheet.create({})