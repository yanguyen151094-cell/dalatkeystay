import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string | null;
}

type SectionConfig = {
  label: string;
  icon: string;
  fields: { key: string; label: string; type: 'text' | 'textarea' | 'url' }[];
};

const sectionConfigs: Record<string, SectionConfig> = {
  general: {
    label: 'Thông tin thương hiệu',
    icon: 'ri-building-4-line',
    fields: [
      { key: 'brand_name', label: 'Tên thương hiệu', type: 'text' },
      { key: 'tagline', label: 'Slogan', type: 'text' },
      { key: 'description', label: 'Mô tả ngắn', type: 'textarea' },
    ],
  },
  homepage: {
    label: 'Trang chủ',
    icon: 'ri-home-4-line',
    fields: [
      { key: 'hero_title', label: 'Tiêu đề Hero', type: 'text' },
      { key: 'hero_subtitle', label: 'Mô tả Hero', type: 'textarea' },
      { key: 'hero_cta', label: 'Nút kêu gọi hành động', type: 'text' },
      { key: 'stat_properties', label: 'Số căn hộ (hiển thị)', type: 'text' },
      { key: 'stat_properties_label', label: 'Nhãn căn hộ', type: 'text' },
      { key: 'stat_guests', label: 'Số khách (hiển thị)', type: 'text' },
      { key: 'stat_guests_label', label: 'Nhãn khách', type: 'text' },
      { key: 'stat_rating', label: 'Điểm đánh giá', type: 'text' },
      { key: 'stat_rating_label', label: 'Nhãn đánh giá', type: 'text' },
      { key: 'stat_years', label: 'Số năm kinh nghiệm', type: 'text' },
      { key: 'stat_years_label', label: 'Nhãn kinh nghiệm', type: 'text' },
      { key: 'why_title', label: 'Tiêu đề mục "Tại sao chọn"', type: 'text' },
      { key: 'why_subtitle', label: 'Mô tả mục "Tại sao chọn"', type: 'textarea' },
    ],
  },
  contact: {
    label: 'Thông tin liên hệ',
    icon: 'ri-phone-line',
    fields: [
      { key: 'phone', label: 'Số điện thoại', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'address', label: 'Địa chỉ', type: 'textarea' },
      { key: 'working_hours', label: 'Giờ làm việc', type: 'text' },
      { key: 'facebook', label: 'Link Facebook', type: 'url' },
      { key: 'instagram', label: 'Link Instagram', type: 'url' },
      { key: 'zalo', label: 'Zalo (số điện thoại)', type: 'text' },
    ],
  },
};

const AdminContent = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [dirty, setDirty] = useState<Record<string, Record<string, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from('site_content').select('*');
    const map: Record<string, Record<string, string>> = {};
    (data as ContentItem[] || []).forEach(item => {
      if (!map[item.section]) map[item.section] = {};
      map[item.section][item.key] = item.value || '';
    });
    setContent(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleChange = (section: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setDirty(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: true },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const sectionDirty = dirty[activeSection] || {};
    const updates = Object.entries(sectionDirty)
      .filter(([, isDirty]) => isDirty)
      .map(([key]) => ({
        section: activeSection,
        key,
        value: content[activeSection]?.[key] || '',
        updated_at: new Date().toISOString(),
      }));

    if (updates.length === 0) {
      setSaving(false);
      showToast('Không có thay đổi nào cần lưu.');
      return;
    }

    const { error } = await supabase
      .from('site_content')
      .upsert(updates, { onConflict: 'section,key' });

    setSaving(false);
    if (error) {
      showToast('Lỗi khi lưu. Vui lòng thử lại.', 'error');
    } else {
      setDirty(prev => ({ ...prev, [activeSection]: {} }));
      showToast('Đã lưu thành công!');
    }
  };

  const hasDirty = Object.values(dirty[activeSection] || {}).some(Boolean);
  const section = sectionConfigs[activeSection];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Chỉnh sửa nội dung website</h1>
          <p className="text-stone-500 text-sm mt-1">
            Cập nhật toàn bộ nội dung hiển thị trên website mà không cần chỉnh code
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar sections */}
            <div className="w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                {Object.entries(sectionConfigs).map(([sectionKey, cfg]) => (
                  <button
                    key={sectionKey}
                    onClick={() => setActiveSection(sectionKey)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer border-b border-stone-50 last:border-0 ${
                      activeSection === sectionKey
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${cfg.icon} text-base`} />
                    </div>
                    <span>{cfg.label}</span>
                    {Object.values(dirty[sectionKey] || {}).some(Boolean) && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-lightbulb-line text-amber-600 text-sm" />
                  </div>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Sau khi lưu, nội dung sẽ cập nhật ngay trên website. Khách hàng sẽ thấy
                    thay đổi khi tải lại trang.
                  </p>
                </div>
              </div>
            </div>

            {/* Content editor */}
            <div className="flex-1">
              <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-lg">
                      <i className={`${section.icon} text-amber-600 text-base`} />
                    </div>
                    <h2 className="font-semibold text-stone-800 text-sm">{section.label}</h2>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || !hasDirty}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {saving ? (
                        <i className="ri-loader-4-line text-sm animate-spin" />
                      ) : (
                        <i className="ri-save-line text-sm" />
                      )}
                    </div>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {section.fields.map(field => {
                    const isDirty = dirty[activeSection]?.[field.key];
                    const val = content[activeSection]?.[field.key] || '';
                    return (
                      <div key={field.key}>
                        <label className="flex items-center gap-2 text-xs font-medium text-stone-600 mb-1.5">
                          {field.label}
                          {isDirty && (
                            <span className="text-amber-500 text-xs">● Chưa lưu</span>
                          )}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={val}
                            onChange={e => handleChange(activeSection, field.key, e.target.value)}
                            rows={3}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y transition-colors"
                          />
                        ) : (
                          <input
                            type={field.type === 'url' ? 'url' : 'text'}
                            value={val}
                            onChange={e => handleChange(activeSection, field.key, e.target.value)}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {hasDirty && (
                  <div className="px-6 py-4 border-t border-stone-100 bg-amber-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700 text-xs">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-edit-line text-sm" />
                      </div>
                      Có thay đổi chưa được lưu trong phần này
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu ngay'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 text-white text-sm rounded-lg px-4 py-3 z-50 flex items-center gap-2 ${
            toastType === 'success' ? 'bg-stone-900' : 'bg-red-600'
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={toastType === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
          </div>
          {toastMsg}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContent;
