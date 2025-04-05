# Use the official Bun runtime
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the entire project
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["bun", "run", "src/index.ts"]
