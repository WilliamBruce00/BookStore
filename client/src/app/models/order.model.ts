enum Status {
  PROCESSING = 'Đang xử lý',
  PENDING = 'Đang thực hiện',
  COMPLETED = 'Hoàn thành',
}

interface Details {
  id: number;
  name: string;
  price: number;
  img: string;
  CategoryID: number;
  quantity: number;
}

export interface Order {
  id?: number;
  fullname: string;
  phone: string;
  address: string;
  total: number;
  createAt: number;
  status: Status;
  userID: number;
  details: Details[];
}
