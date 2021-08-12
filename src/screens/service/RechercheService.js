import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';


export default class RechercheService extends React.Component {

  state = {
    service: []
  }
  formatData(dataList, numColumns) {
    while (dataList.length % numColumns != 0) {
      dataList.push({ id: 'blank', empty: true })
    }
    return dataList;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      searched: this.props.route.params.searched
    });
    axios.get("http://192.168.43.100:8090/service/getServiceByNom", { params: { keyword: this.props.route.params.searched } }, {
      auth: {
        username: "user",
        password: "0000"
      }
    }).then((res) => {
      const service = res.data;
      this.setState({ service });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={3}
          data={this.formatData(this.state.service, 3)}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('ListePrestataire', { item })}
              style={[styles.items, item.empty ? styles.iteminvisible : styles.item]} >
              <Image style={styles.image} resizeMode='contain' source={{ uri: item.icone }} />
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
  items: {
    flex: 1
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "space-around",
    backgroundColor: '#fff',
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
  iteminvisible: {
    flex: 1,
    width: 100,
    height: 100,
    margin: 10,
    paddingVertical: 20,
    backgroundColor: 'transparent'
  },
  text: {
    color: 'black',
    fontSize: 12
  },
  image: {
    width: 40,
    height: 40

  }
});
