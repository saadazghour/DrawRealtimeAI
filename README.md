# Draw Real Time AI

## Introduction

**Draw Real Time AI** is a cutting-edge Application that harnesses the power of AI to generate real-time, visually engaging content directly from textual descriptions. Built using Next.js and integrated with Excalidraw and the Fal.ai serverless platform, this Application demonstrates the seamless blend of text to image transformation capabilities in a dynamic, user-driven environment.

## Features

- **Real-Time Image Generation**: Convert textual descriptions into high-quality images in real time.
- **Interactive Canvas**: Utilize Excalidraw for a fully interactive drawing experience.
- **AI-Enhanced Visuals**: Leverage Fal.ai's AI capabilities for instant image rendering.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- Yarn (Package Manager)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/saadazghour/DrawRealtimeAI.git
   ```

2. **Navigate to the project directory:**

   ```sh
   cd DrawRealtimeAI
   ```

3. **Install dependencies:**

   ```sh
   yarn install
   ```

### Configuration

    1. Rename `.env.local.example` to `.env.local`.
    2. Insert your Fal.ai API key in the `.env.local` file. You can find your API key on the [Fal.ai Dashboard](https://www.fal.ai/dashboard/keys).

### Running the Application

- Execute the following command to start the application:

  ```sh
   yarn run dev

   The app will be available at http://localhost:3000.
  ```

### How It Works

- Input your desired image description.
- The app processes the input using Fal.ai's real-time capabilities to generate an image.

* The image is rendered on the Excalidraw Canvas, where further interactions can be made.

### Contributing

- Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.
