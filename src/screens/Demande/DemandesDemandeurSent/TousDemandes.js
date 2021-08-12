import React, { useCallback, useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  FlatList,
  TextInput,
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
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
import { sendPushNotification } from "../../../Notifications/Notifications";

export default function TousDemande({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [idd, setIdd] = useState();
  const [demandetype, setdemandetype] = useState(5);
  const [description, setDescription] = useState();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [connecteduser, setconnecteduser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modaldata, setmodaldata] = useState({});
  const [modalldataa, setmodalldataa] = useState({});
  const [modalVisiblee, setModalVisiblee] = useState(false);
  const [modallVisiblee, setModallVisiblee] = useState(false);
  const [modaldataa, setmodaldataa] = useState({
    feedback: { avis: "", note: "" },
  });
  const [commentaire, setcommentaire] = useState("");
  const [starCount, setstarCount] = useState(0);
  function supprimerFeedback(id, prestataireid) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .delete(
        "http://192.168.43.100:8090/demande/supprimerFeedback/" + id,

        {},
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then((response) => {
        getconnecteduser();
        prestatairenotechange(prestataireid);
      });
  }
  function modifierFeedback(comment, count, id, prestataireid) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .put(
        "http://192.168.43.100:8090/demande/modifierFeedback/"+id,

        {
          avis: comment,
          note: count,
        },
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      )
      .then((response) => {
        setstarCount(0);
        setcommentaire("");
        prestatairenotechange(prestataireid);
        getconnecteduser();
      });
  }
  function prestatairenotechange(id) {
    setTimeout(() => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios.put(
        "http://192.168.43.100:8090/feedback/notePrestataire/" + id,

        {},
        config,
        {
          auth: {
            username: "user",
            password: "0000",
          },
        }
      );
    }, 2000);
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setmodalldataa(dateFormat(currentDate, "dddd, mmmm dS, yyyy, h:MM TT"));
    };
    //date and time picker function
    const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
    };
    //date and time picker function
    const showDatepicker = () => {
    showMode('date');
    };
    //date and time picker function
    const showTimepicker = () => {
    showMode('time');
    };
    
    
    
    //get prestataire notification token by his id
    
    /*async function getpresnotif() {
    
    await axios.get("http://192.168.43.100:8090/prestataire/getPrestataireNotificationToken/1").then(response => {
    setNotiftoken(response.data);
    
    })
    }
    */
    //format the date so the user can understand it
    var dateFormat = require("dateformat");
    dateFormat.i18n = {
    dayNames: [
    "Lun",
    "Mar",
    "Mer",
    "Jeu",
    "Ven",
    "Sam",
    "Dim",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
    ],
    monthNames: [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "May",
    "Jun",
    "Jul",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembrr",
    "Decembre",
    ],
    timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
    };
  const ajouterFeedback = (feedback, count, id, prestataireid) => {
    axios
      .post("http://192.168.43.100:8090/demande/ajouterFeedback/" + id, {
        avis: feedback,
        note: count,
      })
      .then((response) => {
        setstarCount(0);
        setcommentaire("");
        getconnecteduser();
        prestatairenotechange(prestataireid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        "http://192.168.43.100:8090/demande/getAllDemandes/" + id,
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
  //accepter ou refuser la demande avec a l'id de demande
  async function modifierdemande(id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      "http://192.168.43.100:8090/demande/modifierDemande/" +id,
      {description:description,
        date_debut:modalldataa},
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                width: 300,
                marginTop: -15,
                marginRight: -25,
                alignContent: "flex-end",
              }}
            >
              <Text style={{ textAlign: "right" }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>NOTEZ CETTE DEMANDE</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              starStyle={{ paddingHorizontal: 5 }}
              starSize={45}
              animation={"tada"}
              fullStarColor={"gold"}
              rating={starCount}
              selectedStar={(rating) => setstarCount(rating)}
            />
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Votre Note</Text>
            <View style={{}}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  setcommentaire(text);
                }}
                placeholder={"Que pensez-vous de ce prestataire de service"}
                style={{
                  padding: 15,
                  textAlignVertical: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  marginVertical: 25,
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (starCount != 0) {
                  ajouterFeedback(
                    commentaire,
                    starCount,
                    modaldata.id,
                    modaldata.prestataire.id
                  );
                  setModalVisible(!modalVisible);
                } else {
                  Alert.alert("ERREUR", "Veuillez attribuer une note");
                }
              }}
            >
              <Text style={styles.textStyle}>ENVOYER FEEDBACK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisiblee}
        onRequestClose={() => {
          setModalVisiblee(!modalVisiblee);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisiblee(false);
              }}
              style={{
                width: 300,
                marginTop: -15,
                marginRight: -25,
                alignContent: "flex-end",
              }}
            >
              <Text style={{ textAlign: "right" }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>NOTEZ CETTE DEMANDE</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              starStyle={{ paddingHorizontal: 5 }}
              starSize={45}
              animation={"tada"}
              fullStarColor={"gold"}
              rating={starCount}
              selectedStar={(rating) => setstarCount(rating)}
            />
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Votre Note</Text>
            <View style={{}}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  setcommentaire(text);
                }}
                placeholder={"Vous pouvez modifier vos commentaires ici"}
                style={{
                  padding: 15,
                  textAlignVertical: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  marginVertical: 25,
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {console.log("fe");
                modifierFeedback(
                  commentaire,
                  starCount,
                  modaldataa.feedback.id,
                  modaldataa.prestataire.id
                );
                setModalVisiblee(false);
              }}
            >
              <Text style={styles.textStyle}>CHANGER FEEDBACK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal><Modal
        animationType="slide"
        transparent={true}
        visible={modallVisiblee}
        onRequestClose={() => {
          setModallVisiblee(!modallVisiblee);
        }}
      >
<View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModallVisiblee(false);
              }}
              style={{
                width: 300,
                marginTop: -15,
                marginRight: -25,
                alignContent: "flex-end",
              }}
            >
              <Text style={{ textAlign: "right" }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>MODIFIER DEMANDE</Text>
            <View style={{}}>
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.action1]}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={showDatepicker}
            >
              <View style={{ flexDirection: "column" }}>
                <Icon
                  color="#0dacfa"
                  name="calendar"
                  type="font-awesome"
                  size={42}
                />
                <Text style={{ textAlign: "center" }}>Jour</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.action1]}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={showTimepicker}
            >
              <View style={{ flexDirection: "column" }}>
                <Icon
                  color="#0dacfa"
                  name="clock-o"
                  type="font-awesome"
                  size={42}
                />
                <Text style={{ textAlign: "center" }}>Heure</Text>
              </View>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                timeZoneOffsetInSeconds={3600}
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
        </View>
        <Text style={{textAlign:'center',marginVertical:12}}>{modalldataa}</Text>

      </View>
            <View style={{}}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  setDescription(text);
                }}
                placeholder={"Details concernant votre demande"}
                style={{
                  padding: 15,
                  textAlignVertical: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  marginVertical: 25,
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {modifierdemande(idd);setModallVisiblee(false)}}
            >
              <Text style={styles.textStyle}>Confirmer modification</Text>
            </TouchableOpacity>
          </View>
        </View></Modal>
      
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
              <Picker.Item label={"Demandes en attente"} value={0} />
              <Picker.Item label={"Demandes acceptées"} value={1} />
              <Picker.Item label={"Demandes en cours"} value={2} />
              <Picker.Item label={"Demandes terminées"} value={3} />
              <Picker.Item label={"Demandes annulées"} value={-1} />
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
                {item.statut == demandetype || demandetype == 5 ? (
                  <View>
                    {item.statut == 0 ? (
                      <TouchableOpacity style={styles.item}>
                        <Text
                          style={{
                            backgroundColor: "white",
                            borderColor: "#0dacfa",
                            color: "#0dacfa",
                            textAlign: "center",
                            borderWidth: 2,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}
                        >
                          Demande en attente
                        </Text>
                        <View
                          style={{
                            marginVertical: 5,
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 15,
                          }}
                        >
                          <Image
                            source={{ uri: item.prestataire.image }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 60 / 2,
                            }}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                                fontWeight: "600",
                                fontSize: 18,
                              },
                            ]}
                          >
                            {item.prestataire.nom}
                          </Text>
                          <TouchableOpacity
                                    onPress={() => {
                                      setIdd(item.id);
                                      setmodalldataa(item.date_debut);
                                      setModallVisiblee(true);
                                    }}
                                  >
                                    <FontAwesome5
                                      style={{
                                        marginHorizontal: 3,
                                        alignSelf: "flex-end",
                                      }}
                                      name="edit"
                                      size={22}
                                      color="white"
                                    />
                                  </TouchableOpacity></View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 0,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
                            ]}
                          >
                            {item.prestataire.numero_telephone}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            funcsaccepterourefuser(item.id, -1);
                            getconnecteduser();
                            sendPushNotification(
                              item.prestataire.notification_token,
                              item.nom,
                              "demande pour Service " +
                                item.nom +
                                " est Annuler"
                            );
                          }}
                        >
                          <View style={styles.start}>
                            <Text style={styles.textSign}>Annuler</Text>
                          </View>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : item.statut == 1 ? (
                      <TouchableOpacity style={styles.item}>
                        <Text
                          style={{
                            backgroundColor: "white",
                            borderColor: "#0dacfa",
                            color: "#0dacfa",
                            textAlign: "center",
                            borderWidth: 2,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}
                        >
                          Demande acceptée
                        </Text>
                        <View
                          style={{
                            marginVertical: 5,
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 15,
                          }}
                        >
                          <Image
                            source={{ uri: item.prestataire.image }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 60 / 2,
                            }}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                                fontWeight: "600",
                                fontSize: 18,
                              },
                            ]}
                          >
                            {item.prestataire.nom}
                          </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 0,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
                            ]}
                          >
                            {item.prestataire.numero_telephone}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            funcsaccepterourefuser(item.id, -1);
                            getconnecteduser();
                            sendPushNotification(
                              item.prestataire.notification_token,
                              item.nom,
                              "demande pour Service " +
                                item.nom +
                                " est Annuler"
                            );
                          }}
                        >
                          <View style={styles.start}>
                            <Text style={styles.textSign}>Annuler</Text>
                          </View>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : item.statut == 2 ? (
                      <TouchableOpacity style={styles.item}>
                        <Text
                          style={{
                            backgroundColor: "white",
                            borderColor: "#0dacfa",
                            color: "#0dacfa",
                            textAlign: "center",
                            borderWidth: 2,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}
                        >
                          Demande en cours
                        </Text>

                        <View
                          style={{
                            marginVertical: 5,
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 15,
                          }}
                        >
                          <Image
                            source={{ uri: item.prestataire.image }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 60 / 2,
                            }}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                                fontWeight: "600",
                                fontSize: 18,
                              },
                            ]}
                          >
                            {item.prestataire.nom}
                          </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 0,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
                            ]}
                          >
                            {item.prestataire.numero_telephone}
                          </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                              funcsaccepterourefuser(item.id, 3);
                              getconnecteduser();
                              sendPushNotification(
                                item.prestataire.notification_token,
                                item.nom,
                                "demande pour Service " +
                                  item.nom +
                                  " est Annuler"
                              );
                            }}
                          >
                            <View style={styles.start}>
                              <Text style={styles.textSign}>Terminer</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                              funcsaccepterourefuser(item.id, -1);
                              getconnecteduser();
                              sendPushNotification(
                                item.prestataire.notification_token,
                                item.nom,
                                "demande pour Service " +
                                  item.nom +
                                  " est Annuler"
                              );
                            }}
                          >
                            <View style={styles.start}>
                              <Text style={styles.textSign}>Annuler</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ) : item.statut == 3 ? (
                      <View>
                        <TouchableOpacity style={styles.item}>
                          <Text
                            style={{
                              backgroundColor: "white",
                              borderColor: "#0dacfa",
                              color: "#0dacfa",
                              textAlign: "center",
                              borderWidth: 2,
                              borderTopLeftRadius: 15,
                              borderTopRightRadius: 15,
                            }}
                          >
                            Demande terminée
                          </Text>

                          <View
                            style={{
                              marginVertical: 5,
                              flex: 1,
                              flexDirection: "row",
                              marginLeft: 15,
                            }}
                          >
                            <Image
                              source={{ uri: item.prestataire.image }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 60 / 2,
                              }}
                            />
                            <Text
                              style={[
                                styles.text,
                                {
                                  textAlignVertical: "center",
                                  marginHorizontal: 10,
                                  fontWeight: "600",
                                  fontSize: 18,
                                },
                              ]}
                            >
                              {item.prestataire.nom}
                            </Text>
                          </View>
                          <View style={{ flex: 1, flexDirection: "row" }}>
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
                                {
                                  textAlignVertical: "center",
                                  marginHorizontal: 0,
                                },
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
                                {
                                  textAlignVertical: "center",
                                  marginHorizontal: 10,
                                },
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
                                {
                                  textAlignVertical: "center",
                                  marginHorizontal: 10,
                                },
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
                                {
                                  textAlignVertical: "center",
                                  marginHorizontal: 10,
                                },
                              ]}
                            >
                              {item.prestataire.numero_telephone}
                            </Text>
                          </View>

                          <View
                            style={{ flex: 1, flexDirection: "row" }}
                          ></View>
                          {item.feedback != null ? (
                            <View
                              style={{
                                backgroundColor: "white",
                                borderWidth: 2,
                                borderColor: "#0dacfa",
                                borderTopWidth: 0,
                                paddingHorizontal: 15,
                                paddingVertical: 7,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                              }}
                            >
                              <View style={{ alignSelf: "flex-start" }}>
                                <StarRating
                                  disabled={true}
                                  maxStars={5}
                                  starSize={25}
                                  fullStarColor={"gold"}
                                  rating={item.feedback.note}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    flex: 4,
                                    padding: 5,
                                    color: "#0dacfa",
                                    fontWeight: "600",
                                  }}
                                >
                                  {item.feedback.avis}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignSelf: "center",
                                    justifyContent: "flex-end",
                                    alignContent: "flex-end",
                                    flex: 1,
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      setmodaldataa(item);
                                      setstarCount(item.feedback.note);

                                      setModalVisiblee(true);
                                    }}
                                  >
                                    <FontAwesome5
                                      style={{
                                        marginHorizontal: 3,
                                        alignSelf: "flex-end",
                                      }}
                                      name="edit"
                                      size={22}
                                      color="#0dacfa"
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      supprimerFeedback(
                                        item.id,
                                        item.prestataire.id
                                      );
                                      getconnecteduser();
                                    }}
                                  >
                                    <FontAwesome5
                                      style={{
                                        marginHorizontal: 3,
                                        alignSelf: "flex-end",
                                      }}
                                      name="trash-alt"
                                      size={22}
                                      color="#0dacfa"
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={{
                                backgroundColor: "white",
                                borderRadius: 7,
                                padding: 7,
                                margin: 15,
                              }}
                              onPress={() => {
                                setmodaldata(item);
                                setModalVisible(true);
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: "#0dacfa",
                                  fontWeight: "600",
                                  textAlign: "center",
                                }}
                              >
                                Évaluer la qualité de la service
                              </Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {item.feedback != null ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginBottom: 10,
                              paddingHorizontal: 15,
                            }}
                          ></View>
                        ) : null}
                      </View>
                    ) : item.statut == -1 ? (
                      <TouchableOpacity style={styles.item}>
                        <Text
                          style={{
                            backgroundColor: "white",
                            borderColor: "#0dacfa",
                            color: "#0dacfa",
                            textAlign: "center",
                            borderWidth: 2,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}
                        >
                          Demande annulée
                        </Text>

                        <View
                          style={{
                            marginVertical: 5,
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 15,
                          }}
                        >
                          <Image
                            source={{ uri: item.prestataire.image }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 60 / 2,
                            }}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                                fontWeight: "600",
                                fontSize: 18,
                              },
                            ]}
                          >
                            {item.prestataire.nom}
                          </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 0,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
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
                              {
                                textAlignVertical: "center",
                                marginHorizontal: 10,
                              },
                            ]}
                          >
                            {item.prestataire.numero_telephone}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
              </View>
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
  action1: {
    paddingHorizontal:35,
    opacity: 0.6,
    alignItems: "center",
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
  },
  footer: {
    flex: 2,
    paddingTop: 10,
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
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#fcc200",
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
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    paddingVertical: 20,
  },
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
