import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import "./JobDetail.css";

function JobDetail() {
  const [job, setJob] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (response.status === 401) {
          localStorage.removeItem("jwtToken");
          // Redirect to the login page
          window.location.replace("/login");
          return;
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJob();
  }, [id]);

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="job-detail-card">
      <h2 className="job-detail-title">{job.title}</h2>
      <div className="job-detail-card">
        <img src={job.company_logo} alt={job.company} />
        <p>Company: {job.company}</p>
        <p>Location: {job.location}</p>
        <p>Type: {job.type}</p>
      </div>

      <div
        className="job-detail-description"
        dangerouslySetInnerHTML={sanitizeHTML(job.description)}
      />
      <div
        className="job-detail-apply"
        dangerouslySetInnerHTML={sanitizeHTML(job.how_to_apply)}
      />
    </div>
  );
}

export default JobDetail;
