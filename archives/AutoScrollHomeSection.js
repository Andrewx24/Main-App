import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

const imagePaths = [
  require('../../assets/art/art1.jpg'),
  require('../../assets/art/art2.png'),
  require('../../assets/art/art3.png'),
  require('../../assets/art/art4.png'),
  require('../../assets/art/art5.png'),
  require('../../assets/art/art6.png'),
  require('../../assets/art/art7.png'),
  require('../../assets/art/art8.png'),
  require('../../assets/photos/mountain.jpg'),
  require('../../assets/photos/grass.jpg'),
  require('../../assets/photos/building.jpg'),
  require('../../assets/photos/man.jpg'),
  require('../../assets/photos/hand.jpg'),
  require('../../assets/photos/gray.jpg'),
  require('../../assets/photos/path.jpg'),
  require('../../assets/photos/animal.jpg'),
  require('../../assets/photos/sunset.jpg'),
  require('../../assets/photos/deer.jpg'),
];

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const ArtForYou = () => {
  const imageChunks = chunkArray(imagePaths, 8); // Chunk into groups of 8 images
  const scrollViewRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    let scrollValue = 0;
    let scrolledToEnd = false;
    let scrollTimer;

    const startScrollTimer = () => {
      scrollTimer = setTimeout(() => {
        setAutoScroll(true);
      }, 10000); // 10 seconds
    };

    const startAutoScroll = () => {
      scrollTimer && clearTimeout(scrollTimer);
      if (!autoScroll) {
        setAutoScroll(true);
      }
    };

    if (autoScroll) {
      const scrollInterval = setInterval(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: scrollValue, animated: true });
          if (!scrolledToEnd) {
            scrollValue += 5;
            if (scrollValue >= 300) { // Adjust this value according to your need
              scrolledToEnd = true;
            }
          } else {
            scrollValue -= 5;
            if (scrollValue <= 0) {
              scrolledToEnd = false;
            }
          }
        }
      }, 30); // Adjust the speed of the scrolling

      return () => clearInterval(scrollInterval);
    } else {
      startScrollTimer();
    }

    return () => {
      scrollTimer && clearTimeout(scrollTimer);
    };
  }, [autoScroll]);

  const handleScrollBeginDrag = () => {
    setAutoScroll(false);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.header}>Art for you</Text>
      <ScrollView
        horizontal
        style={styles.scrollView}
        ref={scrollViewRef}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16} // to ensure the scroll event is captured quickly
      >
        <View style={styles.row}>
          {imageChunks[0].map((path, index) => (
            <Image
              key={index}
              source={path}
              style={styles.image}
            />
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.row}>
          {imageChunks[1].map((path, index) => (
            <Image
              key={index}
              source={path}
              style={styles.image}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10, // Margin between rows
  },
  image: {
    width: 110,
    height: 110,
    marginRight: 10, // Margin between images in a row
    borderRadius: 5,
  },
});

export default ArtForYou;
