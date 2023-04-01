import { PageContent } from "@content/domain/ContentProps"
import { PageModel } from "@content/infrastructure/PageModel"
import { Request, Response, Router } from "express"

const contentRouter = Router()

contentRouter.post('/pages', async (request: Request, response: Response) => {
  const { name, sections } = request.body as PageContent
  const newPage = new PageModel({ name, sections })

  try {
    const result = await newPage.save()
    return response.status(200).json(result)
  } catch (error) {
    return response.status(500).json({ message: error })
  }
})

contentRouter.patch('/pages/description', async (request: Request, response: Response) => {
  const { page, section, description } = request.body
  const result = await Promise.resolve(PageModel.findOne({ name: page }))
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

contentRouter.get('/pages', async (request: Request, response: Response) => {
  const { name } = request.query as { name: string }

  try {
    const result = await Promise.resolve(PageModel.findOne({ name }))
    return response.status(200).json(result)
  } catch (error) {
    return response.status(500).json({ message: error })
  }
})

export default contentRouter
