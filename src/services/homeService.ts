export interface BannerData {
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
}

export const getBannerData = (): BannerData => {
  return {
    title: "Staff Cup II",
    slug: "⚽ Futsal",
    date: "14 de Junio - 2025",
    imageUrl: "https://staff19torneos.com/wp-content/uploads/2025/05/logo_sc_f1f1f1.png"
  };
};

/*
// Función para futuras mejoras - banners dinámicos
export const getActiveBanner = async (): Promise<BannerData> => {
  // Aquí podrías hacer una llamada a la API
  // const response = await api.get('/banners/active');
  // return response.data;
  
  // Por ahora retorna el banner estático
  return getBannerData();
};

// Función para obtener múltiples banners (para carrusel)
export const getAllBanners = async (): Promise<BannerData[]> => {
  // Placeholder para múltiples banners
  return [getBannerData()];
};
*/