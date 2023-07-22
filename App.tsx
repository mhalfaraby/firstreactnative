import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface Hero {
  id: number;
  localized_name: string;
  img: string;
}

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;
const itemHeight = 142; // Set the height of the item container
const imageHeight = 100; // Set the height of the image
const padding = 8; // Adjust the padding value as needed

const BASE_URL = 'https://api.opendota.com';

const renderItem = ({item}: {item: Hero}) => (
  <View
    style={[styles.item, {width: itemWidth - padding * 2, height: itemHeight}]}>
    <View style={[styles.imageContainer, {height: imageHeight}]}>
      <Image source={{uri: BASE_URL + item.img}} style={styles.image} />
    </View>
    <View style={styles.heroNameContainer}>
      <Text style={styles.heroName} numberOfLines={2} ellipsizeMode="tail">
        {item.localized_name}
      </Text>
    </View>
  </View>
);

const App: React.FC = () => {
  const [data, setData] = useState<Hero[]>([]);

  useEffect(() => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(response => response.json())
      .then(data => {
        // Sort the data by localized_name in ascending order
        const sortedData = data.sort((a, b) =>
          a.localized_name.localeCompare(b.localized_name),
        );
        setData(sortedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding,
    margin: padding,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heroNameContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    flex: 1, // Occupy the available space and allow the text to wrap
  },
  heroName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap', // Allow text to wrap to the next line if it doesn't fit
  },
});

export default App;
