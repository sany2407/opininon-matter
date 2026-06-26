export interface Blog {
  id: number | string;
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  slug?: string;
  image?: string;
  cover_image?: string;
  category?: string | Category;
  categories?: { name: string };
  category_id?: number;
  author?: string;
  status?: string;
  readTime?: string;
  read_time?: string;
  published_date?: string;
  date?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface Category {
  id: number | string;
  _id?: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}
