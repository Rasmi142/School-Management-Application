# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build-time variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY

# Make variables available during build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
ENV NEXT_PUBLIC_CLOUDINARY_API_KEY=${NEXT_PUBLIC_CLOUDINARY_API_KEY}

# Generate Database
RUN npx prisma migrate dev --name init

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
