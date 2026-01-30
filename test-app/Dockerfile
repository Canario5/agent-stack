# =============================================================================
# Test App Container
# =============================================================================
# Minimal container for testing the sidecar architecture
# =============================================================================

FROM alpine:latest

# Create app directory
RUN mkdir -p /app

WORKDIR /app

# Keep container alive
CMD ["tail", "-f", "/dev/null"]
