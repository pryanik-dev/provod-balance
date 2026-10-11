window.__ModuleLoader__.load({
  id: '@pryanik-dev/provod-balance',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const DEFAULT_ENDPOINT = '/api/provod-balance/balance';
    const CONFIG_ENDPOINT = '/api/provod-balance/config';
    const readSettings = () => { try { return JSON.parse(localStorage.getItem('provod-balance.settings') || '{}'); } catch { return {}; } };
    const saveSettings = (value) => localStorage.setItem('provod-balance.settings', JSON.stringify(value));
    const getSettings = () => ({ endpoint: DEFAULT_ENDPOINT, intervalSeconds: 30, ...readSettings() });

    function BalanceIndicator() {
      const [state, setState] = React.useState({ status: 'loading', value: null, error: null });
      const refresh = React.useCallback(async () => {
        try {
          const settings = getSettings();
          const response = await fetch(DEFAULT_ENDPOINT, { headers: { accept: 'application/json' } });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
          const value = data.balance ?? data.availableBalance ?? data.available ?? data.amount ?? data.credits ?? data.data?.balance ?? data.data?.availableBalance ?? data.data?.available ?? data.data?.amount;
          if (value === undefined) throw new Error(data.message || data.error?.message || `Ответ API: ${JSON.stringify(data).slice(0, 180)}`);
          setState({ status: 'ok', value, error: null });
        } catch (error) { setState((previous) => ({ ...previous, status: 'error', error: error.message })); }
      }, []);
      React.useEffect(() => {
        refresh();
        const timer = setInterval(refresh, [10, 15, 30].includes(Number(getSettings().intervalSeconds)) ? Number(getSettings().intervalSeconds) * 1000 : 30000);
        const listener = () => refresh();
        window.addEventListener('provod-balance.settings-changed', listener);
        return () => { clearInterval(timer); window.removeEventListener('provod-balance.settings-changed', listener); };
      }, [refresh]);
      const settings = getSettings();
      const label = settings.profileName || 'Provod';
      const text = state.status === 'loading' ? 'Проверка…' : state.status === 'error' ? `ошибка: ${state.error || 'неизвестно'}` : `${state.value}`;
      return h('div', { title: state.status === 'error' ? `Баланс ${label}: ${state.error}` : `Баланс ${label}`, role: 'status', style: styles.root },
        h('span', { style: { ...styles.dot, background: state.status === 'ok' ? '#36c275' : state.status === 'loading' ? '#d6a83a' : '#d05050' } }),
        h('span', { style: styles.label }, label), h('strong', { style: styles.value }, text),
        h('button', { type: 'button', onClick: refresh, 'aria-label': 'Обновить баланс Provod AI', style: styles.button }, '↻'));
    }

    function SettingsPage({ view }) {
      const [settings, setSettings] = React.useState(() => getSettings());
      if (view === 'summary') return h('span', null, 'Свой endpoint, название профиля и интервал');
      const update = (key, value) => setSettings((old) => ({ ...old, [key]: value }));
      const save = async () => {
        const intervalSeconds = [10, 15, 30].includes(Number(settings.intervalSeconds)) ? Number(settings.intervalSeconds) : 30;
        const next = { ...settings, intervalSeconds, profileName: String(settings.profileName || 'Provod AI').trim() || 'Provod AI' };
        saveSettings(next);
        try {
          const response = await fetch(CONFIG_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ apiKey: next.apiKey || '', endpoint: next.endpoint || '', profileName: next.profileName }) });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (error) { window.alert(`Не удалось сохранить API-ключ в Harness: ${error.message}`); return; }
        window.dispatchEvent(new Event('provod-balance.settings-changed'));
      };
      return h('section', { style: styles.form },
        h('h3', null, 'Настройка Provod AI Balance'),
        h('p', { style: styles.help }, 'Harness выполняет запрос к Provod AI внутри Host, поэтому браузерный CORS не мешает.'),
        h('label', { style: styles.field }, 'Название профиля', h('input', { value: settings.profileName || 'Provod AI', onChange: (e) => update('profileName', e.target.value), style: styles.input, placeholder: 'Например: Мой сервер' })),
        h('label', { style: styles.field }, 'Свой сервер баланса (HTTPS endpoint)', h('input', { value: settings.endpoint || '', onChange: (e) => update('endpoint', e.target.value), style: styles.input, placeholder: 'https://example.com/v1/balance' })),
        h('label', { style: styles.field }, 'API-ключ', h('input', { type: 'password', value: settings.apiKey || '', onChange: (e) => update('apiKey', e.target.value), style: styles.input, autoComplete: 'off' })),
        h('label', { style: styles.field }, 'Проверять баланс', h('select', { value: settings.intervalSeconds, onChange: (e) => update('intervalSeconds', Number(e.target.value)), style: styles.input },
          h('option', { value: 10 }, 'Каждые 10 секунд'), h('option', { value: 15 }, 'Каждые 15 секунд'), h('option', { value: 30 }, 'Каждые 30 секунд'))),
        h('button', { type: 'button', onClick: save, style: styles.save }, 'Сохранить настройки'));
    }
    const styles = {
      root: { display: 'flex', alignItems: 'center', gap: 6, minHeight: 32, padding: '0 10px', color: 'var(--dsw-alias-text-secondary, #999)', fontSize: 12, whiteSpace: 'nowrap' },
      dot: { width: 6, height: 6, borderRadius: 6, flex: '0 0 auto' }, label: { opacity: .8 }, value: { color: 'var(--dsw-alias-text-primary, #eee)', fontWeight: 600 }, button: { border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 0 2px 3px' },
      form: { padding: 20, maxWidth: 560, color: 'var(--dsw-alias-text-primary, #eee)' }, help: { color: 'var(--dsw-alias-text-secondary, #999)', fontSize: 13 }, field: { display: 'grid', gap: 6, margin: '16px 0', fontSize: 13 }, input: { boxSizing: 'border-box', width: '100%', padding: '9px 10px', borderRadius: 6, border: '1px solid var(--dsw-alias-border, #555)', background: 'var(--dsw-alias-surface, #222)', color: 'inherit' }, save: { padding: '9px 14px', border: 0, borderRadius: 6, cursor: 'pointer', background: '#3b82f6', color: 'white' }
    };
    return { inject: ['slots'], apply(ctx) {
      ctx.slots.inject('sidebar.settings', () => ctx.slots.register({ name: 'sidebar.settings', id: 'provod-balance', order: 20 }, BalanceIndicator));
      ctx.slots.inject('plugins.row.config', () => ctx.slots.register({ name: 'plugins.row.config', key: '@pryanik-dev/provod-balance#provod-balance' }, SettingsPage));
    } };
  }
});
