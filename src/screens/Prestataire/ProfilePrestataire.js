import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,

  TouchableOpacity,
  Alert,
} from "react-native";
import { Rating } from 'react-native-ratings';
import React, { useEffect, useState } from "react";
import {  AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from 'react-native-elements'

import {
  FontAwesome,
  MaterialIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
export default function ProfilePrestataire({ route, navigation }) {
  const [noteglobale,setnoteglobale]=useState(0);
  const [feedback,setfeedbacks]=useState(null);
  const [connecteduser,setconnecteduser]=useState(null);
const [i,seti]=useState(0);
  async function getconnecteduser() {
    
      const tokeen = await AsyncStorage.getItem('token');
      if(tokeen){
  await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+tokeen).then(response => {
          setconnecteduser(response.data);
          })
          }
          else {setconnecteduser('notconnected');} 
        }
  const fetchData = async () => {
    getconnecteduser();
    const result = await axios(
      "http://192.168.43.100:8090/demande/getAllFeedback/"+`${route.params.prestataire.id}`,
    );
    setfeedbacks(result.data);
    if(result.data.length>0){
      setnoteglobale(prevState => prevState -prevState);
    let i=0;
    for (let userObject of result.data) {
      i++;
      setnoteglobale(prevState => prevState + userObject.feedback.note);
  }
  seti(i);
  setnoteglobale(prevState => prevState/i);
  }    
  ;}


  useEffect(() => {
    fetchData();
  }, []);
    if (feedback==null){
        return(
          <View style={styles.overlayy}>
          <View style={styles.containerr}>
          <ActivityIndicator color={'black'}/>
          <Text style={styles.textt}>Loading...</Text>
          </View>
          </View>
        );
    } 
    else 
  return (
    
    <View style={{ flex: 1,backgroundColor:'white',marginTop:3}}>
      <View style={styles.header}>
        <Text style={styles.name}>{route.params.prestataire.nom}</Text>
      </View>
      <Image
        style={styles.avatar}
        source={{ uri: route.params.prestataire.image }}
      />
      <View style={{ flex: 1, marginTop: 40 }}>
      <View style={{marginVertical:20,justifyContent:'center',alignSelf:'center'}}>
<Text style={{textAlign:'center',paddingVertical:5}}>Note globale  {noteglobale.toFixed(1)}/5 ({i} reviews)</Text>
<Rating
  startingValue={noteglobale}
  readonly={true}
  imageSize={28}
/>

</View>
<View style={{flex:3}}>

<Text style={{textAlign:'center'}}>Reviews</Text>
     <ScrollView style={{marginBottom:10}}>
         {
  feedback.map((l, index) => ( 
<TouchableOpacity key={index} style={[styles.card, {borderColor:"#0dacfa",borderWidth:2}]}>
    <View style={[styles.cardContent]}>
    <View style={{flexDirection:'row'}}>
      <Image style={[styles.image, styles.imageContent]} source={{uri: l.demandeur.image}}/>
      <Text style={{marginTop:-40,fontSize:16,fontWeight:'bold',color:'white',opacity:0.8}}>{l.demandeur.nom}</Text></View>
      <View style={{flexDirection:'column',flex:1}}>
  <View style={{flexDirection:'row',alignSelf:'flex-end',paddingHorizontal:10,paddingVertical:5}}>
  <Image
                        style={{
                          width: 28,
                          height: 28,
                        }}
                        source={{ uri: l.service.icone }}
                      /><Text style={{flex:1,textAlignVertical:"center",justifyContent:'flex-start',paddingHorizontal:5}}>{l.nom}</Text>
  <Rating
  startingValue={l.feedback.note}
  readonly={true}
style={{                          marginTop:-30,
}}
  imageSize={25}
/>
</View>
<View style={{flexDirection:'row',paddingHorizontal:10}}>
<Icon
  name='description'
  type='material'
  color='#0dacfa'
/>

<Text style={{flex:1,fontSize:15,fontWeight:'600',opacity:0.6}}>{l.feedback.avis}</Text>

</View></View></View></TouchableOpacity>))
}
        

             
              </ScrollView>
</View>

        {connecteduser=='notconnected' ?
                           <View style={styles.button}> 
                           <TouchableOpacity  onPress={() => {
                           Alert.alert("Vous devez d'abord vous connecter");navigation.navigate("LoginDemandeur")
                          }}>
                             <LinearGradient  colors={['#f5f7fa', '#b8c6db', '#b8c6db' ]}  start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startt}  >
                                   <Text style={styles.textSign}>Demander service</Text>
                                 <AntDesign style={styles.icon} name="rightcircle" size={20} color="#fff" />
                             </LinearGradient>
                          </TouchableOpacity></View>
                            : <View style={styles.button}> 
                            <TouchableOpacity  onPress={() => {
                            navigation.navigate('Passerdemande', { prestataire:route.params.prestataire,service: route.params.service});
                           }}>
                              <LinearGradient  colors={['#0dacfa', '#45d3f4', '#70e9ef' ]}  start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startt}  >
                                    <Text style={styles.textSign}>Demander service</Text>
                                  <AntDesign style={styles.icon} name="rightcircle" size={20} color="#fff" />
                              </LinearGradient>
                           </TouchableOpacity></View>}
                        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    borderTopRightRadius:55,
    height: 130,
  },
  buttonmlouta: { flex: 1 },
  scrollview: { flex: 2 },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 65,
  },
  button: {
paddingHorizontal:15,    
  },
  startt: {
    height: 50,
    width:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#fff'
},
  start: {
    width: '100%',
    height: 45,
    
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
},textSign: {
  marginHorizontal:10,
  fontWeight: 'bold',
  color: '#fff'
},
containerr: {
  
  backgroundColor: 'white',
  flexDirection: 'row',
  padding: 20,
  borderRadius: 8,
},
overlayy: {
  ...StyleSheet.absoluteFill,
  backgroundColor: '#45d3f4',
  alignItems: 'center',
  justifyContent: 'center',
},
textt: {
  marginLeft: 16,
  fontSize: 18,
  fontWeight: '500',
},
  card: {
    height:null,
    paddingTop:10,
    paddingBottom:10,
    marginTop:5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopWidth:40,
    marginBottom:20,
  },
  cardContent:{
    flex:1,
    flexDirection:'column',
    marginLeft:10, 
  },
  imageContent:{
    marginTop:-40,
  },
  image:{
    width:60,
    height:60,
    borderRadius:30,
  },
  namee:{
    fontSize:20,
    fontWeight: '600',
    marginLeft:10,
    color:'black',
    opacity:0.8,
    alignSelf: 'center'
  },
  body: {
    flex: 1,
    marginTop: 30,
  },
  bodyContentmlfou9: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 23,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
    color: "white",
    opacity: 0.8,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttoncontainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
});
