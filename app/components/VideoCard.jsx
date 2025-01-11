import { View, Text, Image, TouchableOpacity } from "react-native";
import { useEvent } from "expo";
import React, { useState } from "react";
import { icons } from "../constants";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoCard = ({ video: { title, thumbnail, video }, users }) => {
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
  });

  const handlePlay = () => {
    if (isFirstPlay) {
      setIsFirstPlay(false);
    }
    player.play();
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center">
            <Image
              source={{ uri: users?.avatars }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {users?.username}
            </Text>
          </View>
        </View>
        <View>
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      <View className="w-full h-60 relative">
        {isFirstPlay ? (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            activeOpacity={0.7}
            onPress={handlePlay}
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full rounded-xl mt-3"
              resizeMethod="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <VideoView
            style={{
              width: "100%",
              height: 240,
              borderRadius: 12,
              marginTop: 12,
            }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>
    </View>
  );
};

export default VideoCard;
