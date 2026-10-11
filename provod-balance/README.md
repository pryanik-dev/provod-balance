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

### macOS — установка из Release-архива

Установка git URL на macOS может определить репозиторий как обычную зависимость. Используйте архив релиза:

```bash
curl -L https://github.com/pryanik-dev/provod-balance/releases/download/v1.0.0/provod-balance-v1.0.0.zip -o provod-balance.zip
rm -rf provod-balance-install
mkdir provod-balance-install
unzip -o provod-balance.zip -d provod-balance-install

# Если команда dsh доступна в PATH:
dsh plugin --profile desktop add "$PWD/provod-balance-install"
```

Если `dsh` не найден, укажите распакованную папку в Harness: **Plugins → Add plugin**.

### Windows / CLI

```powershell
dsh plugin --profile desktop add C:\path\to\provod-balance
```

После установки откройте:

**Plugins → @pryanik-dev/provod-balance → Configure**

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
