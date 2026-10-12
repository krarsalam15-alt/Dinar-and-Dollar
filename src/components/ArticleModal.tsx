import React, { useState } from 'react';
import { NewsArticle } from '../types/finance';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onToggleBookmark: (articleId: string) => void;
  onShare: (title: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onToggleBookmark,
  onShare,
  showToast,
}) => {
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  if (!article) return null;

  const handleVoiceListen = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      showToast('جارٍ قراءة المقال صوتياً', 'volume_up');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = `${article.title}. ${article.summary}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsSpeaking(false);
      showToast('تم إيقاف القراءة الصوتية', 'volume_off');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-[#eceef0]">
        {/* Header Actions */}
        <div className="p-4 flex items-center justify-between border-b border-[#eceef0] bg-[#f7f9fb]/90 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eceef0] text-[#191c1e] hover:bg-[#e0e3e5] active:scale-95 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="flex items-center bg-[#eceef0] rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setFontSizeOffset(Math.max(-2, fontSizeOffset - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-[#45464d] hover:text-[#191c1e]"
                title="تصغير الخط"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSizeOffset(Math.min(4, fontSizeOffset + 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold text-[#45464d] hover:text-[#191c1e]"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            {/* Read aloud */}
            <button
              type="button"
              onClick={handleVoiceListen}
              title="الاستماع للمقال"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                isSpeaking
                  ? 'bg-[#006c49] text-white animate-pulse'
                  : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">
                {isSpeaking ? 'volume_up' : 'headphones'}
              </span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(article.id)}
              className="w-9 h-9 rounded-full bg-[#eceef0] text-[#45464d] hover:text-[#191c1e] active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[19px]">
                {article.isSaved ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() => onShare(article.title)}
              className="w-9 h-9 rounded-full bg-[#eceef0] text-[#45464d] hover:text-[#191c1e] active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#eceef0] shadow-sm">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 right-3 bg-[#131a33]/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {article.sourceName}
            </span>
            <span className="absolute bottom-3 left-3 text-white text-[11px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#6ffbbe]/25 text-[#002113] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {article.categoryTag}
            </span>
            <span className="text-[11px] text-[#45464d] font-medium">{article.timeAgo}</span>
            {article.viewsCount && (
              <>
                <span className="text-[#c6c6ce]">•</span>
                <span className="text-[11px] text-[#45464d]">{article.viewsCount}</span>
              </>
            )}
          </div>

          <h2
            className="font-bold text-[#191c1e] leading-snug"
            style={{ fontSize: `${20 + fontSizeOffset}px` }}
          >
            {article.title}
          </h2>

          <div className="bg-[#f2f4f6] p-3.5 rounded-2xl border border-[#c6c6ce]/30">
            <span className="text-[11px] font-bold text-[#006c49] block mb-1">
              الخلاصة التنفيذية
            </span>
            <p
              className="text-[#191c1e] font-medium leading-relaxed"
              style={{ fontSize: `${14 + fontSizeOffset}px` }}
            >
              {article.summary}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-[#45464d] leading-relaxed">
            {article.fullContent?.map((paragraph, index) => (
              <p key={index} style={{ fontSize: `${14 + fontSizeOffset}px` }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-4 border-t border-[#eceef0] flex items-center justify-between text-[11px] text-[#45464d]">
            <span>قسم التحليل المالي • دينار و دولار</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#131a33] text-white font-bold rounded-xl active:scale-95"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
