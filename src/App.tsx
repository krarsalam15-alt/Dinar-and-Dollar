/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ScreenDashboard } from './components/ScreenDashboard';
import { ScreenRates } from './components/ScreenRates';
import { ScreenGlobalEconomy } from './components/ScreenGlobalEconomy';
import { ScreenNews } from './components/ScreenNews';
import { ArticleModal } from './components/ArticleModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { NotificationsDrawer, NotificationItem } from './components/NotificationsDrawer';
import { ProfileModal } from './components/ProfileModal';
import { QuickConvertModal } from './components/QuickConvertModal';
import { Toast } from './components/Toast';

import {
  INITIAL_CURRENCIES,
  INITIAL_MACRO_INDICATORS,
  INITIAL_TICKERS,
  INITIAL_ECONOMIC_EVENTS,
  INITIAL_NEWS_ARTICLES,
  INITIAL_BANK_RATES,
} from './data/mockData';

import { CurrencyItem, NewsArticle, PriceAlert, BankRate } from './types/finance';
import { getCurrentDateInfo } from './utils/dateUtils';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('rates');

  // Data states
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(INITIAL_CURRENCIES);
  const [bankRates, setBankRates] = useState<BankRate[]>(INITIAL_BANK_RATES);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-1',
      currencyCode: 'XAU / USD',
      currencyName: 'أونصة الذهب الفوري',
      targetPrice: 2900,
      condition: 'above',
      createdAt: 'اليوم',
      isActive: true,
    },
    {
      id: 'alt-2',
      currencyCode: 'USD / IQD',
      currencyName: 'الدينار العراقي',
      targetPrice: 1500,
      condition: 'above',
      createdAt: 'اليوم',
      isActive: true,
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'صعود قياسي للذهب XAU/USD',
      body: 'سجلت أونصة الذهب الفوري مستوى 2,896 دولاراً متجاوزة الهدف الفني الأول.',
      timeAgo: 'منذ 10 دقائق',
      isRead: false,
      type: 'rate',
    },
    {
      id: 'n2',
      title: 'متابعة أسعار المصارف والبورصات',
      body: 'استقرار سعر صرف الدولار في بورصة الكفاح عند 1,490 دينار ومصرف الرافدين عند 1,320 دينار.',
      timeAgo: 'تحديث فوري',
      isRead: false,
      type: 'rate',
    },
    {
      id: 'n3',
      title: 'استقرار مؤشر الدولار DXY',
      body: 'تماسك المؤشر فوق 104 نقاط مع ثبات أسعار صرف العملات الخليجية المرتبطة.',
      timeAgo: 'منذ 45 دقيقة',
      isRead: true,
      type: 'market',
    },
  ]);

  // Automatic Real-Time Polling for Multi-Bank Rates (Auto-update every 25s)
  React.useEffect(() => {
    const bankTimer = setInterval(() => {
      setBankRates((prev) =>
        prev.map((bank) => {
          // Central bank and official government banks stay strictly pegged (1310/1320)
          if (bank.category === 'iraq-banks' && bank.bankCode !== 'NBI') {
            return { ...bank, lastUpdated: 'محدث رسمياً' };
          }
          // Slight realistic live market fluctuation for parallel bourses (+/- 0.5 - 1 dinar)
          if (bank.category === 'iraq-bourses') {
            const delta = (Math.random() - 0.49) > 0 ? 0.5 : -0.5;
            const newBuy = Math.round(bank.buyRate + delta);
            const newSell = newBuy + bank.spread;
            return {
              ...bank,
              buyRate: newBuy,
              sellRate: newSell,
              lastUpdated: 'الآن',
            };
          }
          return bank;
        })
      );
    }, 25000);

    return () => clearInterval(bankTimer);
  }, []);

  // Modals & Drawers
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertTargetCurrency, setAlertTargetCurrency] = useState<CurrencyItem | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isQuickConvertOpen, setIsQuickConvertOpen] = useState<boolean>(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const showToast = (msg: string, icon = 'check_circle') => {
    setToastMsg(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  };

  // Actions: Manual & Auto Refresh All Banks and Markets
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Refresh banks and currencies
      setBankRates((prev) =>
        prev.map((bank) => ({
          ...bank,
          lastUpdated: 'تم التحديث الآن',
        }))
      );
      showToast('تم تحديث أسعار الصرف في كافة المصارف والبورصات لحظياً', 'sync');
    }, 600);
  };

  const handleToggleBookmark = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const nextState = !art.isSaved;
          showToast(
            nextState ? 'تم حفظ المقال في قائمتك' : 'تمت إزالة المقال من المحفوظات',
            nextState ? 'bookmark_added' : 'bookmark_remove'
          );
          return { ...art, isSaved: nextState };
        }
        return art;
      })
    );
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('تم نسخ رابط التقرير للحافظة بنجاح', 'content_copy');
    }
  };

  const handleOpenAlertModal = (currency?: CurrencyItem | string) => {
    if (typeof currency === 'string') {
      const match = currencies.find((c) => c.code === currency);
      setAlertTargetCurrency(match);
    } else {
      setAlertTargetCurrency(currency);
    }
    setIsAlertModalOpen(true);
  };

  const handleSaveAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const alertObj: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: 'الآن',
      isActive: true,
    };
    setAlerts([alertObj, ...alerts]);
    setIsAlertModalOpen(false);
    showToast(`تم تفعيل تنبيه سعر ${newAlert.currencyCode} بنجاح`, 'notifications_active');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('تم حذف التنبيه', 'delete');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <Header
        currentTab={activeTab}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Body with Safe Paddings */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 max-w-xl mx-auto">
        {activeTab === 'rates' && (
          <ScreenRates
            currencies={currencies}
            bankRates={bankRates}
            onOpenAlertModal={handleOpenAlertModal}
          />
        )}

        {activeTab === 'dashboard' && (
          <ScreenDashboard
            onGoToNews={() => setActiveTab('news')}
            onGoToRates={() => setActiveTab('rates')}
            onOpenArticle={(art) => setSelectedArticle(art)}
            onOpenAlertModal={handleOpenAlertModal}
          />
        )}

        {activeTab === 'global' && (
          <ScreenGlobalEconomy
            macroIndicators={INITIAL_MACRO_INDICATORS}
            tickers={INITIAL_TICKERS}
            economicEvents={INITIAL_ECONOMIC_EVENTS}
            onOpenMacroReport={() => {
              const macroArticle = articles.find((a) => a.categoryFilter === 'forex');
              if (macroArticle) setSelectedArticle(macroArticle);
              else setActiveTab('news');
            }}
          />
        )}

        {activeTab === 'news' && (
          <ScreenNews
            articles={articles}
            onOpenArticle={(art) => setSelectedArticle(art)}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickConvert={() => setIsQuickConvertOpen(true)}
      />

      {/* Article Detail Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onToggleBookmark={handleToggleBookmark}
        onShare={handleShare}
        showToast={showToast}
      />

      {/* Price Alert Customizer Modal */}
      {isAlertModalOpen && (
        <PriceAlertModal
          initialCurrency={alertTargetCurrency}
          currencies={currencies}
          alerts={alerts}
          onClose={() => setIsAlertModalOpen(false)}
          onSaveAlert={handleSaveAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          showToast('تم تحديد جميع التنبيهات كمقروءة');
        }}
        onClearAll={() => {
          setNotifications([]);
          showToast('تم مسح جميع التنبيهات');
        }}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        showToast={showToast}
      />

      {/* Quick Convert Floating Modal */}
      <QuickConvertModal
        isOpen={isQuickConvertOpen}
        currencies={currencies}
        onClose={() => setIsQuickConvertOpen(false)}
        onGoToFullConverter={() => {
          setActiveTab('rates');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />

      {/* Interactive Toast Notifications */}
      <Toast message={toastMsg} iconName={toastIcon} />
    </div>
  );
}
