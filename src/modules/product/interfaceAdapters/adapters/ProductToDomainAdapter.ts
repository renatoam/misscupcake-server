import { ProductProps } from "@product/domain/ProductProps";
import { PersistenceProductProps } from "../../frameworksDrivers/mappers/PersistenceProductProps";

export function productToDomainAdapter(persistence: PersistenceProductProps): ProductProps {
  const images = persistence.product_image.map(img => img.image_url)
  const reviews = persistence.product_review.map(review => review.review)
  const { price, discount } = { ...persistence.product_price[0] }
  const {
    in_stock,
    delivery_time,
    total_quantity,
    sold_quantity
  } = { ...persistence.product_availability[0] }
  const {
    availability,
    combo_quantity,
    flavor,
    frosting,
    ingredients,
    packaging,
    shelf_life,
    size,
    weight
  } = persistence.product_specification[0]

  return {
    id: persistence.id,
    name: persistence.name,
    description: persistence.description,
    images,
    price: {
      current: price,
      discount: discount
    },
    availability: {
      inStock: in_stock,
      deliveryTime: delivery_time,
      totalQuantity: total_quantity,
      soldQuantity: sold_quantity
    },
    specification: {
      availability,
      flavor,
      frosting,
      ingredients,
      packaging,
      quantityPerPackage: combo_quantity,
      shelfLife: shelf_life,
      size,
      weight
    },
    rating: persistence.product_rating[0].rating,
    reviews
  }
}
