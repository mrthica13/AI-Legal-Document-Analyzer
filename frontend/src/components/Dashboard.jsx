import { useState, useEffect } from "react";
import axios from "axios";
import DashboardCharts from "./DashboardCharts";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Dashboard() {
    console.log("Dashboard Loaded");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [dashboard, setDashboard] = useState({
    total_documents: 0,
    total_users: 0,
    todays_uploads: 0,
  })
  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem("token");
      navigate("/");
   };

  useEffect(() => {
  fetchDocuments();
  fetchDashboard();
  fetchProfile();
}, []);

  // Fetch Documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/documents"
      );

      setDocuments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Dashboard
  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/dashboard"
      );

      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const response = await axios.get(
      "http://127.0.0.1:8000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PROFILE:", response.data);

    setUsername(response.data.username);
    setEmail(response.data.email);

  } catch (error) {
    console.log("PROFILE ERROR:", error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    }
  }
};

  // Upload PDF
  const uploadPDF = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setResult(response.data);

      fetchDocuments();
      fetchDashboard();

      alert("✅ PDF Uploaded Successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("❌ Upload Failed");
    }
  };
    // View Document
  const viewDocument = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/documents/${id}`
      );

      setSelectedDocument(response.data);

    } catch (error) {
      console.log(error);
      alert("Unable to fetch document");
    }
  };

  // Delete Document
  const deleteDocument = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/documents/${id}`
      );

      fetchDocuments();
      fetchDashboard();

      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument(null);
      }

      alert("✅ Document Deleted");

    } catch (error) {
      console.log(error);
      alert("❌ Delete Failed");
    }
  };

  // Download Document
  const downloadDocument = (id) => {
    window.open(
      `http://127.0.0.1:8000/download/${id}`,
      "_blank"
    );
  };

  return (
    <div className="container">
      <Navbar
         username={username}
         email={email}
         onLogout={handleLogout}
      />
      <h1 className="title">
        ⚖ AI Legal Document Analyzer
      </h1>
      {/* Dashboard Cards */}

      <div className="dashboard">

        <div className="dashboard-card">
          <h2>📄</h2>
          <h3>{dashboard.total_documents}</h3>
          <p>Total Documents</p>
        </div>

        <div className="dashboard-card">
          <h2>👤</h2>
          <h3>{dashboard.total_users}</h3>
          <p>Total Users</p>
        </div>

        <div className="dashboard-card">
          <h2>📅</h2>
          <h3>{dashboard.todays_uploads}</h3>
          <p>Today's Uploads</p>
        </div>

      </div>

      {/* <DashboardCharts dashboard={dashboard} /> */}

      {/* Upload */}

      <div className="card">

        <h2>📄 Upload PDF</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadPDF} disabled={loading}>
          {loading ? (
           <>
           <span className="spinner"></span>
           Generating AI Summary...
           </>
          ) : (
          "📄 Upload PDF"
          )}
        </button>
      </div>
            {/* AI Summary */}

      {result && (
        <div className="card">

          <h2>🤖 AI Summary</h2>

          <p className="filename">
            <strong>Filename:</strong> {result.filename}
          </p>

          <div className="summary">
            {result.summary}
          </div>

        </div>
      )}

      {/* Uploaded Documents */}

      <div className="card">

        <h2>📚 Uploaded Documents</h2>

        <input
          type="text"
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {documents
              .filter((doc) =>
                doc.filename
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((doc) => (

                <tr key={doc.id}>

                  <td>{doc.id}</td>

                  <td>{doc.filename}</td>

                  <td>
                    {new Date(doc.created_at).toLocaleString()}
                  </td>

                  <td>

                    <button onClick={() => viewDocument(doc.id)}>
                      👁 View
                    </button>

                    {" "}

                    <button onClick={() => downloadDocument(doc.id)}>
                      📥 Download
                    </button>

                    {" "}

                    <button onClick={() => deleteDocument(doc.id)}>
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>
            {/* View Document */}

      {selectedDocument && (

        <div className="card">

          <h2>📄 Document Details</h2>

          <p>
            <strong>Filename:</strong>{" "}
            {selectedDocument.filename}
          </p>

          <h3>🤖 AI Summary</h3>

          <div className="summary">
            {selectedDocument.summary}
          </div>

          <h3>📃 Extracted Text</h3>

          <div className="summary">
            {selectedDocument.extracted_text}
          </div>

        </div>

      )}
     <Footer />
    </div>
  );
}

export default Dashboard;
