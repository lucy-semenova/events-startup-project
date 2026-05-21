import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
function readDb() {
  const data = fs.readFileSync("./db.json", "utf-8");
  return JSON.parse(data);
}

const orders = [];

apiRouter.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

apiRouter.get("/events", (req, res) => {
  const searchText = req.query.q;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;

  const db = readDb();
  let filteredEvents = db.events;

  if (searchText && searchText.length >= 2) {
    filteredEvents = filteredEvents.filter((event) => {
      const eventTitle = event.title.toLowerCase();
      const searchTextLowerCase = searchText.toLowerCase();

      return eventTitle.includes(searchTextLowerCase);
    });
  }

  const selectedCategory = req.query.category;

  if (selectedCategory) {
    filteredEvents = filteredEvents.filter(
      (event) => event.category === selectedCategory,
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  res.json({
    events: paginatedEvents,
    totalEvents: filteredEvents.length,
    currentPage: page,
    totalPages: Math.ceil(filteredEvents.length / limit),
  });
});

apiRouter.get("/events/:id", (req, res) => {
  const db = readDb();
  const eventId = Number(req.params.id);

  const event = db.events.find((event) => event.id === eventId);

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(event);
});

apiRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  res.json({
    accessToken: "fake-token",
    user: {
      email,
    },
  });
});

apiRouter.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  res.status(201).json({
    accessToken: "fake-token",
    user: {
      email,
    },
  });
});

apiRouter.post("/orders", (req, res) => {
  const { userEmail, items, total, createdAt } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order must contain items" });
  }

  const newOrder = {
    id: orders.length + 1,
    userEmail,
    items,
    total,
    createdAt,
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

apiRouter.get("/orders", (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.json(orders);
  }

  const userOrders = orders.filter((order) => order.userEmail === userEmail);
  res.json(userOrders);
});
app.get("/", (req, res) => {
  res.send("Event Startup API is running");
});
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
