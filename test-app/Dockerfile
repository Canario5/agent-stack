# =============================================================================
# Test App Container
# =============================================================================
# Minimal container for testing the sidecar architecture
# =============================================================================

FROM alpine:latest@sha256:5b10f432ef3da1b8d4c7eb6c487f2f5a8f096bc91145e68878dd4a5019afde11

# Create app directory
RUN mkdir -p /app

WORKDIR /app

# Keep container alive
CMD ["tail", "-f", "/dev/null"]
