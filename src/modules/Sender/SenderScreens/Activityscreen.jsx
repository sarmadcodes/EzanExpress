import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackBar from '../../../components/BackBar'
import LegalDocumentCard from '../../../components/Cards/LegalDocumentCard'

const Activityscreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C', paddingHorizontal:15}}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <BackBar title='Activity' />
      <View style={styles.sectionrow}>
          <Text style={{fontSize:16, fontWeight:'600', color:'#fff'}}>My Parcels</Text>
          <TouchableOpacity>
            <Text style={{fontSize:14, color:'#2563EB', fontWeight:'600'}}>View All</Text>
          </TouchableOpacity>
        </View>

          <View style={{width:"100%",height:200,justifyContent:"center",alignItems:"center"}}>
                     <Text style={{fontSize:14, color:'#2563EB', fontWeight:'600'}}>No Parcel</Text>
                    </View>

        {/* <LegalDocumentCard
  title="Legal Documents"
  status="Pending Match"
  documentId="#EZ-99120"
  fromCode="DXB"
  fromCity="Dubai"
  toCode="CDG"
  toCity="Paris"
  postedTime="Posted 2 hours ago"
/> */}
    </SafeAreaView>
  )
}

export default Activityscreen

const styles = StyleSheet.create({
  sectionrow: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:10,
  }
})