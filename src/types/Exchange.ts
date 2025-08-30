export type Exchange = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  last: number;
  buy: number;
  sell: number;
  logo?: string; // опціонально: шлях до логотипу
};
