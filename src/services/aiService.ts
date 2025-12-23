interface AIConfig {
  platform: string
  apiKey: string
  model: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface SiliconFlowResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class AIService {
  private config: AIConfig | null = null

  constructor() {
    this.loadConfig()
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('ai-config')
      if (saved) {
        this.config = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load AI config:', error)
    }
  }

  public updateConfig(config: AIConfig) {
    this.config = config
  }

  public hasValidConfig(): boolean {
    return !!(this.config?.apiKey?.trim())
  }

  public async askQuestion(question: string, options: string[] = []): Promise<string> {
    if (!this.hasValidConfig()) {
      throw new Error('AI配置无效，请先配置API Key')
    }

    if (this.config!.platform === 'siliconflow') {
      return this.callSiliconFlow(question, options)
    }

    throw new Error('不支持的AI平台')
  }

  private async callSiliconFlow(question: string, options: string[]): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的学习助手。请用简洁明了的方式回答问题，直接说明答案和关键理由，不要冗长的解释。'
      },
      {
        role: 'user',
        content: this.formatQuestionForAI(question, options)
      }
    ]

    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config!.apiKey}`
        },
        body: JSON.stringify({
          model: this.config!.model || 'deepseek-ai/DeepSeek-V3',
          messages: messages,
          temperature: 0.3,
          max_tokens: 300,
          stream: false
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('SiliconFlow API error:', errorText)
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
      }

      const data: SiliconFlowResponse = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('AI返回了空响应')
      }

      let content = data.choices[0].message.content

      // 移除DeepSeek-R1的thinking内容
      content = this.removeThinkingContent(content)

      return content.trim()
    } catch (error) {
      console.error('AI service error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('AI请求失败，请检查网络连接和API Key')
    }
  }

  private formatQuestionForAI(question: string, options: string[]): string {
    let prompt = `题目：${question}\n`
    
    if (options.length > 0) {
      prompt += '\n选项：\n'
      options.forEach((option, index) => {
        prompt += `${String.fromCharCode(65 + index)}. ${option}\n`
      })
    }
    
    prompt += '\n请回答：为什么选这个答案？只需要关键理由，不要长篇解释。和其它选项错在哪里？'
    
    return prompt
  }

  private removeThinkingContent(content: string): string {
    // 移除DeepSeek-R1的thinking标签内容
    return content
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/\*\*思考过程：\*\*[\s\S]*?(?=\n\n|\n\*\*|$)/gi, '')
      .replace(/思考：[\s\S]*?(?=\n\n|\n[^\n]|$)/gi, '')
      .trim()
  }
}

export const aiService = new AIService()