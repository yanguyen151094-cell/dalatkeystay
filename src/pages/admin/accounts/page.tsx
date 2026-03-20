import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase, AdminProfile } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

interface AdminRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reject_reason: string | null;
}

type Tab = 'requests' | 'accounts';

const statusLabel: Record<string, { label: string; className: string }> = {
  pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-600' },
};

const roleLabel: Record<string, { label: string; className: string }> = {
  super_admin: { label: 'Admin Cấp 1', className: 'bg-amber-100 text-amber-700' },
  operator: { label: 'Admin Cấp 2', className: 'bg-sky-100 text-sky-700' },
};

const AdminAccounts = () => {
  const { adminProfile } = useAdminAuth();
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [accounts, setAccounts] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; email: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveModal, setApproveModal] = useState<AdminRequest | null>(null);
  const [approvePassword, setApprovePassword] = useState('');
  const [approveError, setApproveError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('admin_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests((data as AdminRequest[]) || []);
  };

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setAccounts((data as AdminProfile[]) || []);
  };

  useEffect(() => {
    Promise.all([fetchRequests(), fetchAccounts()]).then(() => setLoading(false));
  }, []);

  const handleApprove = async () => {
    if (!approveModal) return;
    if (!approvePassword || approvePassword.length < 6) {
      setApproveError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setActionLoading(approveModal.id);
    setApproveError('');

    // Create user in Supabase Auth via Admin API not available from client
    // Use edge function or manual creation note
    // For now: update request status to approved and show instructions
    const { error } = await supabase.from('admin_requests').update({
      status: 'approved',
      reviewed_by: adminProfile?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', approveModal.id);

    if (error) {
      setApproveError('Có lỗi xảy ra. Vui lòng thử lại.');
      setActionLoading(null);
      return;
    }

    // Create admin_profile record (user must sign up themselves with this email)
    // Show instructions to admin
    setActionLoading(null);
    setApproveModal(null);
    setApprovePassword('');
    await fetchRequests();
    showToast(`Đã phê duyệt ${approveModal.full_name}. Hãy tạo tài khoản Supabase Auth cho email: ${approveModal.email} và thêm vào admin_profiles.`);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    await supabase.from('admin_requests').update({
      status: 'rejected',
      reject_reason: rejectReason.trim() || null,
      reviewed_by: adminProfile?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', rejectModal.id);
    setActionLoading(null);
    setRejectModal(null);
    setRejectReason('');
    await fetchRequests();
    showToast('Đã từ chối yêu cầu.');
  };

  const handleToggleActive = async (account: AdminProfile) => {
    if (account.id === adminProfile?.id) return;
    setActionLoading(account.id);
    await supabase.from('admin_profiles').update({ is_active: !account.is_active }).eq('id', account.id);
    setActionLoading(null);
    await fetchAccounts();
    showToast(account.is_active ? 'Đã vô hiệu hoá tài khoản.' : 'Đã kích hoạt tài khoản.');
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Tài khoản Admin</h1>
          <p className="text-stone-500 text-sm mt-1">Phê duyệt đơn đăng ký và quản lý tài khoản</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 w-fit mb-6">
          <button
            onClick={() => setTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              tab === 'requests' ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Đơn đăng ký
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('accounts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              tab === 'accounts' ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Tài khoản hiện tại
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'requests' ? (
          <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            {requests.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-inbox-line text-4xl text-stone-300" />
                </div>
                <p className="text-sm">Chưa có đơn đăng ký nào</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Người đăng ký</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Liên hệ</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Lý do</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Ngày đăng ký</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-stone-800">{req.full_name}</p>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        <p>{req.email}</p>
                        {req.phone && <p className="text-stone-400 text-xs mt-0.5">{req.phone}</p>}
                      </td>
                      <td className="px-6 py-4 text-stone-500 max-w-xs">
                        <p className="text-xs line-clamp-2">{req.reason || '—'}</p>
                        {req.reject_reason && (
                          <p className="text-xs text-red-500 mt-1">Lý do từ chối: {req.reject_reason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(req.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabel[req.status].className}`}>
                          {statusLabel[req.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {req.status === 'pending' && (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => { setApproveModal(req); setApprovePassword(''); setApproveError(''); }}
                              disabled={actionLoading === req.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <div className="w-3.5 h-3.5 flex items-center justify-center">
                                <i className="ri-check-line text-xs" />
                              </div>
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => setRejectModal({ id: req.id, email: req.email })}
                              disabled={actionLoading === req.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <div className="w-3.5 h-3.5 flex items-center justify-center">
                                <i className="ri-close-line text-xs" />
                              </div>
                              Từ chối
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            {accounts.length === 0 ? (
              <div className="py-16 text-center text-stone-400 text-sm">Chưa có tài khoản nào</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Tài khoản</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Phân quyền</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Đăng nhập lần cuối</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-stone-800">{acc.full_name || '—'}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{acc.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleLabel[acc.role]?.className || 'bg-stone-100 text-stone-600'}`}>
                          {roleLabel[acc.role]?.label || acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {acc.last_login ? new Date(acc.last_login).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                          {acc.is_active ? 'Hoạt động' : 'Vô hiệu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {acc.id !== adminProfile?.id && (
                          <button
                            onClick={() => handleToggleActive(acc)}
                            disabled={actionLoading === acc.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                              acc.is_active
                                ? 'bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600'
                                : 'bg-green-50 hover:bg-green-100 text-green-600'
                            }`}
                          >
                            {acc.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'}
                          </button>
                        )}
                        {acc.id === adminProfile?.id && (
                          <span className="text-xs text-stone-400 italic">Tài khoản của bạn</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-stone-800 text-base mb-1">Phê duyệt đơn đăng ký</h3>
            <p className="text-stone-500 text-sm mb-4">
              Phê duyệt tài khoản cho <strong>{approveModal.full_name}</strong> ({approveModal.email})
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-amber-800 text-xs font-medium mb-1">Hướng dẫn sau khi phê duyệt:</p>
              <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                <li>Vào Supabase Dashboard → Authentication → Users</li>
                <li>Tạo user mới với email: <strong>{approveModal.email}</strong></li>
                <li>Chạy SQL để thêm vào admin_profiles với role &apos;operator&apos;</li>
              </ol>
            </div>
            <div className="bg-stone-50 rounded-lg px-4 py-3 mb-4">
              <p className="text-stone-600 text-xs font-medium mb-2">SQL cần chạy sau khi tạo user:</p>
              <code className="text-xs text-stone-700 block bg-stone-100 rounded p-2 leading-relaxed">
                {'INSERT INTO admin_profiles (id, email, full_name, role) VALUES ((SELECT id FROM auth.users WHERE email = \''}{approveModal.email}{'\'), \''}{approveModal.email}{'\', \''}{approveModal.full_name}{'\', \'operator\');'}
              </code>
            </div>
            {approveError && <p className="text-red-500 text-xs mb-3">{approveError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setApproveModal(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading === approveModal.id}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                {actionLoading === approveModal.id ? 'Đang xử lý...' : 'Xác nhận phê duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-stone-800 text-base mb-1">Từ chối đơn đăng ký</h3>
            <p className="text-stone-500 text-sm mb-4">Email: {rejectModal.email}</p>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Lý do từ chối (tuỳ chọn)</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Không đủ thông tin, không thuộc nhân sự công ty..."
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-red-400 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal.id}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                {actionLoading === rejectModal.id ? 'Đang xử lý...' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white text-sm rounded-lg px-4 py-3 z-50 animate-fade-in">
          {toastMsg}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAccounts;
