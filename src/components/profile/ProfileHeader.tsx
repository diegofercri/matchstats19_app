import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@colors';
import { User } from '@types';
import { getInitials } from '@services/profileService';

interface ProfileHeaderProps {
  profile: User;
  onEditPress: () => void;
}

export function ProfileHeader({ profile, onEditPress }: ProfileHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.imageSection}>
        <ProfileImage profile={profile} />
        <Pressable style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="camera-outline" size={20} color={colors.interactive.primaryText} />
        </Pressable>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>
      </View>
    </View>
  );
}

// Separate component for profile image
interface ProfileImageProps {
  profile: User;
}

const ProfileImage = ({ profile }: ProfileImageProps) => (
  <View style={styles.imageContainer}>
    {profile.image ? (
      <Image source={{ uri: profile.image }} style={styles.image} />
    ) : (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>{getInitials(profile.name)}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  imageSection: {
    position: 'relative',
    marginBottom: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.interactive.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.interactive.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});