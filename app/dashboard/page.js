// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Button, Card, Badge, Alert, Input, Spinner } from "../components/ui";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);
    await loadData(session.user.id);
    setLoading(false);
  }

  async function loadData(userId) {
    // Only fetch links belonging to this user
    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const codes = (linksData || []).map((l) => l.code);

    let logsData = [];
    if (codes.length > 0) {
      const { data } = await supabase
        .from("click_logs")
        .select("*")
        .in("link_code", codes)
        .order("timestamp", { ascending: false });
      logsData = data || [];
    }

    setLinks(linksData || []);
    setLogs(logsData);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function countryBreakdown() {
    const counts = {};
    logs.forEach((log) => {
      counts[log.country] = (counts[log.country] || 0) + 1;
    });
    return counts;
  }

  function deviceBreakdown() {
    const counts = { mobile: 0, desktop: 0, other: 0 };
    logs.forEach((log) => {
      const ua = (log.device || "").toLowerCase();
      if (ua.includes("mobile")) counts.mobile++;
      else if (ua.includes("windows") || ua.includes("macintosh")) counts.desktop++;
      else counts.other++;
    });
    return counts;
  }

  function startEdit(link) {
    setError("");
    setEditingCode(link.code);
    setEditValue(link.destination_url || "");
  }

  function cancelEdit() {
    setEditingCode(null);
    setEditValue("");
  }

  async function saveEdit(code) {
    setError("");
    let newDestination = editValue.trim();
    if (!newDestination) {
      setError("Destination can't be empty.");
      return;
    }
    if (!/^https?:\/\//i.test(newDestination)) {
      newDestination = "https://" + newDestination;
    }

    const { error: updateError } = await supabase
      .from("links")
      .update({ destination_url: newDestination })
      .eq("code", code)
      .eq("user_id", user.id);  // security check

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingCode(null);
    setEditValue("");
    loadData(user.id);
  }

  async function deleteLink(code) {
    const confirmed = window.confirm(`Delete link "${code}"? This can't be undone.`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("code", code)
      .eq("user_id", user.id);  // security check

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    loadData(user.id);
  }

  if (loading) return <Spinner />;

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Dashboard</h1>
        <Button onClick={handleLogout} variant="ghost">Log out</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3 style={{ margin: "0" }}>{links.length}</h3>
          <p style={{ color: "var(--text)" }}>Total Links</p>
        </Card>
        <Card>
          <h3 style={{ margin: "0" }}>{logs.length}</h3>
          <p style={{ color: "var(--text)" }}>Total Clicks</p>
        </Card>
        <Card>
          <h3 style={{ margin: "0" }}>{Object.keys(countryBreakdown()).length}</h3>
          <p style={{ color: "var(--text)" }}>Countries</p>
        </Card>
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Your Links</h2>
      {links.length === 0 ? (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text)" }}>No links yet. Create your first smart link!</p>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button href="/create" variant="primary">Create Link</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {links.map((link) => (
            <Card key={link.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Badge>{link.link_type}</Badge>
                  <strong>{link.code}</strong>
                </div>
                <p style={{ color: "var(--text)", marginTop: "0.5rem" }}>
                  {link.destination_url || "Non-URL content"}
                </p>
                <p style={{ color: "var(--text)", fontSize: "0.85rem" }}>
                  Clicks: {link.clicks} | Created: {new Date(link.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {link.link_type === "url" && (
                  editingCode === link.code ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="New destination URL"
                        style={{ width: "200px" }}
                      />
                      <Button onClick={() => saveEdit(link.code)} variant="primary">Save</Button>
                      <Button onClick={cancelEdit} variant="ghost">Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => startEdit(link)} variant="secondary">Edit</Button>
                  )
                )}
                <Button onClick={() => deleteLink(link.code)} variant="danger">Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Section */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "1rem" }}>
          <Card>
            <h3>By Country</h3>
            {Object.keys(countryBreakdown()).length === 0 ? (
              <p style={{ color: "var(--text)" }}>No data yet.</p>
            ) : (
              <ul>
                {Object.entries(countryBreakdown()).map(([country, count]) => (
                  <li key={country} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{country}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <h3>By Device</h3>
            <ul>
              <li>Mobile: {deviceBreakdown().mobile}</li>
              <li>Desktop: {deviceBreakdown().desktop}</li>
              <li>Other: {deviceBreakdown().other}</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Recent Clicks */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Recent Clicks</h2>
        {logs.slice(0, 20).length === 0 ? (
          <p style={{ color: "var(--text)" }}>No clicks yet.</p>
        ) : (
          <Card style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  <th style={thStyle}>Link</th>
                  <th style={thStyle}>Country</th>
                  <th style={thStyle}>Referrer</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={tdStyle}>{log.link_code}</td>
                    <td style={tdStyle}>{log.country}</td>
                    <td style={tdStyle}>{log.referrer}</td>
                    <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </main>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.75rem 1rem",
  fontWeight: "600",
  color: "var(--text)",
  fontSize: "0.85rem",
};

const tdStyle = {
  padding: "0.75rem 1rem",
  fontSize: "0.9rem",
};
