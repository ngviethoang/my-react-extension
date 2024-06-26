import { runSummarizer } from '../summarizer';

export const handleChapterPage = async () => {
  try {
    // Config
    const maxTokensPerPrompt = 5000;
    const autoNextPage = true;
    const summaryChapterSummariesOutputSentencesNum = 20;
    const summaryChapterOutputSentencesNum = 5;

    // parse data from current page
    document.querySelectorAll('#chapter-c div').forEach((e) => e.remove());
    document.querySelectorAll('#chapter-c a').forEach((e) => e.remove());
    const innerHtml = document.querySelector('#chapter-c').innerHTML;
    const chapterContent = innerHtml
      .replace(/<br>/g, '\n')
      .replace(/<[^>]*>/g, '\n')
      .replace(/\n+/g, '\n')
      .trim();
    const chapterTitle = document.querySelector('.chapter-title').textContent;
    const novelTitle = document.querySelector('.truyen-title').textContent;

    const goToNextPage = () => {
      document.querySelector('#next_chap').click();
    };

    runSummarizer(
      novelTitle,
      chapterTitle,
      chapterContent,
      goToNextPage,
      'vi',
      maxTokensPerPrompt,
      autoNextPage,
      summaryChapterSummariesOutputSentencesNum,
      summaryChapterOutputSentencesNum
    );
  } catch (error) {
    console.log('Retry handleChapterPage', error);
    // reload page
    window.location.reload();
  }
};
