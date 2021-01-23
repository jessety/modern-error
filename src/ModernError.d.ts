export default class ModernError extends Error {

  constructor(message: string)

  constructor(error: Error)

  constructor(message: string, options?: {
    [key: string]: unknown
  })

  constructor(options: {
    message: string
    [key: string]: unknown
  })
}
