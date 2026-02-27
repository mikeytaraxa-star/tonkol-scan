# Tonkol Plugin for Teleton Agent

Track KOL (Key Opinion Leader) trades, activity, and performance on the TON blockchain via [Tonkol](https://tonkol.pro).

## Features

| Tool | Description |
|------|-------------|
| `tonkol_recent_trades` | Latest trades across all tracked KOLs |
| `tonkol_kol_activity` | Recent trading activity for a specific KOL |
| `tonkol_kol_stats` | Performance stats: PnL, volume, win rate, biggest win/loss |
| `tonkol_leaderboard` | Top KOL traders ranked by PnL (24h / 7d) |

## Installation

```bash
# Clone and build
git clone https://github.com/TONresistor/teleton-agent.git
cd teleton-agent
npm install

# Build the plugin
cd teleton-plugin-tonkol
npm install
npm run build

# Copy to plugins directory
mkdir -p ~/.teleton/plugins/tonkol
cp dist/index.js ~/.teleton/plugins/tonkol/
```

## Configuration

Add to your `config.yaml`:

```yaml
plugins:
  tonkol:
    enabled: true
```

## Usage Examples

Once enabled, the Teleton AI agent can use these tools:

- **"Show me the latest KOL trades on TON"** → `tonkol_recent_trades`
- **"What has wallet EQC... been trading?"** → `tonkol_kol_activity`
- **"Show me performance stats for this KOL"** → `tonkol_kol_stats`
- **"Who are the top TON traders this week?"** → `tonkol_leaderboard`

## Data Source

All data is fetched from the [Tonkol API](https://apitonkol.pro), which tracks KOL trading activity on TON DEXes including DeDust, Ston.fi, and others.

## License

MIT
