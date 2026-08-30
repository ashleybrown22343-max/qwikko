"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
    await loadData();
    setLoading(false);
  }

  async function loadData() {
    const { data: linksData } = await supabase
      .from("links")
      .select("*")
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
      .eq("code", code);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingCode(null);
    setEditValue("");
    loadData();
  }

  async function deleteLink(code) {
    const confirmed = window.confirm(`Delete link "${code}"? This can't be undone.`);
    if (!confirmed) return;

    await supabase.from("links").delete().eq("code", code);
    loadData();
  }

  if (loading) return <main style={{ padding: "24px" }}>Loading...</main>;

  return (
    <main style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Links</h2>
      {links.length === 0 && <p>No links yet.</p>}
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Destination</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>{link.code}</td>
              <td>{link.link_type}</td>
              <td>
                {editingCode === link.code ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  link.destination_url || <em>(non-URL content)</em>
                )}
              </td>
              <td>{link.clicks}</td>
              <td>{new Date(link.created_at).toLocaleDateString()}</td>
              <td>
                {editingCode === link.code ? (
                  <>
                    <button onClick={() => saveEdit(link.code)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    {link.link_type === "url" && (
                      <button onClick={() => startEdit(link)}>Edit</button>
                    )}
                    <button onClick={() => deleteLink(link.code)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>By country</h2>
      <ul>
        {Object.entries(countryBreakdown()).map(([country, count]) => (
          <li key={country}>{country}: {count}</li>
        ))}
      </ul>

      <h2>By device</h2>
      <ul>
        <li>Mobile: {deviceBreakdown().mobile}</li>
        <li>Desktop: {deviceBreakdown().desktop}</li>
        <li>Other: {deviceBreakdown().other}</li>
      </ul>

      <h2>Recent clicks</h2>
      <table>
        <thead>
          <tr>
            <th>Link</th>
            <th>Country</th>
            <th>Referrer</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(0, 20).map((log) => (
            <tr key={log.id}>
              <td>{log.link_code}</td>
              <td>{log.country}</td>
              <td>{log.referrer}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
    }
