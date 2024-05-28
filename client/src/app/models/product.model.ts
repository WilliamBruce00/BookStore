export interface Details {
  auchor: string;
  weight: string;
  page: number;
  size: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  CategoryID: number;
  details: Details;
}
