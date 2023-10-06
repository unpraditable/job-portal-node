import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./JobList.css";

function JobList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSeeMoreVisible, setIsSeeMoreVisible] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchDescription, setSearchDescription] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [fullTime, setFullTime] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/jobs?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        // Redirect to the login page
        window.location.replace("/login");
        return;
      }
      const data = await response.json();
      if (data?.length) {
        setJobs((prevJobs) => [...prevJobs, ...data]);
      } else {
        setIsSeeMoreVisible(false);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = async (e, page = 1) => {
    e.preventDefault();
    if (page === 1) {
      setFilteredJobs([]);
    }
    try {
      setIsSeeMoreVisible(true);
      setJobs([]);
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/jobs/search?description=${searchDescription}&location=${searchLocation}&full_time=${fullTime}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data?.length) {
        if (page !== 1) {
          setFilteredJobs((prevJobs) => [...prevJobs, ...data]);
        } else {
          setFilteredJobs(data);
        }
      } else {
        setIsSeeMoreVisible(false);
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeMore = (e) => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      if (searchDescription || searchLocation || fullTime) {
        handleSearch(e, nextPage);
      } else {
        fetchJobs(nextPage);
      }
      return nextPage;
    });
  };

  return (
    <>
      <h2>Job List</h2>
      <div>
        <form
          className="job-list-search-container"
          onSubmit={(e) => {
            handleSearch(e);
            setCurrentPage(1);
          }}
        >
          <input
            className="job-list-search-input"
            type="text"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Search by description"
          />
          <input
            className="job-list-search-input"
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search by location"
          />
          <label>
            Full Time:
            <input
              className="job-list-search-checkbox"
              type="checkbox"
              checked={fullTime}
              onChange={(e) => setFullTime(e.target.checked)}
            />
          </label>
          <button className="job-list-search-button" type="submit">
            Search
          </button>
        </form>

        {filteredJobs?.length === 0 &&
          jobs.map(
            (job) =>
              job && (
                <div className="job-card" key={job.id}>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-location">{job.location}</p>
                  <Link className="job-link" to={`/jobs/${job.id}`}>
                    View Details
                  </Link>
                </div>
              )
          )}

        {filteredJobs.map(
          (job) =>
            job && (
              <div className="job-card" key={job.id}>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-location">{job.location}</p>
                <Link className="job-link" to={`/jobs/${job.id}`}>
                  View Details
                </Link>
              </div>
            )
        )}

        {!isLoading && jobs.length === 0 && filteredJobs.length === 0 && (
          <p>No Jobs Found!</p>
        )}

        {isSeeMoreVisible && !isLoading && (
          <button className="job-see-more" onClick={handleSeeMore}>
            See More
          </button>
        )}

        {isLoading && <p>Loading...</p>}
      </div>
    </>
  );
}

export default JobList;
