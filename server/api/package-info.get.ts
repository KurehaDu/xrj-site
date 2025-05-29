import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const packagePath = join(process.cwd(), 'package.json')
    const packageContent = readFileSync(packagePath, 'utf-8')
    const packageJson = JSON.parse(packageContent)
    
    return {
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '无法读取package.json文件'
    })
  }
}) 