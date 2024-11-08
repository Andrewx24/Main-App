import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DiscoverButton from "../DiscoverButton";
import { getAllProfilePictures, incrementViews } from "../../API/API";
import { useAuth } from "../../state/AuthProvider";

const loadingGif = require("../../assets/loading-gif.gif");

const FeaturedArtists = () => {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getAllProfilePictures(token);
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [token]);

  const navigateToArtistScreen = async (artist, profilePic, type, initialIndex, userId) => {
    try {
      await incrementViews(userId, token); // Increment views for the specific user
      navigation.navigate("ArtistScreens", {
        artist,
        profilePic,
        type,
        galleryImages: artists,
        initialIndex,
      });
      console.log(`Navigating to ${artist}'s screen`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.headerText}>DISCOVER ARTISTS</Text>
        <Image source={loadingGif} style={styles.loadingGif} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>DISCOVER ARTISTS</Text>
        <DiscoverButton />
      </View>
      <ScrollView
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {artists.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.artistContainer}
            onPress={() =>
              navigateToArtistScreen(
                item.name,
                item.profilePictureLink,
                item.artistType,
                index,
                item._id // Assuming `_id` is the user's unique identifier
              )
            }
          >
            <Image
              source={{ uri: item.profilePictureLink }}
              style={styles.image}
            />
            <Text style={styles.artistName}>{item.name}</Text>
            <Text style={styles.artistType}>{item.artistType}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    marginTop: 0,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "LEMON MILK Bold",
    color: "#000",
  },
  scrollView: {
    flexDirection: "row",
  },
  artistContainer: {
    alignItems: "center",
    marginRight: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 2,
  },
  artistName: {
    fontSize: 8,
    color: "black",
    fontFamily: "LEMON MILK Bold",
  },
  artistType: {
    fontSize: 8,
    color: "black",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingGif: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default FeaturedArtists;
