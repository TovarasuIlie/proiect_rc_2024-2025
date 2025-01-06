import { logoutUserAction } from "@/redux/auth_slice";
import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useDispatch, useSelector } from "react-redux"

const HomePage = () => {
  const room = "q";
  const [stompClient, setStompClient] = useState();
  const [potValue, setPotValue] = useState({temperature: 0, humidity: 0});

  useEffect(() => {
    const sock = new SockJS("http://192.168.0.215:8080/ws");
    const client = Stomp.over(sock);
    setStompClient(client);
  }, []);

  useEffect(() => {
    if (stompClient !== undefined && stompClient !== null) {
      stompClient.connect({}, onConnected, onError);
    }
  }, [stompClient]);

  const onConnected = () => {
    if (stompClient !== undefined && stompClient !== null) {
      stompClient.subscribe("/topic/messages/" + room, onMessageReceived);
    }
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    if (message?.messageType === "INPUT") {
      setPotValue(message?.message);
    }
  };

  const onError = (error) => {
    // console.log(error);
  };
  const dispatch = useDispatch()
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center p-4 bg-gray-900">
        <Text style={styles.textColor} className={"font-bold text-5xl shadow-sm"}>Termofy</Text>
        <TouchableOpacity>
          <Button title="Log out!" className={"p-2 px-3 bg-white border border-green-900 rounded-full font-bold"} onPress={() => dispatch(logoutUserAction())} />
        </TouchableOpacity>
      </View>
      <View className="flex-column justify-center items-center mt-5  bg-gray-900 p-5 rounded-lg m-3">
        <CircularProgress
          value={potValue.temperature}
          radius={100}
          duration={200}
          progressValueColor={'#ecf0f1'}
          maxValue={100}
          title={'°C'}
          titleColor={'white'}
          titleStyle={{fontWeight: 'bold'}}
        />
        <Text style={styles.textColor} className="font-bold text-3xl text-center mt-5">Temperatura</Text>
      </View>
      <View className="flex-column justify-center items-center mt-8 bg-gray-900 p-5 rounded-lg m-3">  
        <Text style={styles.textColor} className="font-bold text-3xl text-center mb-5">Umiditate</Text>
        <CircularProgress
          value={potValue.humidity}
          radius={120}
          duration={100}
          activeStrokeColor={potValue.humidity >= 40 && potValue.humidity <= 60 ? "#00cc44" : '#f39c12'}
          progressValueColor={'#ecf0f1'}
          title={'%'}
          titleColor={'white'}
          titleStyle={{fontWeight: 'bold'}}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  textColor: {
    color: '#fff',
  }
});