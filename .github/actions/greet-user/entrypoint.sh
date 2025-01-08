# .github/actions/greet-user/entrypoint.sh

#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get the input
NAME="${INPUT_NAME}"

# Greet the user
echo "Hello, $NAME! Welcome to the GitHub Actions workflow."
