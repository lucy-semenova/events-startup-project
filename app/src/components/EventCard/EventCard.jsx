import "./EventCard.css";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket, Users, FileText } from "lucide-react";

function EventCard({
  id,
  title,
  date,
  time,
  venue,
  city,
  price,
  description,
  ticketsAvailable,
  category,
}) {
  const getAvailabilityMessage = () => {
    return ticketsAvailable === 0
      ? "Sold out"
      : `${ticketsAvailable} ticket${ticketsAvailable > 1 ? "s" : ""} left`;
  };

  const getPriceMessage = () => {
    return price === 0 ? "Free" : `${price} DKK`;
  };

  return (
    <li className="eventCard">
      <h2 className="eventTitle">{title}</h2>
      <p className="eventType">{category}</p>
      <div className="eventInfo">
        <FileText size={20} />
        <p className="eventDescription">{description}</p>
      </div>
      <div className="eventInfo">
        <CalendarDays size={20} />
        <p className="eventDate">
          {date} at {time}
        </p>
      </div>
      <div className="eventInfo">
        <MapPin size={20} />
        <p className="eventVenue">
          {venue}, {city}
        </p>
      </div>
      <div className="eventInfo">
        <Ticket size={20} />
        <p className="eventPrice">{getPriceMessage()}</p>
      </div>
      <div className="eventInfo">
        <Users size={20} />
        <p className="eventTicketsLeft">{getAvailabilityMessage()}</p>
      </div>
      <Link className="buyTicketButton" to={`/events/${id}`}>
        {ticketsAvailable === 0 ? "View details" : "Buy ticket"}
      </Link>
    </li>
  );
}
export default EventCard;
