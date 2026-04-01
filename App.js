import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleBlack}>Home Screen</Text>
      <Button 
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleBlack}>Details Screen</Text>
      <Button
        title="Voltar para home"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="Listar filmes"
        onPress={() => navigation.navigate("Movies")}
      />
    </View>
  );
}

function MoviesScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const response = await fetch('http://www.omdbapi.com/?s=spider%20man&apikey=1cd66749');
      const json = await response.json();
      setMovies(json.Search);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (index < movies.length - 1) setIndex(index + 1);
  };

  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.card}>
          <Image
            source={{ uri: movies[index].Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
          <Text style={styles.titleWhite}>{movies[index].Title}</Text>
          <Text style={styles.year}>Ano: {movies[index].Year}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Anterior" onPress={handlePrevious} disabled={index === 0} />
            <Button title="Próximo" onPress={handleNext} disabled={index === movies.length - 1} />
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Movies" component={MoviesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fundo branco em todas as telas
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#1e1e1e', // Fundo escuro só dentro do card
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  poster: {
    width: 250,
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  titleWhite: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleBlack: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  year: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});
