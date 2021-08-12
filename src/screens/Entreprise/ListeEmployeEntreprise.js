import { SafeAreaView,RefreshControl, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Feather, FontAwesome5 } from "@expo/vector-icons";
export default function ListeEmployeEntreprise({ navigation }) {
  const [data, setData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState("token");
  const [connecteduser,setconnecteduser]=useState(null);
  async function getconnecteduser() {
      const tokeen = await AsyncStorage.getItem('token');
  await axios.get("http://192.168.43.100:8090/demandeur/consulterDemandeur/"+tokeen).then(response => {
          setconnecteduser(response.data);
          fetchData(response.data.id);
          })
          } 
  const onRefresh = useCallback(() => {
    getconnecteduser();
    setRefreshing(true);
    setRefreshing(false);
  }, []);
  async function fetchData(id) {
    await axios.get("http://192.168.43.100:8090/entreprise/getListeDesEmployes/"+id, {}, {
      auth: {
        username: "user",
        password: "0000"
      }
    }).then((response) => {
      setData(response.data)
    });
  }
  useFocusEffect(
    React.useCallback(() => {
      getconnecteduser();
    }, [])
  );
  async function loadJWT() {
      const value = await AsyncStorage.getItem('token');
setToken(value);    }
  useEffect(() => {
    loadJWT();
      getconnecteduser();       
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl 
           refreshing={refreshing} 
           onRefresh={onRefresh}
           colors={["gray","orange"]} 
          />
      }
        renderItem={({ item }) =>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ProfileEmployeEntreprise', { item })}  >
           <Image style={styles.image} source={{ uri: item.image }} />
           <View style={{ flexDirection: "column", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              ></View>
              <View style={styles.text}>
                <View>
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}
                  >
                    {item.nom}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome
                      style={{ marginRight: 5, marginVertical: 10 }}
                      name="map-marker"
                      size={22}
                      color="#000"
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        opacity: 0.6,
                        fontWeight: "400",
                        textAlignVertical: "center",
                      }}
                    >
                      {item.addresse}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

          </TouchableOpacity>
          
        }
        
      />
  <TouchableOpacity style={styles.start} onPress={() => { navigation.navigate("AjoutPrestataireEmploye") }}>
                            <LinearGradient style={styles.start} colors={['#0dacfa', '#45d3f4', '#70e9ef']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }}>
                                <Text style={styles.textSign} >Ajouter un employé</Text>
                            </LinearGradient>

                        </TouchableOpacity>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:35,
  },
  action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 6,
    opacity: 0.6,

    alignItems: 'center'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
  textSign: {
    fontWeight: 'bold',
    color: '#fff'
},
  start: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal:5
},
  text: {
    flex: 2,
    color: 'black',
    alignItems: "flex-start",
    marginLeft: 10
  },
  image: {
    width: 100,
    height: 100
  }
});