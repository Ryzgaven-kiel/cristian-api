# BlackboxAI API

This project provides a simple API interface to communicate with the BlackboxAI service using Express.js and Axios. The API allows users to send messages and manage conversations with the AI model of their choice.

## Features

- Send and continue conversations with BlackboxAI.
- Supports dynamic model selection.
- Maintains conversation history using unique conversation IDs.
- Error handling for various scenarios.

### Getting Started

### Prerequisites

- Node.js (>= 12.x)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/notsopreety/blackbox-api.git
   cd blackboxai-api
   ```

2. Install the required dependencies:

   ```bash
   npm install express axios
   ```

### Usage

1. Run the server:

   ```bash
   node index.js
   ```

2. The server will start on `http://localhost:3000`.

### API Endpoints

#### Send a Message

- **Endpoint**: `/api/blackbox`
- **Method**: `GET`
- **Query Parameters**:
  - `text`: The user's message (required).
  - `conversationId`: A unique identifier for the conversation (required).
  - `model`: The AI model to use (optional). If not provided, it defaults to `blackboxai`.

**Example Request**:

```http
GET http://localhost:3000/api/blackbox?text=Hello%20AI&conversationId=1&model=gpt-4o
```

**Example Response**:

```json
{
  "response": "AI's response here."
}
```
**Test Deployed API**:

```http
GET https://blackbox-api-chi.vercel.app/api/blackbox?text=Hello%20AI&conversationId=435HGS&model=gpt-4o
```

### Error Handling

The API handles various error scenarios, including:

- Missing required parameters (`text` and `conversationId`).
- Server errors while communicating with the BlackboxAI service.

In case of an error, the response will include an appropriate error message and status code.

### Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. All contributions are welcome!

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Author

Samir Thakuri  
[My GitHub Profile](https://github.com/notsopreety)
