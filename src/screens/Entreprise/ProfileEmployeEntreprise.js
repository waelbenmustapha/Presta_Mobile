import React, { useEffect,  useState } from "react";
import {
  KeyboardAvoidingView,

  Image,
  
  TextInput,
  Alert,
  
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FontAwesome,
  Feather,
  
} from "@expo/vector-icons";
import axios from "axios";

export default function ProfileEmployeEntreprise({ route, navigation }) {
  const [emailnotvalid, setEmailnotvalid] = useState("");
  const [nomprenimvide, setNomprevide] = useState("");
  const [pohnenum,setpohnenum]=useState(route.params.item.numero_telephone);
  const [addprenimvide, setaddprevide] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mobilenotvalid, setMobVal] = useState("");
  const [avoirDemandesEnCours, setademande] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = React.useState({
    nom: route.params.item.nom,
    email: route.params.item.email,
    secureTextEntry: true,
    addresse: route.params.item.addresse,
    checktextInputChange: false,
    checkaddInputChange: false,
    checkemailInputChange: false,
    emailError: "",
    champVideError: "",
  });
  function modifieremploye() {
    if (
      mobilenotvalid == "" &&
      data.nom.length > 0 &&
      data.email.length > 0 &&
      emailnotvalid == "" &&
      pohnenum.length == 8 &&
      data.addresse.length > 0
    ) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios.put(
        "http://192.168.43.100:8090/employe/modifierEmploye",

        {
          id: route.params.item.id,
          nom: data.nom,
          email: data.email,
          addresse: data.addresse,
          numero_telephone: pohnenum,
        },
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      );
      Alert.alert("Employé Modifié");
      navigation.navigate("ListeEmployeEntreprise");

    } else {
      Alert.alert("Vérifier les données");
    }
  }

  useEffect(() => {
    checkdemandeencours();
  }, []);
  const textInputChange = (text) => {
    if (text == "") {
      setNomprevide("Vous devez entrez le nom et prénom !");
      setData({
        ...data,
        checktextInputChange: false,
      });
    } else {
      setNomprevide("");

      setData({
        ...data,
        nom: text,
        checktextInputChange: true,
      });
    }
  };

  const addInputChange = (text) => {
    if (text == "") {
      setaddprevide("Vous devez entrez une adresse !");
      setData({
        ...data,
        checkaddInputChange: false,
      });
    } else {
      setaddprevide("");

      setData({
        ...data,
        addresse: text,
        checkaddInputChange: true,
      });
    }
  };
  function checkdemandeencours() {
    axios
      .get(
        "http://192.168.43.100:8090/employe/avoirDemandesEnCours/" +
          route.params.item.id
      )
      .then((response) => {
        setademande(response.data);
      });
  }
  const validatePhoneNumber = (text) => {
    let reg = /^[2,4,5,9][0-9]{7}$/;
    if (reg.test(text) === false) {
      setMobVal("Vérifier votre Numero de telephone !");
    } else {
      setMobVal("");
      
    }
  };

  function enablemodification() {
    setEnabled(!enabled);
  }

  function deleteemploye() {
    axios.delete(
      `http://192.168.43.100:8090/employe/supprimerEmploye/${route.params.item.id}`
    );
  }

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(text) == false) {
      setEmailnotvalid("Vérifier votre adresse mail !");
      setData({
        ...data,
        checkemailInputChange: false,
      });
    }

    if (reg.test(text) == true) {
      setEmailnotvalid("");

      setData({
        ...data,
        email: text,
        checkemailInputChange: true,
      });
    }
  };
  return (
  
      <KeyboardAvoidingView style={{ flex: 1 }}>
          <LinearGradient
            colors={["#0dacfa", "#45d3f4", "#70e9ef"]}
            style={styles.container}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
          
            <View style={{ flex: 0.6, paddingTop: 10 }}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Vous êtes sur le point de supprimer cette employé
                    </Text>
                    <View
                      style={{
                        paddingVertical: 20,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderBottomWidth: 1,
                          borderColor: "red",
                        }}
                        onPress={() => {
                          setModalVisible(!modalVisible);
if(!avoirDemandesEnCours){
                          deleteemploye();
                          navigation.replace("ListeEmployeEntreprise");}
                          else{Alert.alert("Action impossible","Employée en mission")}
                        }}
                      >
                        <Text style={styles.textStyle}>Supprimer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderBottomWidth: 1,
                          borderColor: "blue",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.textStyle}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={styles.profileImgContainer}>
                <Image
                  source={{ uri: route.params.item.image }}
                  style={styles.profileImg}
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 25,
                color: "white",
                fontWeight: "600",
                paddingBottom: 15,
                textAlign: "center",
              }}
            >
              {route.params.item.nom}
            </Text>
            <View style={styles.footer}>
              <ScrollView style={{ marginTop: 20 }}>
                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="user-o"
                    size={22}
                    color="#000"
                  />
                  <TextInput
                    onChangeText={(text) => {
                      data.nom = text;
                      textInputChange(text);
                    }}
                    value={data.nom}
                    editable={enabled}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEnabled(true);
                    }}
                  >
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="edit" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{nomprenimvide}</Text>
                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="envelope-o"
                    size={20}
                    color="#000"
                  />
                  <TextInput
                    editable={enabled}
                    onChangeText={(text) => {
                      data.email = text;
                      validate(text);
                    }}
                    value={data.email}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEnabled(true);
                    }}
                  >
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="edit" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{emailnotvalid}</Text>

                <View style={styles.action}>
                  <FontAwesome
                    style={styles.icon}
                    name="phone"
                    size={23}
                    color="#000"
                  />
                  <TextInput
                    editable={enabled}
                    onChangeText={(text) => {
                     setpohnenum(text);
                     validatePhoneNumber(text);
                    }}
                    value={pohnenum}
                    style={[
                      styles.textInput,
                      enabled
                        ? {
                            color: "black",
                          }
                        : {
                            color: "black",
                            opacity: 0.5,
                          },
                    ]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEnabled(true);
                    }}
                  >
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="edit" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{mobilenotvalid}</Text>
                <View style={styles.action}>
            <FontAwesome
              style={styles.icon}
              name="map-marker"
              size={32}
              color="#000"
            />
            <TextInput
              editable={enabled}
              onChangeText={(text) => {
                data.addresse = text;
                addInputChange(text);
              }}
              value={data.addresse}
              style={[
                styles.textInput,
                enabled
                  ? {
                      color: "black",
                    }
                  : {
                      color: "black",
                      opacity: 0.5,
                    },
              ]}
              autoCapitalize="none"
            />
           <TouchableOpacity
                    onPress={() => {
                      setEnabled(true);
                    }}
                  >
                    {enabled ? (
                      <Feather />
                    ) : (
                      <Feather name="edit" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
          </View>
          <Text style={{ color: "red" }}>{addprenimvide}</Text>

              </ScrollView>
              {enabled? <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginVertical: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.start}
                  onPress={() => {
                    modifieremploye();
                  }}
                >
                  <LinearGradient
                    style={styles.start}
                    colors={["#0dacfa", "#45d3f4", "#70e9ef"]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.textSign}>
                      Sauvegarder modifications
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>:null}

              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 10 }}
                onPress={() => {setModalVisible(true);checkdemandeencours();}}
              >
                <Text style={{ fontSize: 15, opacity: 0.8, color: "#696969" }}>
                  Supprimer Employé
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,    marginTop:3,borderTopRightRadius:55,

  },
  start: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    marginVertical: -20, //-45
  },
  header: {
    flex: 0.75,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 2.3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 16,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
   paddingBottom: 6
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  text: {
    color: "#fff",
    opacity: 0.7,
    marginTop: 4,
    fontSize: 18,
  },
  login: {
    padding: 10,
  },
  appButtoncontainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
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
  button: {
    marginVertical: 30,
    marginHorizontal: 20,
  },
  profileImgcontainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  profileImgContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  profileImg: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderRadius: 60,
    overflow: "hidden",
    borderColor: "white",
    borderWidth: 4,
  },
  nom: {
    color: "white",
    fontSize: 20,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  start3: {
    backgroundColor: "#0dacfa",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "flex-end",
    height: 50,
    width: 150,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  textSign: {
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    margin: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth:1,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 30,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize:15,
    textAlign: "center",
  },
});
