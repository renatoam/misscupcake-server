export interface PersistencePrice {
  id: string;
  product_id: string;
  price: number;
  discount: number;
}

export interface PersistenceAvailability {
  id: string;
  product_id: string;
  in_stock: boolean;
  total_quantity: number;
  sold_quantity: number; // talvez depreciar
  delivery_time: string;
}

export interface PersistenceImage {
  id: string;
  product_id: string;
  image_url: string;
}

export interface PersistenceRating {
  id: string;
  product_id: string;
  rating: number;
}

export interface PersistenceReview {
  id: string;
  product_id: string;
  review: string;
}

export interface PersistenceSpecification {
  id: string;
  product_id: string;
  size: string;
  flavor: string;
  weight: number;
  combo_quantity: number;
  frosting: string;
  ingredients: string;
  shelf_life: number;
  packaging: string;
  availability: string;
}

export interface PersistenceProductProps {
  id: string;
  name: string;
  description: string;
  product_price: PersistencePrice[];
  product_availability: PersistenceAvailability[];
  product_image: PersistenceImage[];
  product_rating: PersistenceRating[];
  product_review: PersistenceReview[];
  product_specification: PersistenceSpecification[];
}
