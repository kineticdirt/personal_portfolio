# .github/actions/greet-user/Dockerfile

FROM ubuntu:20.04

# Install dependencies if needed
# For simple echo, no dependencies are required

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
