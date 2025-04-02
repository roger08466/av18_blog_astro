// 簡單的測試端點，用於確認Functions是否正常工作

export async function onRequest(context) {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'Cloudflare Pages Functions正常工作',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
