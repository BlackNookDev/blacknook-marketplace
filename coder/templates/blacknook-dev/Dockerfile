# Blacknook Developer Workspace Image
# Node.js LTS + Python 3 + Git + code-server (OpenVSCode uyumlu tarayıcı IDE)
FROM codercom/enterprise-base:ubuntu

USER root

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && curl -fsSL https://code-server.dev/install.sh | sh \
  && npm install -g npm@latest \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

USER coder

WORKDIR /home/coder

LABEL org.opencontainers.image.title="Blacknook Developer Workspace" \
      org.opencontainers.image.description="Node LTS, Python 3, Git, code-server" \
      org.opencontainers.image.source="https://blacknook.com"
