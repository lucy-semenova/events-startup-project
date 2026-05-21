import "./EventSearch.css";

function EventSearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="searchFilterContainer">
      <div className="eventSearch">
        <span className="searchIcon">🔍</span>

        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <select
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
      >
        <option value="All">All categories</option>
        <option value="Workshop">Workshop</option>
        <option value="Conference">Conference</option>
        <option value="Hackathon">Hackathon</option>
        <option value="Meetup">Meetup</option>
        <option value="Bootcamp">Bootcamp</option>
      </select>
    </div>
  );
}

export default EventSearch;
