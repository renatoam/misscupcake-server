export namespace Product {
  export interface Price {
    current: number;
    discount: number;
  }

  export interface Availability {
    inStock: boolean;
    totalQuantity: number;
    soldQuantity: number;
    deliveryTime: string;
  }

  export interface Rating {
    rating: number;
  }

  export interface Review {
    review: string[];
  }

  export interface Specification {
    size: string;
    flavor: string;
    weight: number;
    quantityPerPackage: number;
    frosting: string;
    ingredients: string;
    shelfLife: number;
    packaging: string;
    availability: string;
  }

  export interface Root {
    id: string;
    name: string;
    description: string;
    price: Price;
    availability: Availability;
    images: string[];
    rating: number;
    reviews: string[];
    specification: Specification;
  }
}
