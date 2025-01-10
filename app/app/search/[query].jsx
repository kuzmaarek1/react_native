import { Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { searchPosts } from "../../lib/appwrite";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../context/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="my-6 px-4">
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>
                <View className="mt-6 mb-8">
                  <SearchInput initialQuery={query} />
                </View>
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

export default Search;
