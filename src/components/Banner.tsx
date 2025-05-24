// src/components/Banner.tsx
import { Text, View, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type BannerProps = {
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
};

const Banner = ({ title, slug, date, imageUrl }: BannerProps) => {
  const handlePress = () => {
    router.push("/web");
  };

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-2xl mb-4 overflow-hidden"
    >
      <LinearGradient
        colors={["#a8c30c", "#1f1f1f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-row">
          <View className="flex-1 p-6 justify-between">
            <View className="bg-white self-start px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold uppercase text-slate-900">
                {slug}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              className="text-3xl font-normal text-slate-100 mt-8 mb-2.5"
            >
              {title}
            </Text>
            <Text className="text-sm text-slate-200">{date}</Text>
          </View>
          <View className="flex-1 p-6 items-end justify-center">
            <Image
              source={{ uri: imageUrl }}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default Banner;
