import { useEffect, useState } from "react";
import axios from "axios";
import { PageHeader, Card, Input, Textarea, Button, EmptyState, Skeleton } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Services = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", icon: "🌐" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchServices = async () => {
    const res = await axios.get(`${API}/services`, { headers });
    setServices(res.data);
  };

  useEffect(() => {
    axios
      .get(`${API}/services`, { headers })
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Could not load services. Check your connection and try again.");
      })
      .finally(() => setInitialLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.title) {
      toast.warning("Please add a title for your service.");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/services/${editId}`, form, { headers });
        toast.success("Service updated.");
        setEditId(null);
      } else {
        await axios.post(`${API}/services`, form, { headers });
        toast.success("Service added.");
      }
      setForm({ title: "", description: "", price: "", icon: "🌐" });
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Could not save the service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, price: s.price, icon: s.icon });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API}/services/${deleteTarget}`, { headers });
      toast.success("Service deleted.");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete the service. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", price: "", icon: "🌐" });
  };

  return (
    <div>
      <PageHeader title="Services" sub="Manage the services you offer" />

      <Card className="mb-8 p-6">
        <h3 className="mb-4 font-display text-base font-bold text-text">{editId ? "Edit Service" : "Add Service"}</h3>
        <div className="mb-3 flex flex-wrap gap-3">
          <Input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="min-w-[180px] flex-[2]"
          />
          <Input
            placeholder="Price (e.g. $500)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="min-w-[140px] flex-1"
          />
          <Input
            placeholder="🌐"
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
              <Skeleton width={52} height={52} radius={12} />
              <Skeleton width="60%" height={18} />
              <Skeleton width="100%" height={13} />
              <Skeleton width="85%" height={13} />
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon="🛠"
          title="No services yet"
          sub="Add your first service above and it will show up here for you to manage."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface p-6 transition-shadow duration-200 hover:shadow-sm">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md border border-primary/25 bg-primary-soft text-[26px]">
                {s.icon}
              </div>
              <h3 className="m-0 font-display text-[16.5px] font-bold text-text">{s.title}</h3>
              <p className="m-0 flex-1 text-[13px] leading-relaxed text-text-2">{s.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-extrabold text-primary">{s.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="cursor-pointer rounded-sm border border-line-strong bg-surface-2 px-2.5 py-1.5 text-sm transition-colors duration-200 hover:bg-surface-3" aria-label="Edit">
                    ✏️
                  </button>
                  <button onClick={() => setDeleteTarget(s.id)} className="cursor-pointer rounded-sm border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-sm transition-colors duration-200 hover:bg-danger/15" aria-label="Delete">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete service?"
        message="This action cannot be undone. The service will be permanently removed."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Services;
