export function trackEvent(event: string, data?: Record<string, any>) {
  try {
    const events = JSON.parse(localStorage.getItem('cn_analytics') || '[]');
    events.push({ event, data, ts: Date.now() });
    if (events.length > 200) events.splice(0, events.length - 200);
    localStorage.setItem('cn_analytics', JSON.stringify(events));
  } catch {}
}
