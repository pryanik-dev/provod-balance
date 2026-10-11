# Installation — Provod AI Balance 1.0.0

## DeepSeek Harness Plugin Manager

1. Open **Plugins** in DeepSeek Harness.
2. Choose **Add plugin**.
3. Enter:

   `https://github.com/pryanik-dev/provod-balance.git`

4. Enable `@pryanik-dev/provod-balance`.
5. Open **Configure** and enter the profile name, HTTPS balance endpoint, API key, and interval (10, 15, or 30 seconds).

## CLI

```powershell
dsh plugin --profile desktop add https://github.com/pryanik-dev/provod-balance.git
```

Restart or refresh DeepSeek Harness after installation if the plugin does not appear immediately.

## Release archive

The `provod-balance-v1.0.0.zip` asset contains the complete plugin bundle. For a local install, extract it and install the extracted folder:

```powershell
dsh plugin --profile desktop add .\provod-balance
```

Never commit an API key to the repository or release archive.
