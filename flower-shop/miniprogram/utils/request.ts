import { API_BASE, CLIENT_ID_KEY } from './config';

export function getClientId(): string {
  let id = wx.getStorageSync(CLIENT_ID_KEY) as string;
  if (!id) {
    id = `c_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    wx.setStorageSync(CLIENT_ID_KEY, id);
  }
  return id;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function request<T = unknown>(
  path: string,
  options: {
    method?: Method;
    data?: WechatMiniprogram.IAnyObject | string;
  } = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${path}`,
      method,
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'x-client-id': getClientId(),
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
          return;
        }
        const body = res.data as { message?: string | string[] };
        const msg = Array.isArray(body?.message)
          ? body.message.join(', ')
          : body?.message || `请求失败(${res.statusCode})`;
        reject(new Error(msg));
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络错误'));
      },
    });
  });
}
