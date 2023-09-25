import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function WeirdCom() {
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {isRunning ? (
        <></>
      ) : (
        <View>
          {isDone ? (
            <View>
              <Text>IT'S ALREADY RUN AND DONE</Text>
            </View>
          ) : (
            <View>
              <Text>
                IT'S ALREADY RUN BUT NOT DONE UNTIL YOU PRESS THE BUTTON BELOW
              </Text>
              <Button
                onPress={() => setIsDone(true)}
                title="PRESS HERE TO MAKE IT DONE"
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
