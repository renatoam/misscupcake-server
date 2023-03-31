import { getProducts } from "@product/features/getProducts";
import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository";
import { Request, Response, Router } from "express";
import mongoose from 'mongoose';

const router = Router()

interface ElementContent {
  name: string
  content: string
}

interface PageContent {
  name: string
  sections: ElementContent[]
}

const page = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  sections: [{
    name: String,
    elements: [
      {
        name: String,
        content: String
      }
    ]
  }]
})

const Page = mongoose.model('Page', page)

router.post('/content/pages', async (request: Request, response: Response) => {
  const { name, sections } = request.body as PageContent
  const newPage = new Page({ name, sections })

  try {
    const result = await newPage.save()
    return response.status(200).json(result)
  } catch (error) {
    return response.status(500).json({ message: error })
  }
})

router.patch('/content/pages/description', async (request: Request, response: Response) => {
  const { page, section, description } = request.body as any
  const result = await Page.findOne({ name: page })
  const sectionIndex = result?.sections.findIndex(sec => sec.name === section) ?? -1
  const descriptionIndex = result?.sections[sectionIndex].elements.findIndex(desc => {
      return desc.name === 'description'
    }) ?? -1

  if (!result) {
    return response.status(404).json({ message: 'page not found' })
  }

  if (sectionIndex < 0) {
    return response.status(400).json({ message: 'page is empty' })
  }

  if (descriptionIndex < 0) {
    return response.status(400).json({ message: 'element does not have description' })
  }

  result.sections[sectionIndex].elements[descriptionIndex].content = description

  try {
    result.save()
    return response.status(200).json(result)
  } catch (error) {
    return response.status(500).json({ message: error })
  }
})

router.get('/content/pages', async (request: Request, response: Response) => {
  const { name } = request.query as { name: string }

  try {
    const result = await Page.findOne({ name })
    console.log(result)
    return response.status(200).json(result)
  } catch (error) {
    console.log(error)
    return response.status(500).json({ message: error })
  }
})

router.get('/featured', async (_, response: Response) => {
  const productRepository = new CustomProductRepository()

  try {
    const products = await productRepository.getFeatured()

    return response.status(200).json(products.getValue())
  } catch (error) {
    return response.status(500).send('Something wrong.')
  }
})

router.get('/products', getProducts)

export default router
