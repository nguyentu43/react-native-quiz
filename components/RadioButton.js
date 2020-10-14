import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, View, TouchableOpacity} from 'react-native';
import globalStyles from "../styles";

const stateIcon = {
  uncheck: {name: 'ellipse-outline', color: 'black'},
  checked: {name: 'checkmark-circle-outline', color: 'black'},
  right: {name: 'checkmark-circle-outline', color: 'green'},
  wrong: {name: 'close-circle-outline', color: 'red'},
};

export default function RadioButton({
  text,
  state = 'uncheck',
  value,
  onValueChange = () => {},
}) {
  const {name, color} = stateIcon[state];

  return (
    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => onValueChange(value)}>
      <Icon
        name={name}
        color={color}
        size={25}
        value={value}
      />
      <Text selectable={true} style={[globalStyles.text, { marginLeft: 5, flexBasis: '90%'}]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
