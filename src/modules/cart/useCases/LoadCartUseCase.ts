// async run(addToCartRequestDTO: AddToCartRequestDTO): Promise<Result<SimpleCartResponseDTO, Error>> {
  
  //   // const cartMessages: CartProps['messages'] = []
  //   const cartItems: CartItem[] = []

  //   if (productsOrError.isError()) {
  //     const error = productsOrError.getError()
  //     return Result.fail(error)
  //   }

  //   const rawProducts = productsOrError.getValue()
  //   rawProducts.forEach(product => {
  //     const productIdx = incomingProducts.findIndex(prod => prod.id === product.id)
  //     let productMessage = ''
  //     let productQuantity = incomingProducts[productIdx].quantity
      
  //     // if (product.availability.totalQuantity < productQuantity) {
  //     //   productQuantity = product.availability.totalQuantity
  //     //   productMessage = `Sorry, we only have ${productQuantity} left in stock for this item.`
  //     //   cartMessages.push(QUANTITY_ADJUSTED_MESSAGE)
  //     // }

  //     const discountAmount = product.discountAmount * productQuantity
  //     const subtotal = product.price * productQuantity
  //     const total = subtotal - discountAmount

  //     const newCartItem = CartItem.create({
  //       id: product.id,
  //       name: product.name,
  //       image: product.images[0],
  //       // discountAmount,
  //       // message: productMessage,
  //       quantity: productQuantity,
  //       unitPrice: product.price,
  //       // removed: !product.availability.inStock,
  //       subtotal,
  //       total
  //     })

  //     cartItems.push(newCartItem.getValue())
  //   })

  //   const cartOrError = Cart.create({ accountId: new UniqueEntityID(123), items: cartItems, status: '' })

  //   if (cartOrError.isError()) {
  //     return Result.fail(cartOrError.getError())
  //   }

  //   const rawCart = cartOrError.getValue()
  //   const newCart: SimpleCartResponseDTO = {
  //     cartId: rawCart.id.toString(),
  //     accountId: '',
  //     subtotal: rawCart.subtotal,
  //     total: rawCart.total,
  //     items: rawCart.items.map(item => simpleCartItemDTOAdapter(item))
  //   }

  //   return Result.success(newCart)
  // }