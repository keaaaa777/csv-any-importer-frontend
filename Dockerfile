FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends bash git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# npm の optional 問題を避けるため pnpm を使用
RUN npm install -g pnpm

# Windows 生成の lock を持ち込まないため、まず package.json のみ
COPY package.json ./

# optional を無効化しても、上で「通常の dev 依存」にしたネイティブは確実に入る
ENV npm_config_optional=false

# 依存インストール（ここで rollup/esbuild のネイティブも入る）
RUN pnpm install --no-optional --frozen-lockfile=false

# 残りのソース
COPY . .

EXPOSE 5173
CMD ["pnpm","run","dev","--","--host","0.0.0.0"]
