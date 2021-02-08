import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class RoundedButton extends React.Component {
  getText() {
    const buttonText = this.props.text || this.props.children || '';
    return buttonText.toUpperCase();
  }
  getStyles() {
    return this.props.style || {};
  }

  render() {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[styles.button, this.getStyles()]}
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.getText()}</Text>
      </TouchableOpacity>
    );
  }
}

export const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#e73536',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 10,
  },
});
