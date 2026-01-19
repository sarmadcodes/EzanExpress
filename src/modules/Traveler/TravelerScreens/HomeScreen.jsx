import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DashboardHeader from '../../../components/DashboardHeader'
import IncRequest from '../../../components/IncRequest'
import TravelComponent from '../../../components/TravelCompnent'

const HomeScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C'}}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <DashboardHeader />
      <ScrollView>
      <TravelComponent />
      <IncRequest />
      <Text style={{fontSize:16, color:'#ffffff3c', textAlign:'center', marginVertical:20, }}>Thats all for now, check back later</Text>
      </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})