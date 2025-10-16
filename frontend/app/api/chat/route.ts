import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Here you would integrate with your actual AI service
    // For now, we'll simulate a response based on common farming questions
    const response = await generateAIResponse(message);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simulated AI response function - Replace with actual AI integration
async function generateAIResponse(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerMessage = userMessage.toLowerCase();

  // Simple response logic - replace with actual AI model integration
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
    if (lowerMessage.includes('sandy') || lowerMessage.includes('sand')) {
      return "For sandy soil, I recommend crops like carrots, radishes, potatoes, and peanuts. Sandy soil drains well but needs regular watering and organic matter. Consider adding compost to improve water retention.";
    } else if (lowerMessage.includes('clay') || lowerMessage.includes('heavy')) {
      return "Clay soil is great for crops like cabbage, broccoli, Brussels sprouts, and kale. It holds moisture well but needs proper aeration. Consider adding sand and organic matter to improve drainage.";
    } else if (lowerMessage.includes('loam') || lowerMessage.includes('loamy')) {
      return "Loamy soil is ideal for most crops! You can grow tomatoes, peppers, corn, beans, and lettuce successfully. This soil type provides excellent drainage while retaining adequate moisture.";
    }
    return "I'd be happy to help with crop recommendations! Could you tell me about your soil type (sandy, clay, or loamy), climate conditions, and what season you're planning to plant in?";
  }

  if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
    return "For accurate weather analysis, I'll need your location. Generally, I can help you understand seasonal patterns, rainfall distribution, and temperature ranges for optimal planting times. Different crops have specific climate requirements for best growth.";
  }

  if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
    return "Water requirements depend on the crop, soil type, and climate. Most vegetables need 1-2 inches of water per week. Drip irrigation is often most efficient. I can provide specific watering schedules if you tell me what crops you're growing.";
  }

  if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
    return "For pest control, I recommend integrated pest management: use companion planting, natural predators, and organic pesticides when necessary. Common solutions include neem oil for aphids and diatomaceous earth for crawling insects. What specific pests are you dealing with?";
  }

  if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return "Plants need nitrogen (N), phosphorus (P), and potassium (K) in different ratios. Leafy greens need more nitrogen, while fruiting plants need more phosphorus. Organic options include compost, manure, and bone meal. Soil testing can help determine exact needs.";
  }

  if (lowerMessage.includes('organic') || lowerMessage.includes('natural')) {
    return "Organic farming focuses on soil health and natural methods. Key practices include crop rotation, cover cropping, composting, and biological pest control. These methods build sustainable soil ecosystems and can improve long-term productivity.";
  }

  // Default response for other queries
  return "Thank you for your question about farming! I'm here to help with crop selection, weather analysis, soil management, pest control, irrigation, and sustainable farming practices. Could you provide more specific details about your farming situation so I can give you the most accurate advice?";
}