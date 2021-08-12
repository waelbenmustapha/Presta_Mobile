import React, { useState,useEffect } from "react";
import {ActivityIndicator, Modal,
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Picker,
} from "react-native";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
export default function InscriptionPrestataire({ navigation }) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(false);
  const [check_textInputChange, setCheck_textInputChange] =
    React.useState(false);
    const [loading,setLoading]=useState(false);

  const [check_emailInputChange, setCheck_emailInputChange] =
    React.useState(false);
  const [check_passwordInputChange, setCheck_passwordInputChange] =
    React.useState(false);
  const [check_phoneInputChange, setCheck_phoneInputChange] =
    React.useState(false);
    React.useState(false);
  const [check_matfiscInputChange, setCheck_matfiscInputChange] =
    React.useState(false);
  const [matfisc, setMatfisc] = React.useState();
  const [nom, setNom] = React.useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [marker,setMarker]=useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [phone, setPhone] = React.useState();
  const [selectedcategorie, setSelectedcat] = React.useState("");
  const [selectedservice, setSelectedservice] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [selectagain, setSelectagain] = React.useState(true);
  const [validate, setValidate] = React.useState();
  //constants to handle inputs errors
  const [emailError, setEmailError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);
  const [textError, setTextError] = React.useState(null);
  const [phoneError, setPhoneError] = React.useState(null);
  const [pictureone, setPictureone] = React.useState(null);
  const [matfiscError, setMatfiscError] = React.useState(null);
  //Picture One
  const handleUploadOne = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "presta");
    data.append("cloud_name", "presta");
    data.append("api_key", "527224346184438");
    data.append("timestamp", (Date.now() / 1000) | 0);
    axios
      .post("https://api.cloudinary.com/v1_1/presta/image/upload", data)
      .then((response) => {
        console.log(response.data);
        setPictureone(response.data.url);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Erreur de téléchargement");
      });
  };
  let openImagePickerAsyncOne = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 4],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUploadOne(newfile);
      }
    } else {
      Alert.alert("Il faut donner la permission");
    }
  };
  useEffect(() => {
        
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
    getcategories();
  }, []);
  //Fonction pour vérifier l'input de nom
  const textInputChange = (text) => {
    let reg = /^[A-Za-z ]+$/;
    if (reg.test(text) === true) {
      setCheck_textInputChange(true);
      setNom(text);
      setTextError(null);
    } else {
      setCheck_textInputChange(false);
    }
  };
  //Fonction pour valider l'email
  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === true) {
      setCheck_emailInputChange(true);
      setEmail(text);
      setEmailError(null);
    } else {
      setCheck_emailInputChange(false);
    }
  };
  //Fonction pour valider le mot de passe
  const handlePasswordChange = (text) => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (reg.test(text) === true) {
      setCheck_passwordInputChange(true);
      setPassword(text);
      setPasswordError(null);
    } else {
      setCheck_passwordInputChange(false);
    }
  };
  //Fonction pour valider le numéro de téléphone
  const validatePhoneNumber = (text) => {
    let reg = /^[2,4,5,9][0-9]{7}$/;
    if (reg.test(text) === true) {
      setCheck_phoneInputChange(true);
      setPhone(text);
      setPhoneError(null);
    } else {
      setCheck_phoneInputChange(false);
    }
  };
  
  //Fonction pour valider la matricule fiscal
  const matfiscInputChange = (text) => {
    let reg = /^[0-9]{7}[abcdefghjklmnpqrstvwxyz]{1}$/gi;
    if (reg.test(text) === true) {
      setCheck_matfiscInputChange(true);
      setMatfisc(text);
      setMatfiscError(null);
    } else {
      setCheck_matfiscInputChange(false);
    }
  };
  //Fonction pour changer l'etat de secure Text Entry du mot  de passe
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const checkInputs = () => {
    if (check_textInputChange === false) {
      setTextError("Vérifiez votre nom");
    }
    if (check_emailInputChange === false) {
      setEmailError("Vérifiez votre email");
    }
    if (check_phoneInputChange === false) {
      setPhoneError("Vérifiez votre numéro de téléphone");
    }
    if (check_passwordInputChange === false) {
      setPasswordError("Vérifiez votre mot de passe");
    }
   
    if (check_matfiscInputChange === false) {
      setMatfiscError("Vérifiez votre matricule fiscal");
    }
  };
  //fonction qui affiche liste des catégories
  async function getcategories() {
    axios
      .get(
        "http://192.168.43.100:8090/categorie/getAllCategories",
        {},
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then((response) => {
        setCategories(response.data);
      });
  }
  //fonction qui affiche liste des services
  async function getservices(cat) {
    axios
      .get(
        "http://192.168.43.100:8090/categorie/getServiceByCategorie/" + cat,
        {},
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then((response) => {
        setServices(response.data);
      });
  }
  // fonction pour envoyer code de validation de compte par email
  const axiosApiCallEmail = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("http://192.168.43.100:8090/demandeur/processRegister", email, config)
      .then((response) => {
        navigation.navigate("InscriptionEntrepriseEmail", {
          password: password,
          nom: nom,
          phone: phone,
          email: email,
          service: selectedservice,
          image1: pictureone,
          matfisc: matfisc,
          code: response.data,
          marker:marker,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // fonction pour envoyer code de validation de compte par téléphone
  const axiosApiCall = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("http://192.168.43.100:8090/mobilenumbers/otp", phone, config)
      .then((response) => {
        setValidate(response.data);
        navigation.navigate("InscriptionEntrepriseTelephone", {
          password: password,
          nom: nom,
          phone: phone,
          email: email,
          service: selectedservice,
          image1: pictureone,
          matfisc: matfisc,
          marker:marker,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //fonction qui vérifie l'existance de l'email et envoi fait appel à la fonction de code de validation par email
  const verifyExistanceEmail = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "http://192.168.43.100:8090/entreprise/entrepriseExistant",
        email,
        config
      )
      .then((response) => {
        if (response.data == "Compte existant") {
          Alert.alert("Adresse email utilisée pour un autre compte");
        } else {
          axiosApiCallEmail();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //fonction qui vérifie l'existance de l'email et envoi fait appel à la fonction de code de validation par téléphone
  const verifyExistance = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "http://192.168.43.100:8090/entreprise/entrepriseExistant",
        email,
        config
      )
      .then((response) => {
        if (response.data == "Compte existant") {
          Alert.alert("Adresse email utilisée pour un autre compte");
        } else {
          axiosApiCall();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //vérification de compte avec numéro de téléphone
  const onPressContinuePhone = () => {
    checkInputs();
    if (
      check_emailInputChange &&
      check_textInputChange &&
      check_passwordInputChange &&
      check_phoneInputChange &&
      pictureone != null &&
      check_matfiscInputChange&&marker!=null
    ) {
      verifyExistance();
    }else{Alert.alert("Vérifier vos donneés")}
  };
  //vérification de compte avec adresse email
  const onPressContinueEmail = () => {
    checkInputs();
    if (
      check_emailInputChange &&
      check_textInputChange &&
      check_passwordInputChange &&
      check_phoneInputChange &&
      pictureone != null &&
      check_matfiscInputChange&&marker!=null
    ) {
      verifyExistanceEmail();
    }else{Alert.alert("Vérifier vos donneés")}
  };
  if(location==null||loading==true){return(<View style={{...StyleSheet.absoluteFill,
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
    <LinearGradient
      colors={["#0dacfa", "#45d3f4", "#70e9ef"]}
      style={styles.container}
      start={{ x: -1, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{flex:1}}
      ><MapView
      style={{flex:1}}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00522,
        longitudeDelta: 0.00521,
      }}
      showsUserLocation={true}
      onLongPress={(e) => setMarker(e.nativeEvent.coordinate)}>
{
      marker &&
      <MapView.Marker coordinate={marker} />
}
     </MapView>
     <View style={{position:'absolute',top:0,right:0,left:0}} ><Text style={{textAlign:'center',padding:15,fontSize:14,color:'#0dacfa'}}>Appuyez longuement sur un emplacement sur la carte Pour que les utilisateurs vous y trouvent</Text></View>
     <View style={{position:'absolute',bottom:10,right:0,left:0}} ><TouchableOpacity style={{borderWidth:1,borderColor:'white',backgroundColor:'#45d3f4',borderRadius:15,justifyContent:'center',alignSelf:'center',height:50,width:160}} onPress={()=>{setModalVisible(false)}}><Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>sélectionner position</Text></TouchableOpacity></View>
  </Modal>
      <View style={styles.header}>
        <Text style={styles.text_header}>Bienvenue</Text>
        <Text style={styles.text}>Créez votre compte !</Text>
      </View>
      <View style={styles.footer}>
        <ScrollView>
          <Text style={styles.titrePick}>
            Choisissez la catégorie et le service que vous offrez{" "}
          </Text>
          <View style={styles.action}>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#45d3f4",
                borderRadius: 4,
                flex: 1,
                margin: 2,
              }}
            >
              <Picker
                selectedValue={selectedcategorie}
                onValueChange={(itemVal) => {
                    if (itemVal != "0") {
                        setSelectedcat(itemVal);
                        getservices(itemVal);
                        setSelectagain(true);
                    }
                  }}
              
              >
<Picker.Item label="--Select--" value="0" key="0" />
                {categories.map((l, index) => (
                  <Picker.Item key={index} label={l.nom} value={l.id} />
                ))}
              </Picker>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#45d3f4",
                borderRadius: 4,
                flex: 1,
                margin: 2,
              }}
            >
              <Picker
                selectedValue={selectedservice}
                onValueChange={(itemVal) => {
                  if (itemVal != "0") {
                    setSelectedservice(itemVal);
                    setSelectagain(false);
                  }
                }}
              >
                <Picker.Item label="--Select--" value="0" key="0" />
                {services.map((l, index) => (
                  <Picker.Item key={index} label={l.nom} value={l.id} />
                ))}
              </Picker>
            </View>
          </View>
          <Text style={styles.titrePick}>choisissez où se trouve votre domicile</Text>
                    <TouchableOpacity style={{ borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#45d3f4',
        flexDirection: 'row',height:50,width:150,alignSelf:'center',justifyContent:'center',alignItems:'center'}} onPress={()=>setModalVisible(!modalVisible)}>
                    <FontAwesome5
                            name="map-marked-alt"
                            size={35}
                            color="white"
                          />
</TouchableOpacity>
          <Text style={styles.titrePick}>
            Téléchargez une photo de la patente
          </Text>
          <View style={styles.action}>
            <TouchableOpacity
              style={[styles.continue, { flex: 1, margin: 2 }]}
              onPress={() => openImagePickerAsyncOne()}
            >
              <Text style={styles.textSign}>Patente</Text>
              {pictureone != null ? (
                <AntDesign
                  style={{ marginLeft: 4 }}
                  name="checkcircle"
                  size={20}
                  color="green"
                />
              ) : null}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)}><Text  style={styles.textVerif}>choose location</Text>
</TouchableOpacity>
          <View style={styles.action}>
            <FontAwesome
              style={styles.icon}
              name="user-o"
              size={20}
              color="#000"
            />
            <TextInput
              placeholder="Nom de l'entreprise"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(text) => textInputChange(text)}
            />
          </View>
          {textError !== null ? (
            <Text style={styles.textError}>{textError}</Text>
          ) : null}
          <View style={styles.action}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="card-text-outline"
              size={18}
              color="#000"
            />
            <TextInput
              placeholder="Matricule fiscal"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(text) => matfiscInputChange(text)}
            />
          </View>
          {matfiscError !== null ? (
            <Text style={styles.textError}>{matfiscError}</Text>
          ) : null}
          
       
          <View style={styles.action}>
            <Feather style={styles.icon} name="phone" size={18} color="#000" />
            <TextInput
              placeholder="Numéro de téléphone"
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(text) => validatePhoneNumber(text)}
            />
          </View>
          {phoneError !== null ? (
            <Text style={styles.textError}>{phoneError}</Text>
          ) : null}
          <View style={styles.action}>
            <FontAwesome5
              style={styles.icon}
              name="envelope"
              size={18}
              color="#000"
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(text) => validateEmail(text)}
            />
          </View>
          {emailError !== null ? (
            <Text style={styles.textError}>{emailError}</Text>
          ) : null}
          <View style={styles.action}>
            <Feather style={styles.icon} name="lock" color="#000" size={18} />
            <TextInput
              placeholder="Mot de passe"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(text) => handlePasswordChange(text)}
              secureTextEntry={secureTextEntry ? false : true}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {secureTextEntry ? (
                <Feather name="eye" color="grey" size={20} />
              ) : (
                <Feather name="eye-off" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {passwordError !== null ? (
            <Text style={styles.textError}>{passwordError}</Text>
          ) : (
            <Text style={styles.textPass}>
              Minimum 8 caractères, 1 lettre majuscule, 1 lettre minuscule et 1
              chiffre
            </Text>
          )}
          <View style={styles.verif}>
            <Text style={styles.textVerif}>Vérifier votre compte</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={onPressContinuePhone}
              >
                <Feather name="phone" size={20} style={styles.iconVerif} />
                <Text style={styles.textSign}>Téléphone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={onPressContinueEmail}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  style={styles.iconVerif}
                />
                <Text style={styles.textSign}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.75,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  textPass: {
    margin: 2,
    opacity: 0.6,
    fontSize: 10,
  },
  titrePick: {
    color: "#000",
    opacity: 0.6,
    fontSize: 14,
    margin: 4,
  },
  textError: {
    color: "#CA0B00",
    fontSize: 12,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 16,
  },
  continue: {
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#45d3f4",
    flexDirection: "row",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  button: {
    borderRadius: 6,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#45d3f4",
    flexDirection: "row",
    margin: 8,
  },
  verif: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 6,
  },
  text: {
    color: "#fff",
    opacity: 0.7,
    marginTop: 4,
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : -12,
    paddingLeft: 12,
    color: "#05375a",
  },
  textSign: {
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    margin: 4,
    opacity: 0.6,
    alignSelf: "center",
  },
  textVerif: {
    color: "#000",
    fontSize: 14,
    opacity: 0.6,
  },
  iconVerif: {
    color: "#fff",
    marginRight: 8,
  },
});
