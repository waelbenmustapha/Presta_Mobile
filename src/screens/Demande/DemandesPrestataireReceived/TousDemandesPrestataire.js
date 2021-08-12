import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Picker,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
import { sendPushNotification } from "../../../Notifications/Notifications";

export default function getAllDemandesReçues({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [demandetype, setdemandetype] = useState(5);

  const [connecteduser, setconnecteduser] = useState(null);

  const responseListener = useRef();
  async function getconnecteduser() {
    const tokeen = await AsyncStorage.getItem("token");
    await axios
      .get("http://192.168.43.100:8090/demandeur/consulterDemandeur/" + tokeen)
      .then((response) => {
        setconnecteduser(response.data);
        demandesenattente(response.data.id);
      });
  }

  //fetch pending requests from api with prestataire id
  async function demandesenattente(id) {
    axios
      .get(
        "http://192.168.43.100:8090/demande/getAllDemandesReçues/" + id,
        {},
        {
          auth: {
            username: "user",
            password: "1f647d8b-f5d0-42a2-988c-ad7e3ec966c1",
          },
        }
      )
      .then((response) => {
        setData(response.data);
      });
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
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      "http://192.168.43.100:8090/demande/changerStatut/" +
        id +
        "/" +
        statut,
      {},
      config,
      {
        auth: {
          username: "user",
          password: "0000",
        },
      }
    );
    getconnecteduser();
  }
  //load data and token before rendering
  useEffect(() => {
    getconnecteduser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
       

        <View style={styles.footer}>
          <View
            style={{
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              opacity: 0.7,
              borderRadius: 45,
            }}
          >
            <Picker
              style={{ padding: 25 }}
              selectedValue={demandetype}
              onValueChange={(itemVal) => {
                if (itemVal != "10") {
                  setdemandetype(itemVal);
                }
              }}
            >
              <Picker.Item label="--Select--" value="10" key="10" />

              <Picker.Item label={"Toutes les demandes"} value={5} />
              <Picker.Item
                label={"Demandes en attente"}
                value={0}
              />
              <Picker.Item
                label={"Demandes acceptées"}
                value={1}
              />
              <Picker.Item
                label={"Demandes en cours"}
                value={2}
              />
              <Picker.Item
                label={"Demandes terminées"}
                value={3}
              />
              <Picker.Item
                label={"Demandes annulées"}
                value={-1}
              />
            </Picker>
          </View>
          <Modal visible={false} transparent={true}>
            <Text
              style={{
                textAlignVertical: "center",
                textAlignVertical: "center",
                fontSize: 50,
                textAlign: "center",
                color: "black",
                alignItems: "center",
                flex: 1,
              }}
            >
              Aucune Demande
            </Text>
          </Modal>

          <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
            keyExtractor={(item) => `key-${item.id}`}
            data={data}
            renderItem={({ item }) => (
              <View>
                {item.statut == demandetype||demandetype==5 ?
                <View>
                {item.statut == 0 ? (
                  <TouchableOpacity style={styles.item}>
                    <Text style={{backgroundColor:'white',borderColor:'#0dacfa',color:'#0dacfa',textAlign:'center',borderWidth:2,borderTopLeftRadius:15,borderTopRightRadius:15}}>Demande en attente</Text>

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


                 <View style={{ flex: 1, flexDirection: "row" }}>
                   <TouchableOpacity
                     style={{ flex: 1 }}
                     onPress={() => {
                       funcsaccepterourefuser(item.id, 1);
                       sendPushNotification(
                         item.demandeur.notification_token,
                         "Demande Accepté",
                         "demande pour Service " + item.nom + " est Accepté"
                       );
                     }}
                   >
                     <View style={styles.start1}>
                       <Text style={[styles.textSign1, { fontSize: 13 }]}>
                         Accepter
                       </Text>
                     </View>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={{ flex: 1 }}
                     onPress={() => {
                       funcsaccepterourefuser(item.id, -1);
                       sendPushNotification(
                         item.demandeur.notification_token,
                         "Demande annulée",
                         "demande pour Service " + item.nom + " est Refuser"
                       );
                     }}
                   >
                     <View style={styles.start}>
                       <Text style={[styles.textSign, { fontSize: 13 }]}>
                         Refuser
                       </Text>
                     </View>
                   </TouchableOpacity>
                 </View>
               </TouchableOpacity>
                ) : item.statut == 1 ? (
                  <TouchableOpacity style={styles.item}>
                    <Text style={{backgroundColor:'white',borderColor:'#0dacfa',color:'#0dacfa',textAlign:'center',borderWidth:2,borderTopLeftRadius:15,borderTopRightRadius:15}}>Demande acceptée</Text>

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
                  <View style={[styles.start,{backgroundColor:'white'}]} >
                    <Text style={[styles.textSign,{color:'#0dacfa'}]} >Commencer</Text>
                  </View>
                </TouchableOpacity> } 
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { funcsaccepterourefuser(item.id, -1);sendPushNotification(item.demandeur.notification_token, item.nom, "demande pour Service " + item.nom + " a commencée"); getconnecteduser(); }}>
                  <View style={styles.start} >
                    <Text style={styles.textSign} >Annuler</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {connecteduser.role =='Entreprise' ?
              <FlatList
               style={{borderWidth:2,borderColor:'#0dacfa',backgroundColor:'white',borderBottomLeftRadius:15,borderBottomRightRadius:15}}
              keyExtractor={(employe) => `key-${employe.id}`}
              data={item.employes}
              renderItem={({ item }) => 
              <TouchableOpacity style={{borderBottomWidth:1,borderColor:'#0dacfa',marginVertical:5,flexDirection:'row',margin:10}}><Image
              source={{ uri: item.image }}
              style={{ marginVertical:2,width: 40, height: 40, borderRadius: 40 / 2 }}
            /><Text style={{textAlignVertical:'center',flex:1,fontWeight:'600',padding:5}}>{item.nom}</Text><Text style={{textAlignVertical:'center'}}>{item.numeroTelephone}</Text></TouchableOpacity>}
              />:null}</TouchableOpacity>
                ) : item.statut == 2 ? (
                  <TouchableOpacity style={styles.item}>
<Text style={{backgroundColor:'white',borderColor:'#0dacfa',color:'#0dacfa',textAlign:'center',borderWidth:2,borderTopLeftRadius:15,borderTopRightRadius:15}}>Demande en cours</Text>
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
                    
                   
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { funcsaccepterourefuser(item.id, 3);getconnecteduser(); sendPushNotification(item.demandeur.notification_token, item.nom, "demande pour service " + item.nom + " est terminée"); }}>
                      <View style={[styles.start,{backgroundColor:'white'}]} >

                        <Text style={[styles.textSign,{color:'#0dacfa'}]} >Terminer</Text>
                      </View>
                    </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { funcsaccepterourefuser(item.id, -1);getconnecteduser(); sendPushNotification(item.demandeur.notification_token, item.nom, "demande pour service " + item.nom + " est annulée"); }}>
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
              />:null}
                </TouchableOpacity>
                ) : item.statut == 3 ? (
                  <TouchableOpacity style={styles.item}>
                                        <Text style={{backgroundColor:'white',borderColor:'#0dacfa',color:'#0dacfa',textAlign:'center',borderWidth:2,borderTopLeftRadius:15,borderTopRightRadius:15}}>Demande terminée</Text>
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
                  {item.feedback != null ? (
                      <View style={{backgroundColor:'white',borderWidth:2,borderColor:'#0dacfa',borderTopWidth:0,paddingHorizontal:15,paddingVertical:7,borderBottomRightRadius:15,borderBottomLeftRadius: 15,}}>
                        <View style={{alignSelf:'center'}}>
                          <StarRating
                      
                          disabled={true}
                          maxStars={5}
                          starSize={25}
                          fullStarColor={"gold"}
                          rating={item.feedback.note}
                        /></View><View style={{alignSelf:'center',flexDirection:'row'}}>
                        <Text   style={{
                          fontSize: 15,
                          color:'#0dacfa',
                          fontWeight:'600',
                        }}>{item.feedback.avis}</Text></View></View>
                  ) : null}
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
              />:null}
                </TouchableOpacity>
                ) : item.statut == -1 ? (
                  <TouchableOpacity style={styles.item}>
                                        <Text style={{backgroundColor:'white',borderColor:'#0dacfa',color:'#0dacfa',textAlign:'center',borderWidth:2,borderTopLeftRadius:15,borderTopRightRadius:15}}>Demande annulée</Text>
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
              />:null}
                </TouchableOpacity>
                ) : null}
              </View>:null}</View>
            )}
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
    flexDirection: "column",
    backgroundColor: "#0dacfa",
    margin: 10,
    marginVertical: 20,
    borderRadius: 15,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
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
    height: 100,
  },
  start: {
    flex: 1,
    backgroundColor: "#0dacfa",
    borderWidth: 2,
    borderColor: "white",
    height: 50,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  start1: {
    flex: 1,
    backgroundColor: "white",
    height: 50,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  header: {
    flex: 0.3,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingVertical:10,
  },
  footer: {
    flex: 2,
  paddingVertical:10,
    paddingHorizontal: 20,
  },
  text_header: {
    color: "#fff",
    paddingTop: 35,
    fontWeight: "bold",
    fontSize: 18,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 16,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 6,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  liste: {
    margin: 50,
    borderRadius: 13,
    backgroundColor: "#0dacfa",
  },

  textInput: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : -12,
    paddingLeft: 12,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {},
  textSign: {
    fontWeight: "bold",
    color: "#fff",
  },
  textSign1: {
    fontWeight: "bold",
    color: "#0dacfa",
  },
  icon: {
    margin: 4,
  },
});
