# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM nvcr.io/nvidia/base/ubuntu:jammy-20250415.1

RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy license information
RUN mkdir -p /legal
COPY LICENSE-3rd-party.txt /legal/

WORKDIR /app

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

RUN node -v && npm -v

ARG NEXT_PUBLIC_MODEL_NAME
ARG NEXT_PUBLIC_EMBEDDING_MODEL
ARG NEXT_PUBLIC_RERANKER_MODEL
ARG NEXT_PUBLIC_CHAT_BASE_URL
ARG NEXT_PUBLIC_VDB_BASE_URL

ENV NEXT_PUBLIC_MODEL_NAME=${NEXT_PUBLIC_MODEL_NAME}
ENV NEXT_PUBLIC_EMBEDDING_MODEL=${NEXT_PUBLIC_EMBEDDING_MODEL}
ENV NEXT_PUBLIC_RERANKER_MODEL=${NEXT_PUBLIC_RERANKER_MODEL}
ENV NEXT_PUBLIC_CHAT_BASE_URL=${NEXT_PUBLIC_CHAT_BASE_URL}
ENV NEXT_PUBLIC_VDB_BASE_URL=${NEXT_PUBLIC_VDB_BASE_URL}

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
