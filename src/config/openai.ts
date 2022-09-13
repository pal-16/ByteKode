import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export { openai }