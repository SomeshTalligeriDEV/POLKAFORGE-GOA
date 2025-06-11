import axios from 'axios';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiAI {
  async analyzeCode(code: string, language: string): Promise<string> {
    try {
      const prompt = `
        Analyze the following ${language} code and provide:
        1. Code quality assessment (1-10 scale)
        2. Potential bugs or issues
        3. Security vulnerabilities
        4. Performance optimizations
        5. Best practices recommendations
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
      `;

      const response = await this.makeRequest(prompt);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error('Failed to analyze code');
    }
  }

  async fixCode(code: string, language: string, errorMessage?: string): Promise<string> {
    try {
      const prompt = `
        Fix the following ${language} code ${errorMessage ? `that has this error: ${errorMessage}` : ''}:
        
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide:
        1. Fixed code
        2. Explanation of what was wrong
        3. Prevention tips for similar issues
      `;

      const response = await this.makeRequest(prompt);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error fixing code:', error);
      throw new Error('Failed to fix code');
    }
  }

  async generateBountyDescription(title: string, requirements: string[]): Promise<string> {
    try {
      const prompt = `
        Create a detailed bounty description for a blockchain development task:
        
        Title: ${title}
        Requirements: ${requirements.join(', ')}
        
        Include:
        1. Clear task description
        2. Technical requirements
        3. Deliverables
        4. Acceptance criteria
        5. Estimated difficulty level
        6. Required skills
      `;

      const response = await this.makeRequest(prompt);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error generating bounty description:', error);
      throw new Error('Failed to generate bounty description');
    }
  }

  async chatWithAI(message: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:`
        : message;

      const response = await this.makeRequest(prompt);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async reviewCodeForNFT(code: string, language: string): Promise<{
    approved: boolean;
    score: number;
    feedback: string;
  }> {
    try {
      const prompt = `
        Review this ${language} code for NFT minting approval on PolkaForge:
        
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide a JSON response with:
        {
          "approved": boolean (true if code quality is 7/10 or above),
          "score": number (1-10 quality score),
          "feedback": "detailed feedback string"
        }
      `;

      const response = await this.makeRequest(prompt);
      const text = this.extractTextFromResponse(response);
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        approved: false,
        score: 5,
        feedback: text
      };
    } catch (error) {
      console.error('Error reviewing code:', error);
      return {
        approved: false,
        score: 0,
        feedback: 'Failed to review code'
      };
    }
  }

  private async makeRequest(prompt: string): Promise<GeminiResponse> {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  }

  private extractTextFromResponse(response: GeminiResponse): string {
    return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
  }
}

export const geminiAI = new GeminiAI();