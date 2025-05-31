/**
 * Interface representing banner data structure
 * Contains all necessary information for displaying promotional banners
 */
export interface BannerData {
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
}

/**
 * Returns current banner data for the application
 * Currently provides static data for Staff Cup II tournament
 * 
 * @returns Static banner data object
 */
export const getBannerData = (): BannerData => {
  return {
    title: "Staff Cup II",
    slug: "⚽ Futsal",
    date: "14 de Junio - 2025",
    imageUrl: "https://staff19torneos.com/wp-content/uploads/2025/05/logo_sc_f1f1f1.png"
  };
};

/*
// Future enhancement functions - dynamic banners
export const getActiveBanner = async (): Promise<BannerData> => {
  // Here you could make an API call
  // const response = await api.get('/banners/active');
  // return response.data;
  
  // For now returns static banner
  return getBannerData();
};

// Function to get multiple banners (for carousel)
export const getAllBanners = async (): Promise<BannerData[]> => {
  // Placeholder for multiple banners
  return [getBannerData()];
};
*/