# Agent OpenCode - Sidecar container

FROM debian:trixie-slim@sha256:109e2c65005bf160609e4ba6acf7783752f8502ad218e298253428690b9eaa4b

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
    # Create app and cache directories with proper permissions
    && mkdir -p /app /home/${USERNAME}/.cache \
    && chown -R ${USERNAME}:${USERNAME} /app /home/${USERNAME}

# Install OpenCode binary as root; move to system-wide location; clean residuals
RUN curl -fsSL https://opencode.ai/install | VERSION=${OPENCODE_VERSION} bash -s -- --no-modify-path \
    && mv /root/.opencode/bin/opencode /usr/local/bin/opencode \
    && rm -rf /root/.opencode

# Switch to non-root user
USER ${USERNAME}

# Set working directory
WORKDIR /app

# Simple healthcheck that verifies opencode is available
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD opencode --version || exit 1

# Keep container running - agent is accessed via docker exec
CMD ["tail", "-f", "/dev/null"]
