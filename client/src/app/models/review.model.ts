export interface Review {
  id?: number;
  userID: number;
  productID: number;
  content: string;
  createAt: number;
  star: number;
}
