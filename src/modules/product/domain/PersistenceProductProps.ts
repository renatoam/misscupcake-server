export namespace PersistenceProduct {
  export interface Price {
    id: string;
    product_id: string;
    price: number;
    discount: number;
  }

  export interface Availability {
    id: string;
    product_id: string;
    in_stock: boolean;
    total_quantity: number;
    sold_quantity: number;
    delivery_time: string;
  }

  export interface Image {
    id: string;
    product_id: string;
    image_url: string;
  }

  export interface Rating {
    id: string;
    product_id: string;
    rating: number;
  }

  export interface Review {
    id: string;
    product_id: string;
    review: string;
  }

  export interface Specification {
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

  export interface Root {
    id: string;
    name: string;
    description: string;
    product_price: Price[];
    product_availability: Availability[];
    product_image: Image[];
    product_rating: Rating[];
    product_review: Review[];
    product_specification: Specification[];
  }
}
