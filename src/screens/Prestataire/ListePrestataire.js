import React from 'react';
import { View, Text, StyleSheet,ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';
import StarRating from "react-native-star-rating";
import { Rating } from 'react-native-ratings';
import { FontAwesome, Feather,  FontAwesome5 } from '@expo/vector-icons';
import { getDistance } from 'geolib';
import * as Location from 'expo-location';


export default class ListePrestataire extends React.Component {
  state = {
    Prestataire: [],
    tri: "nom",
    location:null,
  }
  componentDidMount() {
    
    this.props.navigation.setOptions({
      title: this.props.route.params.item.nom
    });

    axios.get("http://192.168.43.100:8090/service/getPrestataireByService/" + this.props.route.params.item.id, {}, {
      auth: {
        username: "user",
        password: "0000"
      }
    }).then((res) => {
      const Prestataire = res.data;
      this.setState({ Prestataire });
      this.sortListByNom();
    });
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        this.setState({ errorMsg: 'Permisfsion to access location was denied' });
        
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location:location});
      console.log(location);
    })();
  }
  // Tri par note
  sortListByNote() {

    this.state.Prestataire.sort(function (obj1, obj2) {
      return obj2.note - obj1.note;
    });

    this.setState(previousState => (
      { Prestataire: previousState.Prestataire }
    ))
    console.log(this.state.Prestataire)

  }
  sortListByDistance() {
let location=this.state.location.coords;
    this.state.Prestataire.sort(function (a, b) {
     return getDistance({ latitude: location.latitude, longitude: location.longitude }, { latitude: a.latitude, longitude: a.longitude }) - getDistance({ latitude: location.latitude, longitude: location.longitude }, { latitude: b.latitude, longitude: b.longitude })
    });

    this.setState(previousState => (
      { Prestataire: previousState.Prestataire }
    ))

  }
 
 
  // Tri par nom
  sortListByNom() {

    this.state.Prestataire.sort(function (a, b) {
      var nameA = a.nom.toLowerCase(), nameB = b.nom.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    this.setState(previousState => (
      { Prestataire: previousState.Prestataire }
    ))

  }

  pickerActivity = (val) => {
    this.setState({ tri: val })
    if (val == "nom") {
      this.sortListByNom()
    }
   else if (val == "distance") {
    this.sortListByDistance() }
      else {
      this.sortListByNote()
    }
  }
  render() {
   if(this.state.location==null){return(<View style={{...StyleSheet.absoluteFill,
    backgroundColor: '#45d3f4',
    alignItems: 'center',
    justifyContent: 'center',}}>
   <View style={{backgroundColor: 'white',
      flexDirection: 'row',
      padding: 20,
      borderRadius: 8,}}>
   <ActivityIndicator color={'black'}/>
   <Text style={{marginLeft: 16,
      fontSize: 18,
      fontWeight: '500',}}>Loading...</Text>
   </View>
   </View>)}
   else{
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.tri}
          onValueChange={(itemValue, itemIndex) => this.pickerActivity(itemValue)}>
          <Picker.Item label="Alphabet" value="nom" />
          <Picker.Item label="Note" value="note" />
          <Picker.Item label="Distance" value="distance" />
        </Picker>

        <FlatList
          data={this.state.Prestataire}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
<TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.navigate('ProfilePrestataire', { prestataire:item,service:this.props.route.params.item })}}  >
<Image style={styles.image} source={{ uri: item.image }} />
<View style={{flexDirection:'column',flex:1}}>
  <View style={{flexDirection:'row',alignSelf:'flex-end',paddingHorizontal:10,paddingVertical:5}}>
    <Text style={{textAlignVertical:'center',paddingHorizontal:5}}>{item.note.toFixed(1)}</Text>
  <Rating
  startingValue={item.note}
  readonly={true}
  imageSize={25}
/>
</View>
<View style={styles.text}>
<View>
<Text style={{fontSize:17,fontWeight:'bold',opacity:0.8}}>{item.nom}</Text>
<Text style={{color:'#FFB81C',fontWeight:'bold',fontSize:17}}>{(getDistance(
    { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude },
    { latitude: item.latitude, longitude: item.longitude }
)/1000).toFixed(1)} KM</Text>
</View></View>
</View>
            </TouchableOpacity>
          }
        />
      </View>

    )
  }}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 15,
    shadowColor: "#0DACFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8
  },
  text: {
    flex: 2,
    color: 'black',
    paddingTop:10,
    justifyContent:'flex-start',
    alignItems: "flex-start",
    marginLeft: 10
  },
  image: {
    width: 110,
    borderTopLeftRadius:15,
    borderBottomLeftRadius:15,
    height: 110
  }
});