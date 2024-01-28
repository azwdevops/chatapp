"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Home() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  let allMessages = [];

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("95d8ba1b23ea2532c0e5", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      allMessages.push(data);
      setMessages(allMessages);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        message,
      }),
    });
    setMessage("");
  };

  return (
    <main>
      <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <div
          href="/"
          class="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom"
        >
          <input
            type="text"
            class="fs-5 fw-semibold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div
          class="list-group list-group-flush border-bottom scrollarea"
          style={{ minHeight: "500px" }}
        >
          {messages?.map((message) => (
            <div class="list-group-item list-group-item-action py-3 lh-sm">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <strong class="mb-1">{message?.username}</strong>
              </div>
              <div class="col-10 mb-1 small">{message?.message}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}
