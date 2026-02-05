
export enum SoilType {
  Select = '',
  Loamy = 'Loamy (Maira - میرا)',
  Clay = 'Clay (Chikni - چکنی)',
  Sandy = 'Sandy (Retli - ریتلی)',
  Silt = 'Silt (Bhal - بھل)',
  Peaty = 'Peaty (Organic - نامیاتی)',
  Chalky = 'Chalky (Choona - چونا)',
  Saline = 'Saline (Kallar - کلر)'
}

export enum CropType {
  Select = '',
  Wheat = 'Wheat (Gandum - گندم)',
  Rice = 'Rice (Chawal - چاول)',
  Cotton = 'Cotton (Kapas - کپاس)',
  Sugarcane = 'Sugarcane (Ganna - گنا)',
  Maize = 'Maize (Makai - مکئی)',
  Potato = 'Potato (Aloo - آلو)',
  Mango = 'Mango (Aam - آم)',
  Citrus = 'Citrus (Kino - کینو)',
  Mustard = 'Mustard (Sarson - سرسوں)',
  Sunflower = 'Sunflower (Suraj Mukhi - سورج مکھی)',
  Tomato = 'Tomato (Tamatar - ٹماٹر)',
  Onion = 'Onion (Pyaz - پیاز)',
  Garlic = 'Garlic (Lehsan - لہسن)',
  Peas = 'Peas (Matar - مٹر)',
  Chillies = 'Chillies (Mirch - مرچ)',
  Tobacco = 'Tobacco (Tambaku - تمباکو)',
  Sorghum = 'Sorghum (Jowar - جوار)',
  Millet = 'Millet (Bajra - باجرہ)',
  Barley = 'Barley (Jau - جو)',
  Gram = 'Gram (Chana - چنا)',
  MungBean = 'Mung Bean (Moong - مونگ)',
  Guava = 'Guava (Amrood - امرود)',
  Dates = 'Dates (Khajoor - کھجور)',
  Apple = 'Apple (Saib - سیب)',
  Grapes = 'Grapes (Angoor - انگور)'
}

export interface SoilData {
  soilType: SoilType;
  crop: string; // Changed to string to allow custom input
  nitrogen: number; // 0-100 scale (Low to High)
  phosphorus: number; // 0-100 scale
  potassium: number; // 0-100 scale
  phLevel: number; // 0-14
  moisture: string; // 'Dry', 'Moist', 'Wet'
}

export interface FertilizerPlan {
  name: string;
  dosage: string;
  applicationMethod: string;
  timing: string;
}

export interface AnalysisResult {
  soilHealthScore: number;
  nutrientStatus: {
    nitrogenStatus: string;
    nitrogenLevel?: number; // 0-100 estimated percentage
    phosphorusStatus: string;
    phosphorusLevel?: number; // 0-100 estimated percentage
    potassiumStatus: string;
    potassiumLevel?: number; // 0-100 estimated percentage
  };
  deficiencyAnalysis: string;
  fertilizerRecommendations: FertilizerPlan[];
  cropAdvice: string;
  localContext: string; // Specific advice for Pakistan region
  resultDate?: number;
  analysisType?: 'manual' | 'image'; // Added to track source of analysis
}

export interface CropProfile {
  id: string;
  name: string;
  localName: string;
  season: 'Rabi' | 'Kharif' | 'Zaid' | 'Perennial' | 'Spring/Autumn';
  soilPreference: string;
  phRange: string;
  waterRequirement: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
  color: string;
  category: 'Grains' | 'Fruits' | 'Vegetables' | 'Flowers';
}

export interface Reminder {
  id: string;
  crop: string;
  date: string;
  note: string;
  createdAt: number;
}

export interface SavedReport {
  id: string;
  date: number;
  soilData: SoilData;
  result: AnalysisResult;
}