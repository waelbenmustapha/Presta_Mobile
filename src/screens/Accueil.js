import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { FlatList,ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import { FontAwesome, Feather,  FontAwesome5 } from '@expo/vector-icons';


export default function Accueil({navigation}) {

  const[searched,setsearched]=useState();
 const [categories,setCategories]=useState([{}]);
 const [services,setServices]=useState([{}]);
 const [prestataires,setPrestataires]=useState([{note:0}]);
 useEffect(() => {
    getcategories();
    getservices();
    getprestataires();
    
}, []);
async function getcategories() {
   await axios.get("http://192.168.43.100:8090/categorie/populaire", {}, {
        auth: {
            username: "user",
            password: "0000"
        }
    })
        .then((response) => {
            setCategories(response.data)
        })
}
async function getservices() {
  await axios.get("http://192.168.43.100:8090/service/populaire", {}, {
        auth: {
            username: "user",
            password: "0000"
        }
    })
        .then((response) => {
            setServices(response.data)
        })
}
async function getprestataires() {
  await  axios.get("http://192.168.43.100:8090/prestataire/populaire", {}, {
        auth: {
            username: "user",
            password: "0000"
        }
    })
        .then((response) => {
            setPrestataires(response.data)
        })
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.action}><TextInput
          style={{flex:1,marginHorizontal: 10,height:35 }}
          mode="outlined"
          label="De quoi avez vous besoin?"
          onChangeText={text => setsearched(text)}
        />
        </View>
        <TouchableOpacity style={{ alignSelf: 'center' }}
          onPress={() => navigation.navigate('RechercheService', { searched: searched })}><Icon style={{ marginRight: 10 }} color='#0dacfa' name='search' type='font-awesome' size={30} />
          </TouchableOpacity></View>
          <Text style={styles.text_header}>Catégories</Text>
          <View>
          <FlatList
          horizontal={true}
          data={categories}
          keyExtractor={(item) => `key-${item.id}`}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ListeService', { item })}  >
              <Image style={styles.image} resizeMode='contain' source={{ uri : item.icone }} />
              <Text style={{color:'white',fontSize:13,textAlign:'center'}}>{item.nom}</Text>
            </TouchableOpacity>
          }
        />
        </View>
        <Text style={styles.text_header}>Services à proposer</Text>
        <FlatList
          horizontal={true}
          data={services}
          keyExtractor={(item) => `key-${item.id}`}
          renderItem={({ item }) =>
          <TouchableOpacity onPress={() => navigation.navigate('ListePrestataire', { item })}
          style={[styles.items, item.empty ? styles.iteminvisibleservice : styles.itemservice]} >
          <Image style={styles.imageservice} resizeMode='contain' source={{ uri:item.icone }} />
          <Text style={styles.textservice}>{item.nom}</Text>
        </TouchableOpacity>
          }
        />
          <Text style={styles.text_header}>Prestataires plus notés</Text>
        <FlatList
          horizontal={true}
          data={prestataires}
          keyExtractor={(item) => `key-${item.id}`}
  renderItem={({ item }) =>
         
          <TouchableOpacity style={styles.itemprestataire} >
          <Image style={styles.imageprestataire} source={{ uri: item.image }} />
          <View style={{flexDirection:'column',flex:1}}>
            <View style={{flexDirection:'row',alignSelf:'flex-end',paddingHorizontal:10,paddingVertical:3}}>
             <Text style={{textAlignVertical:'center',paddingHorizontal:5,color:'gold'}}>{item.note.toFixed(1)}</Text>
            <Rating
            startingValue={item.note}
            readonly={true}
            imageSize={17}
          />
          </View>
          <View style={styles.textprestataire}>
          <View>
          <Text style={{fontSize:13,fontWeight:'bold',opacity:0.8,color:'#0dacfa'}}>{item.nom}</Text>
        
          </View></View>
          </View>
                      </TouchableOpacity>
                    
          }
        /> 
        
      </ScrollView>
    )
  }


const styles = StyleSheet.create({
    itemprestataire: {
        flex: 1,
        borderWidth:2,borderColor:'#0DACFA',
        marginVertical:10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 15,
        shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
      textprestataire: {
       
        flex: 2,
        color: 'black',
        justifyContent:'flex-start',
        alignItems: "flex-start",
        marginLeft: 10
      },
      imageprestataire: {
        width: 80,
        borderTopLeftRadius:13,
        borderBottomLeftRadius:13,
        height: 80
      },
  container: {
    flex: 1,backgroundColor:'white'
  },
  itemservice: {
    flex: 1,
    padding:4,
    alignItems: 'center',
    justifyContent: "space-around",
    backgroundColor: '#fff',
    borderWidth:2,
    borderColor:'#0DACFA',
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
  iteminvisibleservice: {
    flex: 1,
    width: 100,
    height: 100,
    margin: 10,
    paddingVertical: 20,
    backgroundColor: 'transparent'
  },
  textservice: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center'
  },
  imageservice: {
    width: 40,
    height: 40

  },
  text:{opacity:0.5,color:'black',fontWeight:'500',paddingHorizontal:10},
  action: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 6,
    opacity: 0.6,

    alignItems: 'center'
  },
  
  text_header:{fontSize:20,color:'black',fontWeight:'bold',paddingTop:20,paddingHorizontal:10,opacity:0.7},
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0DACFA',
    alignSelf: 'stretch',
    height:120,
    width:120,
    margin: 10,
    paddingVertical: 20,
    borderRadius: 5,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
  
  image: {
    width: 60,
    height: 60
  },
  signIn: {
    width: '35%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    borderRadius: 10,
    borderColor: '#0dacfa',
    padding:-5,
    borderWidth: 1,
    marginTop: 15,
    bottom:-50
}
});
