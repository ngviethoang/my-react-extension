import { GoogleGenerativeAI } from '@google/generative-ai';
import secrets from 'secrets';
import OpenAI from 'openai';
import { sleep } from './utils';

const geminiModel = 'gemini-1.5-pro';

export const countPromptTokens = async (prompt) => {
  const genAI = new GoogleGenerativeAI(secrets.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: geminiModel });
  const response = await model.countTokens(prompt);
  return response;
};

export const generateContent = async (prompt) => {
  const genAI = new GoogleGenerativeAI(secrets.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: geminiModel });

  const openai = new OpenAI({
    apiKey: secrets.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    // console.log(text);
    return text;
  } catch (error) {
    // try again after some time
    await sleep(3000);
    console.log('Retry generateContent');
    const text = await generateContent(prompt);
    return text;
  }
};

export const summaryChapterSummaries = async (
  summaries,
  outputSentencesNum = 10
) => {
  const currentChaptersSummaryPrompt = `Nhiệm vụ: Tóm tắt lại các tóm tắt của các chương trong một tiểu thuyết
  
Mục tiêu: Bạn được giao nhiệm vụ tạo một bản tóm tắt ngắn gọn về các sự kiện chính từ các tóm tắt của các chương của một tiểu thuyết. Chỉ sử dụng thông tin có trong nội dung dưới đây. Tóm tắt sao cho người đọc hiểu rõ hơn về nội dung, bối cảnh của tiểu thuyết để tạo ra một tóm tắt chương mới.

Hướng dẫn:
- Độ dài: Bản tóm tắt không được dài quá ${outputSentencesNum} câu. Cố gắng sử dụng ít câu hơn nếu được.
- Ngôn ngữ: Bản tóm tắt phải được viết bằng cùng ngôn ngữ với nội dung chương dưới đây: cụ thể là tiếng Việt
- Phong cách: Cố gắng khớp với phong cách viết của tiểu thuyết càng sát càng tốt. Không sử dụng mở đầu kiểu như "Chương này nói về", "Chương này bắt đầu với" hoặc tương tự.
- Nội dung: Chỉ tập trung vào các sự kiện chính. Không bao gồm bất kỳ thông tin bên ngoài hoặc chi tiết không có trong chương.
- Rõ ràng: Đảm bảo bản tóm tắt dễ hiểu, liền mạch và toàn diện.

Nội dung các tóm tắt:
${summaries}`;

  const result = await generateContent(currentChaptersSummaryPrompt);
  return result;
};

export const summaryChapter = async (
  content,
  previousSummary,
  outputSentencesNum = 5
) => {
  const chapterPrompt = `Nhiệm vụ: Tóm tắt Chương hiện tại của một Tiểu thuyết

Mục tiêu: Bạn được giao nhiệm vụ tạo một bản tóm tắt ngắn gọn về các sự kiện chính từ chương hiện tại của một tiểu thuyết. Chỉ sử dụng thông tin có trong nội dung chương dưới đây.

Hướng dẫn:
- Độ dài: Bản tóm tắt không được dài quá ${outputSentencesNum} câu. Cố gắng sử dụng ít câu hơn nếu được.
- Ngôn ngữ: Bản tóm tắt phải được viết bằng cùng ngôn ngữ với nội dung chương dưới đây: cụ thể là tiếng Việt
- Phong cách: Cố gắng khớp với phong cách viết của tiểu thuyết càng sát càng tốt. Không sử dụng mở đầu kiểu như "Chương này nói về", "Chương này bắt đầu với" hoặc tương tự.
- Nội dung: Chỉ tập trung vào các sự kiện chính. Không bao gồm bất kỳ thông tin bên ngoài hoặc chi tiết không có trong chương.
- Rõ ràng: Đảm bảo bản tóm tắt dễ hiểu, liền mạch và toàn diện.

Tóm tắt các chương trước:
${previousSummary}

Nội dung Chương:
${content}`;

  const result = await generateContent(chapterPrompt);
  return result;
};
