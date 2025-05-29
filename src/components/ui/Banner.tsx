import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { colors } from "@/theme/colors";

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
    <Pressable onPress={handlePress} style={styles.container}>
      <LinearGradient
        colors={["#a8c30c", "#1f1f1f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {slug}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.rightSection}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
  },
  leftSection: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.text.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.text.primary,
    marginTop: 32,
    marginBottom: 10,
    lineHeight: 32,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rightSection: {
    flex: 1,
    padding: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  image: {
    width: 116,
    height: 116,
  },
});

export default Banner;