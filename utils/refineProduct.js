const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function refineProductDetails(productName){
    const prompt = `
    Refine the following product name for an e-commerce search auto-suggestion and generate 5 relevant keywords. 
    The refined name should be concise (maximum 30 characters), easily readable, and optimized for search.
    Include only the most crucial identifying information.
    Omit articles, common words, and any unnecessary details.
    Focus on brand, model, and one key feature if space allows.
  
    Product Name: "${productName}"
  
    Output format:
    Refined Name: [concise refined name, max 30 chars]
    Keywords: [keyword1], [keyword2], [keyword3], [keyword4], [keyword5]
    `;

    try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.7,
        });
    
        const result = response.choices[0].message.content.trim();
        const [refinedNameLine, keywordsLine] = result.split('\n');
        
        const refinedName = refinedNameLine.replace('Refined Name:', '').trim();
        const keywords = keywordsLine.replace('Keywords:', '').split(',').map(kw => kw.trim());
    
        return { refinedName, keywords };
      } catch (error) {
        console.error("Error with OpenAI API:", error);
        throw new Error("Failed to refine product details");
      }
    }
module.exports = refineProductDetails;