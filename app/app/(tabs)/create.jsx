import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
//import { Video, ResizeMode } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createVideo } from "../../lib/appwrite";
import { icons } from "../../constants";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  const submit = async () => {
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      return Alert.alert("Plaese fill in all the fields");
    }
    setUploading(true);
    try {
      await createVideo(form);
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({ title: "", video: null, thumbnail: null, prompt: "" });
      setUploading(false);
    }
  };

  const player = useVideoPlayer(
    form.video ? form.video.uri : null,
    (player) => {
      player.loop = false;
    }
  );

  const handleRemoveVideo = () => {
    setForm({ ...form, video: null });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder={"Give your video a catch title..."}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <View className="w-full flex-row justify-between">
            <Text className="w-30 text-base text-gray-100 font-pmedium">
              Upload Video
            </Text>
            {form.video && (
              <TouchableOpacity
                className="w-30 px-2 h-5 bg-red-500 rounded-2xl justify-center items-center"
                onPress={handleRemoveVideo}
              >
                <Text className="text-white text-[10px] font-pmedium justify-center items-center">
                  Remove video
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <VideoView
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 12,
                }}
                player={player}
                //allowsFullscreen
                //allowsPictureInPicture
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="conatin"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="conatin"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder={"The prompt you used to create this video"}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Sumbit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
