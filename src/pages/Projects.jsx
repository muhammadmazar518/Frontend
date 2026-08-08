import { useEffect, useState } from "react";
import axios from "axios";
import { PageHeader, Card, Input, Textarea, Select, Button, EmptyState, Skeleton } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusColors = {
  Live: "#34d399",
  "In Progress": "#fbbf24",
  Planning: "#a1a1aa",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "Planning", icon: "📁" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`, { headers });
    setProjects(res.data);
  };

  useEffect(() => {
    axios
      .get(`${API}/projects`, { headers })
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Could not load projects. Check your connection and try again.");
      })
      .finally(() => setInitialLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.title) {
      toast.warning("Please add a title for your project.");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/projects/${editId}`, form, { headers });
        toast.success("Project updated.");
        setEditId(null);
      } else {
        await axios.post(`${API}/projects`, form, { headers });
        toast.success("Project added.");
      }
      setForm({ title: "", description: "", status: "Planning", icon: "📁" });
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Could not save the project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, status: p.status, icon: p.icon });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API}/projects/${deleteTarget}`, { headers });
      toast.success("Project deleted.");
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete the project. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", status: "Planning", icon: "📁" });
  };

  return (
    <div>
      <PageHeader title="Projects" sub="Manage your projects" />

      <Card className="mb-8 p-6">
        <h3 className="mb-4 font-display text-base font-bold text-text">{editId ? "Edit Project" : "Add Project"}</h3>
        <div className="mb-3 flex flex-wrap gap-3">
          <Input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="min-w-[180px] flex-[2]"
          />
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="min-w-[150px] flex-1"
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>Live</option>
          </Select>
          <Input
            placeholder="📁"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-[76px] shrink-0"
          />
        </div>
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mb-3"
        />
        <div className="flex gap-2.5">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editId ? "✓ Update" : "+ Add"}
          </Button>
          {editId && (
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {initialLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="flex flex-col gap-3 p-6">
              <Skeleton width={30} height={30} radius={8} />
              <Skeleton width="60%" height={18} />
              <Skeleton width="100%" height={13} />
              <Skeleton width="85%" height={13} />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          sub="Add your first project above and it will show up here for you to manage."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const color = statusColors[p.status] || "#a1a1aa";
            return (
              <div key={p.id} className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface p-6 transition-shadow duration-200 hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[30px]">{p.icon}</span>
                  <span
                    className="rounded-full px-3 py-0.5 text-[11px] font-bold"
                    style={{ color, background: `${color}16`, border: `1px solid ${color}40` }}
                  >
                    {p.status}
                  </span>
                </div>
                <h3 className="m-0 font-display text-[16.5px] font-bold text-text">{p.title}</h3>
                <p className="m-0 flex-1 text-[13px] leading-relaxed text-text-2">{p.description}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 cursor-pointer rounded-sm border border-line-strong bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-text-2 transition-colors duration-200 hover:bg-surface-3"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p.id)}
                    className="flex-1 cursor-pointer rounded-sm border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-[12.5px] text-danger transition-colors duration-200 hover:bg-danger/15"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message="This action cannot be undone. The project will be permanently removed."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Projects;
