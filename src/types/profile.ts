/**
 * Interface representing a user profile
 * Contains personal information and identification data for app users
 */
export interface Profile {
  id: string;
  name: string;
  surname: string;
  email: string;
  image: string;
}