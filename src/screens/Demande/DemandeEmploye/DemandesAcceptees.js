import React, { useCallback, useEffect, useState } from 'react';
import { FlatList,Picker,Image, Modal, View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesome,MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient';
import { sendPushNotification } from '../../../Notifications/Notifications'

export default function AcceptationDemande({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [demandetype,setdemandetype]=useState('default value');
  const [connecteduser,setconnecteduser]=useState(null);

  async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem('token');
await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+tokeen).then(response => {
        setconnecteduser(response.data);
        demandesenattente(response.data.id);
        })
        
        } 
  //fetch pending requests from api with prestataire id
  async function demandesenattente(id) {

    axios.get("http://192.168.43.100:8090/demande/demandeEmploye/"+id+"/1", {}, {
      auth: {
        username: "user",
        password: "1f647d8b-f5d0-42a2-988c-ad7e3ec966c1"
      }
    })
      .then((response) => {
        setData(response.data);
      })


  }

  //refresh page function
  const onRefresh = useCallback(() => {
    getconnecteduser();

    setRefreshing(true);
    setRefreshing(false);

  }, []);


  //accepter ou refuser la demande avec a l'id de demande
  async function funcsaccepterourefuser(id, statut) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    await axios.put("http://192.168.43.100:8090/demande/changerStatut/" + id + "/" + statut, {}, config, {
      auth: {
        username: "user",
        password: "0000"
      }
    })
    getconnecteduser();
  };
  //load data and token before rendering
  useEffect(() => {


    getconnecteduser();
   
  }, []);

  return (

    <SafeAreaView style={styles.container}>
        <View style={styles.footer}>
        <View style={{backgroundColor:'white',borderColor:'black',borderWidth:1,opacity:0.7,borderRadius:45}}>
        <Picker style={{padding:25}}
                            selectedValue={demandetype}
                            onValueChange={(itemVal) => {  if (itemVal != "0") {
                                    setdemandetype(itemVal);
                                    navigation.replace(itemVal);
                                  }}}>
<Picker.Item label="--Select--" value="0" key="0" />
<Picker.Item label={"Demandes acceptées"} value={"DemandesAcceptees"}/>
<Picker.Item label={"Demandes en cours"} value={"DemandesEnCours"} />
<Picker.Item label={"Demandes terminées"} value={"DemandesTerminees"} />
<Picker.Item label={"Demandes annulées"} value={"DemandesAnnulees"} />
                           
                        </Picker></View>
            <Modal visible={false}
              transparent={true}>
              <Text style={{ textAlignVertical: 'center', textAlignVertical: 'center', fontSize: 50, textAlign: 'center', color: 'black', alignItems: 'center', flex: 1 }}>Aucune Demande</Text>
            </Modal>

            <FlatList
              keyExtractor={(item) => `key-${item.id}`}
              data={data}
              renderItem={({ item }) => 
              <TouchableOpacity style={styles.item}>
               <View
                      style={{
                        marginVertical: 5,
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 15,
                      }}
                    >
                      <Image
                        source={{ uri: item.demandeur.image }}
                        style={{ width: 60, height: 60, borderRadius: 60 / 2 }}
                      />
                      <Text
                        style={[
                          styles.text,
                          { textAlignVertical: "center", marginHorizontal: 10,fontWeight:'600',fontSize:18 },
                        ]}
                      >
                        {item.demandeur.nom}
                      </Text>
                    </View><View style={{ flex: 1, flexDirection: "row" }}>
                      <Image
                        tintColor="white"
                        style={{
                          margin: 15,
                          width: 28,
                          height: 28,
                          overflow: "hidden",
                        }}
                        source={{ uri: item.service.icone }}
                      />
                      <Text
                        style={[
                          styles.text,
                          { textAlignVertical: "center", marginHorizontal: 0 },
                        ]}
                      >
                        {item.nom}
                      </Text>
                    </View>
                    
                    <View
                      style={{
                        marginVertical: 5,
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 15,
                      }}
                    >
                      <FontAwesome5
                        style={{ alignSelf: "center" }}
                        name="clock"
                        size={18}
                        color="white"
                      />
                      <Text
                        style={[
                          styles.text,
                          { textAlignVertical: "center", marginHorizontal: 10 },
                        ]}
                      >
                        {item.date_debut}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 15,
                      }}
                    >
                      <MaterialIcons
                        style={{ alignSelf: "center" }}
                        name="description"
                        size={18}
                        color="white"
                      />
                      <Text
                        style={[
                          styles.text,
                          { textAlignVertical: "center", marginHorizontal: 10 },
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 15,
                      }}
                    >
                      <FontAwesome5
                        style={{ alignSelf: "center" }}
                        name="phone-alt"
                        size={18}
                        color="white"
                      />
                      <Text
                        style={[
                          styles.text,
                          { textAlignVertical: "center", marginHorizontal: 10 },
                        ]}
                      >
                        {item.demandeur.numero_telephone}
                      </Text>
                    </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
               {connecteduser.role =='Entreprise' ? <TouchableOpacity style={{ flex: 1 }} onPress={() => {navigation.navigate('AffectationEmployesDemande',{item})}} >
                  <View style={styles.start} >
                    <Text style={styles.textSign} >Affecter à</Text>
                  </View>
                 
                </TouchableOpacity> 
:
<TouchableOpacity style={{ flex: 1 }} onPress={() => {funcsaccepterourefuser(item.id,2)}} >
                  <View style={styles.start} >

                    <Text style={styles.textSign} >Commencer</Text>
                  </View>
                </TouchableOpacity> } 
              
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { funcsaccepterourefuser(item.id, -1);sendPushNotification(item.demandeur.notification_token, item.nom, "L'entreprise a commencé l'exécution de votre demande de service de " + item.nom ); getconnecteduser(); }}>
                  <View style={styles.start} >

                    <Text style={styles.textSign} >Annuler</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {connecteduser.role =='Entreprise' ?
              <FlatList
               style={{backgroundColor:'white',borderBottomLeftRadius:15,borderBottomRightRadius:15}}
              keyExtractor={(employe) => `key-${employe.id}`}
              data={item.employes}
              renderItem={({ item }) => 
              <TouchableOpacity style={{borderBottomWidth:1,marginVertical:5,flexDirection:'row',margin:10}}><Image
              source={{ uri: item.image }}
              style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
            /><Text style={{textAlignVertical:'center',flex:1,fontWeight:'600',padding:5}}>{item.nom}</Text><Text style={{textAlignVertical:'center'}}>{item.numeroTelephone}</Text></TouchableOpacity>}
              />:null}</TouchableOpacity>
              }
            />
          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,     

  },
  item: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0dacfa',
    margin: 10,
    marginVertical: 20,
    borderRadius: 15,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
  text: {
    flex: 1,
    color: "#fff",
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 13,
  },
  image: {
    width: 100,
    height: 100
  },
  start: {
    flex: 1,
    backgroundColor: '#0dacfa',
    borderWidth: 2,
    borderColor: 'white',
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  }, start1: {
    flex: 1,
    backgroundColor: 'white',
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  header: {
    flex: 0.3,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    paddingTop: 40,
    fontWeight: 'bold',
    fontSize: 18
  },
  text_footer: {
    color: '#05375a',
    fontSize: 16
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 6
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
  },
  liste: {
    margin: 50,
    borderRadius: 13,
    backgroundColor: "#0dacfa"
  },

  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -12,
    paddingLeft: 12,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
  },
  textSign: {
    fontWeight: 'bold',
    color: '#fff',
  },
  textSign1: {
    fontWeight: 'bold',
    color: '#0dacfa',
  },
  icon: {
    margin: 4
  }

});