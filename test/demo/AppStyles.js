import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  // container styles
  flex: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  // used for the containers with room form and media access buttons
  shrinkingContainer: {
    flexShrink: 1,
    flexBasis: 'auto',
  },
  // used for the video container
  borderedContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },
  // label styles
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 15,
    marginTop: 10,
  },
  // label for showing backend connection issues
  alertLabel: {
    fontWeight: 'bold',
    color: 'red',
    marginHorizontal: 15,
  },
  // label for each video, containing the session ID
  streamLabel: { textAlign: 'center', fontWeight: 'bold' },
  // room input style
  roomInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 15,
  },
  // button styles
  greenButton: { backgroundColor: 'green', flex: 1 },
});
