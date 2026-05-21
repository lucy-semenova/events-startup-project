import EventCard from "../EventCard/EventCard";
import EventSearch from "../EventSearch/EventSearch";
import "./EventList.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchEvents() {
      const searchQuery = encodeURIComponent(searchTerm);
      const categoryQuery =
        selectedCategory === "All"
          ? ""
          : `&category=${encodeURIComponent(selectedCategory)}`;

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          api(`/events?q=${searchQuery}${categoryQuery}&page=${page}&limit=3`),
        );

        if (!response.ok) {
          throw new Error("Could not load events. Please try again later.");
        }

        const data = await response.json();
        setEvents(data.events);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, page]);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="event-list">
      <EventSearch
        searchQuery={searchTerm}
        setSearchQuery={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(value) => {
          setSelectedCategory(value);
          setPage(1);
        }}
      />
      {events.length === 0 ? (
        <p className="noEvents">
          No events match your search or selected category.
        </p>
      ) : (
        <>
          <ul className="event-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                venue={event.venue}
                city={event.city}
                description={event.description}
                category={event.category}
                price={event.price}
                ticketsAvailable={event.ticketsAvailable}
              />
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default EventList;
