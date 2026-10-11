# Provod AI Balance for DeepSeek Harness

Плагин DeepSeek Harness для отображения баланса API-профиля в нижней панели.

## Возможности

- запрос баланса выполняется через Host Harness, без браузерного CORS;
- API-ключ задаётся в настройках плагина;
- поддерживается собственный HTTPS endpoint;
- пользовательское название профиля;
- интервал обновления: 10, 15 или 30 секунд;
- поддерживаются поля `balance`, `availableBalance`, `available`, `amount`, `credits` и вложенные варианты в `data`.

## Установка в DeepSeek Harness

Установите локальный bundle через Plugin Manager или CLI:

```powershell
dsh plugin --profile desktop add https://github.com/pryanik-dev/provod-balance.git
```

После установки откройте:

**Plugins → @local/provod-balance → Configure**

Заполните название профиля, HTTPS endpoint и API-ключ, затем выберите интервал обновления.

## API-формат

По умолчанию используется:

```text
https://api.provod.ai/v1/balance
```

Запрос отправляется с заголовком:

```http
Authorization: Bearer YOUR_API_KEY
```

Пример ответа:

```json
{
  "availableBalance": 12.34
}
```

> Не добавляйте API-ключи в репозиторий, исходный код или README.
