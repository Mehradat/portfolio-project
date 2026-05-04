import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../config";

interface Project {
  _id: string;
  title: string;
  image: string;
  category: string;
  displayOrder?: number;
  description?: string;
  keyFeatures?: string[];
  techStack?: string[];
  images?: string[];
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  createdAt?: string;
}

interface MusicTrack {
  _id: string;
  title: string;
  genre: string;
  audioUrl?: string;
  createdAt?: string;
}

interface AdminUser {
  _id: string;
  username: string;
  createdAt?: string;
}

const categories = [
  "Music + Code Integration",
  "Full-Stack Development",
  "Front-End Showcase",
];

function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // User Management Forms
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserUsername, setEditUserUsername] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Full-Stack Development"); // Default
  const [description, setDescription] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [activeSection, setActiveSection] = useState<"projects" | "contacts" | "music" | "cv" | "users">("projects");

  const [trackTitle, setTrackTitle] = useState("");
  const [trackGenre, setTrackGenre] = useState("");
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [isSavingTrack, setIsSavingTrack] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectModalLoading, setIsProjectModalLoading] = useState(false);
  const [isProjectSaving, setIsProjectSaving] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Full-Stack Development");
  const [editDescription, setEditDescription] = useState("");
  const [editKeyFeatures, setEditKeyFeatures] = useState("");
  const [editTechStack, setEditTechStack] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editCurrentImage, setEditCurrentImage] = useState("");
  const [editGalleryImages, setEditGalleryImages] = useState<string[]>([]);
  const [editNewGalleryFiles, setEditNewGalleryFiles] = useState<File[]>([]);
  const [editNewGalleryPreviews, setEditNewGalleryPreviews] = useState<string[]>([]);
  // CV Upload state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isCvUploading, setIsCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // 📥 GET projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const fetchContacts = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_URL}/api/contacts`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

      if (!res.ok) throw new Error("Failed to fetch contacts");

      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const fetchMusic = async () => {
    try {
      const res = await fetch(`${API_URL}/api/music`);
      if (!res.ok) throw new Error("Failed to fetch music");

      const data = await res.json();
      setTracks(data);
    } catch (error) {
      console.error("Failed to fetch music", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resume`);
      const data = await res.json();
      if (data.success && data.fileUrl) {
        setCvUrl(data.fileUrl);
      }
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    }
  };

  // CHECK AUTH & FETCH
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          window.location.pathname = "/admin";
          return;
        }
        const res = await fetch(`${API_URL}/api/check-auth`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.isAuthenticated) {
          localStorage.removeItem("adminToken");
          window.location.pathname = "/admin";
        } else {
          fetchProjects();
          fetchContacts();
          fetchMusic();
          fetchResume();
          fetchUsers();
        }
      } catch (err) {
         window.location.pathname = "/admin";
      }
    };
    checkAuth();
  }, []);

  // ➕ ADD
  const parseListInput = (value: string) => {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const parsedFeatures = parseListInput(keyFeaturesText);
    const parsedTechStack = parseListInput(techStackText);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category); // Use state
    formData.append("description", description);
    formData.append("keyFeatures", JSON.stringify(parsedFeatures));
    formData.append("techStack", JSON.stringify(parsedTechStack));
    formData.append("password", "123456");

    projectImages.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        
        body: formData,
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      if (!res.ok) throw new Error("Failed");

      setTitle("");
      setDescription("");
      setKeyFeaturesText("");
      setTechStackText("");
      setProjectImages([]);
      fetchProjects();
      alert("Project added successfully!");
    } catch (error) {
      console.error("Error adding project", error);
      alert("Failed to add project");
    } finally {
      setIsAdding(false);
    }
  };

  // ❌ DELETE
  const deleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}`, "Content-Type": "application/json" },
        
        body: JSON.stringify({ password: "123456" }),
      });

      if (res.ok) {
        fetchProjects();
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      const res = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      if (!res.ok) throw new Error("Failed to delete contact");

      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact", error);
      alert("Failed to delete contact");
    }
  };

  const resetMusicForm = () => {
    setTrackTitle("");
    setTrackGenre("");
    setTrackFile(null);
    setEditingTrackId(null);
  };

  const openCreateMusicModal = () => {
    resetMusicForm();
    setIsMusicModalOpen(true);
  };

  const closeMusicModal = () => {
    setIsMusicModalOpen(false);
    resetMusicForm();
  };

  const submitTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTrack(true);

    const formData = new FormData();
    formData.append("title", trackTitle);
    formData.append("genre", trackGenre);
    if (trackFile) {
      formData.append("audio", trackFile);
    }

    try {
      const isEditing = Boolean(editingTrackId);
      const endpoint = isEditing
        ? `${API_URL}/api/music/${editingTrackId}`
        : `${API_URL}/api/music`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        
        body: formData,
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      if (!res.ok) throw new Error("Failed to save track");

      closeMusicModal();
      fetchMusic();
    } catch (error) {
      console.error("Failed to save track", error);
      alert("Failed to save track");
    } finally {
      setIsSavingTrack(false);
    }
  };

  const editTrack = (track: MusicTrack) => {
    setTrackTitle(track.title);
    setTrackGenre(track.genre);
    setTrackFile(null);
    setEditingTrackId(track._id);
    setActiveSection("music");
    setIsMusicModalOpen(true);
  };

  const deleteTrack = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`${API_URL}/api/music/${id}`, {
        method: "DELETE",
        
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      if (!res.ok) throw new Error("Failed to delete track");

      if (editingTrackId === id) {
        closeMusicModal();
      }

      fetchMusic();
    } catch (error) {
      console.error("Failed to delete track", error);
      alert("Failed to delete track");
    }
  };

  const saveProjectOrder = async (orderedIds: string[]) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/order`, {
        method: "PUT",
        
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error("Failed to save project order");
    } catch (error) {
      console.error("Failed to save project order", error);
      alert("Failed to save project order");
      fetchProjects();
    }
  };

  const handleProjectDragStart = (projectId: string) => {
    setDraggedProjectId(projectId);
  };

  const handleProjectDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    if (dragOverProjectId !== projectId) {
      setDragOverProjectId(projectId);
    }
  };

  const handleProjectDrop = (targetProjectId: string) => {
    if (!draggedProjectId || draggedProjectId === targetProjectId) {
      setDraggedProjectId(null);
      setDragOverProjectId(null);
      return;
    }

    setProjects((prev) => {
      const draggedIndex = prev.findIndex((p) => p._id === draggedProjectId);
      const targetIndex = prev.findIndex((p) => p._id === targetProjectId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [draggedItem] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedItem);

      saveProjectOrder(next.map((p) => p._id));
      return next;
    });

    setDraggedProjectId(null);
    setDragOverProjectId(null);
  };

  const handleProjectDragEnd = () => {
    setDraggedProjectId(null);
    setDragOverProjectId(null);
  };

  const resetProjectEditState = () => {
    editNewGalleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    setEditingProjectId(null);
    setEditTitle("");
    setEditCategory("Full-Stack Development");
    setEditDescription("");
    setEditKeyFeatures("");
    setEditTechStack("");
    setEditImageFile(null);
    setEditCurrentImage("");
    setEditGalleryImages([]);
    setEditNewGalleryFiles([]);
    setEditNewGalleryPreviews([]);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    resetProjectEditState();
  };

  const openProjectEditModal = async (projectId: string) => {
    setIsProjectModalOpen(true);
    setIsProjectModalLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project");

      const data: Project = await res.json();
      setEditingProjectId(projectId);
      setEditTitle(data.title || "");
      setEditCategory(data.category || "Full-Stack Development");
      setEditDescription(data.description || "");
      setEditKeyFeatures((data.keyFeatures || []).join(", "));
      setEditTechStack((data.techStack || []).join(", "));

      let loadedImages = Array.isArray(data.images)
        ? data.images.filter((img) => Boolean(img))
        : [];

      if (data.image && !loadedImages.includes(data.image)) {
        loadedImages = [data.image, ...loadedImages];
      }

      setEditGalleryImages(loadedImages);
      setEditCurrentImage(loadedImages.length > 0 ? loadedImages[0] : "");
    } catch (error) {
      console.error("Error fetching project", error);
      alert("Failed to load project data");
      closeProjectModal();
    } finally {
      setIsProjectModalLoading(false);
    }
  };

  const moveEditImage = (index: number, direction: "up" | "down") => {
    const newImages = [...editGalleryImages];
    if (direction === "up" && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setEditGalleryImages(newImages);
    setEditCurrentImage(newImages.length > 0 ? newImages[0] : "");
  };

  const removeEditGalleryImage = (index: number) => {
    const newImages = editGalleryImages.filter((_, i) => i !== index);
    setEditGalleryImages(newImages);
    setEditCurrentImage(newImages.length > 0 ? newImages[0] : "");
  };

  const handleEditNewGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setEditNewGalleryFiles((prev) => [...prev, ...files]);
    setEditNewGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeEditNewGalleryFile = (index: number) => {
    URL.revokeObjectURL(editNewGalleryPreviews[index]);
    setEditNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setEditNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId) return;

    setIsProjectSaving(true);

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("category", editCategory);
    formData.append("description", editDescription);
    formData.append("keyFeatures", JSON.stringify(parseListInput(editKeyFeatures)));
    formData.append("techStack", JSON.stringify(parseListInput(editTechStack)));
    formData.append("password", "123456");
    formData.append("existingImages", JSON.stringify(editGalleryImages));

    if (editImageFile) {
      formData.append("image", editImageFile);
    }

    editNewGalleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/projects/${editingProjectId}`, {
        method: "PUT",
        
        body: formData,
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      if (!res.ok) throw new Error("Failed to update project");

      await fetchProjects();
      closeProjectModal();
      alert("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project", error);
      alert("Failed to update project");
    } finally {
      setIsProjectSaving(false);
    }
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setIsCvUploading(true);
    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const res = await fetch(`${API_URL}/api/resume`, {
        method: "POST",
        
        body: formData,
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      const data = await res.json();
      if (data.success) {
        setCvUrl(data.fileUrl);
        setCvFile(null);
        alert("CV Uploaded Successfully!");
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("CV upload error", error);
      alert("Something went wrong");
    } finally {
      setIsCvUploading(false);
    }
  };

  const handleCvDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the current CV?")) return;

    try {
      const res = await fetch(`${API_URL}/api/resume`, {
        method: "DELETE",
        
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});

      const data = await res.json();
      if (data.success) {
        setCvUrl(null);
        alert("CV Deleted Successfully!");
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (error) {
      console.error("CV delete error", error);
      alert("Something went wrong");
    }
  };

  // --- USER MANAGEMENT ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}`, "Content-Type": "application/json" },
        
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewUsername("");
        setNewPassword("");
        fetchUsers();
        alert("User added successfully!");
      } else {
        alert(data.message || "Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserId) return;
    setIsUserLoading(true);
    try {
      const updates: any = {};
      if (editUserUsername) updates.username = editUserUsername;
      if (editUserPassword) updates.password = editUserPassword;

      const res = await fetch(`${API_URL}/api/users/${editUserId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}`, "Content-Type": "application/json" },
        
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        setEditUserId(null);
        setEditUserUsername("");
        setEditUserPassword("");
        fetchUsers();
        alert("User updated successfully!");
      } else {
        alert(data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${username}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        
      
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },});
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header className="text-black" />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveSection("projects")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeSection === "projects"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Project
            </button>
            <button
              onClick={() => setActiveSection("music")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeSection === "music"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Music
            </button>
            <button
              onClick={() => setActiveSection("contacts")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeSection === "contacts"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveSection("cv")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeSection === "cv"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Resume/CV
            </button>
            <button
              onClick={() => setActiveSection("users")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeSection === "users"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {activeSection === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Add Project Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Add New Project</h3>
              <form onSubmit={addProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                  <input
                    value={title}
                    required
                    placeholder="e.g. Portfolio Website"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    required
                    placeholder="Write a short project description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                  <textarea
                    value={keyFeaturesText}
                    required
                    placeholder="One per line or comma separated"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={(e) => setKeyFeaturesText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                  <textarea
                    value={techStackText}
                    required
                    placeholder="React, Node.js, MongoDB ..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onChange={(e) => setTechStackText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    onChange={(e) => {
                      if (e.target.files) {
                        setProjectImages(Array.from(e.target.files));
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    First selected image will be used as the main cover.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isAdding}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isAdding ? "opacity-75 cursor-wait" : ""
                  }`}
                >
                  {isAdding ? "Adding..." : "Add Project"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Project List */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Existing Projects ({projects.length})</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p, index) => (
                <div
                  key={p._id}
                  draggable={!isProjectModalOpen}
                  onDragStart={() => handleProjectDragStart(p._id)}
                  onDragOver={(e) => handleProjectDragOver(e, p._id)}
                  onDrop={() => handleProjectDrop(p._id)}
                  onDragEnd={handleProjectDragEnd}
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    draggedProjectId === p._id
                      ? "opacity-60 border-green-300"
                      : dragOverProjectId === p._id
                        ? "border-green-400 ring-2 ring-green-200"
                        : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="h-40 overflow-hidden bg-gray-100">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain bg-white" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-1 truncate">{p.title}</h4>
                    <p className="text-sm text-gray-500 mb-4">{p.category || "No Category"}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-500">Drag to reorder</span>
                      <span className="text-xs font-semibold text-gray-700">#{index + 1}</span>
                    </div>
                    
                    <div className="flex gap-2">
                       <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          window.location.pathname = `/admin/edit/${p._id}`;
                        }}
                        className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 px-3 rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => deleteProject(p._id)}
                        className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-1 px-3 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {projects.length === 0 && (
                <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  No projects found. Add one to get started!
                </div>
              )}
            </div>
          </div>
          
          </div>
        )}

        {activeSection === "contacts" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Customer Contact Messages ({contacts.length})</h3>
              <button
                onClick={fetchContacts}
                className="py-1 px-3 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-lg text-gray-800 truncate">{c.name}</h4>
                      <p className="text-sm text-gray-600">{c.email}</p>
                      <p className="text-sm text-gray-600">{c.mobile}</p>
                      {c.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{c.message}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => deleteContact(c._id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 py-1 px-3 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="py-10 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  No customer contact messages found.
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "music" && (
          <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Music Tracks ({tracks.length})</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchMusic}
                    className="py-1 px-3 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={openCreateMusicModal}
                    className="py-1 px-3 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add Music
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {tracks.map((track) => (
                  <div
                    key={track._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-bold text-lg text-gray-800 truncate">{track.title}</h4>
                        <p className="text-sm text-gray-600">{track.genre}</p>
                        {track.audioUrl && (
                          <a
                            href={track.audioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-purple-600 hover:underline"
                          >
                            Audio file
                          </a>
                        )}
                        {track.createdAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(track.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => editTrack(track)}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 px-3 rounded text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTrack(track._id)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 py-1 px-3 rounded text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {tracks.length === 0 && (
                  <div className="py-10 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    No music tracks found.
                  </div>
                )}
              </div>
          </div>
        )}

        {/* CV SECTION */}
        {activeSection === "cv" && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Update Resume / CV</h3>
            <form onSubmit={handleCvSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Document</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100"
                />
              </div>
              <button 
                type="submit" 
                disabled={isCvUploading || !cvFile}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
              >
                {isCvUploading ? "Uploading..." : "Upload CV"}
              </button>
            </form>

            {cvUrl && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-medium text-gray-700 mb-2">Current Active CV</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate mr-4">{cvUrl.split('/').pop()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCvDelete}
                      type="button"
                      className="flex-shrink-0 text-red-600 hover:text-red-800 text-sm font-medium border border-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <a 
                      href={cvUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-teal-600 hover:text-teal-800 text-sm font-medium border border-teal-600 px-3 py-1 rounded"
                    >
                      View Current
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS SECTION */}
        {activeSection === "users" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Add New User</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="admin123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isUserLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-indigo-400"
                  >
                    {isUserLoading ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Existing Users</h3>
                <span className="text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{users.length} Users</span>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map(user => (
                  <div key={user._id} className="p-4 sm:flex items-center justify-between hover:bg-gray-50 transition-colors">
                    {editUserId === user._id ? (
                      <form onSubmit={handleUpdateUser} className="w-full flex flex-col sm:flex-row gap-4 items-center">
                        <input
                          type="text"
                          required
                          value={editUserUsername}
                          onChange={e => setEditUserUsername(e.target.value)}
                          className="w-full sm:w-auto px-3 py-1 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          placeholder="Username"
                        />
                        <input
                          type="password"
                          value={editUserPassword}
                          onChange={e => setEditUserPassword(e.target.value)}
                          className="w-full sm:w-auto px-3 py-1 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          placeholder="New password (optional)"
                        />
                        <div className="flex gap-2 w-full sm:w-auto ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setEditUserId(null);
                              setEditUserUsername("");
                              setEditUserPassword("");
                            }}
                            className="flex-1 sm:flex-none text-sm text-gray-600 hover:text-gray-900 border px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isUserLoading}
                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded disabled:bg-indigo-400"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900">{user.username}</h4>
                            <span className="text-xs text-gray-400 font-mono">ID: {user._id.slice(-6)}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditUserId(user._id);
                              setEditUserUsername(user.username);
                              setEditUserPassword("");
                            }}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.username)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No users found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {isMusicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {editingTrackId ? "Edit Music Track" : "Add Music Track"}
              </h3>
              <button
                onClick={closeMusicModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <input
                  value={trackGenre}
                  onChange={(e) => setTrackGenre(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio File {editingTrackId ? "(optional)" : ""}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setTrackFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingTrack}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white ${
                    editingTrackId
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  } ${isSavingTrack ? "opacity-75 cursor-wait" : ""}`}
                >
                  {isSavingTrack
                    ? "Saving..."
                    : editingTrackId
                      ? "Update Track"
                      : "Add Track"}
                </button>
                <button
                  type="button"
                  onClick={closeMusicModal}
                  className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Edit Project</h1>
              <button
                onClick={closeProjectModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            {isProjectModalLoading ? (
              <div className="text-center p-10">Loading...</div>
            ) : (
              <form onSubmit={handleProjectUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="e.g. Portfolio Website"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        placeholder="description..."
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                      <textarea
                        value={editKeyFeatures}
                        onChange={(e) => setEditKeyFeatures(e.target.value)}
                        rows={2}
                        placeholder="separated"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                      <textarea
                        value={editTechStack}
                        onChange={(e) => setEditTechStack(e.target.value)}
                        rows={2}
                        placeholder="React, Node.js"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Media Management</h3>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Main Cover Image</label>
                    <div className="flex items-start gap-4 flex-wrap">
                      {editCurrentImage ? (
                        <img
                          src={editCurrentImage}
                          alt="Current Cover"
                          className="w-32 h-32 object-cover rounded shadow-sm bg-white"
                          onError={() => setEditCurrentImage("")}
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Cover</div>
                      )}

                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs text-gray-500 mb-2">Upload a new file to replace the current cover image.</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) setEditImageFile(e.target.files[0]);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gallery Images (Reorder & Edit)</label>

                    {editGalleryImages.length === 0 && (
                      <p className="text-sm text-gray-500 italic mb-2">No gallery images yet.</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {editGalleryImages.map((imgUrl, index) => (
                        <div key={`${imgUrl}-${index}`} className="flex items-center gap-3 p-2 bg-white border rounded shadow-sm">
                          <span className="text-gray-400 font-mono text-xs w-6 text-center">{index + 1}</span>
                          <img src={imgUrl} alt="Gallery" className="w-16 h-16 object-cover rounded bg-gray-100" />

                          <div className="flex-1 truncate text-xs text-gray-500">{imgUrl.split('/').pop()}</div>

                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveEditImage(index, "up")}
                              disabled={index === 0}
                              className="p-1 px-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600 text-xs"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => moveEditImage(index, "down")}
                              disabled={index === editGalleryImages.length - 1}
                              className="p-1 px-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600 text-xs"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => removeEditGalleryImage(index)}
                              className="p-1 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="block text-sm font-bold text-blue-900 mb-2">Add New Images to Gallery</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditNewGalleryFiles}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-50 mb-3"
                    />

                    {editNewGalleryFiles.length > 0 && (
                      <div className="space-y-4">
                        {editNewGalleryFiles.map((file, idx) => (
                          <div key={`${file.name}-${idx}`} className="flex items-center gap-3 text-sm bg-white p-2 rounded border border-blue-200">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img src={editNewGalleryPreviews[idx]} alt="New Upload" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeEditNewGalleryFile(idx)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1 bg-red-50 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <p className="text-xs text-blue-600 mt-2">* These images will be appended to the gallery after saving.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isProjectSaving}
                    className={`flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                      isProjectSaving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProjectSaving ? "Saving Changes..." : "Save All Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={closeProjectModal}
                    className="py-3 px-4 rounded-md text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPanel;