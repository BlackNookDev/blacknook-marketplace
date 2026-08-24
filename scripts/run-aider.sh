#!/usr/bin/env bash
# Aider CLI kısayolu — proje kökünden: npm run aider
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Yerel pip --user bin yolu (macOS / Linux)
export PATH="${HOME}/Library/Python/3.9/bin:${HOME}/.local/bin:${PATH}"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
elif [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if ! command -v aider >/dev/null 2>&1; then
  echo "aider bulunamadı. Kurulum: python3 -m pip install --user aider-chat" >&2
  exit 1
fi

MODE="${1:-auto}"
shift || true

pick_model() {
  case "$MODE" in
    claude)
      if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
        echo "ANTHROPIC_API_KEY .env içinde tanımlı değil." >&2
        exit 1
      fi
      echo "claude-3-5-sonnet-20241022"
      ;;
    gpt)
      if [ -z "${OPENAI_API_KEY:-}" ]; then
        echo "OPENAI_API_KEY .env içinde tanımlı değil." >&2
        exit 1
      fi
      echo "gpt-4o"
      ;;
    auto|*)
      if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
        echo "claude-3-5-sonnet-20241022"
      elif [ -n "${OPENAI_API_KEY:-}" ]; then
        echo "gpt-4o"
      else
        echo "Ne ANTHROPIC_API_KEY ne OPENAI_API_KEY tanımlı. .env dosyasına anahtar ekleyin." >&2
        exit 1
      fi
      ;;
  esac
}

MODEL="$(pick_model)"
echo "Aider başlatılıyor → model: ${MODEL}"
exec aider --model "$MODEL" "$@"
