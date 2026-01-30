# Agent OpenCode - Sidecar container

FROM debian:trixie-slim

# renovate: datasource=github-releases depName=anomalyco/opencode
ARG OPENCODE_VERSION=1.1.42

# Install essential tools in a single layer to minimize image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create nonroot opencode user with UID 1000 (common default)
ARG USERNAME=opencode
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    # Create app directory with proper permissions
    && mkdir -p /app \
    && chown -R ${USERNAME}:${USERNAME} /app

# Install OpenCode binary using the official install script
RUN curl -fsSL https://opencode.ai/install | VERSION=${OPENCODE_VERSION} bash

# Switch to non-root user
USER ${USERNAME}

# Set working directory
WORKDIR /app

# Simple healthcheck that verifies opencode is available
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD opencode --version || exit 1

# Keep container running - agent is accessed via docker exec
CMD ["tail", "-f", "/dev/null"]
