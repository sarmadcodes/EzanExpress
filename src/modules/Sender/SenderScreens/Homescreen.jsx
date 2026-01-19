import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DashboardHeader from '../../../components/DashboardHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import GuaranteeCard from '../../../components/Cards/GuaranteeCard'
import TravelerSearchCard from '../../../components/Cards/TravelerSearchCard'
import QuickActionCard from '../../../components/Cards/QuickActionCard'
import LegalDocumentCard from '../../../components/Cards/LegalDocumentCard'

const Homescreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C'}}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <DashboardHeader />
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal:15}}>
        <TravelerSearchCard />
        <QuickActionCard />

        <View style={styles.sectionrow}>
          <Text style={{fontSize:16, fontWeight:'600', color:'#fff'}}>My Parcels</Text>
          <TouchableOpacity>
            <Text style={{fontSize:14, color:'#2563EB', fontWeight:'600'}}>View All</Text>
          </TouchableOpacity>
        </View>

        <LegalDocumentCard
  title="Legal Documents"
  status="Pending Match"
  documentId="#EZ-99120"
  fromCode="DXB"
  fromCity="Dubai"
  toCode="CDG"
  toCity="Paris"
  postedTime="Posted 2 hours ago"
/>
<LegalDocumentCard
  title="Electronics Box"
  status="Pending Match"
  documentId="#IT-89220"
  fromCode="ISL"
  fromCity="Islamabad"
  toCode="NY"
  toCity="New York"
  postedTime="Posted 1 day ago"
/>

        <GuaranteeCard
          title="Safe & Verified"
          description="Learn how Ezan Express insures every parcel up to"
          amountText="$500."
        />

      </ScrollView>

    </SafeAreaView>
  )
}

export default Homescreen

const styles = StyleSheet.create({
  sectionrow: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:10,
  }
})