import { View, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUserPosts, signOut } from "../../lib/appwrite";
import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../context/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatars }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <InfoBox
                title={user?.username}
                conatinerStyles="mt-5"
                titleStyles="text-lg"
              />
              <View className="mt-5 flex-row">
                <InfoBox
                  title={posts.lenght || 0}
                  subtitle="Posts"
                  conatinerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Video Found"
              subtitle="No videos found for this search query"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
