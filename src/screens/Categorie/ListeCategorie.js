import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { Icon } from 'react-native-elements';


export default class ListeCategorie extends React.Component {
  
  constructor(props){
    super(props);
    
  }
  state = {
    categories: [],
    searched: '',
    location:null,
  }

 
   

  componentDidMount() {
    axios.get("http://192.168.43.100:8090/categorie/getAllCategories", {}, {
      auth: {
        username: "user",
        password: "0000"
      }
    }).then((res) => {
      const categories = res.data;
      this.setState({ categories });
    });
   
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}><View style={styles.action}><TextInput
          style={{ flex: 1, marginHorizontal: 10 }}
          mode="outlined"
          label="De quoi avez vous besoin?"
          onChangeText={text => this.state.searched = text}
        /></View><TouchableOpacity style={{ alignSelf: 'center' }}
          onPress={() => this.props.navigation.navigate('RechercheService', { searched: this.state.searched })}><Icon style={{ marginRight: 10 }} color='#0dacfa' name='search' type='font-awesome' size={42} />
          </TouchableOpacity></View>
        <FlatList
          data={this.state.categories}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('ListeService', { item })}  >
              <Image style={styles.image} resizeMode='contain' source={{ uri : item.icone }} />
              <Text style={styles.text}>{item.nom}</Text>
            </TouchableOpacity>
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0DACFA',
    alignSelf: 'stretch',
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
  text: {
    color: 'white',
    fontSize: 16,
    textAlign:'center'
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
