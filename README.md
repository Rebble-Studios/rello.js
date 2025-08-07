# Rello.js

A Discord.js-like library for React applications that connects to a WebSocket server on `127.0.0.1:4455`.

## Installation

```bash
npm install rello.js
# or
pnpm add rello.js
```

## Basic Usage

### Traditional Client Usage

```typescript
import { Client } from 'rello.js/client';

const client = new Client({
    token: 'your-auth-token',
    wsOptions: {
        url: 'ws://127.0.0.1:4455'
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
    console.log('Logged in as:', client.user?.username);
});

client.on('error', (error) => {
    console.error('Client error:', error);
});

// Login to the service
await client.login();
```

### React Hook Usage

```typescript
import React from 'react';
import { useClient } from 'rello.js/client';

function App() {
    const { client, user, isReady, isConnected, error, login, disconnect } = useClient({
        token: 'your-auth-token',
        autoConnect: true // Automatically connect on mount
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!isConnected) {
        return <div>Connecting...</div>;
    }

    if (!isReady) {
        return <div>Authenticating...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user?.username}!</h1>
            <p>Status: {isReady ? 'Ready' : 'Not Ready'}</p>
            <button onClick={() => disconnect()}>
                Disconnect
            </button>
        </div>
    );
}
```

## API Reference

### Client

The main client class for connecting to the service.

#### Constructor Options

```typescript
interface ClientOptions {
    token: string;
    restOptions?: {
        baseURL?: string;
        userAgent?: string;
        timeout?: number;
    };
    wsOptions?: {
        url?: string;
        reconnectInterval?: number;
        maxReconnectAttempts?: number;
        heartbeatInterval?: number;
    };
}
```

#### Events

- `ready` - Emitted when the client is ready
- `disconnect` - Emitted when the client disconnects
- `reconnect` - Emitted when the client attempts to reconnect
- `error` - Emitted when an error occurs

#### Methods

- `login(token?: string)` - Login to the service
- `disconnect()` - Disconnect from the service

#### Properties

- `token` - The authentication token
- `user` - The current user (available after login)
- `rest` - REST manager for HTTP requests
- `ws` - WebSocket manager for real-time communication
- `state` - State manager for caching
- `isReady` - Whether the client is ready
- `isConnected` - Whether the client is connected

### RESTManager

Handles HTTP requests to the API.

```typescript
// GET request
const data = await client.rest.get('/endpoint');

// POST request
const result = await client.rest.post('/endpoint', { data: 'value' });

// Custom request
const response = await client.rest.request('/endpoint', {
    method: 'PUT',
    body: { update: 'value' },
    headers: { 'Custom-Header': 'value' }
});
```

### WebSocketManager

Manages the WebSocket connection.

```typescript
// Check connection status
console.log(client.ws.isConnected);

// Send custom message
client.ws.send({
    op: 0,
    d: { type: 'custom', data: 'value' }
});
```

### useClient Hook

React hook for managing client connection.

```typescript
const {
    client,      // Client instance
    user,        // Current user
    isReady,     // Ready status
    isConnected, // Connection status
    error,       // Last error
    login,       // Login function
    disconnect   // Disconnect function
} = useClient(options);
```

## Protocol

The WebSocket connection follows a Discord-like protocol:

### OpCodes

- `0` (DISPATCH) - Server dispatches an event
- `1` (HEARTBEAT) - Client heartbeat
- `2` (IDENTIFY) - Client identification
- `10` (HELLO) - Server hello with heartbeat interval
- `11` (HEARTBEAT_ACK) - Server heartbeat acknowledgment

### Authentication Flow

1. Client connects to WebSocket
2. Server sends HELLO with heartbeat interval
3. Client starts heartbeat and sends IDENTIFY with token
4. Server responds with READY event containing user data

## License

ISC
