import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

class TypeUtilisateur extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.box} onPress={() => this.props.navigation.navigate("LoginFacebookGoogle")}>
          <Image style={styles.image} source={require('../../../assets/demandeur.png')} />
          <Text style={styles.text}>Demandeur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { marginTop: 10 }]} onPress={() => this.props.navigation.navigate("InscriptionPrestataire")}>
          <Image style={styles.image} source={require('../../../assets/prestataire.png')} />
          <Text style={styles.text}>Prestataire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { marginTop: 10 }]} onPress={() => this.props.navigation.navigate("InscriptionEntreprise")}>
          <Image style={styles.image} source={require('../../../assets/entreprise.png')} />
          <Text style={styles.text}>Entreprise</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45d3f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 90,
    height: 90,
    opacity: 0.6,
  },
  text: {
    marginTop: 8,
    color: '#000',
    fontSize: 16,
    opacity: 0.6
  }
});
export default TypeUtilisateur;